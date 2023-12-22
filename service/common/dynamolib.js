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

function query() {
  //there will probably be a dowhile loop in here
  const command = new QueryCommand()
  return ddbDocClient.send(command)
}

function getItem() {
  const command = new GetCommand()
  return ddbDocClient.send(command)
}



module.exports = { putItem }