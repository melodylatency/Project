import axios from "axios";
import asyncHandler from "../middleware/asyncHandler.js";
import Ticket from "../models/ticketModel.js";

// @desc    Create a Jira ticket
// @route   POST /api/jira/tickets
// @access  Private
const createJiraTicket = asyncHandler(async (req, res) => {
  const { summary, priority, url, template } = req.body;
  const userEmail = req.user.email;

  let userAccountId = await checkJiraUser(userEmail);
  if (!userAccountId) {
    userAccountId = await createJiraUser(userEmail);
  }

  const jiraKey = await createJiraIssue(userAccountId, {
    summary,
    priority,
    url,
    template,
  });

  const ticket = await Ticket.create({
    user_id: req.user.id,
    jiraKey,
    summary,
    priority,
    url,
    template,
  });

  const jiraLink = `https://${process.env.JIRA_DOMAIN}/browse/${jiraKey}`;
  res.status(201).json({ jiraKey, jiraLink });
});

// @desc    Get all tickets for the logged-in user
// @route   GET /api/jira/tickets
// @access  Private
const getUserTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.findAll({
    where: { user_id: req.user.id },
    order: [["createdAt", "DESC"]],
  });

  const ticketsWithStatus = await Promise.all(
    tickets.map(async (ticket) => {
      const status = await getJiraTicketStatus(ticket.jiraKey);
      return { ...ticket.toJSON(), status };
    })
  );

  res.status(200).json(ticketsWithStatus);
});

const checkJiraUser = async (email) => {
  try {
    const response = await axios.get(
      `https://${process.env.JIRA_DOMAIN}/rest/api/3/user/search?query=${email}`,
      {
        auth: {
          username: process.env.JIRA_ADMIN_EMAIL,
          password: process.env.JIRA_API_TOKEN,
        },
      }
    );
    return response.data[0]?.accountId;
  } catch (error) {
    console.error(
      "Error checking Jira user:",
      error.response?.data || error.message
    );
    return null;
  }
};

const createJiraUser = async (email) => {
  try {
    const response = await axios.post(
      `https://${process.env.JIRA_DOMAIN}/rest/api/3/user`,
      {
        emailAddress: email,
        displayName: email.split("@")[0],
        notification: false,
        products: [],
      },
      {
        auth: {
          username: process.env.JIRA_ADMIN_EMAIL,
          password: process.env.JIRA_API_TOKEN,
        },
      }
    );
    return response.data.accountId;
  } catch (error) {
    console.error(
      "Error creating Jira user:",
      error.response?.data || error.message
    );
    return null;
  }
};

const createJiraIssue = async (
  userAccountId,
  { summary, priority, url, template }
) => {
  try {
    const descriptionContent = [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: url,
            marks: [
              {
                type: "link",
                attrs: {
                  href: url,
                },
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: `Template: ${template || "N/A"}`,
          },
        ],
      },
    ];

    const issueData = {
      fields: {
        project: { key: "BTS" },
        issuetype: { name: "Task" },
        summary,
        description: {
          type: "doc",
          version: 1,
          content: descriptionContent,
        },
        priority: { name: priority },
        reporter: { id: userAccountId },
      },
    };

    const response = await axios.post(
      `https://${process.env.JIRA_DOMAIN}/rest/api/3/issue`,
      issueData,
      {
        auth: {
          username: process.env.JIRA_ADMIN_EMAIL,
          password: process.env.JIRA_API_TOKEN,
        },
      }
    );
    return response.data.key;
  } catch (error) {
    console.error(
      "Error creating Jira issue:",
      error.response?.data || error.message
    );
    throw new Error("Failed to create Jira ticket");
  }
};

const getJiraTicketStatus = async (jiraKey) => {
  try {
    const response = await axios.get(
      `https://${process.env.JIRA_DOMAIN}/rest/api/3/issue/${jiraKey}?fields=status`,
      {
        auth: {
          username: process.env.JIRA_ADMIN_EMAIL,
          password: process.env.JIRA_API_TOKEN,
        },
      }
    );
    return response.data.fields.status.name;
  } catch (error) {
    console.error(
      "Error fetching Jira ticket status:",
      error.response?.data || error.message
    );
    return "Unknown";
  }
};

export { createJiraTicket, getUserTickets };
