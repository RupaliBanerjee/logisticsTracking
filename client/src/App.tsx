// import { SetStateAction, useEffect, useState } from "react";
import { Box } from "@mui/material";
import "./App.css";

import { Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import RateCardForm from "./components/pages/rateCardForm/RateCardForm";
import Navbar from "./components/common/Navbar";
import ProductConsole from "./components/pages/ProductConsole";
// import axios from "axios";

function App() {
  return (
    <>
      <div className="App">
        <Navbar />
        <Box className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productForm" element={<RateCardForm />} />
            <Route path="/productConsole" element={<ProductConsole />} />
          </Routes>
        </Box>
      </div>
    </>
  );
}

export default App;
