import { useParams, Link, useNavigate } from "react-router-dom";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useSelector } from "react-redux";

const FormScreen = () => {
  const { id: formId } = useParams();

  return (
    <div>
      <Row className="mt-4">
        <Col md={12}>
          <Form>
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
                        checked={currentTemplateAnswers[question.id] ?? false}
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

            {isLoading && <Loader />}
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default FormScreen;
