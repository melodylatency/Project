import { Row, Col } from "react-bootstrap";
import Template from "../components/Template";
import { useGetTemplatesQuery } from "../redux/slices/templatesApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const HomeScreen = () => {
  const { data: templates, isLoading, error } = useGetTemplatesQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1 className="text-lg">Latest Templates</h1>
          <Row>
            {templates.map((template) => (
              <Col key={template.id} sm={12} md={6} lg={4} xl={3}>
                <Template template={template} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
