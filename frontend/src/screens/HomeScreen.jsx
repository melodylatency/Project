import { useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import Template from "../components/Template";
import { useGetTemplatesQuery } from "../redux/slices/templatesApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { TagCloud } from "react-tagcloud";
import { useGetTagCloudQuery } from "../redux/slices/tagsApiSlice";

const HomeScreen = () => {
  const { data: templates, isLoading, error } = useGetTemplatesQuery();

  const { data } = useGetTagCloudQuery();

  const top5 = useMemo(() => {
    if (!Array.isArray(templates) || templates.length === 0) return [];
    return [...templates]
      .filter((template) => template?.likes != null)
      .sort((a, b) => b.likes - a.likes)
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
          <h1 className="text-center text-6xl py-5">Top 5 Viewed Templates</h1>
          {templates.length > 0 ? (
            <Row>
              {top5.map((template) => (
                <Col key={template.id} sm={12} md={6} lg={4} xl={4}>
                  <Template template={template} />
                </Col>
              ))}
            </Row>
          ) : (
            <h1 className="flex justify-center text-3xl text-gray-500">
              Nothing to see here...
            </h1>
          )}

          <h1 className="text-center text-6xl py-5">All other Templates</h1>

          {templates.length > 5 ? (
            <Row>
              {restTemplates.map((template) => (
                <Col key={template.id} sm={12} md={6} lg={4} xl={3}>
                  <Template template={template} />
                </Col>
              ))}
            </Row>
          ) : (
            <h1 className="flex justify-center text-3xl text-gray-500">
              Nothing to see here...
            </h1>
          )}
          <Row className="flex justify-center">
            <Col md={6}>
              {" "}
              <TagCloud
                minSize={12}
                maxSize={35}
                tags={data}
                className="cursor-pointer my-2"
                onClick={(tag) => alert(`'${tag.value}' was selected!`)}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default HomeScreen;
