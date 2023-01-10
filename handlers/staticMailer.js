const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const { response, internalErrorResponse, isBlank } = require('./util');

const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

const buildEmailBody = (id, form) => {
  return `
    Message: ${form.message}
    Name: ${form.name}
    Email: ${form.email}
    Service Information: ${id.sourceIp} - ${id.userAgent}
  `;
};

async function handler(event) {
  try {
    const data = JSON.parse(event.body);
    if (isBlank(data.name)) return response(400, 'invalid name');
    if (isBlank(data.email)) return response(400, 'invalid email');
    if (isBlank(data.message)) return response(400, 'invalid message');

    const res = await fetch(
      'https://y0sq0ngdi6.execute-api.us-east-1.amazonaws.com/dev/subscribe',
      {
        method: 'POST',
        body: JSON.stringify({ email: data.email }),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const emailBody = buildEmailBody(event.requestContext.identity, data);

    const client = new SNSClient();
    await client.send(
      new PublishCommand({
        TopicArn: SNS_TOPIC_ARN,
        Message: emailBody,
        Subject: 'New Subscription',
      })
    );

    return response(200, { message: 'OK' });
  } catch (error) {
    return internalErrorResponse(error);
  }
}

module.exports = handler;