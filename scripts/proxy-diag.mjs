// Diagnose the configured proxy: reachability, exit IP, and weapi through it.
import { ProxyAgent } from 'undici'
import { createCipheriv, createPublicKey, publicEncrypt, randomBytes, constants } from 'node:crypto'

const PROXY = 'http://127.0.0.1:7890'
let agent
try {
  agent = new ProxyAgent(PROXY)
  console.log('ProxyAgent created OK')
} catch (e) {
  console.log('ProxyAgent FAILED:', e.message)
  process.exit(1)
}

// 1) exit IP through the proxy
try {
  const r = await fetch('https://api.ipify.org?format=json', { dispatcher: agent })
  console.log('proxy exit IP:', await r.text())
} catch (e) {
  console.log('proxy IP check failed:', e.message)
}
// 2) geo info (country hint)
try {
  const r = await fetch('http://ip-api.com/json/?lang=zh-CN', { dispatcher: agent })
  const j = await r.json()
  console.log('geo:', j.country, j.regionName, j.city, 'isp:', j.isp, 'org:', j.org)
} catch (e) {
  console.log('geo check failed:', e.message)
}

// 3) weapi through the proxy
const AES_KEY = '0CoJUm6Qyw8W8jud'
const AES_IV = '0102030405060708'
const RSA_E = '010001'
const RSA_N =
  '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7'
const aes = (t, k) => {
  const c = createCipheriv('aes-128-cbc', Buffer.from(k), Buffer.from(AES_IV))
  return c.update(t, 'utf8', 'hex') + c.final('hex')
}
const rsa = (t) => {
  const r = Buffer.from(t).reverse()
  const key = createPublicKey({ key: { kty: 'RSA', n: Buffer.from(RSA_N, 'hex').toString('base64url'), e: Buffer.from(RSA_E, 'hex').toString('base64url') }, format: 'jwk' })
  return publicEncrypt({ key, padding: constants.RSA_PKCS1_PADDING }, r).toString('hex')
}
const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
let secret = ''
for (let i = 0; i < 16; i++) secret += chars[randomBytes(1)[0] % chars.length]
const form = new URLSearchParams()
form.set('params', aes(aes(JSON.stringify({ type: 1 }), secret), AES_KEY))
form.set('encSecKey', rsa(secret))
try {
  const res = await fetch('https://music.163.com/weapi/login/qrcode/unikey', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0.0.0',
      referer: 'https://music.163.com/',
      'cookie': 'os=pc; appver=2.9.7',
    },
    body: form,
    dispatcher: agent,
  })
  const text = await res.text()
  console.log('weapi via proxy: status', res.status, 'len', text.length, text ? text.slice(0, 120) : '(EMPTY — blocked)')
} catch (e) {
  console.log('weapi via proxy failed:', e.message)
}
agent.close()
