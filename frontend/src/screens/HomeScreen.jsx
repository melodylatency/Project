import { useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import Template from "../components/Template";
import { useGetTemplatesQuery } from "../redux/slices/templatesApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const HomeScreen = () => {
  const { data: templates, isLoading, error } = useGetTemplatesQuery();

  const top5 = useMemo(() => {
    if (!Array.isArray(templates) || templates.length === 0) return [];
    return [...templates]
      .filter((template) => template?.views != null)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }, [templates]);

  const top5Ids = useMemo(() => top5.map((template) => template.id), [top5]);

  const restTemplates = useMemo(() => {
    if (!Array.isArray(templates)) return [];
    return templates.filter((template) => !top5Ids.includes(template.id));
  }, [templates, top5Ids]);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1 className="text-center text-6xl py-5">Top Viewed Templates</h1>
          <Row>
            {top5.map((template) => (
              <Col key={template.id} sm={12} md={6} lg={4} xl={4}>
                <Template template={template} />
              </Col>
            ))}
          </Row>

          <h1 className="text-center text-6xl py-5">All other Templates</h1>
          <Row>
            {restTemplates.map((template) => (
              <Col key={template.id} sm={12} md={6} lg={4} xl={3}>
                <Template template={template} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};

export default HomeScreen;
