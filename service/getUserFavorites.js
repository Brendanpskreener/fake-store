const { getFavorites } = require("./common/dynamolib")

async function handler(event) {
  const { pathParameters: { userId } } = event

  try {
    //get array of favorite product ids
    const favorites = await getFavorites(userId)
    const matchArray = favorites.map(({ productId }) => {
      return productId
    })

    return {
      statusCode: 200,
      body: JSON.stringify(matchArray)
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: 'INTERNAL SERVER ERROR' })
    }
  }
}

module.exports = { handler }