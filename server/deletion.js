async function deleteItem(id, destinationCountry) {
  //const container = client.database(databaseId).container(containerId);

  // Query to find the item
  const querySpec = {
    query:
      "SELECT * FROM c WHERE c.id = @id AND c.Destination_Country = @destinationCountry",
    parameters: [
      { name: "@id", value: id },
      { name: "@destinationCountry", value: destinationCountry },
    ],
  };

  // Run the query
  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

  if (items.length > 0) {
    // Assuming id is unique, there should be at most one item
    const item = items[0];
    console.log("Check item :", item);
    await container.item(item.id, "Germany").delete();
    console.log(
      `Item with id '${id}' and Destination_Country '${destinationCountry}' deleted.`
    );
  } else {
    console.log(
      `No items found with id '${id}' and Destination_Country '${destinationCountry}'.`
    );
  }
}

deleteItem("ebe26771-f795-41a8-bdd1-d4c5328c62b8", "Russia").catch((error) => {
  console.error(error);
});
