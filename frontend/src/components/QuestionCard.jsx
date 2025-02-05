// QuestionCard.jsx
import React, { useState } from "react";
import { Button, Row, Col, Card, Form } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const QuestionCard = ({
  question,
  index,
  onDelete,
  onUpdateQuestion,
  provided,
}) => {
  // Local state for new option text (for checkbox questions)
  const [newOption, setNewOption] = useState("");

  // Handler to add a new option if less than 4 options exist
  const handleAddOption = () => {
    if (newOption.trim() === "") return;
    const options = question.options || [];
    if (options.length >= 4) {
      alert("Maximum 4 options allowed.");
      return;
    }
    const updatedQuestion = {
      ...question,
      options: [...options, newOption.trim()],
    };
    onUpdateQuestion(updatedQuestion);
    setNewOption("");
  };

  // Handler to delete an option
  const handleDeleteOption = (idx) => {
    const options = question.options || [];
    const updatedOptions = options.filter((_, i) => i !== idx);
    onUpdateQuestion({ ...question, options: updatedOptions });
  };

  // Handler to update an option’s text inline
  const handleOptionChange = (idx, text) => {
    const options = question.options || [];
    const updatedOptions = options.map((option, i) =>
      i === idx ? text : option
    );
    onUpdateQuestion({ ...question, options: updatedOptions });
  };

  // Handler for drag and drop reordering of options
  const onOptionDragEnd = (result) => {
    if (!result.destination) return;
    const options = Array.from(question.options || []);
    const [removed] = options.splice(result.source.index, 1);
    options.splice(result.destination.index, 0, removed);
    onUpdateQuestion({ ...question, options });
  };

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

        {/* If the question supports options (e.g. checkbox), show the options editor */}
        {question.type === "checkbox" && (
          <>
            <hr />
            <h6>Options</h6>
            <DragDropContext onDragEnd={onOptionDragEnd}>
              <Droppable droppableId={`options-${question.id}`}>
                {(providedOptions) => (
                  <div
                    ref={providedOptions.innerRef}
                    {...providedOptions.droppableProps}
                  >
                    {(question.options || []).map((option, idx) => (
                      <Draggable
                        key={idx}
                        draggableId={`option-${question.id}-${idx}`}
                        index={idx}
                      >
                        {(providedOption) => (
                          <div
                            className="d-flex align-items-center mb-2"
                            ref={providedOption.innerRef}
                            {...providedOption.draggableProps}
                            {...providedOption.dragHandleProps}
                          >
                            <Form.Control
                              type="text"
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(idx, e.target.value)
                              }
                            />
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="ms-2"
                              onClick={() => handleDeleteOption(idx)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {providedOptions.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            {(question.options || []).length < 4 && (
              <Row className="g-2 mt-2">
                <Col xs={8}>
                  <Form.Control
                    type="text"
                    placeholder="New option"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                  />
                </Col>
                <Col xs={4}>
                  <Button variant="secondary" onClick={handleAddOption}>
                    Add Option
                  </Button>
                </Col>
              </Row>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default QuestionCard;
