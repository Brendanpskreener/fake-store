const { getObject } = require("./common/s3utils")

async function handler(event) {
  try {
    //parse productId
    const { pathParameters: { productId } } = event
    //send command
    const { ContentType, object } = await getObject(productId)
    const image = Buffer.from(object).toString('base64')

    //send response
    return {
      statusCode: 200,
      body: image,
      headers: {
        'Content-Type': ContentType,
        'Access-Control-Allow-Origin': '*'
      },
      isBase64Encoded: true
    }
  } catch (error) {
    console.error('Error getting image', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: 'INTERNAL SERVER ERROR' })
    }
  }
}

module.exports = { handler }