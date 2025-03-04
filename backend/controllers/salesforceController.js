import asyncHandler from "../middleware/asyncHandler.js";
import { getSalesforceConfig } from "../utils/salesforce.js";
import axios from "axios";

const verifySalesforceConfig = asyncHandler(async (req, res) => {
  try {
    const { accessToken, instanceUrl } = await getSalesforceConfig();

    const query = encodeURIComponent("SELECT Id FROM Account LIMIT 1");
    const response = await axios.get(`${instanceUrl}/query?q=${query}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json({
      valid: true,
      apiVersion: instanceUrl.split("/v")[1],
      recordCount: response.data.totalSize,
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      details: error.response?.data || error.message,
    });
  }
});

const createSalesforceAccount = asyncHandler(async (req, res) => {
  const { companyName, website, phone, jobTitle, department } = req.body;
  const user = req.user;

  if (!companyName) {
    res.status(400);
    throw new Error("Company name is required");
  }

  const [firstName, ...rest] = user.name.split(" ");
  const lastName = rest.join(" ") || "Unknown";

  const { accessToken, instanceUrl } = await getSalesforceConfig();

  const contactQuery = encodeURIComponent(
    `SELECT Id,AccountId FROM Contact WHERE Email='${user.email.replace(
      /'/g,
      "''"
    )}' LIMIT 1`
  );
  const contactCheck = await axios.get(
    `${instanceUrl}/query?q=${contactQuery}`,
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
    const accountQuery = encodeURIComponent(
      `SELECT Id FROM Account WHERE Name='${companyName.replace(
        /'/g,
        "''"
      )}' LIMIT 1`
    );
    const accountCheck = await axios.get(
      `${instanceUrl}/query?q=${accountQuery}`,
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
        `${instanceUrl}/sobjects/Account`,
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
      `${instanceUrl}/sobjects/Contact`,
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
