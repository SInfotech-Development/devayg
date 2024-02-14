const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const path = require("path");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "0.0.0.0:5000",
      changeOrigin: true,
    })
  );
};

const allowedOrigins = [
  "http://18.223.93.100",
  "http://localhost:3000",
  "http://3.130.189.92",
  "https://www.megasails.com",
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

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "broker@megasails.com",
    pass: "Mega#$2023",
  },
});
app.use(bodyParser.json());

app.post("/send-email-yachtdetails", async (req, res) => {
  try {
    const { recipientEmail, subject, message } = req.body;

    if (!recipientEmail || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const {
      NM_firstName,
      NM_lastName,
      ID_email,
      NO_phoneNumber,
      CA_category,
      DS_comments1,
      NM_docId,
    } = message;

    const mailOptions = {
      from: "broker@megasails.com",
      to: recipientEmail,
      subject: "MegaSails- Yacht Broker Services",
      text: `
Dear ${NM_firstName} ${NM_lastName},

Thank you for choosing MegaSails for your yacht broker services. We are delighted to inform you that we have received your request, and our dedicated Yacht Service Team will promptly contact you to coordinate and schedule your yacht service.

Your satisfaction is our priority, and we look forward to providing you with top-notch service.

If you have any immediate questions or concerns, feel free to reach out to us at broker@megasails.com.

Best Regards,
MegaSails Team
      `,
    };
    const mailOptions1 = {
      from: "broker@megasails.com",
      to: "broker@megasails.com",
      subject: "MegaSails- Yacht Broker Services",
      text: `
    Name: ${NM_firstName} ${NM_lastName}
    Email: ${ID_email}
    Phone: ${NO_phoneNumber}
    Category: ${CA_category}
    Comments: ${DS_comments1}
    DocId:${NM_docId}
    Link: http://localhost:3000/yachtdetails/${NM_docId}
          `,
    };

    // Send email
    await transporter.sendMail(mailOptions); //Customer
    // await transporter.sendMail(mailOptions1); //Mega team

    console.log("Email sent successfully");
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: error.message || "An error occurred" });
  }
});

app.post("/send-email-contact", async (req, res) => {
  try {
    const { recipientEmail, subject, message } = req.body;

    if (!recipientEmail || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const {
      NM_firstName,
      NM_lastName,
      ID_email,
      NO_phoneNumber,
      CA_category,
      DS_comments1,
    } = message;

    const mailOptions2 = {
      from: "broker@megasails.com",
      to: recipientEmail,
      subject: "MegaSails- Yacht Contact Inquiry",
      text: `
Dear ${NM_firstName} ${NM_lastName},

Thank you for choosing MegaSails for your yacht services. We are delighted to inform you that we have received your request, and our dedicated Yacht Service Team will promptly contact you to coordinate and schedule your yacht service.

Your satisfaction is our priority, and we look forward to providing you with top-notch service.

If you have any immediate questions or concerns, feel free to reach out to us at broker@megasails.com.

Best Regards,
MegaSails Team
      `,
    };
    const mailOptions3 = {
      from: "broker@megasails.com",
      to: "broker@megasails.com",
      subject: "MegaSails- Yacht Contact Inquiry",
      text: `
    Name: ${NM_firstName} ${NM_lastName}
    Email: ${ID_email}
    Phone: ${NO_phoneNumber}
    Category: ${CA_category}
    Comments: ${DS_comments1}    
          `,
    };

    // Send email
    await transporter.sendMail(mailOptions2); //Customer
    await transporter.sendMail(mailOptions3); //Mega team

    console.log("Email sent successfully");
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: error.message || "An error occurred" });
  }
});

app.post("/send-email-service", async (req, res) => {
  try {
    const { recipientEmail, subject, message } = req.body;

    if (!recipientEmail || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const {
      NM_firstName,
      NM_lastName,
      ID_email,
      NO_phoneNumber,
      CA_category,
      DS_comments1,
    } = message;

    const mailOptions4 = {
      from: "broker@megasails.com",
      to: recipientEmail,
      subject: "MegaSails- Yacht Service Inquiry",
      text: `
Dear ${NM_firstName} ${NM_lastName},

Thank you for choosing MegaSails for your yacht ${CA_category} services. We are delighted to inform you that we have received your request, and our dedicated Yacht Service Team will promptly contact you to coordinate and schedule your yacht service.

Your satisfaction is our priority, and we look forward to providing you with top-notch service.

If you have any immediate questions or concerns, feel free to reach out to us at broker@megasails.com.

Best Regards,
MegaSails Team
      `,
    };
    const mailOptions5 = {
      from: "broker@megasails.com",
      to: "broker@megasails.com",
      subject: "MegaSails- Yacht Service Inquiry",
      text: `
    Name: ${NM_firstName} ${NM_lastName}
    Email: ${ID_email}
    Phone: ${NO_phoneNumber}
    Category: ${CA_category}
    Comments: ${DS_comments1}    
          `,
    };

    // Send email
    await transporter.sendMail(mailOptions4); //Customer
    await transporter.sendMail(mailOptions5); //Mega team

    console.log("Email sent successfully");
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: error.message || "An error occurred" });
  }
});

app.use(cors());
// corsOptions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
