import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { useGetTemplateByIdQuery } from "../redux/slices/templatesApiSlice";
import { useCreateFormMutation } from "../redux/slices/formsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from "../components/Rating";
import {
  clearTemplateAnswers,
  updateAnswer,
} from "../redux/slices/answerSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import "github-markdown-css/github-markdown-light.css";

const FormScreen = () => {
  // Function to handle changes in inputs

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
                <ListGroup.Item>
                  <Rating value={4.7} text={`${5} comments`} />
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={12}>
              <Form onSubmit={handleSubmit}>
                {template.questionList.map((question) => {
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
                  <Button type="submit" variant="primary" size="lg">
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
