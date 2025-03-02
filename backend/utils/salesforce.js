import jwt from "jsonwebtoken";
import fs from "fs";
import axios from "axios";
import path from "path";

let tokenCache = null;

export const getAccessToken = async () => {
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.accessToken;
  }

  const privateKey = fs.readFileSync(
    path.resolve(process.env.SALESFORCE_PRIVATE_KEY_PATH),
    "utf8"
  );

  const tokenPayload = {
    iss: process.env.SALESFORCE_CLIENT_ID,
    sub: process.env.SALESFORCE_USER,
    aud: process.env.SALESFORCE_LOGIN_URL,
    exp: Math.floor(Date.now() / 1000) + 300, // 5 minutes
  };

  const assertion = jwt.sign(tokenPayload, privateKey, {
    algorithm: "RS256",
  });

  try {
    const { data } = await axios.post(
      `${process.env.SALESFORCE_LOGIN_URL}/services/oauth2/token`,
      new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    tokenCache = {
      accessToken: data.access_token,
      instanceUrl: data.instance_url,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    return tokenCache.accessToken;
  } catch (error) {
    console.error(
      "Salesforce auth error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to authenticate with Salesforce");
  }
};
