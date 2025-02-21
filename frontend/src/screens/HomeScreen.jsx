import { useEffect, useMemo, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Template from "../components/Template";
import { useGetTemplatesQuery } from "../redux/slices/templatesApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { TagCloud } from "react-tagcloud";
import { useGetTagCloudQuery } from "../redux/slices/tagsApiSlice";
import { useTranslation } from "react-i18next";

const HomeScreen = () => {
  const { t } = useTranslation();
  const [tags, setTags] = useState([]);

  const { data: templates, isLoading, error } = useGetTemplatesQuery();
  const { data } = useGetTagCloudQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data) {
      setTags(data);
    }
  }, [data]);

  const options = {
    luminosity: "bright",
    hue: "purple",
  };

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
          <h1 className="text-center text-6xl py-5 dark:text-gray-400">
            {t("topTemplates")}
          </h1>
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
              {t("nothingToSee")}
            </h1>
          )}

          <h1 className="text-center text-6xl py-5 dark:text-gray-400">
            {t("allTemplates")}
          </h1>

          {templates.length > 5 ? (
            <Row>
              {restTemplates.map((template) => (
                <Col key={template.id} sm={12} md={6} lg={4} xl={3}>
                  <Template template={template} />
                </Col>
              ))}
            </Row>
          ) : (
            <h1 className="flex justify-center text-3xl text-gray-600">
              {t("nothingToSee")}
            </h1>
          )}
          <Row className="flex justify-center">
            <Col md={6}>
              <TagCloud
                minSize={12}
                maxSize={35}
                colorOptions={options}
                tags={tags}
                className="cursor-pointer my-2"
                onClick={(tag) => alert(t("tagAlert", { value: tag.value }))}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default HomeScreen;
