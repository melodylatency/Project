import { Button, Row, Col, Card } from "react-bootstrap";

const QuestionCard = ({ question, index, onDelete, provided }) => {
  return (
    <Card
      className="mb-3 shadow-sm"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <Card.Body>
        <Row className="align-items-center">
          <Col>
            <h5 className="mb-1">
              {index + 1}. {question.title}
            </h5>
            {question.description && (
              <p className="mb-1 text-muted">{question.description}</p>
            )}
            <small className="text-secondary">
              Type: {question.type}{" "}
              {question.displayOnTable && "(Displayed in Table)"}
            </small>
          </Col>
          <Col xs="auto">
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
