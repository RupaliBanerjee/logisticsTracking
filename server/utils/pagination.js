const getLimit = (page) => {
  switch (page) {
    case 1:
      return 25;
    case 2:
      return 50;
    case 3:
      return 100;
    // Continue this pattern if necessary
    default:
      return 100; // After a certain page, keep the limit constant if needed
  }
};

const getOffset = (page) => {
  if (page === 1) {
    return 0;
  }
  let offset = 0;
  for (let i = 1; i < page; i++) {
    offset += getLimit(i);
  }
  return offset;
};

const getPaginatedQuery = (field, search, offset, limit) => {
  if (search) {
    return {
      query: `
          SELECT DISTINCT c.${field} FROM c 
          WHERE CONTAINS(c.${field}, @search) 
          OFFSET @offset LIMIT @limit`,
      parameters: [
        { name: "@search", value: search },
        { name: "@offset", value: offset },
        { name: "@limit", value: limit },
      ],
    };
  } else {
    return {
      query: `
          SELECT DISTINCT c.${field} FROM c 
          OFFSET @offset LIMIT @limit`,
      parameters: [
        { name: "@offset", value: offset },
        { name: "@limit", value: limit },
      ],
    };
  }
};

const getTotalCountQuery = (field, search) => {
  if (search) {
    return {
      query: `
          SELECT VALUE COUNT(1) FROM (
            SELECT DISTINCT c.${field} FROM c 
            WHERE CONTAINS(c.${field}, @search)
          )`,
      parameters: [{ name: "@search", value: search }],
    };
  } else {
    return {
      query: `
          SELECT VALUE COUNT(1) FROM (
            SELECT DISTINCT c.${field} FROM c
          )`,
      parameters: [],
    };
  }
};

module.exports = { getTotalCountQuery, getLimit, getOffset, getPaginatedQuery };
