import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Card,
  Tabs,
  Tab,
  Table,
} from "react-bootstrap";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import QuestionCard from "../components/QuestionCard";
import { toast } from "react-toastify";
import SortableItem from "../components/SortableItem";
import {
  useUpdateTemplateMutation,
  useGetTemplateByIdQuery,
  useGetTemplatesQuery,
} from "../redux/slices/templatesApiSlice";
import {
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
  useUpdateQuestionMutation,
} from "../redux/slices/questionsApiSlice";
import { useGetTagsQuery } from "../redux/slices/tagsApiSlice";
import { useGetTemplateFormsQuery } from "../redux/slices/formsApiSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import ReactMarkdown from "react-markdown";
import "github-markdown-css/github-markdown-light.css";
import moment from "moment";
import Message from "../components/Message";
import Tags from "../components/Tags";

const EditTemplateScreen = () => {
  const { id: templateId } = useParams();

  const {
    data: template,
    isLoading: isLoadingTemplate,
    refetch: refetchTemplate,
  } = useGetTemplateByIdQuery(templateId);

  const {
    data: forms,
    isLoading: loadingForms,
    error: errorForm,
  } = useGetTemplateFormsQuery(templateId);

  const { data: suggestions, refetch: refetchTags } = useGetTagsQuery();

  const [createQuestion, { isLoading: isCreatingQuestion }] =
    useCreateQuestionMutation();

  const [updateQuestion] = useUpdateQuestionMutation();

  const [deleteQuestion, { isLoading: isDeleting }] =
    useDeleteQuestionMutation();

  const [updateTemplate, { isLoading }] = useUpdateTemplateMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [access, setAcess] = useState("public");
  const [topic, setTopic] = useState("Other");
  const [topicList] = useState(["Other", "Education", "Poll"]);
  const [selected, setSelected] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [sortOrderForms, setSortOrderForms] = useState("desc");
  const [newQuestion, setNewQuestion] = useState({
    type: "text",
    title: "",
    description: "",
    displayOnTable: true,
  });

  const navigate = useNavigate();

  const { refetch } = useGetTemplatesQuery();

  useEffect(() => {
    if (template) {
      setTitle(template.title);
      setDescription(template.description);
      setQuestionList(template.Questions);
      setAcess(template.access);
      setTopic(template.topic);
      setSelected(template.Tags);
    }
  }, [template]);

  const addQuestion = async () => {
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
      try {
        await createQuestion({
          ...newQuestion,
          index: questionList.length,
          template_id: templateId,
        }).unwrap();
        setNewQuestion({
          type: "SINGLE_LINE",
          title: "",
          description: "",
          displayOnTable: true,
        });
        refetchTemplate();
        toast.success("Question created successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleDragEnd = async (event) => {
    if (editingQuestionId !== null) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Use the local state for ordering
    const oldIndex = questionList.findIndex((q) => q.id === active.id);
    const newIndex = questionList.findIndex((q) => q.id === over.id);

    // Reorder and update index property
    const newQuestions = arrayMove(questionList, oldIndex, newIndex).map(
      (q, idx) => ({
        ...q,
        index: idx,
      })
    );

    // Update local state to reflect new order immediately
    setQuestionList(newQuestions);

    try {
      // Update each question's index in the backend.
      for (const question of newQuestions) {
        await updateQuestion({
          id: question.id,
          index: question.index,
        }).unwrap();
      }
      // Optionally, refetch the template to sync any other changes:
      await refetchTemplate();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reorder questionList");
    }
  };

  const handleDelete = async (questionId) => {
    try {
      await deleteQuestion(questionId).unwrap();

      const updatedQuestions = questionList.filter((q) => q.id !== questionId);

      const reIndexedQuestions = updatedQuestions.map((q, index) => ({
        ...q,
        index,
      }));

      setQuestionList(reIndexedQuestions);

      for (const question of reIndexedQuestions) {
        await updateQuestion({
          id: question.id,
          index: question.index,
        }).unwrap();
      }

      refetchTemplate();
      toast.success("Question deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleUpdate = async (editedQuestion) => {
    try {
      await updateQuestion({
        ...editedQuestion,
      }).unwrap();
      refetchTemplate();
      toast.success("Question updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
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
      await updateTemplate({
        title,
        description,
        access,
        topic,
        templateId,
        tagList: selected,
      }).unwrap();
      refetch();
      refetchTemplate();
      refetchTags();
      navigate("/");
      toast.success("Template updated successfully!");
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
      <Tabs
        defaultActiveKey="general"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="general" title="General Settings">
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
            <Card className="my-2">
              <Card.Header>Markdown Preview</Card.Header>
              <Card.Body>
                <div className="markdown-body">
                  <ReactMarkdown>{description}</ReactMarkdown>
                </div>
              </Card.Body>
            </Card>

            <Form.Group className="my-3">
              <Tags
                suggestions={suggestions}
                selected={selected}
                setSelected={setSelected}
              />
            </Form.Group>

            <Form.Group className="flex flex-row justify-between">
              <Form.Select
                name="access"
                value={access}
                onChange={(e) => setAcess(e.target.value)}
                className="w-1/3"
              >
                <option value="public">Public</option>
                <option value="restricted">Restricted</option>
              </Form.Select>

              <Form.Select
                name="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-1/3"
              >
                {topicList.map((topic, index) => (
                  <option key={index} value={topic}>
                    {topic}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="text-center mt-2">
              <Button variant="primary" type="submit" size="lg">
                Save Form
              </Button>
            </div>
          </Form>
        </Tab>

        <Tab eventKey="questions" title="Questions">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {/* Questions List */}
            <h4 className="mb-3">Questions</h4>
            <SortableContext
              items={questionList.map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              {questionList.map((question) => (
                <SortableItem
                  key={question.id}
                  id={question.id}
                  index={question.index}
                >
                  <QuestionCard
                    question={question}
                    index={question.index}
                    onDelete={() => handleDelete(question.id)}
                    onUpdate={() => setEditingQuestionId(question.id)}
                    isEditing={question.id === editingQuestionId}
                    onSave={handleUpdate}
                    onCancelEdit={() => setEditingQuestionId(null)}
                    dragHandleProps={undefined}
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
                        setNewQuestion({
                          ...newQuestion,
                          title: e.target.value,
                        })
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
                      <option value="SINGLE_LINE">Single-line</option>
                      <option value="MULTI_LINE">Multi-line</option>
                      <option value="INTEGER">Integer</option>
                      <option value="CHECKBOX">Checkbox</option>
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
            {(isLoading ||
              isDeleting ||
              isLoadingTemplate ||
              isCreatingQuestion) && <Loader />}
          </DndContext>
        </Tab>

        <Tab eventKey="results" title="Results">
          {loadingForms ? (
            <Loader />
          ) : errorForm ? (
            <Message>{errorForm?.data?.message || errorForm.error}</Message>
          ) : forms.length === 0 ? (
            <Message>No forms found.</Message>
          ) : (
            <>
              <Table striped hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th className="text-nowrap">USER ID</th>
                    <th className="text-nowrap">FORM ID</th>
                    <th
                      className="min-w-[120px] cursor-pointer"
                      onClick={() =>
                        setSortOrderForms((prev) =>
                          prev === "asc" ? "desc" : "asc"
                        )
                      }
                    >
                      <div className="d-flex align-items-center gap-1 text-nowrap">
                        DATE FILLED
                        {sortOrderForms === "asc" ? (
                          <FaChevronUp className="text-muted" />
                        ) : (
                          <FaChevronDown className="text-muted" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {forms
                    .slice()
                    .sort((a, b) => {
                      const dateA = new Date(a.createdAt);
                      const dateB = new Date(b.createdAt);
                      return sortOrderForms === "asc"
                        ? dateA - dateB
                        : dateB - dateA;
                    })
                    .map((form) => (
                      <tr key={form.id}>
                        <td>{form.user_id}</td>
                        <td>
                          <Link
                            to={`/form/${form.id}`}
                            className="text-blue-500 underline"
                          >
                            {form.id}
                          </Link>
                        </td>
                        <td className="text-nowrap">
                          {moment(form.createdAt).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </>
          )}
        </Tab>
        <Tab eventKey="aggregation" title="Aggregation">
          Tab content for aggregation
        </Tab>
      </Tabs>
    </Container>
  );
};

export default EditTemplateScreen;
