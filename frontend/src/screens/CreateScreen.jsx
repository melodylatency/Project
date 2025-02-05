import React, { useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Card,
  Alert,
} from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// A simple component for rendering a question preview card
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
            <small className="text-secondary">Type: {question.type}</small>
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

const CreateScreen = () => {
  // Template header states
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");

  // Questions state (each question includes id, title, description, and type)
  const [questions, setQuestions] = useState([]);

  // New question being built in the form below
  const [newQuestion, setNewQuestion] = useState({
    type: "text", // default type
    title: "",
    description: "",
  });

  // Success indicator when the template is “saved”
  const [success, setSuccess] = useState(false);

  // Handler to add a new question (only if the title is non-empty)
  const addQuestion = () => {
    if (newQuestion.title.trim() === "") return;
    const questionWithId = { ...newQuestion, id: Date.now() };
    setQuestions([...questions, questionWithId]);
    setNewQuestion({ type: "text", title: "", description: "" });
  };

  // Handler for drag and drop reordering
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(questions);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setQuestions(reordered);
  };

  // Delete a question by its id
  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Handler for final form submission ("Save Form")
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() === "") {
      alert("Form title cannot be empty");
      return;
    }
    if (questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }

    const template = { title, description, questions };
    try {
      // Replace with your actual API call
      console.log("Form Template Created:", template);
      setSuccess(true);
      // Reset form fields after saving
      setTitle("Untitled Form");
      setDescription("");
      setQuestions([]);
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: "800px" }}>
      <h1 className="text-center mb-4">Create New Form</h1>
      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
          Form saved successfully!
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        {/* Form Title */}
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label className="fs-4">Form Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter form title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="lg"
          />
        </Form.Group>

        {/* Form Description */}
        <Form.Group className="mb-4" controlId="formDescription">
          <Form.Label className="fs-5">Form Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter a description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        {/* Questions List (Drag & Drop enabled) */}
        <h4 className="mb-3">Questions</h4>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="questionsDroppable">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {questions.map((question, index) => (
                  <Draggable
                    key={question.id}
                    draggableId={question.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <QuestionCard
                        question={question}
                        index={index}
                        onDelete={deleteQuestion}
                        provided={provided}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Add New Question */}
        <Card className="mt-4 mb-4 shadow-sm">
          <Card.Header className="bg-light">Add New Question</Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={5}>
                <Form.Control
                  type="text"
                  placeholder="Question title"
                  value={newQuestion.title}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, title: e.target.value })
                  }
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Optional description"
                  value={newQuestion.description}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      description: e.target.value,
                    })
                  }
                />
              </Col>
              <Col md={2}>
                <Form.Select
                  value={newQuestion.type}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, type: e.target.value })
                  }
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="textarea">Paragraph</option>
                </Form.Select>
              </Col>
              <Col md={1}>
                <Button variant="primary" onClick={addQuestion}>
                  +
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Save Form Button */}
        <div className="text-center">
          <Button variant="success" type="submit" size="lg">
            Save Form
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreateScreen;
