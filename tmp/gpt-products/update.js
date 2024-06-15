const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { getObject } = require("../../service/common/s3utils");
const { getBlurHash } = require("../../service/common/utilities");
const { getProducts } = require("../../service/common/dynamolib");

async function main() {
  //Set up clients
  const clientOptions = {
    marshallOptions: {
      removeUndefinedValues: true
    }
  }

  const ddbClient = new DynamoDBClient({})
  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, clientOptions)

  //query the products to be updated
  const products = await getProducts()

  //Map product key to image buffer
  products.map(async (product) => {
    const { productId } = product
    const { object } = await getObject(productId)
    const blurHash = await getBlurHash(object)

    //construct update command
    const key = {
      pk: `product#${productId}`,
      sk: `product#${productId}`,
    }
    const update = {
      TableName: 'fakeStoreTable',
      Key: key,
      ExpressionAttributeNames: { '#B': 'blurHash' },
      ExpressionAttributeValues: { ':b': blurHash },
      UpdateExpression: 'SET #B = :b'
    }

    //Build and send Dynamo UpdateCommands
    const ddbCommand = new UpdateCommand(update)
    ddbDocClient.send(ddbCommand)
  })
}

main()