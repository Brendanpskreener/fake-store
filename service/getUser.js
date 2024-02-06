const { getItem } = require("./common/dynamolib")

async function handler(event) {
  try {
    //Parse userID out of event
    const { pathParameters: { userId } } = event
    // Build query
    const key = {
      pk: `user#${userId}`,
      sk: `user#${userId}`
    }
    const query = {
      TableName: process.env.TABLE_NAME,
      Key: key
    }
    //send query
    const response = await getItem(query)
    const { pk, sk, type, created, ...user } = response.Item
    // send response
    return {
      statusCode: 200,
      body: JSON.stringify(user)
    }
  } catch (error) {
    console.error('Error in getUser', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: 'INTERNAL SERVER ERROR' })
    }
  }
}

module.exports = { handler }