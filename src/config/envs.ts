import 'dotenv/config';
import * as joi from 'joi';

interface IEnvVars {
  PORT: number;
  DATABASE_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVarsToValidate: IEnvVars = value as IEnvVars;

export const envs = {
  port: envVarsToValidate.PORT,
  databaseUrl: envVarsToValidate.DATABASE_URL,
};
