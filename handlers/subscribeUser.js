const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const uuid = require('uuid');
const { response, internalErrorResponse, isBlank } = require('./util')

const USERS_TABLE = process.env.USERS_TABLE;
const AWS_REGION = process.env.REGION;

async function handler(event) {
  try {
    const data = JSON.parse(event.body);

    if (isBlank(data.email)) {
      return response(400, 'Provide a valid email addresss');
    }

    const timestamp = new Date().getTime();

    const user = {
      id: uuid.v4().toString(),
      email: data.email,
      subscriber: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const client = new DynamoDBClient({ region: AWS_REGION });
    const docClient = DynamoDBDocumentClient.from(client);
    await docClient.send(
      new PutCommand({ TableName: USERS_TABLE, Item: user })
    );

    return response(200, user);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

module.exports = handler;