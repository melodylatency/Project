export const getSalesforceConfig = () => {
  if (
    !process.env.SALESFORCE_ACCESS_TOKEN ||
    !process.env.SALESFORCE_INSTANCE_URL
  ) {
    throw new Error("Missing Salesforce configuration");
  }

  return {
    accessToken: process.env.SALESFORCE_ACCESS_TOKEN,
    instanceUrl: process.env.SALESFORCE_INSTANCE_URL,
  };
};
