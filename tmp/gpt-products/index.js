const fs = require("node:fs/promises")
const path = require("node:path")
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3")
const { v4: uuidv4 } = require('uuid');

const BASE_PATH = path.join(__dirname)

async function main() {
  const clientOptions = {
    marshallOptions: {
      removeUndefinedValues: true
    }
  }
  const s3Client = new S3Client();
  const ddbClient = new DynamoDBClient({})
  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, clientOptions)


  // Map product data and image buffers
  const json = await fs.readFile(path.join(BASE_PATH, './gpt-products.json'), { encoding: 'utf8' });
  const jsonProducts = JSON.parse(json);

  const promises = jsonProducts.map(async (product) => {
    const { img, ...rest } = product;
    const uuid = uuidv4();
    const imgbuf = await fs.readFile(path.join(BASE_PATH, img));
    const productQuery = {
      Item: {
        ...rest,
        pk: `product#${uuid}`,
        sk: `product#${uuid}`,
        type: 'product',
        productId: uuid
      },
      TableName: 'fakeStoreTable'
    }
    const imgQuery = {
      Body: imgbuf,
      Bucket: 'fake-store-media',
      Key: uuid,
      ContentType: 'image/png'
    };

    // Build and Send Dynamo PutCommands using product objects
    const ddbCommand = new PutCommand(productQuery)
    // Build and send image buffers to s3 using product objects
    const s3Command = new PutObjectCommand(imgQuery)

    return [
      ddbDocClient.send(ddbCommand),
      s3Client.send(s3Command)
    ]
  });

  try {
    await Promise.all(promises.flat(Infinity));
  } catch (e) {
    console.error(e)
  }
}

main()