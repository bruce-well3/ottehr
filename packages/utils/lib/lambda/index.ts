import { DateTime } from 'luxon';
import { APIGatewayProxyResult } from 'aws-lambda';
import sendgrid from '@sendgrid/mail';
import { Secrets, getSecret, SecretsKeys } from '../secrets';
import { APIError, isApiError } from '../types';

const handleErrorResult = (errorResult: unknown): APIGatewayProxyResult => {
  if (isApiError(errorResult)) {
    const { code, message } = errorResult as APIError;
    return {
      statusCode: 400, // we have 1 case currently so this is good enough for now
      body: JSON.stringify({ message, code }),
    };
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal error' }),
    };
  }
};

export async function topLevelCatch(
  zambda: string,
  error: any,
  secrets: Secrets | null
): Promise<APIGatewayProxyResult> {
  console.error(`Top level catch block in ${zambda}: \n ${error} \n Error stringified: ${JSON.stringify(error)}`);
  if (isApiError(error)) {
    console.error('Top level catch block returning silently');
  } else {
    await sendErrors(zambda, error, secrets);
  }
  return handleErrorResult(error);
}

export const sendErrors = async (zambda: string, error: any, secrets: Secrets | null): Promise<void> => {
  const ENVIRONMENT = getSecret(SecretsKeys.ENVIRONMENT, secrets);
  // Only fires in staging and production
  if (!['staging', 'production'].includes(ENVIRONMENT)) {
    return;
  }

  // const notification = ENVIRONMENT === 'production' ? '@channel' : '@ottehr-devs';
  const notification = 'todo';
  const message = `${notification} Alert in ${ENVIRONMENT} zambda ${zambda}.\n\n${error}\n\n${JSON.stringify(error)}`;
  await triggerSlackAlarm(message, secrets);

  const SENDGRID_API_KEY = getSecret(SecretsKeys.SENDGRID_API_KEY, secrets);
  const SENDGRID_ERROR_EMAIL_TEMPLATE_ID = getSecret(SecretsKeys.URGENT_CARE_SENDGRID_ERROR_EMAIL_TEMPLATE_ID, secrets);

  console.log('Sending error email');
  sendgrid.setApiKey(SENDGRID_API_KEY);

  // TODO confirm details
  const email = 'support@masslight.com';
  const emailConfiguration = {
    to: email,
    from: {
      email: email,
      name: 'Ottehr',
    },
    replyTo: email,
    templateId: SENDGRID_ERROR_EMAIL_TEMPLATE_ID,
    dynamic_template_data: {
      environment: ENVIRONMENT,
      errorMessage: `Error in ${zambda}.\n${error}.\nError stringified: ${JSON.stringify(error)}`,
      timestamp: DateTime.now().setZone('UTC').toFormat("EEEE, MMMM d, yyyy 'at' h:mm a ZZZZ"),
    },
  };

  try {
    const sendResult = await sendgrid.send(emailConfiguration);
    console.log(
      `Details of successful sendgrid send: statusCode, ${sendResult[0].statusCode}. body, ${JSON.stringify(
        sendResult[0].body
      )}`
    );
  } catch (error) {
    console.error(`Error sending email to ${email}: ${JSON.stringify(error)}`);
    // Re-throw error so caller knows we failed.
    throw error;
  }
};

export const triggerSlackAlarm = async (message: string, secrets: Secrets | null): Promise<void> => {
  const ENVIRONMENT = getSecret(SecretsKeys.ENVIRONMENT, secrets);
  console.log('Sending error message to Slack');
  const url =
    ENVIRONMENT === 'production'
      ? 'https://hooks.slack.com/services/todo'
      : 'https://hooks.slack.com/services/todo';
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      text: message,
      link_names: true,
    }),
  });
};

export const lambdaResponse = (statusCode: number, body: any): APIGatewayProxyResult => {
  const response = {
    statusCode,
    body: body ? JSON.stringify(body) : '',
  };
  console.log('Response:', response);
  return response;
};
