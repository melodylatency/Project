import React, { useCallback, useState } from "react";
import { ReactTags } from "react-tag-autocomplete";
import "../css/tagStyles.css";
import { suggestions } from "./countries";

const Tags = () => {
  const [selected, setSelected] = useState([]);

  const onAdd = useCallback(
    (newTag) => {
      setSelected([...selected, newTag]);
    },
    [selected]
  );

  const onDelete = useCallback(
    (tagIndex) => {
      setSelected(selected.filter((_, i) => i !== tagIndex));
    },
    [selected]
  );

  return (
    <ReactTags
      labelText="Select countries"
      selected={selected}
      suggestions={suggestions}
      onAdd={onAdd}
      onDelete={onDelete}
      noOptionsText="No matching countries"
    />
  );
};

export default Tags;
