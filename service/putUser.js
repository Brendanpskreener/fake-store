const { v4: uuidv4 } = require('uuid')
const { putItem } = require('./common/dynamolib')
/**
 * Entry point for putUsers lambda endpoint.
 * @param {object} event - HTTP Lambda event
 * @returns {object} response object
 */
async function handler(event) {
  try {
    // PARSE EVENT
    const { body = '{}' } = event
    const { firstName, lastName, email } = JSON.parse(body)

    // BUILD DYNAMODB QUERY
    const uuid = uuidv4()
    const item = {
      pk: `user#${uuid}`,
      sk: `user#${uuid}`,
      type: 'user',
      created: (new Date()).getTime(),
      userId: uuid,
      firstName,
      lastName,
      email
    }
    const query = {
      TableName: process.env.TABLE_NAME,
      Item: item
    }

    // SEND QUERY
    await putItem(query)

    // SEND RESPONSE
    return {
      statusCode: 201,
      headers: {
        Location: `/user/${uuid}`,
        'Access-Control-Expose-Header': 'Location'
      }
    }
  } catch (error) {
    console.error('Error in putUser', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: 'INTERNAL SERVER ERROR' })
    }
  }
}

module.exports = { handler }