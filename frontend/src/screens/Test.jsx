import React from "react";
import Select from "react-select";

const options = [
  {
    label: "John Doe",
    value: "john-doe",
    email: "caterpillar@example.com",
  },
  {
    label: "Jane Smith",
    value: "jane-smith",
    email: "jane.smith@example.com",
  },
  {
    label: "Alice Johnson",
    value: "alice-johnson",
    email: "alice.johnson@example.com",
  },
];

const customFilterOption = (option, inputValue) => {
  const searchTerm = inputValue.trim().toLowerCase();
  const label = option.data.label.toLowerCase();
  const email = option.data.email?.toLowerCase() || "";
  return label.includes(searchTerm) || email.includes(searchTerm);
};

const formatOptionLabel = ({ label, email }) => (
  <div>
    <div>{label}</div>
    {email && <div style={{ fontSize: "12px", color: "#666" }}>{email}</div>}
  </div>
);

const AutoCompleteSelect = () => {
  return (
    <Select
      isMulti
      options={options}
      filterOption={customFilterOption}
      formatOptionLabel={formatOptionLabel}
      placeholder="Select a user..."
      isClearable
      isSearchable
    />
  );
};

export default AutoCompleteSelect;
