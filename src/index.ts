import * as fs from 'fs'
import * as path from 'path'
import ReadableStream = NodeJS.ReadableStream
import { S3 } from 'aws-sdk'

export interface S3Config {
  mode: 'public' | 'private'
  accessKeyId: string
  secretAccessKey: string
  endpoint: string
  bucket: string
  region?: string
  s3ForcePathStyle?: boolean
}

interface UploadOptions {
  key: string
  size: number
  shasum?: string
  shasum256?: string
}

interface DownloadOptions {
  timeout: number
}

function trimKey(key: string) {
  return key ? key.replace(/^\//, '') : ''
}

class S3Wrapper {
  s3: S3
  config: S3Config

  constructor(config: S3Config) {
    this.config = config

    this.s3 = new S3({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region,
      endpoint: config.endpoint,
      s3ForcePathStyle: config.s3ForcePathStyle,
    })
  }

  private async _upload(
    file: string | ReadableStream,
    options: UploadOptions,
  ): Promise<any> {
    const key = trimKey(options.key)

    if (typeof file === 'string') {
      file = fs.createReadStream(file)
    }

    return this.s3
      .putObject({
        Bucket: this.config.bucket,
        Key: key,
        Body: file,
      })
      .promise()
      .then(() => {
        if (this.config.mode === 'public') {
          return {
            url: `https://${this.config.bucket}.${this.config.endpoint}/${key}`,
          }
        } else {
          return { key }
        }
      })
  }

  async upload(filePath: string, options: UploadOptions): Promise<any> {
    return this._upload(filePath, options)
  }

  async uploadBuffer(
    fileBuffer: ReadableStream,
    options: UploadOptions,
  ): Promise<any> {
    return this._upload(fileBuffer, options)
  }

  async remove(key: string): Promise<any> {
    const decodedKey = decodeURIComponent(trimKey(key))

    return this.s3
      .headObject({
        Bucket: this.config.bucket,
        Key: decodedKey,
      })
      .promise()
      .then(() => {
        this.s3
          .deleteObject({
            Bucket: this.config.bucket,
            Key: decodedKey,
          })
          .promise()
          .then(data => {
            return
          })
      })
      .catch(e => {
        if (e.statusCode === 404) {
          e.message = 'File Not Found'
        }
        throw new Error(`Could not remove file from S3: ${e.message}`)
      })
  }

  async download(
    key: string,
    savePath: string,
    options: DownloadOptions,
  ): Promise<any> {
    const decodedKey = decodeURIComponent(trimKey(key))

    const folderPath = path.dirname(savePath)
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath)
    }

    return this.s3
      .headObject({
        Bucket: this.config.bucket,
        Key: decodedKey,
      })
      .promise()
      .then(() => {
        return this.s3
          .getObject({
            Bucket: this.config.bucket,
            Key: decodedKey,
          })
          .createReadStream()
      })
      .then(stream => {
        return new Promise((resolve, reject) => {
          stream.pipe(
            fs.createWriteStream(savePath).on('close', () => {
              resolve()
            }),
          )
        })
      })
      .catch(e => {
        if (e.statusCode === 404) {
          e.message = 'File Not Found'
        }
        throw new Error(`Could not retrieve file from S3: ${e.message}`)
      })
  }

  async createDownloadStream(
    key: string,
    options: DownloadOptions,
  ): Promise<any> {
    const decodedKey = decodeURIComponent(trimKey(key))

    return this.s3
      .headObject({
        Bucket: this.config.bucket,
        Key: decodedKey,
      })
      .promise()
      .then(() => {
        return this.s3
          .getObject({
            Bucket: this.config.bucket,
            Key: decodedKey,
          })
          .createReadStream()
      })
      .catch(e => {
        if (e.statusCode === 404) {
          e.message = 'File Not Found'
        }
        throw new Error(`Could not retrieve file from S3: ${e.message}`)
      })
  }
}

export function create(options: S3Config) {
  return new S3Wrapper(options)
}
