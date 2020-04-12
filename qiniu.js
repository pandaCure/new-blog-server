const qiniu = require('qiniu')
const path = require('path')
const { qiuniuAccessKey, qiniuSecretKey } = require(path.resolve(
  process.cwd(),
  'config.js'
))
const bucket = 'zzy-blog'
const mac = new qiniu.auth.digest.Mac(qiuniuAccessKey, qiniuSecretKey)
const options = {
  scope: bucket,
  returnBody: '{"name":"$(key)","host":"$(x:host)","query":"$(x:query)"}',
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)
const config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_z1 // 华北
const localFile = '/Users/zhangfan/Downloads/2017071117160955.jpg'
const resumeUploader = new qiniu.resume_up.ResumeUploader(config)
const putExtra = new qiniu.resume_up.PutExtra()
// 扩展参数
putExtra.params = {
  'x:query': 'imageView2/0/format/webp',
  'x:host': 'qiniu.zzysie.xin',
}
// 如果指定了断点记录文件，那么下次会从指定的该文件尝试读取上次上传的进度，以实现断点续传
putExtra.resumeRecordFile = './progress.log'
const key = 'avator.jpeg'
// 文件分片上传
resumeUploader.putFile(uploadToken, key, localFile, putExtra, function (
  respErr,
  respBody,
  respInfo
) {
  if (respErr) {
    throw respErr
  }
  if (respInfo.statusCode == 200) {
    console.log(respBody)
  } else {
    console.log(respInfo.statusCode)
    console.log(respBody)
  }
})
