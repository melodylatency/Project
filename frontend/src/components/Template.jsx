import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
// import Rating from "./Rating";

const Template = ({ template }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/template/${template.id}`}>
        <Card.Img src={template.image} variant="top" />
      </Link>
      <Card.Body>
        <Link to={`/template/${template.id}`}>
          <Card.Title className="template-title pb-4" as="div">
            <h1 className="text-ellipsis truncate text-lg">{template.title}</h1>
          </Card.Title>
        </Link>

        {/* <Card.Text className="pb-1" as="div">
          <Rating
            value={template.rating}
            text={`${template.numReviews} reviews`}
          />
        </Card.Text> */}

        <Card.Text as="h3">${template.topic}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Template;
