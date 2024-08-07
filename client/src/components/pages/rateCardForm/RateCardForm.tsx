import { useCallback, useEffect, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GroupBase, OptionsOrGroups } from "react-select";
import { Additional, Option } from "../../../utils/types";

import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Notifications from "../../common/Notifications";
import { formFields, getDefaultFormData, loadOptions } from "./FormUtil";

import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Slider,
  SliderValueLabelProps,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";

//FOR SLIDER TOOLTIP
function ValueLabelComponent(props: SliderValueLabelProps) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const RateCardForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{ [key: string]: Option | null }>({
    Rate_Card_ID: null,
    Supplier_ID: null,
    Supplier_Name: null,
    Origin_Country: null,
    Destination_Country: null,
    Weight_KG: null,
    IS_DDP_OR_DDU: null,
    Volumetric_Divisor: { value: 2000, label: "Volumetric_Divisor" },
  });

  const [openNotification, setOpenNotification] = useState(false);

  //handle notification close event
  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenNotification(false);
  };

  //on submit button click handle rate card updation
  const updateRateCard = async (
    updatedEntry: { [key: string]: string },
    productID: string | null
  ) => {
    try {
      const response = await axios.post("/api/updateItems", {
        productID: productID,
        updatedEntry,
      });
      console.log("Check response for create call:", response.data);
      navigate("/");
    } catch (err) {
      setOpenNotification(true);
    }
  };

  //on submit button click handle rate card creation
  const createRateCard = async (updatedEntry: { [key: string]: string }) => {
    try {
      const response = await axios.post("/api/addItems", updatedEntry);
      console.log("Check response for create rate card:", response.data);
      navigate("/");
    } catch (err) {
      setOpenNotification(true);
    }
  };

  //PRODUCT FORM DEFAULT VALUES
  useEffect(() => {
    if (searchParams.get("productID")) {
      const productID = searchParams.get("productID");

      const getRateCard = async () => {
        try {
          const response = await axios.get(`/api/getProductID/${productID}`);
          const customFormData: Record<
            string,
            { value: string | number; label: string }
          > = await getDefaultFormData(response.data.items[0]);
          setFormData((previousData) => {
            let refactoredFormData: Record<
              string,
              { value: string | number; label: string }
            > = {};
            Object.keys(previousData).forEach((key) => {
              refactoredFormData = {
                ...refactoredFormData,
                [key]: customFormData[key],
              };
            });

            return refactoredFormData;
          });
        } catch (err) {
          console.error(err);
          setOpenNotification(true);
        }
      };
      getRateCard();
    }
  }, [searchParams]);

  const handleChange = (field: string, selectedOption: Option | null) => {
    setFormData((prevValues) => ({
      ...prevValues,
      [field]: selectedOption,
    }));
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    setFormData((prevValues) => ({
      ...prevValues,
      IS_DDP_OR_DDU: { value: selectedValue, label: "IS_DDP_OR_DDU" },
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    let updatedEntry = {};
    Object.keys(formData).forEach((key) => {
      let value: string | number;
      if (["Volumetric_Divisor", "Weight_KG"].includes(key)) {
        value = formData[key]?.value.toString() || "";
      } else {
        value = formData[key]?.value || "";
      }

      updatedEntry = {
        ...updatedEntry,
        [key]: value,
      };
    });
    if (searchParams.get("productID")) {
      updateRateCard(updatedEntry, searchParams.get("productID"));
    } else {
      createRateCard(updatedEntry);
    }
  };

  const debouncedLoadOptions = useCallback(
    (
      search: string,
      loadedOptions: OptionsOrGroups<Option, GroupBase<Option>>,
      additional: Additional | undefined,
      field: string
    ) => {
      return loadOptions(search, loadedOptions, additional, field);
    },
    []
  );
  return (
    <>
      <Notifications
        open={openNotification}
        severity="error"
        message="Something went wrong"
        onClose={handleClose}
      />

      <Box
        sx={{
          maxWidth: "60rem",
          margin: "auto",
        }}
      >
        <Card variant="outlined" sx={{ margin: "2rem 4rem" }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Stack>
                {formFields.map((field) => (
                  <FormControl key={field} style={{ marginBottom: "20px" }}>
                    <label
                      htmlFor={field}
                      className="required"
                      style={{ marginRight: "auto", marginBottom: "0.5em" }}
                    >
                      {field}
                    </label>
                    <AsyncPaginate
                      required
                      id={field}
                      value={formData[field]}
                      loadOptions={(search, loadedOptions, additional) =>
                        debouncedLoadOptions(
                          search,
                          loadedOptions,
                          additional,
                          field
                        )
                      }
                      onChange={(selectedOption) =>
                        handleChange(field, selectedOption)
                      }
                      additional={{
                        page: 1,
                      }}
                      debounceTimeout={300}
                    />
                  </FormControl>
                ))}

                <FormControl variant="outlined">
                  <label
                    htmlFor="Weight_KG"
                    className="required"
                    style={{ marginRight: "auto", marginBottom: "0.5em" }}
                  >
                    Weight
                  </label>
                  <TextField
                    id="Weight_KG"
                    value={formData["Weight_KG"]?.value ?? 0}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">kg</InputAdornment>
                      ),
                      inputMode: "decimal",
                    }}
                    onChange={(e) =>
                      handleChange("Weight_KG", {
                        value: e.target.value,
                        label: "Weight_KG",
                      })
                    }
                    inputProps={{
                      pattern: "[0-9]*[.,]?[0-9]*",
                    }}
                  />
                </FormControl>
                <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
                  <RadioGroup
                    row
                    aria-labelledby="delivery-terms-radio-buttons-group"
                    name="row-radio-buttons-group"
                    id="IS_DDP_OR_DDU"
                    value={formData["IS_DDP_OR_DDU"]?.value ?? "DDU"}
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel
                      value="DDU"
                      control={<Radio />}
                      label="Delivery Duty Unpaid"
                    />
                    <FormControlLabel
                      value="DDP"
                      control={<Radio />}
                      label="Delivery Duty Paid"
                    />
                  </RadioGroup>
                </FormControl>

                <FormControl>
                  <label
                    htmlFor="Volumetric_Divisor"
                    className="required"
                    style={{ marginRight: "auto", marginBottom: "1em" }}
                  >
                    Volumetric Divisor
                  </label>
                  <Slider
                    id="Volumetric_Divisor"
                    valueLabelDisplay="auto"
                    aria-labelledby="Volumetric_Divisor"
                    slots={{
                      valueLabel: ValueLabelComponent,
                    }}
                    onChange={(_event, newValue) =>
                      handleChange("Volumetric_Divisor", {
                        value: newValue.toString(),
                        label: "Volumetric_Divisor",
                      })
                    }
                    min={1000}
                    max={10000}
                    step={500}
                    aria-label="custom thumb label"
                    value={
                      typeof formData["Volumetric_Divisor"]?.value === "number"
                        ? formData["Volumetric_Divisor"].value
                        : parseInt(
                            formData["Volumetric_Divisor"]?.value as string
                          ) || 2000
                    }
                    defaultValue={2000}
                  />
                </FormControl>
              </Stack>
              <Box sx={{ m: 3 }} />
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default RateCardForm;
