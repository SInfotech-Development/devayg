const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");

app.use(cors());

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
