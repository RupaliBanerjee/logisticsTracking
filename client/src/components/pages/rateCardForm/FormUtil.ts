import axios from "axios";
import { Additional, Option } from "../../../utils/types";
import { GroupBase, OptionsOrGroups } from "react-select";

export const customField = ["Volumetric_Divisor", "Weight_KG", "IS_DDP_OR_DDU"];

//DROPDOWN FIELDS FOR ASYNC PAGINATE
export const formFields = [
  "Rate_Card_ID",
  "Supplier_ID",
  "Supplier_Name",
  "Origin_Country",
  "Destination_Country",
];

//VALUE PARSING
export const getCustomFieldValue = (key: string, customValue: string) => {
  switch (key) {
    case "Volumetric_Divisor":
    case "Weight_KG":
      return { value: parseInt(customValue), label: key };
    case "IS_DDP_OR_DDU":
      return { value: customValue, label: key };
  }
};

export const getDefaultFormData = (rateCardData: { [key: string]: string }) => {
  let refactoredData = {};

  Object.keys(rateCardData).forEach((key) => {
    if (customField.includes(key)) {
      const customValue = getCustomFieldValue(key, rateCardData[key]);
      refactoredData = { ...refactoredData, [key]: customValue };
    } else {
      const customValue = {
        value: rateCardData[key],
        label: rateCardData[key],
      };
      refactoredData = { ...refactoredData, [key]: customValue };
    }
  });
  return refactoredData;
};

//OPTION FOR ASYNC PAGINATE DROPDOWN FIELDS
export const loadOptions = async (
  search: string,
  loadedOptions: OptionsOrGroups<Option, GroupBase<Option>>,
  additional: Additional | undefined,
  field: string
) => {
  const page = additional?.page || 1;

  console.log("Check load options", loadedOptions);
  try {
    const response = await axios.get(`/api/getItem/${field}`, {
      params: {
        q: search || "",
        page,
      },
    });
    console.log("Check response on client side:", response.data);
    const options = await response.data.options.map((item: string) => ({
      value: item,
      label: item,
    }));

    return {
      options,
      hasMore: response.data.hasMore,
      additional: {
        page: page + 1,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      options: [],
      hasMore: false,
      additional: {
        page,
      },
    };
  }
};
