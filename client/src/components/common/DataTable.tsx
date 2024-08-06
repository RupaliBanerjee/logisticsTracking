import { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbar,
} from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* FOR TABLE DATA RENDER */

const DataTable = () => {
  const [tableData, setTableData] = useState<GridRowsProp[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: "Rate_Card_ID", headerName: "Rate Card ID", flex: 1 },
    { field: "Supplier_ID", headerName: "Supplier ID", flex: 1 },
    { field: "Supplier_Name", headerName: "Supplier", flex: 0.5 },
    {
      field: "Origin_Country",
      headerName: "Origin",
      flex: 1,
    },
    {
      field: "Destination_Country",
      headerName: "Destination",
      flex: 1,
    },
    {
      field: "Weight_KG",
      headerName: "Weight",
      flex: 1,
    },
    {
      field: "IS_DDP_OR_DDU",
      headerName: "Delivery Terms",
      flex: 0.5,
    },
    {
      field: "Volumetric_Divisor",
      headerName: "Volumetric Divisor",
      flex: 0.5,
    },
    {
      field: "id",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => {
        const handleClick = () => {
          console.log(params.row.id);
          navigate(`/productForm?productID=${params.row.id.trim()}`);
        };
        return (
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={handleClick}
          >
            Update
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios
          .get("/api/getAllProductData")
          .then((response) => {
            setLoading(false);
            return response.data;
          });
        // const data = response.filter((device: { platform: string }) => {
        //   return device.platform === "iOS";
        // });
        console.log("check table response:", response);
        setTableData(response.items);
      } catch (err) {
        console.log("check the error found", err);
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Box sx={{ height: "600px", width: "100%" }}>
        <DataGrid
          rows={tableData}
          columns={columns}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25,
              },
            },
          }}
          disableRowSelectionOnClick
        />
      </Box>
    </>
  );
};

export default DataTable;
