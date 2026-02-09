const { getItem } = require("./common/dynamolib")
const { createResponse } = require("./common/utilities")


async function handler(event) {
  try {
    //Parse userID out of event
    const userId = event?.pathParameters?.userId
    if (!userId) {
      return createResponse(400, { msg: 'Bad Request - Invalid userId' })
    }
    // Build query
    const query = {
      TableName: process.env.TABLE_NAME,
      Key: {
        pk: `user#${userId}`,
        sk: `user#${userId}`
      }
    }
    //send query
    const response = await getItem(query)
    //check if user exists
    if (!response.Item) {
      return createResponse(404, { msg: 'USER NOT FOUND' })
    }
    //parse response
    const { pk, sk, type, created, ...user } = response.Item
    // send response
    return createResponse(200, user)
  } catch (error) {
    console.error('Error in getUser', error)
    return createResponse(500, { msg: 'INTERNAL SERVER ERROR' })
  }
}

module.exports = { handler }