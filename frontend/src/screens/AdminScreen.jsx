import { Table, Button, Row, Col } from "react-bootstrap";
import {
  FaTimes,
  FaTrash,
  FaCheck,
  FaLock,
  FaLockOpen,
  FaSort,
} from "react-icons/fa"; // Added FaSort for sort icon
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
} from "../redux/slices/usersApiSlice";
import { toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { useLogoutMutation } from "../redux/slices/usersApiSlice";
import { logout } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const { data: users = [], refetch, isLoading, error } = useGetUsersQuery(); // Default users to an empty array if undefined

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();
  const [blockUser, { isLoading: loadingBlock }] = useBlockUserMutation();
  const [unblockUser, { isLoading: loadingUnblock }] = useUnblockUserMutation();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // Track the sorting index

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = useCallback(async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }, [logoutApiCall, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      if (error.data?.message === "Account blocked.") {
        logoutHandler();
      }
      toast.error(error.data?.message || "An error occurred.");
    }
  }, [error, logoutHandler]);

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]); // Deselect all if all are selected
    } else {
      setSelectedUsers(users.map((user) => user.id)); // Select all users
    }
  };

  const handleAction = async (action) => {
    if (selectedUsers.length === 0) {
      toast.error("Please select users to proceed");
      return;
    }

    if (window.confirm(`Are you sure you want to ${action} these users?`)) {
      let actionCount = 0;

      try {
        // Rearrange selectedUsers to process userInfo.id last
        const reorderedUsers = [
          ...selectedUsers.filter((id) => id !== userInfo.id), // Other users
          ...selectedUsers.filter((id) => id === userInfo.id), // Current user
        ];

        for (const userId of reorderedUsers) {
          const user = users.find((user) => user.id === userId);

          switch (action) {
            case "delete":
              await deleteUser(userId).unwrap(); // `unwrap` to throw errors
              actionCount++;
              break;
            case "block":
              if (user.isBlocked === true) continue;
              await blockUser(userId).unwrap();
              actionCount++;
              break;
            case "unblock":
              if (user.isBlocked === false) continue;
              await unblockUser(userId).unwrap();
              actionCount++;
              break;
            default:
              toast.error("Unknown action");
          }
        }

        if (actionCount > 0) {
          toast.success(
            `${actionCount} user${
              actionCount > 1 ? "s" : ""
            } ${action}ed successfully.`
          );
        }

        setSelectedUsers([]); // Reset selection after action
        refetch();
      } catch (err) {
        toast.error("Action failed.");
      }
    }
  };

  // Sort users by last login
  const sortedUsers = [...users].sort((a, b) => {
    const dateA = moment(a.lastLogin);
    const dateB = moment(b.lastLogin);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  // Toggle sort index
  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
  };

  return (
    <>
      <h1 className="flex justify-center text-7xl text-stroke py-5">
        Admin Panel
      </h1>
      {loadingDelete && <Loader />}
      {loadingBlock && <Loader />}
      {loadingUnblock && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.message || "Not admin"}</Message>
      ) : (
        <>
          <div className="py-3 pl-1">
            <Row className="align-items-center justify-content-between">
              {/* Left section */}
              <Col
                xs={12}
                sm="auto"
                className="d-flex flex-wrap gap-3 mb-2 mb-sm-0"
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length}
                  onChange={handleSelectAll}
                  className="scale-125"
                />
                <Button
                  className="d-flex align-items-center gap-2"
                  variant="primary"
                  onClick={() => handleAction("delete")}
                >
                  <FaTrash /> Delete
                </Button>
                <Button
                  className="d-flex align-items-center gap-2"
                  variant="primary"
                  onClick={() => handleAction("block")}
                >
                  <FaLock /> Block
                </Button>
                <Button
                  className="d-flex align-items-center gap-2"
                  variant="primary"
                  onClick={() => handleAction("unblock")}
                >
                  <FaLockOpen /> Unblock
                </Button>
              </Col>

              {/* Right section */}
              <Col xs={12} sm="auto" className="text-sm-end">
                <Button
                  className="d-flex align-items-center"
                  onClick={handleSort}
                >
                  <FaSort /> Sort by Last Login
                </Button>
              </Col>
            </Row>
          </div>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Select</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>BLOCKED</th>
                <th>LAST LOGIN</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>
                    <a
                      href={`mailto:${user.email}`}
                      className="underline text-blue-500"
                    >
                      {user.email}
                    </a>
                  </td>
                  <td>{user.isBlocked ? <FaCheck /> : <FaTimes />}</td>
                  <td
                    className="font-thin overflow-hidden text-ellipsis whitespace-nowrap"
                    style={{
                      maxWidth: "200px", // Adjust this value as needed
                    }}
                  >
                    {moment(user.lastLogin).format("MMMM Do YYYY, h:mm:ss a")}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default AdminScreen;
