import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import useTheme from "../hooks/useTheme";

const SaleFormScreen = () => {
  const { t } = useTranslation();
  const isDark = useTheme();

  //companyName, phone, jobTitle, website, department

  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(answerArray);
      // await updateForm({
      //   answerMap: answerArray,
      //   formId,
      // }).unwrap();
      refetch();
      setAnswerMap({});
      navigate("/profile");
      toast.success(t("update"));
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

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
          <Link to={`/profile`}>
            <div className="my-3">
              <Button variant="secondary">{t("goBack")}</Button>
            </div>
          </Link>
          <Row className="mt-4">
            <Col md={12}>
              <Form
                onSubmit={handleSubmit}
                data-bs-theme={isDark ? "dark" : "light"}
              >
                <Form.Group controlId="companyName" className="my-3">
                  <Form.Label className="dark:text-gray-400">
                    Company Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("enterEmail")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="website" className="my-3">
                  <Form.Label className="dark:text-gray-400">
                    Website
                  </Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://example.com"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={
                      !(
                        userInfo.id === form.user_id ||
                        userInfo.isAdmin === true
                      )
                    }
                  >
                    {t("submitForm")}
                  </Button>
                </div>
                {isLoading || (updatingForm && <Loader />)}
              </Form>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default SaleFormScreen;
