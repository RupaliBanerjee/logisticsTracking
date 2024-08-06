const { CosmosClient } = require("@azure/cosmos");
const dotenv = require("dotenv");

dotenv.config();

const client = new CosmosClient(process.env.COSMOSDB_CONNECTION_STRING);
const database = client.database("ProductLogisticsDB");
const container = database.container("ProductDeliveryContainer");

module.exports = { client, database, container };
