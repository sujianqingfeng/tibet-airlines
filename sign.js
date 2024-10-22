
import fetch from 'node-fetch';
import NodeRSA from 'node-rsa';
import CryptoJS from 'crypto-js';

const servsers = "https://wechat.tibetairlines.com.cn/xcx-rest/api";




 const User_Agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090c11)XWEB/11275";



// function getToken() {
  // post
  // https://wechat.tibetairlines.com.cn/xcx-rest/api/token

  // {
//   "localToken": "",
//   "expired": true
// }

//   {
//   "createNewSession": false,
//   "data": {
//     "needSetAesKey": true,
//     "publicKey": "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrnhhbpNxi85V8zomUhgvFDMLltASlnuh4yOeU/okh/ZNGEpJUFlu8+Rn9wuQgj5yGjM6uXn55Lez5YFM5lTeXw4fB91irrUUKgInyALF5LdnRBG84rFRWdotX41TqJzK8Kl91H5R4bQVN7tf8uEP1kEo9hR7SYopamyXBMg4ilQIDAQAB",
//     "responseTime": "1729608064",
//     "token": "77b6fb31950d4148894d6eb747eaadfd",
//     "transferSuccess": false
//   },
//   "errorStack": null,
//   "statusCode": "0",
//   "statusMsg": ""
// }




// ----aes

// post aes

// https://wechat.tibetairlines.com.cn/xcx-rest/api/token/aes

// {
//   "aesKey": "dDJrlM9a7JcEDNf0IKMDstqop09oSNtOrxyzHVPtuKjw6XaG/wTAqU9eqVrXw3N0GNnuFLYL69s6Xw/OgoCEr00j9VzFyTtlu0fA7M51mWzafXQKVlCyzdke+MwVv74f0pQd9PrJ5S+ApCG3FPuRQCOBkCBviqFaWLvWzydzj1Q=",
//   "token": "77b6fb31950d4148894d6eb747eaadfd"
// }


// {
//   "createNewSession": false,
//   "data": null,
//   "errorStack": null,
//   "statusCode": "0",
//   "statusMsg": ""
// }


// }

const headers = {
            'User-Agent': User_Agent,
            'Content-Type': 'application/json;charset:utf-8;'
        }


function getKeyId() {
    for (var e = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], t = "", r = 0; r < 16; r++) {
        t += e[parseInt(61 * Math.random())]
    }
    return t
}


// function generateAesKey(randomKey,publicKey) {
//     // Convert the random key to Base64
//     const keyBase64 = CryptoJS.enc.Base64.stringify(randomKey);

//     // Use JSEncrypt to encrypt the Base64 key with the public key
//     const encrypt = new JSEncrypt();
//     encrypt.setPublicKey(publicKey);
//     const encryptedKey = encrypt.encrypt(keyBase64);

//     return encryptedKey;
// }

function generateAesKey(randomKey, publicKey) {
    // console.log("🚀 ~ generateAesKey ~ randomKey:", randomKey)
    // Convert the random key to Base64

    // Use node-rsa to encrypt the Base64 key with the public key
    const encrypt = new NodeRSA();
    encrypt.importKey(publicKey, 'pkcs8');
    const encryptedKey = encrypt.encrypt(randomKey, 'base64');

    return encryptedKey;
}


function getToken() {
    return fetch('https://wechat.tibetairlines.com.cn/xcx-rest/api/token', {
        method: 'POST',
        body: JSON.stringify({
            localToken: "",
            expired: true
        }),
        headers
    })
    .then(response => response.json())
    .then(data => {
        if (data.statusCode === "0" && data.data.publicKey) {
            return { token: data.data.token, publicKey: data.data.publicKey };
        } else {
            throw new Error('Failed to get token');
        }
    });
}

function setAesKey(token, aesKey) {
    return fetch('https://wechat.tibetairlines.com.cn/xcx-rest/api/token/aes', {
        method: 'POST',
        body: JSON.stringify({
            aesKey: aesKey,
            token: token
        }),
        headers
    })
    .then(response => response.json())
    .then(data => {
        console.log("🚀 ~ setAesKey ~ data:", data)
        if (data.statusCode === "0") {
            return true;
        } else {
            throw new Error('Failed to set AES key');
        }
    });
}



function getSign(params,okey,oiv) {
    // 1. 排序参数
    const sortedKeys = Object.keys(params).sort();
    let paramStr = '';

    // 2. 拼接参数
    for (let i = 0; i < sortedKeys.length; i++) {
        const key = sortedKeys[i];
        paramStr += `${key}=${params[key]}`;
        if (i !== sortedKeys.length - 1) {
            paramStr += '&';
        }
    }

    // 3. 获取密钥
    const key = CryptoJS.enc.Utf8.parse(okey);
    const iv = CryptoJS.enc.Utf8.parse(oiv);

    // 4. 加密
    const encrypted = CryptoJS.AES.encrypt(paramStr, key, {
        iv: iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    // 5. 编码
    const encryptedStr = encrypted.toString();
    const encodedStr = encodeURIComponent(encodeURIComponent(encryptedStr));

    return encodedStr;
}



function generateBody({strValue,token,key,iv}){
  const timestamp = Date.parse(new Date()) / 1e3;

  
  return {
    strValue: JSON.stringify(strValue),
    timestamp,
    token,
    sign: getSign({strValue,timestamp},key,iv)
  } 
}


function fetchList(token,key,iv){

const  body = generateBody({strValue:{baChannel:1},token,key,iv});
console.log("🚀 ~ fetchList ~ body:", body)

 return fetch('https://wechat.tibetairlines.com.cn/xcx-rest/api/icon/getlist', {
        method: 'POST',
        body: JSON.stringify(body),
        headers
    })
    .then(response => response.json())
    .then(data => {
      console.log("🚀 ~ fetchList ~ data:", data)
    })

}



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(){
  const keyId = getKeyId();
  console.log("🚀 ~ main ~ keyId:", keyId)

 const {token, publicKey} = await getToken();
 console.log("🚀 ~ main ~ publicKey:", publicKey)
 console.log("🚀 ~ main ~ token:", token)

 const pk = `-----BEGIN PUBLIC KEY-----
${publicKey}
-----END PUBLIC KEY-----`
 const aesKey = generateAesKey(keyId,pk);
 console.log("🚀 ~ main ~ aesKey:", aesKey)
 await sleep(1000);
 await setAesKey(token, aesKey);





fetchList({
  token,
  key:keyId,
  iv:keyId
})


}


main()