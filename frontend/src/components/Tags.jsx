import React, { useCallback } from "react";
import { ReactTags } from "react-tag-autocomplete";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4
import "../css/tagStyles.css";
import { suggestions } from "./countries";
import { useDispatch, useSelector } from "react-redux";
import { addTag, removeTag } from "../redux/slices/tagSlice";

const Tags = () => {
  const { tagList } = useSelector((state) => state.tag);

  const dispatch = useDispatch();

  const onAdd = useCallback(
    (newTag) => {
      const isDuplicate = tagList.some((tag) => tag.label === newTag.label);
      if (isDuplicate) {
        return;
      }

      const tagWithUUID = {
        ...newTag,
        value: uuidv4(),
      };
      dispatch(addTag(tagWithUUID));
    },
    [tagList, dispatch]
  );

  const onDelete = useCallback(
    (tagIndex) => {
      dispatch(removeTag(tagIndex));
    },
    [dispatch]
  );

  return (
    <ReactTags
      labelText="Select tags"
      selected={tagList}
      suggestions={suggestions}
      onAdd={onAdd}
      onDelete={onDelete}
      allowNew
      newOptionText="Add new: {label}"
    />
  );
};

export default Tags;
