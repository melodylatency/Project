import React from "react";
import { Card } from "react-bootstrap";
import { Tag } from "antd";
import { Link } from "react-router-dom";

const Template = ({ template }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/template/${template.id}`}>
        <Card.Img
          className="h-[350px] object-cover"
          src={template.image}
          variant="top"
          alt={template.title}
        />
      </Link>
      <Card.Body>
        <Link to={`/template/${template.id}`}>
          <Card.Title className="template-title pb-3" as="div">
            <h1 className="text-ellipsis truncate text-xl">{template.title}</h1>
          </Card.Title>
        </Link>
        <Card.Text as="div">{template.access}</Card.Text>
        <Card.Text as="h3" className="my-2">
          likes: {template.likes}
        </Card.Text>
        <Tag>
          <Link to={`/${template.topic}`}>{template.topic}</Link>
        </Tag>
      </Card.Body>
    </Card>
  );
};

export default Template;
