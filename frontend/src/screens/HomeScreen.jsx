import { useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import Template from "../components/Template";
import { useGetTemplatesQuery } from "../redux/slices/templatesApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { TagCloud } from "react-tagcloud";

const HomeScreen = () => {
  const { data: templates, isLoading, error } = useGetTemplatesQuery();

  const data = [
    { value: "jQuery", count: 25 },
    { value: "MongoDB", count: 18 },
    { value: "JavaScript", count: 38 },
    { value: "React", count: 30 },
    { value: "Nodejs", count: 28 },
    { value: "Express.js", count: 25 },
    { value: "HTML5", count: 33 },
    { value: "CSS3", count: 20 },
    { value: "Webpack", count: 22 },
    { value: "Babel.js", count: 7 },
    { value: "ECMAScript", count: 25 },
    { value: "Jest", count: 15 },
    { value: "Mocha", count: 17 },
    { value: "React Native", count: 27 },
    { value: "Angular.js", count: 30 },
    { value: "TypeScript", count: 15 },
    { value: "Flow", count: 30 },
    { value: "NPM", count: 11 },
  ];

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
