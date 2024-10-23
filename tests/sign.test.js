import { describe, it, expect} from "vitest";
import JSEncrypt from 'nodejs-jsencrypt'
import CryptoJS from "crypto-js";


// exports.getSign = function(e) {
//         for (var t = Object.keys(e).sort(), n = "", o = 0; o < t.length; o++) n += t[o] + "=" + e[t[o]], o != t.length - 1 && (n += "&");
//         var p = r.enc.Utf8.parse(wx.getStorageSync("tv_keyID")),
//             s = r.enc.Utf8.parse(wx.getStorageSync("tv_keyID")),
//             c = r.AES.encrypt(n, p, {
//                 iv: s,
//                 mode: r.mode.ECB,
//                 padding: r.pad.Pkcs7
//             }).toString();
//         return c = encodeURIComponent(c), encodeURIComponent(c)
//     };


function getSign(params, okey, oiv) {
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

        console.log("🚀 ~ getSign ~ paramStr:", paramStr)

  // 3. 获取密钥
  const key = CryptoJS.enc.Utf8.parse(okey);
  const iv = CryptoJS.enc.Utf8.parse(oiv);

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

describe("sign", () => {
  it.skip("should return a valid aes key", async () => {
    const publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBvK4oNjqxUVCHZAuagDFVSLnCulaNxL9ppiJLIDjbETemn3LnxUfTXo3FjycUH8Tz+it3NmJuNGpg444ztYeDDmiP3JvEW+NHpUN49iRZlSZ54o/eVnhfIacb1WaIDxs7Nl61RxKHOYSl0T5kl/Hj5AUbmstgihBq0WSXopZ6TQIDAQAB";
    const keyId = "dT1lhgHL6GAWH9Rc";
    const expectResult ="ZqXnl2jcT1H1ER3v3hA15d0uEZH1Be+2wuWJEy2d53n9HZwpsMYqulSWYkPbFCM0J5w8yZ2a2zFZZIu3unrLL4Ti6la/ykzZrfpjLfK7ufoUswelRdIw42s52dmwzLxKutBeIBVMg7ZhFbdxSYLTjp8uw1mupkhSJpWxwnKFLLc="
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encrypted = encrypt.encrypt(keyId);
    // 如果需要验证特定的加密结果
    expect(encrypted).toBe(expectResult);
  });

  it("should return a valid sign", async () => {
    const keyId = "dT1lhgHL6GAWH9Rc";
    const timestamp = Date.parse(new Date()) / 1e3;
    console.log("🚀 ~ it ~ timestamp:", timestamp)
    console.log("🚀 ~ it ~ timestamp:", 1729686262)
    const token = '0f828817344c4c40894d1ca4a0cce0ce'

    const result = getSign({ strValue: JSON.stringify({ baChannel: 1 }), timestamp,token  }, keyId, keyId);
    expect(result).toMatchInlineSnapshot(`"dgMhviAqcb9GBpDBft3xhPSU905FcnWIuqh0j3LWbW2%252FFtRWnO%252FFAtBiYuq9lLrBqOU%252FIY8iWYi61SrvSy3j9hF13GPJhbLYKKn13%252FMxvd7sL66wNLj9ZMOMKWwLfZhh"`)
  });
});
