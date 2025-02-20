import { useParams, Link } from "react-router-dom";
import { Row, Col, Form, Card } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useGetFormByIdQuery } from "../redux/slices/formsApiSlice";

const FormScreen = () => {
  const { id: formId } = useParams();

  const { data: form, isLoading, error } = useGetFormByIdQuery(formId);

  const answerMap = form?.answerList?.reduce((acc, answer) => {
    acc[answer.question_id] = answer.value;
    return acc;
  }, {});

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
          <Link
            className="btn btn-light my-3"
            to={`/template/edit/${form.template_id}`}
          >
            Go Back
          </Link>
          <Row className="mt-4">
            <Col md={12}>
              <Form>
                {form.questionList.map((question) => {
                  // Retrieve current answers for this form
                  const currentAnswer = answerMap[question.id];
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
                            value={currentAnswer ?? ""}
                            readOnly
                            disabled={true}
                            placeholder="Enter your answer"
                          />
                        )}

                        {question.type === "MULTI_LINE" && (
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={currentAnswer ?? ""}
                            readOnly
                            disabled={true}
                            placeholder="Enter your answer"
                          />
                        )}

                        {question.type === "INTEGER" && (
                          <>
                            <Form.Control
                              type="number"
                              value={currentAnswer ?? ""}
                              readOnly
                              disabled={true}
                              placeholder="Enter a positive number"
                            />
                          </>
                        )}

                        {question.type === "CHECKBOX" && (
                          <Form.Check
                            type="checkbox"
                            id={question.id}
                            label="Check this box"
                            disabled={true}
                            checked={currentAnswer ?? false}
                            readOnly
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
      )}
    </>
  );
};

export default FormScreen;
