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
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import QuestionCard from "../components/QuestionCard";
import { useSelector } from "react-redux";

// Sortable Item component
const SortableItem = ({ id, children, index }) => {
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
        index: index,
      })}
    </div>
  );
};

const CreateScreen = () => {
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    type: "text",
    title: "",
    description: "",
    displayOnTable: true,
  });
  const [success, setSuccess] = useState(false);

  const { templateData } = useSelector((state) => state.template);
  const { userInfo } = useSelector((state) => state.auth);

  const addQuestion = () => {
    if (newQuestion.title.trim() === "") return;

    const countOfType = questions.filter(
      (q) => q.type === newQuestion.type
    ).length;
    if (countOfType >= 4) {
      alert(
        `You can add a maximum of 4 questions of type "${newQuestion.type}"`
      );
      return;
    }

    const questionWithId = {
      ...newQuestion,
      id: Date.now(),
      options: newQuestion.type === "checkbox" ? [] : undefined,
    };
    setQuestions([...questions, questionWithId]);
    setNewQuestion({
      type: "text",
      title: "",
      description: "",
      displayOnTable: false,
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setQuestions((questions) => {
        const oldIndex = questions.findIndex((q) => q.id === active.id);
        const newIndex = questions.findIndex((q) => q.id === over.id);
        return arrayMove(questions, oldIndex, newIndex);
      });
    }
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (updatedQuestion) => {
    setQuestions(
      questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  };

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
      console.log("Form Template Created:", template);
      setSuccess(true);
      setTitle("Untitled Form");
      setDescription("");
      setQuestions([]);
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: "800px" }}>
      <h1 className="text-center mb-4 text-5xl">Create New Form</h1>
      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
          Form saved successfully!
        </Alert>
      )}
      {/* Move DndContext outside the Form */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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

          {/* Questions List */}
          <h4 className="mb-3">Questions</h4>
          <SortableContext
            items={questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {questions.map((question, index) => (
              <SortableItem key={question.id} id={question.id} index={index}>
                <QuestionCard
                  question={question}
                  onDelete={deleteQuestion}
                  onUpdateQuestion={updateQuestion}
                />
              </SortableItem>
            ))}
          </SortableContext>

          {/* Add New Question */}
          <Card className="mt-4 mb-4 shadow-sm">
            <Card.Header className="bg-light">Add New Question</Card.Header>
            <Card.Body>
              <Row className="g-3 align-items-center">
                <Col md={6}>
                  <Form.Control
                    type="text"
                    placeholder="Enter the question"
                    value={newQuestion.title}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, title: e.target.value })
                    }
                  />
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={newQuestion.type}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, type: e.target.value })
                    }
                  >
                    <option value="text">Single-line</option>
                    <option value="textarea">Multi-line</option>
                    <option value="number">Integer</option>
                    <option value="checkbox">Checkbox</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Check
                    type="checkbox"
                    label="Display"
                    checked={newQuestion.displayOnTable}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        displayOnTable: e.target.checked,
                      })
                    }
                  />
                </Col>
                <Col md={1}>
                  <Button variant="primary" onClick={addQuestion}>
                    +
                  </Button>
                </Col>
              </Row>
              <Row className="my-3">
                <Col md={12}>
                  <Form.Control
                    as={"textarea"}
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
              </Row>
              <Form.Text className="text-muted">
                Note: You can add up to 4 questions of each type.
              </Form.Text>
            </Card.Body>
          </Card>

          <div className="text-center">
            <Button variant="primary" type="submit" size="lg">
              Save Form
            </Button>
          </div>
        </Form>
      </DndContext>
    </Container>
  );
};

export default CreateScreen;
