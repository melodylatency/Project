import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BiLike } from "react-icons/bi";
import { RegExpMatcher, englishDataset } from "obscenity";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Form,
  ListGroupItem,
  Card,
} from "react-bootstrap";
import {
  useCreateTemplateReviewMutation,
  useGetTemplateByIdQuery,
  useGetTemplatesQuery,
} from "../redux/slices/templatesApiSlice";
import {
  clearTemplateAnswers,
  updateAnswer,
} from "../redux/slices/answerSlice";
import { useCreateFormMutation } from "../redux/slices/formsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ReactMarkdown from "react-markdown";
import "github-markdown-css/github-markdown-light.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const FormScreen = () => {
  const [isLiked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { id: templateId } = useParams();

  const {
    data: template,
    isLoading,
    refetch,
    error,
  } = useGetTemplateByIdQuery(templateId);

  const [createForm, { isLoading: creatingForm }] = useCreateFormMutation();
  const [createReview, { isLoading: loadingReview }] =
    useCreateTemplateReviewMutation();

  const { refetch: refetchTemplates } = useGetTemplatesQuery();

  const { answerMap } = useSelector((state) => state.answer);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matcher = useMemo(() => new RegExpMatcher(englishDataset.build()), []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (comment.length < 1) {
      toast.error("The comment can't be empty");
      return;
    }

    const matches = matcher.getAllMatches(comment);
    if (matches.length > 0) {
      toast.error("Please remove inappropriate language from your comment");
      return;
    }

    try {
      await createReview({
        templateId,
        user_id: userInfo.id,
        isLiked,
        comment,
      }).unwrap();
      refetch();
      refetchTemplates();
      setLiked(false);
      setComment("");
      toast.success("Review submitted");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleInputChange = (templateId, questionId, value, type) => {
    let newValue;

    switch (type) {
      case "INTEGER":
        if (value < 0) {
          setErrorMessage("Integer values must be positive.");
          return; // Don't update state if invalid
        } else {
          setErrorMessage(""); // Clear error if input is valid
          newValue = value === "" ? "" : Number(value);
        }
        break;
      case "CHECKBOX":
        // Flip the current checkbox value (defaulting to false)
        newValue = !(
          (answerMap[templateId] && answerMap[templateId][questionId]) ||
          false
        );
        break;
      default:
        newValue = value;
    }

    dispatch(updateAnswer({ templateId, questionId, answer: newValue }));
  };

  const handleSubmittingForm = async (e) => {
    e.preventDefault();
    const currentFormAnswers = answerMap[templateId] || {};
    const answerArray = Object.entries(currentFormAnswers).map(
      ([questionId, value]) => ({
        questionId,
        value,
      })
    );
    try {
      await createForm({
        title: template.title,
        user_id: userInfo.id,
        template_id: templateId,
        answerMap: answerArray,
      }).unwrap();
      dispatch(clearTemplateAnswers(templateId));
      navigate("/");
      toast.success("Form submitted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Image src={template.image} fluid alt={template.title} />
            </Col>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3 className="text-3xl">{template.title}</h3>
                </ListGroup.Item>
                {template.description.length > 0 && (
                  <ListGroup.Item>
                    <div className="markdown-body">
                      <ReactMarkdown>{template.description}</ReactMarkdown>
                    </div>
                  </ListGroup.Item>
                )}
                <ListGroup.Item className="d-flex align-items-center gap-1">
                  <p>{template.likes}</p>
                  <BiLike />
                </ListGroup.Item>
                <h2 className="text-3xl my-3">Reviews</h2>
                {template.Reviews.length === 0 && <Message>No Reviews</Message>}
                {template.Reviews.map((review) => (
                  <ListGroupItem key={review.id}>
                    <strong>{review.name}</strong>
                    {review.isLiked && (
                      <p className="text-muted font-light">User left a 👍</p>
                    )}
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p className="mt-4">{review.comment}</p>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroupItem className="bg-transparent">
                  <h2 className="text-3xl mb-3">Leave a review</h2>

                  {loadingReview && <Loader />}

                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="like" className="my-2">
                        <Form.Check
                          type="checkbox"
                          checked={isLiked}
                          label="Like"
                          onChange={(e) => setLiked(e.target.checked)}
                        />
                      </Form.Group>
                      <Form.Group controlId="comment" className="my-2">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </Form.Group>
                      <Button
                        className="my-2"
                        disabled={loadingReview}
                        type="submit"
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      <Link
                        className="text-blue-500 underline"
                        to={`/login?redirect=/template/${templateId}`}
                      >
                        Sign in
                      </Link>{" "}
                      to submit a review
                    </Message>
                  )}
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={12}>
              <Form onSubmit={handleSubmittingForm}>
                {template.Questions.map((question) => {
                  // Retrieve current answers for this template
                  const currentTemplateAnswers = answerMap[templateId] || {};
                  return (
                    <Card key={question.id} className="mb-3">
                      <Card.Body>
                        <Card.Title>{question.title}</Card.Title>
                        {question.description && (
                          <Card.Text className="text-muted">
                            {question.description}
                          </Card.Text>
                        )}

                        {question.type === "SINGLE_LINE" && (
                          <Form.Control
                            type="text"
                            value={currentTemplateAnswers[question.id] ?? ""}
                            disabled={!userInfo}
                            onChange={(e) =>
                              handleInputChange(
                                templateId,
                                question.id,
                                e.target.value,
                                "SINGLE_LINE"
                              )
                            }
                            placeholder="Enter your answer"
                          />
                        )}

                        {question.type === "MULTI_LINE" && (
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={currentTemplateAnswers[question.id] ?? ""}
                            disabled={!userInfo}
                            onChange={(e) =>
                              handleInputChange(
                                templateId,
                                question.id,
                                e.target.value,
                                "MULTI_LINE"
                              )
                            }
                            placeholder="Enter your answer"
                          />
                        )}

                        {question.type === "INTEGER" && (
                          <>
                            <Form.Control
                              type="number"
                              value={currentTemplateAnswers[question.id] ?? ""}
                              disabled={!userInfo}
                              onChange={(e) =>
                                handleInputChange(
                                  templateId,
                                  question.id,
                                  e.target.value,
                                  "INTEGER"
                                )
                              }
                              placeholder="Enter a positive number"
                            />
                            {errorMessage && (
                              <Message variant="danger">{errorMessage}</Message>
                            )}
                          </>
                        )}

                        {question.type === "CHECKBOX" && (
                          <Form.Check
                            type="checkbox"
                            id={question.id}
                            label="Check this box"
                            disabled={!userInfo}
                            checked={
                              currentTemplateAnswers[question.id] ?? false
                            }
                            onChange={() =>
                              handleInputChange(
                                templateId,
                                question.id,
                                null,
                                "CHECKBOX"
                              )
                            }
                          />
                        )}
                      </Card.Body>
                    </Card>
                  );
                })}

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={!userInfo}
                  >
                    Submit Form
                  </Button>
                </div>
                {(isLoading || creatingForm) && <Loader />}
              </Form>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default FormScreen;
