import React from "react";
import { Button, Row, Col, Card } from "react-bootstrap";

const QuestionCard = ({
  question,
  index,
  onDelete,
  onUpdate,
  dragHandleProps,
}) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Row className="align-items-center">
          <Col>
            <div className="d-flex align-items-center">
              <button
                type="button"
                {...dragHandleProps}
                style={{ cursor: "move" }}
                className="me-2"
              >
                ≡
              </button>
              <span className="me-2">{index + 1}.</span>
              <h5 className="ml-1">{question.title}</h5>
              <span className="badge bg-secondary ms-2">{question.type}</span>
            </div>
            <p className="text-muted">{question.description}</p>
          </Col>
          <Col xs="auto" className="d-flex align-items-center gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => onUpdate(question.id)}
            >
              Update
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(question.id)}
            >
              Delete
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default QuestionCard;
