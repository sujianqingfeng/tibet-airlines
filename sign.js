import fetch from "node-fetch";
import CryptoJS from "crypto-js";
import { JSEncrypt } from "nodejs-jsencrypt";

const BASE_URL= "https://wechat.tibetairlines.com.cn/xcx-rest/api";

const User_Agent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090c11)XWEB/11275";


const headers = {
  "User-Agent": User_Agent,
  "Content-Type": "application/json;charset:utf-8;",
  Referer: "https://servicewechat.com/wx4e033a64f8735d07/174/page-frame.html",
};

function getKeyId() {
  for (
    var e = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
      ],
      t = "",
      r = 0;
    r < 16;
    r++
  ) {
    t += e[parseInt(61 * Math.random())];
  }
  return t;
}

function generateAesKey(keyId, publicKey) {
  const pk = `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`;
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(pk);
  const encrypted = encrypt.encrypt(keyId);
  return encrypted;
}

function getToken() {
  return fetch(`${BASE_URL}/token`, {
    method: "POST",
    body: JSON.stringify({
      localToken: "",
      expired: true,
    }),
    headers,
  })
    .then((response) => response.json())
    .then((res) => {
      const {
        data: { token, publicKey },
        statusCode,
      } = res;
      if (statusCode === "0" && publicKey) {
        return { token, publicKey };
      } else {
        throw new Error("Failed to get token");
      }
    });
}

function setAesKey(token, aesKey) {
  return fetch(`${BASE_URL}/token/aes`, {
    method: "POST",
    body: JSON.stringify({
      aesKey: aesKey,
      token: token,
    }),
    headers,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.statusCode === "0") {
        return true;
      } else {
        throw new Error("Failed to set AES key");
      }
    });
}

export function getSign(params, oKey, oIv) {
  // 1. 排序参数
  const sortedKeys = Object.keys(params).sort();
  let paramStr = "";

  // 2. 拼接参数
  for (let i = 0; i < sortedKeys.length; i++) {
    const key = sortedKeys[i];
    paramStr += `${key}=${params[key]}`;
    if (i !== sortedKeys.length - 1) {
      paramStr += "&";
    }
  }

  // 3. 获取密钥
  const key = CryptoJS.enc.Utf8.parse(oKey);
  const iv = CryptoJS.enc.Utf8.parse(oIv);

  // 4. 加密
  const encrypted = CryptoJS.AES.encrypt(paramStr, key, {
    iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  // 5. 编码
  const encryptedStr = encrypted.toString();
  const encodedStr = encodeURIComponent(encodeURIComponent(encryptedStr));

  return encodedStr;
}

function generateBody({ strValue, token, key, iv }) {
  const timestamp = Date.parse(new Date()) / 1e3;

  return {
    strValue: JSON.stringify(strValue),
    timestamp,
    token,
    sign: getSign(
      { strValue: JSON.stringify(strValue), timestamp, token },
      key,
      iv
    ),
  };
}

function fetchList(body) {
  return fetch(`${BASE_URL}/icon/getlist`, {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    }
  ).then((response) => response.json());
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const keyId = getKeyId();
  const { token, publicKey } = await getToken();
  console.log("🚀 ~ main ~ token:", token)
  console.log("🚀 ~ main ~ publicKey:", publicKey)
  const aesKey = generateAesKey(keyId, publicKey);
  console.log("🚀 ~ main ~ aesKey:", aesKey)
  await sleep(1000);
  await setAesKey(token, aesKey);
  await sleep(1000);

  const body = generateBody({ strValue: { baChannel: 1 }, token, key: keyId , iv: keyId });

  const list = await fetchList(body);
  console.log("🚀 ~ main ~ list:", list);
}

main();
