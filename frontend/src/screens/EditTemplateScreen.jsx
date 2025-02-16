import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Container, Card } from "react-bootstrap";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import QuestionCard from "../components/QuestionCard";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addToQuestionList,
  setQuestionList,
} from "../redux/slices/questionSlice";
import SortableItem from "../components/SortableItem";
import { v4 as uuid } from "uuid";
import {
  useCreateTemplateMutation,
  useGetTemplateByIdQuery,
  useGetTemplatesQuery,
} from "../redux/slices/templatesApiSlice";
import {
  useDeleteQuestionMutation,
  useEditQuestionMutation,
} from "../redux/slices/questionsApiSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import ReactMarkdown from "react-markdown";
import "github-markdown-css/github-markdown-light.css";

const EditTemplateScreen = () => {
  // const { questionList } = useSelector((state) => state.question);
  const { userInfo } = useSelector((state) => state.auth);

  const { id: templateId } = useParams();

  const {
    data: template,
    isLoading: loadingTemplate,
    refetch: refetchTemplate,
    error,
  } = useGetTemplateByIdQuery(templateId);

  const [
    editQuestion,
    { isLoading: isUpdatingQuestion, error: failedUpdatingQuestion },
  ] = useEditQuestionMutation();

  const [
    deleteQuestion,
    { isLoading: isDeleting, error: deleteQuestionFailed },
  ] = useDeleteQuestionMutation();

  const [title, setTitle] = useState();
  const [description, setDescription] = useState("");
  const [questionList, setQuestionList] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    type: "text",
    title: "",
    description: "",
    displayOnTable: true,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [createTemplate, { isLoading }] = useCreateTemplateMutation();
  const { refetch } = useGetTemplatesQuery();

  useEffect(() => {
    if (template) {
      setTitle(template.title);
      setDescription(template.description);
      setQuestionList(template.questionList);
    }
  }, [template]);

  const addQuestion = () => {
    const countOfType = questionList.filter(
      (q) => q.type === newQuestion.type
    ).length;

    if (newQuestion.title.trim() === "") {
    } else if (newQuestion.description.trim().length > 1500) {
      toast.error("Description too large.");
    } else if (countOfType >= 4) {
      alert(
        `You can add a maximum of 4 questionList of type "${newQuestion.type}"`
      );
    } else {
      const questionWithId = {
        ...newQuestion,
        id: uuid(),
        options: newQuestion.type === "checkbox" ? [] : undefined,
      };
      dispatch(addToQuestionList(questionWithId));
      setNewQuestion({
        type: "text",
        title: "",
        description: "",
        displayOnTable: true,
      });
    }
  };

  const handleDragEnd = (event) => {
    if (editingQuestionId !== null) return;
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = questionList.findIndex((q) => q.id === active.id);
      const newIndex = questionList.findIndex((q) => q.id === over.id);
      const newQuestionList = arrayMove(questionList, oldIndex, newIndex);
      dispatch(setQuestionList(newQuestionList));
    }
  };

  const handleDelete = async (questionId) => {
    try {
      await deleteQuestion(questionId).unwrap();
      refetchTemplate();
      toast.success("Question deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const updateQuestion = (updatedQuestion) => {
    dispatch(
      setQuestionList(
        questionList.map((q) =>
          q.id === updatedQuestion.id ? updatedQuestion : q
        )
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() === "") {
      alert("Form title cannot be empty");
      return;
    }
    if (questionList.length === 0) {
      alert("Please add at least one question.");
      return;
    }

    try {
      await createTemplate({
        title,
        description,
        topic: "Other",
        questionList,
        authorId: userInfo.id,
      }).unwrap();
      localStorage.removeItem("questionList");
      dispatch(setQuestionList([]));
      refetch();
      navigate("/");
      toast.success("Template created successfully!");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: "800px" }}>
      <Link className="btn btn-light my-3" to="/profile">
        Go Back
      </Link>
      <h1 className="text-center mb-4 text-5xl">Edit Template</h1>
      {/* Move DndContext outside the Form */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Form onSubmit={handleSubmit}>
          {/* Form Title */}

          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label className="fs-4">Template Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              size="lg"
            />
          </Form.Group>

          {/* Form Description with Markdown Support */}
          <Form.Group className="mb-4" controlId="formDescription">
            <Form.Label className="fs-5">
              Template Description (supports Markdown)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              placeholder="Enter a description (optional, Markdown supported)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          {/* Markdown Preview */}
          <Card className="mb-4">
            <Card.Header>Markdown Preview</Card.Header>
            <Card.Body>
              <div className="markdown-body">
                <ReactMarkdown>{description}</ReactMarkdown>
              </div>
            </Card.Body>
          </Card>

          {/* Questions List */}
          <h4 className="mb-3">Questions</h4>
          <SortableContext
            items={questionList.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {questionList.map((question, index) => (
              <SortableItem key={question.id} id={question.id} index={index}>
                <QuestionCard
                  question={question}
                  index={index}
                  onDelete={() => handleDelete(question.id)}
                  onUpdate={() => setEditingQuestionId(question.id)}
                  isEditing={question.id === editingQuestionId}
                  onSave={updateQuestion}
                  onCancelEdit={() => setEditingQuestionId(null)}
                  dragHandleProps={undefined} // Handled by SortableItem
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
                Note: You can add up to 4 questionList of each type.
              </Form.Text>
            </Card.Body>
          </Card>

          <div className="text-center">
            <Button variant="primary" type="submit" size="lg">
              Save Form
            </Button>
          </div>
          {isLoading && <Loader />}
        </Form>
      </DndContext>
    </Container>
  );
};

export default EditTemplateScreen;
