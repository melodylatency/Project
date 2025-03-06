import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useCreateTicketMutation } from "../redux/slices/jiraApiSlice";
import { closeModal } from "../redux/slices/ticketModalSlice";
import useTheme from "../hooks/useTheme";
import { toast } from "react-toastify";

const TicketModal = () => {
  const dispatch = useDispatch();
  const isDark = useTheme();
  const { isOpen, currentUrl } = useSelector((state) => state.ticketModal);
  const [createTicket, { isLoading, isSuccess, error }] =
    useCreateTicketMutation();

  const [formData, setFormData] = useState({
    summary: "",
    priority: "Medium",
    url: currentUrl,
    template: document.title,
  });

  useEffect(() => {
    if (isOpen) {
      const url = new URL(currentUrl);
      const isTemplatePage = url.pathname.startsWith("/template/");
      const newFormData = {
        summary: "",
        priority: "Medium",
        url: currentUrl,
      };
      if (isTemplatePage) {
        newFormData.template = document.title;
      }
      setFormData(newFormData);
    }
  }, [isOpen, currentUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        summary: formData.summary,
        priority: formData.priority,
        url: formData.url,
      };
      if (formData.template) {
        dataToSend.template = formData.template;
      }
      await createTicket(dataToSend).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Modal
      show={isOpen}
      onHide={() => dispatch(closeModal())}
      centered
      backdrop="static"
      className="font-sans"
      data-bs-theme={isDark ? "dark" : "light"}
    >
      <Modal.Header closeButton>
        <Modal.Title className="dark:text-gray-300">
          Create Support Ticket
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="space-y-4">
          {isSuccess ? (
            <div className="text-center py-4">
              <h4 className="text-green-600 mb-2">
                Ticket Created Successfully!
              </h4>
              <p className="text-sm dark:text-gray-400">
                View in your{" "}
                <Link
                  to="/profile"
                  className="text-blue-500 hover:underline"
                  onClick={() => dispatch(closeModal())}
                >
                  Profile
                </Link>
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
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Form.Select>
              </Form.Group>

              {error && (
                <div className="text-red-600 text-sm mt-2">
                  Error creating ticket:{" "}
                  {error.data?.message || "Unknown error"}
                </div>
              )}
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          {!isSuccess ? (
            <>
              <Button
                variant="secondary"
                onClick={() => dispatch(closeModal())}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Ticket"}
              </Button>
            </>
          ) : (
            <Button variant="success" onClick={() => dispatch(closeModal())}>
              Close
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TicketModal;
