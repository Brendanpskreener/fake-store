const { defaultProvider } = require('@aws-sdk/credential-provider-node'); // V3 SDK.
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');
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
  const { from = 0, size = 10 } = event?.queryStringParameters || {};
  const fromNum = parseInt(from, 10);
  const sizeNum = parseInt(size, 10);

  try {
    //send query
    const response = await client.search({
      index: INDEX_NAME,
      body: {
        from: fromNum,
        size: sizeNum,
        sort: [{ msrp: 'desc' }],
        query: { match_all: {} }
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

    // send response
    return {
      statusCode: 200,
      body: JSON.stringify(responseBody),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  } catch (error) {
    console.error('Error in getProducts', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: 'INTERNAL SERVER ERROR' })
    }
  }
}

module.exports = { handler }