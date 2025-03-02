import asyncHandler from "../middleware/asyncHandler.js";
import { getAccessToken } from "../utils/salesforce.js";
import axios from "axios";

// @desc    Test Salesforce connection
// @route   GET /api/salesforce/test-auth
// @access  Public (for testing only)
const testSalesforceAuth = asyncHandler(async (req, res) => {
  try {
    const { accessToken, instanceUrl } = await getAccessToken();
    res.json({
      status: "Success",
      accessToken: accessToken.slice(0, 20) + "...", // Partial token for security
      instanceUrl,
    });
  } catch (error) {
    console.error("Salesforce Auth Test Failed:", error.message);
    res.status(500).json({
      error: "Salesforce connection failed",
      details: error.message,
    });
  }
});

// @desc    Create Salesforce Account+Contact
// @route   POST /api/salesforce/create-account
// @access  Private
const createSalesforceAccount = asyncHandler(async (req, res) => {
  try {
    const { companyName, industry, phone, jobTitle } = req.body;
    const user = req.user;

    // Validate required fields
    if (!companyName || !industry) {
      res.status(400);
      throw new Error("Company name and industry are required");
    }

    const { accessToken, instanceUrl } = await getAccessToken();

    // Create records
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
            FirstName: user.firstName,
            LastName: user.lastName,
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
      details: error.response?.data?.message || error.message,
    });
  }
});

export { testSalesforceAuth, createSalesforceAccount };
