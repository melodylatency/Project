import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Button, Form } from "react-bootstrap";
import Loader from "../components/Loader";
import { useSendSalesFormMutation } from "../redux/slices/saleforceApiSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import useTheme from "../hooks/useTheme";

const SaleFormScreen = () => {
  const { t } = useTranslation();
  const isDark = useTheme();

  const [sendForm, { isLoading: sendingForm }] = useSendSalesFormMutation();

  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (companyName.trim() === "") {
      alert(t("companyNameRequired"));
      return;
    }

    try {
      console.log("OK");
      await sendForm({
        companyName,
        website,
        phone,
        jobTitle,
        department,
      }).unwrap();
      navigate("/profile");
      toast.success("Sales force created!");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <div>
        <Link to={`/profile`}>
          <div className="my-3">
            <Button variant="secondary">{t("goBack")}</Button>
          </div>
        </Link>
        <Row className="mt-4 justify-content-center">
          <Col md={12} lg={8} xl={6}>
            <Form
              onSubmit={handleSubmit}
              data-bs-theme={isDark ? "dark" : "light"}
            >
              <Form.Group controlId="companyName" className="my-3">
                <Form.Label className="dark:text-gray-400">
                  {t("company")}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("enterCompany")}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="website" className="my-3">
                <Form.Label className="dark:text-gray-400">Website</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://example.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="phone" className="my-3">
                <Form.Label className="dark:text-gray-400">
                  {t("phone")}
                </Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="123-456-7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="jobTitle" className="my-3">
                <Form.Label className="dark:text-gray-400">
                  {t("jobTitle")}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("enterJobTitle")}
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="companyName" className="my-3">
                <Form.Label className="dark:text-gray-400">
                  {t("department")}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("enterDepartment")}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <div className="flex justify-center">
                <Button type="submit" variant="primary" size="lg">
                  {t("submitForm")}
                </Button>
              </div>
              {sendingForm && <Loader />}
            </Form>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SaleFormScreen;
