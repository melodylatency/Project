import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetTemplateByIdQuery } from "../redux/slices/templatesApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from "../components/Rating";
import { setFormState, addToFormState } from "../redux/slices/formSlice";
import { useDispatch, useSelector } from "react-redux";

const FormScreen = () => {
  const { id: templateId } = useParams();
  const {
    data: template,
    isLoading,
    error,
  } = useGetTemplateByIdQuery(templateId);

  const { formState } = useSelector((state) => state.form);

  const dispatch = useDispatch();

  //     template.questionList.forEach((question) => {
  //       initialState[question.id] = question.type === "CHECKBOX" ? false : "";
  //     });
  //     setFormState(initialState);

  const handleInputChange = (questionId, value, type) => {
    switch (type) {
      case "INTEGER":
        dispatch(
          setFormState((prev) => ({
            ...prev,
            [questionId]: value === "" ? "" : Number(value),
          }))
        );
        break;
      case "CHECKBOX":
        dispatch(
          setFormState((prev) => ({
            ...prev,
            [questionId]: !prev[questionId],
          }))
        );
        break;

      default:
        dispatch(
          setFormState((prev) => ({
            ...prev,
            [questionId]: value,
          }))
        );
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form responses:", formState);
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
                    <p>Description: {template.description}</p>
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
                {template.questionList.map((question) => (
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
                          value={
                            formState[question.id] !== undefined
                              ? formState[question.id]
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange(
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
                          value={
                            formState[question.id] !== undefined
                              ? formState[question.id]
                              : ""
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
                        <Form.Control
                          type="number"
                          value={
                            formState[question.id] !== undefined
                              ? formState[question.id]
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              question.id,
                              e.target.value,
                              "INTEGER"
                            )
                          }
                          placeholder="Enter a number"
                        />
                      )}

                      {question.type === "CHECKBOX" && (
                        <Form.Check
                          type="checkbox"
                          id={question.id}
                          label="Check this box"
                          checked={
                            formState[question.id] !== undefined
                              ? formState[question.id]
                              : false
                          }
                          onChange={() =>
                            handleInputChange(question.id, null, "CHECKBOX")
                          }
                        />
                      )}
                    </Card.Body>
                  </Card>
                ))}

                <div className="d-grid gap-2">
                  <Button type="submit" variant="primary" size="lg">
                    Submit Form
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default FormScreen;
