const { defaultProvider } = require('@aws-sdk/credential-provider-node'); // V3 SDK.
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

const { getProducts } = require('../../service/common/dynamolib');

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

async function main() {
  const products = await getProducts()

  try {
    // Bulk index into OS
    const results = await client.helpers.bulk({
      datasource: products,
      onDocument(doc) {
        const { pk, sk, ...minifiedProduct } = doc;
        return [
          { index: { _index: INDEX_NAME, _id: doc.productId } },
          { ...minifiedProduct, cached: new Date().toISOString() }
        ]
      }
    })

    console.info(results)
  } catch (error) {
    console.error(error)
  }
}

main()