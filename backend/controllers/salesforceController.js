import asyncHandler from "../middleware/asyncHandler.js";
import { getSalesforceConfig } from "../utils/salesforce.js";
import axios from "axios";

// @desc    Verify Salesforce configuration
// @route   GET /api/salesforce/verify-config
// @access  Private/Admin
const verifySalesforceConfig = asyncHandler(async (req, res) => {
  try {
    const { accessToken, instanceUrl } = getSalesforceConfig();
    res.json({
      status: "Success",
      instanceUrl,
      tokenExists: !!accessToken,
    });
  } catch (error) {
    res.status(400).json({
      error: "Invalid Salesforce configuration",
      details: error.message,
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
    const { accessToken, instanceUrl } = getSalesforceConfig();

    // Create Account and Contact using composite API
    const response = await axios.post(
      `${instanceUrl}/services/data/v58.0/composite/sobjects`,
      {
        allOrNone: true,
        records: [
          {
            attributes: { type: "Account" },
            Name: companyName,
            Industry: industry,
            // Add more account fields as needed
          },
          {
            attributes: { type: "Contact" },
            FirstName: user.firstName,
            LastName: user.lastName,
            Email: user.email,
            Phone: phone,
            Title: jobTitle,
            AccountId: "@{Account.id}", // Reference the created Account
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
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({
      error: "Salesforce operation failed",
      details: error.response?.data || error.message,
    });
  }
});

export { verifySalesforceConfig, createSalesforceAccount };
