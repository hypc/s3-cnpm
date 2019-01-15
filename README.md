# s3-cnpm

[![Build Status](https://img.shields.io/travis/com/hyunrealshadow/s3-cnpm.svg?style=flat-square)](https://travis-ci.com/hyunrealshadow/s3-cnpm)
[![codecov](https://img.shields.io/codecov/c/gh/hyunrealshadow/s3-cnpm.svg?style=flat-square&logo=codecov)](https://codecov.io/gh/hyunrealshadow/s3-cnpm)

s3 wrapper for [cnpmjs.org NFS](https://github.com/cnpm/cnpmjs.org/wiki/NFS-Guide)

It can support the use of OSS COS S3

## Usage
```bash
npm install @hyu/s3-cnpm
```

```js
const s3 = require('@hyu/s3-cnpm')

const client = s3.create({
  mode: 'public or private'
  accessKeyId: 'S3 accessKeyId' // COS SecretId or OSS AccessKey ID
  secretAccessKey: 'S3 secretAccessKey' // COS SecretKey or OSS Access Key Secret
  endpoint: 'your service endpoint' // e.g. cos.ap-shanghai.myqcloud.com
  bucket: 'your service bucket name' // e.g. npm
  region: 'your service region' // e.g. ap-shanghai
})
```

## Test

Create an .env file in the project root directory

```ini
ACCESS_KEY_ID=SOMETHING
SECRET_ACCESS_KEY=SOMETHING
ENDPOINT=SOMETHING
BUCKET=SOMETHING
REGION=SOMETHING
```

## Liecnse

[MIT](LICENSE)