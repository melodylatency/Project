import asyncHandler from "../middleware/asyncHandler.js";
import { getSalesforceConfig } from "../utils/salesforce.js";
import axios from "axios";

// @desc    Verify Salesforce configuration
// @route   GET /api/salesforce/verify-config
// @access  Private/Admin
const verifySalesforceConfig = asyncHandler(async (req, res) => {
  try {
    const { accessToken, instanceUrl } = getSalesforceConfig();

    // Simple query to verify token
    const response = await axios.get(
      `${instanceUrl}/services/data/v58.0/query?q=SELECT+Id+FROM+Account+LIMIT+1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json({
      valid: true,
      apiVersion: "v58.0",
      recordCount: response.data.totalSize,
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      details: error.response?.data || error.message,
    });
  }
});

// @desc    Create Salesforce Account+Contact
// @route   POST /api/salesforce/create-account
// @access  Private
const createSalesforceAccount = asyncHandler(async (req, res) => {
  const { companyName, industry, phone, jobTitle } = req.body;
  const user = req.user;

  if (!companyName || !industry) {
    res.status(400);
    throw new Error("Company name and industry are required");
  }

  try {
    // Split user name
    const [firstName, ...rest] = user.name.split(" ");
    const lastName = rest.join(" ") || "Unknown";

    const { accessToken, instanceUrl } = getSalesforceConfig();

    const response = await axios.post(
      `${instanceUrl}/services/data/v58.0/composite/sobjects`,
      {
        allOrNone: true,
        records: [
          {
            attributes: { type: "Account" },
            Name: companyName,
            Industry: industry,
          },
          {
            attributes: { type: "Contact" },
            FirstName: firstName,
            LastName: lastName,
            Email: user.email,
            Phone: phone,
            Title: jobTitle,
            AccountId: "@{Account.id}",
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(201).json({
      success: true,
      accountId: response.data[0].id,
      contactId: response.data[1].id,
    });
  } catch (error) {
    console.error("Salesforce Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Salesforce operation failed",
      details: error.response?.data || error.message,
    });
  }
});

export { verifySalesforceConfig, createSalesforceAccount };
