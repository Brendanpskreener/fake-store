const { deleteItem } = require("./common/dynamolib")

async function handler(event) {
  try {
    //parse the Ids
    const { body = '{}' } = event
    const { userId, productId } = JSON.parse(body)
    //construct the query
    const key = {
      pk: `user#${userId}`,
      sk: `product#${productId}`
    }
    const query = {
      TableName: process.env.TABLE_NAME,
      Key: key
    }
    //send the query
    await deleteItem(query)

    //send response
    return {
      statusCode: 204,
      'Access-Control-Allow-Origin': '*'
    }

  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: 'INTERNAL SERVER ERROR' })
    }
  }
}

module.exports = { handler }