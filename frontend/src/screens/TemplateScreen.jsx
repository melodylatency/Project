import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BiLike } from "react-icons/bi";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Form,
  ListGroupItem,
} from "react-bootstrap";
import {
  useCreateTemplateReviewMutation,
  useGetTemplateByIdQuery,
  useGetTemplatesQuery,
} from "../redux/slices/templatesApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ReactMarkdown from "react-markdown";
import "github-markdown-css/github-markdown-light.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const FormScreen = () => {
  const [isLiked, setLiked] = useState(false);
  const [comment, setComment] = useState("");

  const { id: templateId } = useParams();

  const {
    data: template,
    isLoading,
    refetch,
    error,
  } = useGetTemplateByIdQuery(templateId);

  const { refetch: refetchTemplates } = useGetTemplatesQuery();

  const [createReview, { isLoading: loadingReview }] =
    useCreateTemplateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (comment.length < 1) {
      toast.error("The comment can't be empty");
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
      toast.success("Review submitted");
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
                {template.reviews.length === 0 && <Message>No Reviews</Message>}
                {template.reviews.map((review) => (
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
                      <Link className="text-blue-500 underline" to={"/login"}>
                        Sign in
                      </Link>{" "}
                      to submit a review
                    </Message>
                  )}
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default FormScreen;
