import React, { useCallback } from "react";
import { ReactTags } from "react-tag-autocomplete";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4
import "../css/tagStyles.css";
import { suggestions } from "./countries";

const Tags = ({ selected, setSelected }) => {
  const onAdd = useCallback(
    (newTag) => {
      const isDuplicate = selected.some((tag) => tag.label === newTag.label);
      if (isDuplicate) {
        return;
      }

      const tagWithUUID = {
        ...newTag,
        value: uuidv4(),
      };
      setSelected([...selected, tagWithUUID]);
    },
    [selected, setSelected]
  );

  const onDelete = useCallback(
    (tagIndex) => {
      setSelected(selected.filter((_, i) => i !== tagIndex));
    },
    [selected, setSelected]
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
