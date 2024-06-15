const { putItem } = require('./common/dynamolib')

/**
 * Entry point for putUserFavorite lambda endpoint.
 * @param {object} event - HTTP Lambda event
 * @returns {object} response object
 */

async function handler(event) {
  try {
    // PARSE EVENT
    const { body = '{}' } = event
    const { userId, productId } = JSON.parse(body)

    // BUILD QUERY
    const item = {
      pk: `user#${userId}`,
      sk: `product#${productId}`,
      created: (new Date()).getTime(),
      type: 'user-favorite',
      productId: productId
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
        Location: `/user${userId}/favorite`,
        'Access-Control-Expose-Header': 'Location',
        'Access-Control-Allow-Origin': '*'
      }
    }

  } catch (error) {
    console.log('Error in putUserFavorite', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: 'INTERNAL SERVER ERROR' })
    }
  }
}

module.exports = { handler }