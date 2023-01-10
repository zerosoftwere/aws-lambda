const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { response, internalErrorResponse } = require('./util');

const QUOTES_BUCKET = process.env.QUOTES_BUCKET;

async function handler() {
  try {
    const client = new S3Client();
    const data = await client.send(
      new GetObjectCommand({
        Bucket: QUOTES_BUCKET,
        Key: 'quotes.json',
      })
    );

    const quotes = JSON.parse(await data.Body.transformToString());
    return response(200, quotes);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

module.exports = handler;