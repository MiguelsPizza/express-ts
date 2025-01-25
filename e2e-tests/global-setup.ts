import "dotenv/config";

const requiredEnvVars: string[] = [];

async function globalSetup() {
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.join("\n")}\n\n` +
      `Please ensure these are set in your e2e-tests/.env file`
    );
  }
}

export default globalSetup;