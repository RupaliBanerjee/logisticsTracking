import { Box, Button } from "@mui/material";
import DataTable from "../common/DataTable";
import { To, useNavigate } from "react-router-dom";

// TO DISPLAY THE PRODUCT TABLE

const ProductConsole = () => {
  const navigate = useNavigate();
  const handleCreateClick = (url: To) => {
    navigate(url);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Button
          onClick={() => handleCreateClick("/productForm")}
          variant="contained"
          size="large"
          sx={{ alignSelf: "flex-end", margin: "0.25rem 0.5rem 0.25rem auto" }}
        >
          Create
        </Button>
        <Box sx={{ margin: "0.5rem 2rem" }}>
          <DataTable />
        </Box>
      </Box>
    </>
  );
};

export default ProductConsole;
