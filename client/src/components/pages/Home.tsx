import { Box, Button, Typography } from "@mui/material";
import { SetStateAction, useState } from "react";
import { To, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [productID, setproductID] = useState("");
  const handleCreateClick = (url: To) => {
    navigate(url);
  };

  const handleUpdateClick = () => {
    if (productID.trim() !== "") {
      navigate(`/productForm?productID=${productID.trim()}`);
    } else {
      alert("Specify productID");
    }
  };

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setproductID(e.target.value);
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 3,
        }}
      >
        <Button
          onClick={() => handleCreateClick("/productForm")}
          variant="contained"
          size="large"
          sx={{ mr: 2 }}
        >
          Create
        </Button>
        <Typography sx={{ mr: 2 }}>OR</Typography>
        <input
          type="text"
          id="Product_ID"
          name="Product_ID"
          placeholder="Product ID"
          required
          style={{ padding: "10px" }}
          onChange={handleInputChange}
        />
        <Button
          variant="contained"
          size="large"
          sx={{ ml: 1 }}
          onClick={handleUpdateClick}
        >
          Update
        </Button>
      </Box>
    </>
  );
};

export default Home;
