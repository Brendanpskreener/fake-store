const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  QueryCommand,
  GetCommand
} = require('@aws-sdk/lib-dynamodb')

const clientOptions = {
  marshallOptions: {
    removeUndefinedValues: true
  }
}

const client = new DynamoDBClient({})
const ddbDocClient = DynamoDBDocumentClient.from(client, clientOptions)


function putItem(query) {
  const command = new PutCommand(query)
  return ddbDocClient.send(command)
}

function deleteItem() {
  const command = new DeleteCommand()
  return ddbDocClient.send(command)
}

function query(query) {
  //there will probably be a dowhile loop in here
  const command = new QueryCommand(query)
  return ddbDocClient.send(command)
}

function getItem(query) {
  const command = new GetCommand(query)
  return ddbDocClient.send(command)
}

async function getProducts() {
  const query = {
    TableName: 'fakeStoreTable',
    IndexName: 'type-lookup',
    ExpressionAttributeNames: { '#T': 'type' },
    ExpressionAttributeValues: { ':product': 'product' },
    KeyConditionExpression: "#T = :product"
  }
  const command = new QueryCommand(query)
  const { Items: products } = await ddbDocClient.send(command)
  return products
}

module.exports = { putItem, getItem, deleteItem, query, getProducts }