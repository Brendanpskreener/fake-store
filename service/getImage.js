const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const s3Client = new S3Client()

async function handler(event) {

  try {
    //parse productId
    const { pathParameters: { productId } } = event

    //build the command for S3
    const input = {
      Bucket: 'fake-store-media',
      Key: productId
    }

    //send command
    const command = new GetObjectCommand(input)
    const response = await s3Client.send(command)
    const { ContentType, Body } = response
    const promise = new Promise((resolve, reject) => {
      const bytes = [];
      Body.on('data', (byteSegment) => bytes.push(byteSegment))
        .on('error', (e) => reject(e))
        .on('end', () => {
          const allBytes = Buffer.concat(bytes);
          resolve(allBytes)
        });
    });

    const imageBuffer = await promise;
    const image = Buffer.from(imageBuffer).toString('base64')

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