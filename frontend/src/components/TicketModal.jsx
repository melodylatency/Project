import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useCreateTicketMutation } from "../redux/slices/jiraApiSlice";
import { closeModal } from "../redux/slices/ticketModalSlice";
import useTheme from "../hooks/useTheme";

const TicketModal = () => {
  const dispatch = useDispatch();
  const isDark = useTheme();
  const { isOpen, currentUrl } = useSelector((state) => state.ticketModal);
  const [createTicket, { isLoading, isSuccess, error }] =
    useCreateTicketMutation();

  const [formData, setFormData] = useState({
    summary: "",
    priority: "Average",
    url: currentUrl,
    template: document.title,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        url: window.location.href,
        template: document.title,
      }));
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTicket(formData);
  };

  return (
    <Modal
      show={isOpen}
      onHide={() => dispatch(closeModal())}
      centered
      backdrop="static"
      className="tw-font-sans"
      data-bs-theme={isDark ? "dark" : "light"}
    >
      <Modal.Header
        closeButton
        className="tw-bg-gray-100 tw-border-b tw-border-gray-200"
      >
        <Modal.Title className="tw-text-lg tw-font-semibold dark:text-gray-300">
          Create Support Ticket
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="tw-space-y-4">
          {isSuccess ? (
            <div className="tw-text-center tw-py-4">
              <h4 className="tw-text-green-600 tw-mb-2">
                Ticket Created Successfully!
              </h4>
              <p className="tw-text-sm">
                View your ticket on{" "}
                <a
                  href={`https://${process.env.REACT_APP_JIRA_DOMAIN}/browse/${formData.jiraKey}`}
                  className="tw-text-blue-600 hover:tw-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Jira
                </a>
              </p>
            </div>
          ) : (
            <>
              <Form.Group controlId="summary">
                <Form.Label className="dark:text-gray-400">Summary</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group controlId="priority">
                <Form.Label className="dark:text-gray-400">Priority</Form.Label>
                <Form.Select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <option value="High">High</option>
                  <option value="Average">Average</option>
                  <option value="Low">Low</option>
                </Form.Select>
              </Form.Group>

              {error && (
                <div className="tw-text-red-600 tw-text-sm tw-mt-2">
                  Error creating ticket:{" "}
                  {error.data?.message || "Unknown error"}
                </div>
              )}
            </>
          )}
        </Modal.Body>

        <Modal.Footer className="tw-border-t tw-border-gray-200">
          {!isSuccess ? (
            <>
              <Button
                variant="secondary"
                onClick={() => dispatch(closeModal())}
                className="tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-gray-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="tw-px-4 tw-py-2 tw-bg-blue-600 tw-text-white tw-rounded-lg hover:tw-bg-blue-700 disabled:tw-opacity-50"
              >
                {isLoading ? "Creating..." : "Create Ticket"}
              </Button>
            </>
          ) : (
            <Button
              variant="success"
              onClick={() => dispatch(closeModal())}
              className="tw-px-4 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded-lg hover:tw-bg-green-700"
            >
              Close
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TicketModal;
