import { useParams, Link, useNavigate } from "react-router-dom";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useSelector } from "react-redux";
import {
  useGetFormByIdQuery,
  useUpdateFormMutation,
} from "../redux/slices/formsApiSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const FormScreen = () => {
  const { t } = useTranslation();
  const { id: formId } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [answerMap, setAnswerMap] = useState({});

  const { userInfo } = useSelector((state) => state.auth);
  const { data: form, refetch, isLoading, error } = useGetFormByIdQuery(formId);

  const [updateForm, { isLoading: updatingForm }] = useUpdateFormMutation();

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

  const handleInputChange = (questionId, value, type) => {
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
  };

  const handleResubmittingForm = async (e) => {
    e.preventDefault();
    const answerArray = Object.entries(answerMap).map(
      ([questionId, value]) => ({
        questionId,
        value,
      })
    );
    try {
      console.log(answerArray);
      await updateForm({
        answerMap: answerArray,
        formId,
      }).unwrap();
      refetch();
      setAnswerMap({});
      navigate("/profile");
      toast.success("Form updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
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
            {t("goBack")}
          </Link>
          <Row className="mt-4">
            <Col md={12}>
              <Form onSubmit={handleResubmittingForm}>
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
                                question.id,
                                e.target.value,
                                "SINGLE_LINE"
                              )
                            }
                            placeholder={t("enterYourAnswer")}
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
                              handleInputChange(question.id, null, "CHECKBOX")
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
                    {t("submitForm")}
                  </Button>
                </div>
                {isLoading || (updatingForm && <Loader />)}
              </Form>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default FormScreen;
