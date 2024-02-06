const { defaultProvider } = require('@aws-sdk/credential-provider-node'); // V3 SDK.
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

const { getFavorites } = require("./common/dynamolib")

const INDEX_NAME = 'fakestoreproducts';

const client = new Client({
  ...AwsSigv4Signer({
    region: 'us-west-2',
    service: 'es',
    getCredentials: () => {
      const credentialsProvider = defaultProvider();
      return credentialsProvider();
    },
  }),
  node: 'https://search-fake-store-domain-rwuqpo3zxflml5gtlswu2k4qoi.us-west-2.es.amazonaws.com'
});

async function handler(event) {
  const { from = 0, size = 10 } = event?.queryStringParameters || {}
  const { pathParameters: { userId } } = event
  const fromNum = parseInt(from, 10)
  const sizeNum = parseInt(size, 10)

  try {
    //get array of favorite product ids
    const favorites = await getFavorites(userId)
    const matchArray = favorites.map(({ productId }) => {
      return productId
    })

    const response = await client.search({
      index: INDEX_NAME,
      body: {
        from: fromNum,
        size: sizeNum,
        sort: [{ msrp: 'desc' }],
        query: {
          terms: {
            "productId.keyword": matchArray
          }
        }
      }
    });

    const {
      body: {
        hits: {
          hits,
          total: { value: total }
        }
      }
    } = response;
    const responseBody = {
      results: hits.map((hit) => hit._source),
      pagination: {
        from: fromNum,
        size: sizeNum,
        total
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(responseBody)
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