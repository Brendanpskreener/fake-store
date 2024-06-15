const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const s3Client = new S3Client()

async function getObject(key, bucket = 'fake-store-media') {
  const input = {
    Bucket: bucket,
    Key: key
  }

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
  return { ContentType, object: await promise }
}


module.exports = { getObject }


