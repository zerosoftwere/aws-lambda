const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require('@aws-sdk/lib-dynamodb');
const { response, internalErrorResponse } = require('./util');

const USERS_TABLE = process.env.USERS_TABLE;
const AWS_REGION = process.env.REGION;

async function handler() {
  try {
    const client = new DynamoDBClient({ region: AWS_REGION });
    const docClient = DynamoDBDocumentClient.from(client);

    let result = await docClient.send(
      new ScanCommand({ TableName: USERS_TABLE })
    );
    const items = result.Items;
    
    while (result.LastEvaluatedKey) {
      result = await docClient.send(
        new ScanCommand({
          TableName: USERS_TABLE,
          ExclusiveStartKey: result.LastEvaluatedKey,
        })
      );
      items.concat(result.Items);
    }

    return response(200, items);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

module.exports = handler;
