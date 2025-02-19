import React, { useCallback } from "react";
import { ReactTags } from "react-tag-autocomplete";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4
import "../css/tagStyles.css";
import { useGetTagsQuery } from "../redux/slices/tagsApiSlice";

const Tags = ({ selected, setSelected }) => {
  const { data: suggestions } = useGetTagsQuery();

  const onAdd = useCallback(
    (newTag) => {
      const isDuplicate = selected.some((tag) => tag.label === newTag.label);
      if (isDuplicate) return;

      // Use existing value for suggestions, generate UUID for new tags
      const tagToAdd = newTag.__isNew__
        ? { ...newTag, value: uuidv4() }
        : newTag;

      setSelected([...selected, tagToAdd]);
    },
    [selected, setSelected]
  );

  const onDelete = useCallback(
    (tagId) => {
      setSelected(selected.filter((_, i) => i !== tagId));
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
