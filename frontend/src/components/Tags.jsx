import React, { useCallback, useEffect, useState } from "react";
import { ReactTags } from "react-tag-autocomplete";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4
import "../css/tagStyles.css";
import { suggestions } from "./countries";

const Tags = () => {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  const onAdd = useCallback(
    (newTag) => {
      const tagWithUUID = {
        ...newTag,
        value: uuidv4(),
      };
      setSelected([...selected, tagWithUUID]);
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
      labelText="Select tags"
      selected={selected}
      suggestions={suggestions}
      onAdd={onAdd}
      onDelete={onDelete}
      allowNew
      newOptionText="Add new: {label}"
    />
  );
};

export default Tags;
