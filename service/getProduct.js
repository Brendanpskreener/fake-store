const { getItem } = require("./common/dynamolib")

async function handler(event) {
  try {
    //Parse productID out of event
    const { pathParameters: { productId } } = event
    // Build query
    const key = {
      pk: `product#${productId}`,
      sk: `product#${productId}`,
    }
    const query = {
      TableName: process.env.TABLE_NAME,
      Key: key
    }
    //send query
    const response = await getItem(query)
    const { pk, sk, type, ...product } = response.Item
    // send response
    return {
      statusCode: 200,
      body: JSON.stringify(product)
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