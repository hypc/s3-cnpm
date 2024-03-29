import { config } from 'dotenv'
import { S3Config } from '../src'
config()

export const publicConfig: S3Config = {
  mode: 'public',
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  endpoint: process.env.ENDPOINT,
  bucket: process.env.BUCKET,
  region: process.env.REGION,
  s3ForcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
}

export const privateConfig: S3Config = {
  mode: 'private',
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  endpoint: process.env.ENDPOINT,
  bucket: process.env.BUCKET,
  region: process.env.REGION,
  s3ForcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
}
