import React, { useEffect, useState } from "react";
import { Table, Form, Button, Row, Col, Tabs, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast } from "react-toastify";
import { useProfileMutation } from "../redux/slices/usersApiSlice";
import { useGetUsersFormsQuery } from "../redux/slices/formsApiSlice";
import { useGetUsersTemplatesQuery } from "../redux/slices/templatesApiSlice";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { setCredentials } from "../redux/slices/authSlice";
import { Link } from "react-router-dom";
import moment from "moment";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sortOrderForms, setSortOrderForms] = useState("desc");
  const [sortOrderTemplates, setSortOrderTemplates] = useState("desc");

  const {
    data: forms,
    isLoading: loadingForms,
    error: errorForm,
  } = useGetUsersFormsQuery();

  const {
    data: templates,
    isLoading: loadingTemplates,
    error: errorTemplate,
  } = useGetUsersTemplatesQuery();

  console.log(forms);

  const [updateProfile, { isLoading }] = useProfileMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
    } else {
      try {
        const res = await updateProfile({
          id: userInfo.id,
          name,
          email,
          password,
        }).unwrap();

        dispatch(setCredentials(res));
        toast.success("Profile updated.");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2 className="text-5xl py-5">User Profile</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password" className="my-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="confirmPassword" className="my-3">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password again"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary" className="my-3">
            Update
          </Button>
          {isLoading && <Loader />}
        </Form>
      </Col>
      <Col md={9}>
        <Tabs defaultActiveKey="forms" id="dashboard" className="pt-5">
          <Tab eventKey="forms" title="Forms">
            {loadingForms ? (
              <Loader />
            ) : errorForm ? (
              <Message>{errorForm?.data?.message || errorForm.error}</Message>
            ) : (
              <Table striped hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>TITLE</th>
                    <th>FORM ID</th>
                    <th
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setSortOrderForms((prev) =>
                          prev === "asc" ? "desc" : "asc"
                        )
                      }
                    >
                      <div className="d-flex align-items-center gap-1">
                        DATE FILLED
                        {sortOrderForms === "asc" ? (
                          <FaChevronUp className="text-muted" />
                        ) : (
                          <FaChevronDown className="text-muted" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {forms
                    .slice()
                    .sort((a, b) => {
                      const dateA = new Date(a.createdAt);
                      const dateB = new Date(b.createdAt);
                      return sortOrderForms === "asc"
                        ? dateA - dateB
                        : dateB - dateA;
                    })
                    .map((form) => (
                      <tr key={form.id}>
                        <td>{form.title}</td>
                        <td>
                          <Link
                            to={`/form/${form.id}`}
                            className="text-blue-500 underline"
                          >
                            {form.id}
                          </Link>
                        </td>
                        <td>
                          {moment(form.createdAt).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}
          </Tab>
          <Tab eventKey="templates" title="Templates">
            {loadingTemplates ? (
              <Loader />
            ) : errorTemplate ? (
              <Message>
                {errorTemplate?.data?.message || errorTemplate.error}
              </Message>
            ) : (
              <Table striped hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>TITLE</th>
                    <th>TOPIC</th>
                    <th>TEMPLATE ID</th>
                    <th
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setSortOrderTemplates((prev) =>
                          prev === "asc" ? "desc" : "asc"
                        )
                      }
                    >
                      <div className="d-flex align-items-center gap-1">
                        CREATED
                        {sortOrderTemplates === "asc" ? (
                          <FaChevronUp className="text-muted" />
                        ) : (
                          <FaChevronDown className="text-muted" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {templates
                    .slice()
                    .sort((a, b) => {
                      const dateA = new Date(a.createdAt);
                      const dateB = new Date(b.createdAt);
                      return sortOrderTemplates === "asc"
                        ? dateA - dateB
                        : dateB - dateA;
                    })
                    .map((template) => (
                      <tr key={template.id}>
                        <td>{template.title}</td>
                        <td>{template.topic}</td>
                        <td>
                          <Link
                            to={`/template/${template.id}`}
                            className="text-blue-500 underline"
                          >
                            {template.id}
                          </Link>
                        </td>
                        <td>{template.createdAt.substring(0, 10)}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}
          </Tab>
        </Tabs>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
