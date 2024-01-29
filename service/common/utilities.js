const { encode } = require("blurhash");
const sharp = require("sharp");

async function getBlurHash(imageBuffer, compX = 4, compY = 4) {
  const { data, info } = await sharp(imageBuffer).raw().toBuffer({ resolveWithObject: true })
  const blurHash = encode(new Uint8Array(data), info.width, info.height, compX, compY)
  return blurHash
}

module.exports = { getBlurHash }