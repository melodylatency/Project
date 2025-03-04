import asyncHandler from "../middleware/asyncHandler.js";
import { getSalesforceConfig } from "../utils/salesforce.js";
import axios from "axios";

// @desc    Verify Salesforce configuration
// @route   GET /api/salesforce/verify-config
// @access  Private/Admin
const verifySalesforceConfig = asyncHandler(async (req, res) => {
  try {
    const { accessToken, instanceUrl } = getSalesforceConfig();

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
  const { companyName, phone, jobTitle, website, department } = req.body;
  const user = req.user;

  if (!companyName) {
    res.status(400);
    throw new Error("Company name is required");
  }

  const [firstName, ...rest] = user.name.split(" ");
  const lastName = rest.join(" ") || "Unknown";

  const { accessToken, instanceUrl } = getSalesforceConfig();

  const escapedEmail = user.email.replace(/'/g, "''");
  const contactCheck = await axios.get(
    `${instanceUrl}/services/data/v58.0/query?q=SELECT+Id,AccountId+FROM+Contact+WHERE+Email='${escapedEmail}'+LIMIT+1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (contactCheck.data.totalSize > 0) {
    res.status(400);
    throw new Error("User already has an associated Salesforce account");
  }

  try {
    const escapedCompanyName = companyName.replace(/'/g, "''");
    const accountCheck = await axios.get(
      `${instanceUrl}/services/data/v58.0/query?q=SELECT+Id+FROM+Account+WHERE+Name='${escapedCompanyName}'+LIMIT+1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    let accountId;
    if (accountCheck.data.totalSize > 0) {
      accountId = accountCheck.data.records[0].Id;
    } else {
      const accountResponse = await axios.post(
        `${instanceUrl}/services/data/v58.0/sobjects/Account`,
        {
          Name: companyName,
          Website: website,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      accountId = accountResponse.data.id;
    }

    const contactResponse = await axios.post(
      `${instanceUrl}/services/data/v58.0/sobjects/Contact`,
      {
        FirstName: firstName,
        LastName: lastName,
        Email: user.email,
        Phone: phone,
        Title: jobTitle,
        Department: department,
        AccountId: accountId,
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
      accountId: accountId,
      contactId: contactResponse.data.id,
    });
  } catch (error) {
    console.error(
      "Salesforce Creation Error:",
      error.response?.data || error.message
    );
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({
      error: "Salesforce operation failed",
      details: error.response?.data || error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

export { verifySalesforceConfig, createSalesforceAccount };
