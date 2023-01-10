function response(statusCode, body) {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
    },
    statusCode: statusCode,
    body: JSON.stringify(body),
  };
}

function internalErrorResponse(error) {
  console.log(error);
  return response(500, {
    error: 'Oops! something went wrong. We are working on fixing it.',
  });
}

function isBlank(value) {
  return typeof value !== 'string' || !value.trim().length;
}

module.exports = { response, internalErrorResponse, isBlank };
