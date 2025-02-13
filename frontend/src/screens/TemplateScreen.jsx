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
  ListGroupItem,
} from "react-bootstrap";
import {
  useCreateTemplateMutation,
  useGetTemplateByIdQuery,
} from "../redux/slices/templatesApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from "../components/Rating";
import ReactMarkdown from "react-markdown";
import "github-markdown-css/github-markdown-light.css";
import { useDispatch, useSelector } from "react-redux";
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

  const [createReview, { isLoading: loadingReview }] =
    useCreateTemplateMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  console.log(template);

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

          <Row className="review mt-4">
            <Col md={6}>
              <h2 className="text-3xl">Reviews</h2>
              {template.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {template.reviews.map((review) => (
                  <ListGroupItem key={review.id}>
                    <strong>{review.name}</strong>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default FormScreen;
