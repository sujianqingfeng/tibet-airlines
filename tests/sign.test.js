import { describe, it, expect } from "vitest";
import JSEncrypt from "nodejs-jsencrypt";
import { getSign } from "../sign.js";


describe("sign", () => {
  it("should return a valid aes key", async () => {
    const publicKey =
      "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBvK4oNjqxUVCHZAuagDFVSLnCulaNxL9ppiJLIDjbETemn3LnxUfTXo3FjycUH8Tz+it3NmJuNGpg444ztYeDDmiP3JvEW+NHpUN49iRZlSZ54o/eVnhfIacb1WaIDxs7Nl61RxKHOYSl0T5kl/Hj5AUbmstgihBq0WSXopZ6TQIDAQAB";
    const keyId = "dT1lhgHL6GAWH9Rc";
    const expectResult =
      "ZqXnl2jcT1H1ER3v3hA15d0uEZH1Be+2wuWJEy2d53n9HZwpsMYqulSWYkPbFCM0J5w8yZ2a2zFZZIu3unrLL4Ti6la/ykzZrfpjLfK7ufoUswelRdIw42s52dmwzLxKutBeIBVMg7ZhFbdxSYLTjp8uw1mupkhSJpWxwnKFLLc=";
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encrypted = encrypt.encrypt(keyId);
    expect(encrypted).toBe(expectResult);
  });

  it("should return a valid sign", async () => {
    const keyId = "dT1lhgHL6GAWH9Rc";
    const timestamp = Date.parse(new Date()) / 1e3;
    const token = "0f828817344c4c40894d1ca4a0cce0ce";

    const result = getSign(
      { strValue: JSON.stringify({ baChannel: 1 }), timestamp, token },
      keyId,
      keyId
    );
    expect(result).toMatchInlineSnapshot(
      `"dgMhviAqcb9GBpDBft3xhPSU905FcnWIuqh0j3LWbW2%252FFtRWnO%252FFAtBiYuq9lLrBqOU%252FIY8iWYi61SrvSy3j9hF13GPJhbLYKKn13%252FMxvd7sL66wNLj9ZMOMKWwLfZhh"`
    );
  });
});
