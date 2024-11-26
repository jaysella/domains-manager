export function validateEnvVariables() {
  const required = [
    'PORKBUN_API_BASE_URL',
    'PORKBUN_API_KEY',
    'PORKBUN_SECRET_KEY'
  ];

  for (const variable of required) {
    if (!process.env[variable]) {
      throw new Error(`Missing required environment variable: ${variable}`);
    }
  }
}
