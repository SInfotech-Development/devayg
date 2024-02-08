const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const path = require("path");
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mega@2023",
  database: "megasails",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

app.post("/submit-form", (req, res) => {
  const formData = req.body;

  const sql = `
    INSERT INTO leads (
      NM_firstName, NM_lastName, ID_email, NO_phoneNumber,
      CD_city, CD_state, CD_country, CA_category,
      DS_comments1, DS_comments2, NM_docid
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    formData.NM_firstName,
    formData.NM_lastName,
    formData.ID_email,
    formData.NO_phoneNumber,
    formData.CD_city,
    formData.CD_state,
    formData.CD_country,
    formData.CA_category,
    formData.DS_comments1,
    formData.DS_comments2,
    formData.NM_docid,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("MySQL insertion error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Data inserted into MySQL database");
      res.json({ success: true });
    }
  });
});

const allowedOrigins = [
  "http://18.223.93.100/",
  // Add any other origins that are allowed to access your server
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/documents", async (req, res) => {
  try {
    const {
      start = 0,
      rows = 25,
      make = null,
      condition = null,
      boatClass = null,
      length = null,
      price = null,
      year = null,
      DocumentID = null,
    } = req.query;
    const response = await axios.get(
      "https://services.boats.com/pls/boats/search",
      {
        params: {
          fields:
            "DocumentID,numResults,CompanyName,LengthOverall,NumberOfEngines,AdditionalDetailDescription,TotalEnginePowerQuantity,length,owner,LengthOverall,OwnerPartyID,salesrep,SalesRepPartyID,ModelYear,make,MakeString,Model,Images,BoatName,BoatLocation,SaleClassCode,BoatClassCode,Office,PriceHideInd,Price,GeneralBoatDescription,price=${minPrice}:${maxPrice}|USD,length=${minLength}:${maxLength},year=${minYear}:${maxYear},price=${minPrice}:${maxPrice}|USD",
          key: "gs4g3hpp688c",
          start,
          rows,
          make,
          condition,
          price,
          length,
          year,
          sort: "ModelYear|desc",
          class: boatClass,
          DocumentID,
        },
      }
    );

    const responseData = response.data.data.results.map((result) => {
      const {
        DocumentID,
        CompanyName,
        owner,
        length,
        OwnerPartyID,
        salesrep,
        SalesRepPartyID,
        ModelYear,
        MakeString,
        NumberOfEngines,
        LengthOverall,
        TotalEnginePowerQuantity,
        AdditionalDetailDescription,
        Model,
        Images,
        BoatName,
        BoatLocation,
        SaleClassCode,
        BoatClassCode,
        Office,
        PriceHideInd,
        Price,
        GeneralBoatDescription,
      } = result;

      return {
        DocumentID,
        CompanyName,
        owner,
        length,
        OwnerPartyID,
        LengthOverall,
        NumberOfEngines,
        TotalEnginePowerQuantity,
        AdditionalDetailDescription,
        salesrep,
        SalesRepPartyID,
        ModelYear,
        MakeString,
        Model,
        Images,
        BoatName,
        BoatLocation,
        SaleClassCode,
        BoatClassCode,
        Office,
        PriceHideInd,
        Price,
        GeneralBoatDescription,
      };
    });

    const numResults = response.data.data.numResults;
    const totalPages = Math.ceil(numResults / rows);

    res.json({ data: { results: responseData, numResults, totalPages } });
  } catch (error) {
    res.status(500).json({ error: error.message || "An error occurred" });
  }
});

app.get("/unique-makes", async (req, res) => {
  try {
    const uniqueMakesSet = new Set();

    // Make multiple requests with pagination parameters
    const rowsPerPage = 25;
    const response = await axios.get(
      "https://services.boats.com/pls/boats/search",
      {
        params: {
          fields: "MakeString",
          key: "gs4g3hpp688c",
          rows: rowsPerPage,
          start: 0, // Always start from the beginning for unique-makes
        },
      }
    );

    const totalPages = Math.ceil(response.data.data.numResults / rowsPerPage);

    for (let page = 1; page <= totalPages; page++) {
      const response = await axios.get(
        "https://services.boats.com/pls/boats/search",
        {
          params: {
            fields: "MakeString",
            key: "gs4g3hpp688c",
            rows: rowsPerPage,
            start: (page - 1) * rowsPerPage,
          },
        }
      );

      const makes = response.data.data.results.map(
        (result) => result.MakeString
      );

      makes.forEach((make) => uniqueMakesSet.add(make));
    }

    const uniqueMakesArray = Array.from(uniqueMakesSet);

    res.json({ data: { uniqueMakes: uniqueMakesArray } });
  } catch (error) {
    res.status(500).json({ error: error.message || "An error occurred" });
  }
});

const port = 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
