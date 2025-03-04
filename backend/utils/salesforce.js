import jwt from "jsonwebtoken";
import fs from "fs";
import axios from "axios";
import { URLSearchParams } from "url";

let tokenCache = null;

const parseCertificateChain = (certificateContent) => {
  return certificateContent
    .split(/-----END CERTIFICATE-----\s*\n?/)
    .map((c) => c.trim())
    .filter((c) => c.startsWith("-----BEGIN CERTIFICATE-----"))
    .map((c) =>
      c
        .replace(/-----BEGIN CERTIFICATE-----/g, "")
        .replace(/-----END CERTIFICATE-----/g, "")
        .replace(/\n/g, "")
        .trim()
    );
};

const getAccessToken = async () => {
  if (tokenCache && tokenCache.expires > Date.now()) {
    return tokenCache;
  }

  try {
    const privateKey = fs
      .readFileSync(process.env.SALESFORCE_PRIVATE_KEY_PATH, "utf8")
      .replace(/\\n/g, "\n");

    const certificateContent = fs.readFileSync(
      process.env.SALESFORCE_CERTIFICATE_PATH,
      "utf8"
    );

    const pemCertificates = parseCertificateChain(certificateContent);
    if (!pemCertificates.length) {
      throw new Error("No certificates found in chain");
    }

    const tokenPayload = {
      iss: process.env.SALESFORCE_CONSUMER_KEY,
      sub: process.env.SALESFORCE_USERNAME,
      aud: process.env.SALESFORCE_LOGIN_URL,
      exp: Math.floor(Date.now() / 1000) + 300,
    };

    const assertion = jwt.sign(tokenPayload, privateKey, {
      algorithm: "RS256",
      header: {
        alg: "RS256",
        x5c: pemCertificates,
      },
    });

    const response = await axios.post(
      `${process.env.SALESFORCE_LOGIN_URL}/services/oauth2/token`,
      new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: assertion,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        timeout: 10000,
        validateStatus: (status) => status < 500,
      }
    );

    if (!response.data.access_token) {
      throw new Error(
        `Salesforce auth failed: ${JSON.stringify(response.data)}`
      );
    }

    tokenCache = {
      accessToken: response.data.access_token,
      instanceUrl: response.data.instance_url,
      expires: Date.now() + response.data.expires_in * 900,
    };

    return tokenCache;
  } catch (error) {
    console.error("AUTH FAILURE DETAILS:", {
      message: error.message,
      code: error.code,
      responseData: error.response?.data,
      config: error.config?.data,
      stack: error.stack,
    });
    throw error;
  }
};

export const getSalesforceConfig = async () => {
  try {
    const { accessToken, instanceUrl } = await getAccessToken();
    return {
      accessToken,
      instanceUrl: `${instanceUrl}/services/data/v${
        process.env.SALESFORCE_API_VERSION || "59.0"
      }`,
    };
  } catch (error) {
    throw new Error(`Salesforce connection failed: ${error.message}`);
  }
};
