import { useParams, Link, useNavigate } from "react-router-dom";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useSelector } from "react-redux";
import { useGetFormByIdQuery } from "../redux/slices/formsApiSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const FormScreen = () => {
  const { id: formId } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [answerMap, setAnswerMap] = useState({});

  const { userInfo } = useSelector((state) => state.auth);
  const { data: form, isLoading, error } = useGetFormByIdQuery(formId);

  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && form) {
      if (userInfo.id !== form.user_id && userInfo.isAdmin === false) {
        navigate("/");
        toast.error("Unauthorized!");
      }

      if (form?.answerList) {
        const initialAnswers = form.answerList.reduce((acc, answer) => {
          acc[answer.question_id] = answer.value;
          return acc;
        }, {});
        setAnswerMap(initialAnswers);
      }
    }
  }, [setAnswerMap, form, userInfo, navigate]);

  const handleInputChange = (formId, questionId, value, type) => {
    let newValue;

    switch (type) {
      case "INTEGER":
        if (value < 0) {
          setErrorMessage("Integer values must be positive.");
          return;
        } else {
          setErrorMessage("");
          newValue = value === "" ? "" : Number(value);
        }
        break;
      case "CHECKBOX":
        newValue = !answerMap[questionId];
        break;
      default:
        newValue = value;
    }

    setAnswerMap((prevMap) => ({
      ...prevMap,
      [questionId]: newValue,
    }));

    //updateAnswer({ formId, questionId, answer: newValue });
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div>
          <Link className="btn btn-light my-3" to={`/profile`}>
            Go Back
          </Link>
          <Row className="mt-4">
            <Col md={12}>
              <Form>
                {form.questionList.map((question) => {
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
                            value={answerMap[question.id] ?? ""}
                            disabled={
                              !(
                                userInfo.id === form.user_id ||
                                userInfo.isAdmin === true
                              )
                            }
                            onChange={(e) =>
                              handleInputChange(
                                formId,
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
                            value={answerMap[question.id] ?? ""}
                            disabled={
                              !(
                                userInfo.id === form.user_id ||
                                userInfo.isAdmin === true
                              )
                            }
                            onChange={(e) =>
                              handleInputChange(
                                formId,
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
                              value={answerMap[question.id] ?? ""}
                              onChange={(e) =>
                                handleInputChange(
                                  formId,
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
                            disabled={
                              !(
                                userInfo.id === form.user_id ||
                                userInfo.isAdmin === true
                              )
                            }
                            onChange={() =>
                              handleInputChange(
                                formId,
                                question.id,
                                null,
                                "CHECKBOX"
                              )
                            }
                            checked={answerMap[question.id] ?? false}
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
                    disabled={
                      !(
                        userInfo.id === form.user_id ||
                        userInfo.isAdmin === true
                      )
                    }
                  >
                    Resubmit Form
                  </Button>
                </div>
                {isLoading && <Loader />}
              </Form>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default FormScreen;
