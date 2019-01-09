import * as fs from 'fs'
import * as path from 'path'
import { create } from '../src'
import { publicConfig, privateConfig } from '../config'

describe('test/index.test.ts', () => {
  ;[
    {
      name: 'public mode s3 client',
      nfs: create(publicConfig),
      prefix: '/s3-cnpm-test',
    },
    {
      name: 'private mode s3 client',
      nfs: create(privateConfig),
      prefix: '/s3-cnpm-test',
    },
  ].forEach(item => {
    describe(item.name, () => {
      const nfs = item.nfs
      const key = item.prefix + '/-/test-' + process.version

      it('should upload file', async () => {
        const result = await nfs.upload(__filename, {
          key: key,
          size: fs.statSync(__filename).size,
        })

        if (nfs.config.mode === 'public') {
          expect(typeof result.url).toEqual('string')
        } else {
          expect(typeof result.key).toEqual('string')
        }

        await nfs.remove(key)
      })

      it('should upload file Buffer', async () => {
        const result = await nfs.uploadBuffer(fs.createReadStream(__filename), {
          key: key,
          size: fs.statSync(__filename).size,
        })

        if (nfs.config.mode === 'public') {
          expect(typeof result.url).toEqual('string')
        } else {
          expect(typeof result.key).toEqual('string')
        }

        await nfs.remove(key)
      })

      it('should download file', async () => {
        await nfs.upload(__filename, {
          key: key,
          size: fs.statSync(__filename).size,
        })

        const tempFile = path.join(__dirname, '.temp-file.ts')
        await nfs.download(key, tempFile, { timeout: 6000 })
        expect(fs.readFileSync(tempFile, 'utf8')).toEqual(
          fs.readFileSync(__filename, 'utf8'),
        )
        fs.unlinkSync(tempFile)

        await nfs.remove(key)

        nfs.download(key, tempFile, { timeout: 6000 }).catch(e => {
          expect(e.message).toEqual(
            'Could not retrieve file from S3: File Not Found',
          )
        })
      })
    })
  })
})
