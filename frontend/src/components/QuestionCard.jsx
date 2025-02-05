import React, { useState } from "react";
import { Button, Row, Col, Card, Form } from "react-bootstrap";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Option Component
const SortableOption = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {React.cloneElement(children, {
        dragHandleProps: listeners,
      })}
    </div>
  );
};

const QuestionCard = ({
  question,
  index,
  onDelete,
  onUpdateQuestion,
  dragHandleProps,
}) => {
  const [newOption, setNewOption] = useState("");
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  // Rest of your existing handlers remain the same
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

  const handleDeleteOption = (idx) => {
    const options = question.options || [];
    const updatedOptions = options.filter((_, i) => i !== idx);
    onUpdateQuestion({ ...question, options: updatedOptions });
  };

  const handleOptionChange = (idx, text) => {
    const options = question.options || [];
    const updatedOptions = options.map((option, i) =>
      i === idx ? text : option
    );
    onUpdateQuestion({ ...question, options: updatedOptions });
  };

  const handleOptionDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = question.options.findIndex(
      (_, idx) => `option-${question.id}-${idx}` === active.id
    );
    const newIndex = question.options.findIndex(
      (_, idx) => `option-${question.id}-${idx}` === over.id
    );

    const updatedOptions = arrayMove(question.options, oldIndex, newIndex);
    onUpdateQuestion({ ...question, options: updatedOptions });
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Row className="align-items-center">
          <Col>
            <h5 className="mb-1 d-flex align-items-center">
              <button
                type="button"
                {...dragHandleProps}
                style={{ cursor: "move" }}
                className="me-2"
              >
                ≡
              </button>
              {index + 1}. {question.title}
              <span className="badge bg-secondary ms-2">{question.type}</span>
            </h5>

            {/* ... rest of question header ... */}
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

        {question.type === "checkbox" && (
          <>
            <hr />
            <h6>Options</h6>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleOptionDragEnd}
            >
              <SortableContext
                items={(question.options || []).map(
                  (_, idx) => `option-${question.id}-${idx}`
                )}
                strategy={verticalListSortingStrategy}
              >
                {(question.options || []).map((option, idx) => (
                  <SortableOption
                    key={`option-${question.id}-${idx}`}
                    id={`option-${question.id}-${idx}`}
                  >
                    <div className="d-flex align-items-center mb-2">
                      <button
                        style={{ cursor: "move" }}
                        className="btn btn-sm me-2"
                        type="button"
                      >
                        ≡
                      </button>
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
                  </SortableOption>
                ))}
              </SortableContext>
            </DndContext>

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
