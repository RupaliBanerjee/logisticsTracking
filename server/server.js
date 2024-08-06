const express = require("express");
const bodyParser = require("body-parser");
const { container } = require("./database"); // Import the container from database.js
const dotenv = require("dotenv");

const {
  getTotalCountQuery,
  getLimit,
  getOffset,
  getPaginatedQuery,
} = require("./utils/pagination");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../client/dist")));

/*
All the API calls are listed below:
  GET
  1. "/api/getProductID/:productID" to get specific RATE CARD based on productID
  2. "/api/getAllProductData" to get first 50 records from the db to populate the PRODUCT CONSOLE PAGE
  3. "/api/getItem/:field" to get all field options for dropdown menu in the PRODUCT FORM

  POST
  1. "/api/addItems" to create new RATE CARD
  2. "/api/updateItems" to update existing RATE CARD

*/

app.get("/api/getProductID/:productID", async (req, res) => {
  try {
    const productID = req.params.productID;
    // Query to find the item
    const querySpec = {
      query: "SELECT * FROM c WHERE c.id = @productID",
      parameters: [{ name: "@productID", value: productID }],
    };
    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();
    res.status(200).json({
      items,
    });
  } catch (err) {}
});

app.get("/api/getAllProductData", async (req, res) => {
  try {
    const querySpec = {
      query: "SELECT TOP 50 * FROM c",
      parameters: [],
    };

    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();

    res.status(200).json({ items });
  } catch (err) {
    res.status(500).send(`Error fetching data from Cosmos DB ${err.message}`);
  }
});

app.get("/api/getItem/:field", async (req, res) => {
  const field = req.params.field;
  const page = parseInt(req.query.page) || 1;
  const limit = getLimit(page);
  const search = req.query.q || "";
  const offset = getOffset(page);
  const totalCountQuerySpec = getTotalCountQuery(field, search);

  try {
    const { resources: totalCount } = await container.items
      .query(totalCountQuerySpec)
      .fetchAll();

    const totalRecords = totalCount[0];

    if (offset >= totalRecords) {
      return res.json({
        options: [],
        hasMore: false,
        additional: { page },
        limit: limit,
      });
    }

    const querySpec = getPaginatedQuery(field, search, offset, limit);

    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();

    const hasMore = offset + items.length < totalRecords;

    res.json({
      options: items.map((item) => item[field]),
      hasMore,
      additional: { page },
      limit: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from Cosmos DB");
  }
});

//POST Call
app.post("/api/addItems", async (req, res) => {
  try {
    const { body } = req;
    const { resource } = await container.items.create(body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/updateItems", async (req, res) => {
  try {
    const { productID, updatedEntry } = req.body;
    const querySpec = {
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [{ name: "@id", value: productID }],
    };

    // Execute the query
    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();

    if (items.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    const item = items[0];
    const originalPartitionKey = item.Destination_Country;
    const newPartitionKey = updatedEntry.Destination_Country;

    if (originalPartitionKey === newPartitionKey) {
      // Update the item's properties
      item.Rate_Card_ID = updatedEntry.Rate_Card_ID || item.Rate_Card_ID;
      item.Supplier_ID = updatedEntry.Supplier_ID || item.Supplier_ID;
      item.Supplier_Name = updatedEntry.Supplier_Name || item.Supplier_Name;
      item.Origin_Country = updatedEntry.Origin_Country || item.Origin_Country;
      item.Destination_Country =
        updatedEntry.Destination_Country || item.Destination_Country;
      item.Weight_KG = updatedEntry.Weight_KG || item.Weight_KG;
      item.IS_DDP_OR_DDU = updatedEntry.IS_DDP_OR_DDU || item.IS_DDP_OR_DDU;
      item.Volumetric_Divisor =
        updatedEntry.Volumetric_Divisor || item.Volumetric_Divisor;

      // Replace the item in the database
      const { resource: updatedItem } = await container
        .item(productID)
        .replace(item);
      res.status(200).json({
        updatedItem,
      });
    } else {
      await container.item(productID, originalPartitionKey).delete();
      const { resource: updatedItem } = await container.items.create(
        updatedEntry
      );
      res.status(200).json({
        updatedItem,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
