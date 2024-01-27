const { defaultProvider } = require('@aws-sdk/credential-provider-node'); // V3 SDK.
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

const fs = require('node:fs/promises');
const path = require('node:path');

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
  const dataPath = path.join(__dirname, 'data.json');
  const jsonBuf = await fs.readFile(dataPath, { encoding: 'utf8' });
  const products = JSON.parse(jsonBuf);

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