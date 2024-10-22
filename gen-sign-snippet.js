define("configs/utils.js", function(require, module, exports, window, document, frames, self, location, navigator, localStorage, history, Caches, screen, alert, confirm, prompt, XMLHttpRequest, WebSocket, Reporter, webkit, WeixinJSCore) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.zeroizeDigit = exports.tokenClear = exports.tingYun = exports.ticketHistory = exports.stopTime = exports.setTime = exports.setStore = exports.resolveJulianDate = exports.removeStore = exports.payTime = exports.passToBase64 = exports.loginToken = exports.loginClear = exports.isOverDay = exports.isINF = exports.historyCity = exports.goPayPage = exports.getVeriCode = exports.getStore = exports.getQuery = exports.getNameLength = exports.getLastDateByMonth = exports.getFirstDateByMonth = exports.getDate = exports.generateParams = exports.formatWeekday = exports.formatTime = exports.formatTamp = exports.formatDay_zh = exports.formatDayXZ = exports.formatDay = exports.flyDate = exports.failToast = exports.failModal = exports.dateReplace = exports.dateDifference = exports.dateCountdown = exports.dateCalculate = exports.createWxUser = exports.contrast = exports.checkStrLengths = exports.checkChildDay = exports.arraySum = void 0;
    var e = require("./dictCommon"),
        t = require("./encrypt"),
        r = require("./base64"),
        n = require("./wx_rsa.js"),
        a = require("./request.js"),
        o = require("./urls.js"),
        s = getApp(),
        i = exports.setStore = function(e, t) {
            wx.setStorageSync(e, t)
        },
        u = exports.getStore = function(e) {
            if (e) return wx.getStorageSync(e)
        },
        c = exports.removeStore = function(e) {
            e && wx.removeStorage({
                key: e
            })
        },
        l = (exports.setTime = function(e, t) {
            return t = t || 1, (e = e.replace(/-/g, "")).slice(8, 10) + ":" + e.slice(10, 12)
        }, exports.isOverDay = function(e, t) {
            return e.date !== t.date
        }, exports.ticketHistory = function(e) {
            var t = u("tv_searchBack");
            0 != (t = Number(t)) && ("back" == e ? wx.setStorageSync("tv_searchBack", t - 1) : wx.setStorageSync("tv_searchBack", t + 1))
        }, exports.getDate = function(e, t) {
            if (t) var r = new Date(t.trim().replace(/\-/g, "/"));
            else r = new Date;
            return r.setDate(r.getDate() + e), r.getFullYear() + "-" + (r.getMonth() + 1 < 10 ? "0" + (r.getMonth() + 1) : r.getMonth() + 1) + "-" + (r.getDate() < 10 ? "0" + r.getDate() : r.getDate())
        }),
        p = exports.dateCalculate = function(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "y",
                r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
                n = 0,
                a = new Date(e.getTime());
            switch (t) {
                case "y":
                    n = a.setFullYear(a.getFullYear() + r);
                    break;
                case "M":
                    n = a.setMonth(a.getMonth() + r);
                    break;
                case "d":
                    n = a.setDate(a.getDate() + r);
                    break;
                case "h":
                    n = a.setHours(a.getHours() + r);
                    break;
                case "m":
                    n = a.setMinutes(a.getMinutes() + r);
                    break;
                case "s":
                    n = a.setSeconds(a.getSeconds() + r);
                    break;
                case "S":
                    n = a.setMilliseconds(a.getMilliseconds() + r)
            }
            return new Date(n)
        },
        g = exports.zeroizeDigit = function(e) {
            return e >= 0 && e < 10 ? "0".concat(e) : e
        },
        f = (exports.dateCountdown = function(e) {
            var t = 0,
                r = 0,
                n = 0,
                a = 0;
            e > 60 ? (r = parseInt(e / 60), t = parseInt(e % 60), r > 60 && (n = parseInt(r / 60), r = parseInt(r % 60), n > 24 && (a = parseInt(n / 24), n = parseInt(n % 24)))) : t = parseInt(e);
            var o = "";
            return e >= 86400 && (o += "".concat(a, "-")), e >= 3600 && (o += "".concat(g(n), ":")), e >= 60 && (o += "".concat(g(r), ":")), e > 0 && (o += "".concat(g(t))), o
        }, exports.formatDayXZ = function(e, t) {
            var r = e.slice(0, 4),
                n = e.slice(4, 6),
                a = e.slice(6, 8);
            return "all" == t ? r + "-" + n + "-" + a + " " + e.slice(8, 10) + ":" + e.slice(10, 12) : r + "-" + n + "-" + a
        }, exports.formatDay = function(e, t) {
            var r = isDateString(e) ? new Date(e.replace(/-/g, "/")) : e;
            return 0 === t && (r = r.addDays(-1)), 1 === t && (r = r.addDays(1)), r.toFormatString("yyyy/MM/dd", !0)
        }, exports.formatTime = function(e) {
            if (null === e) return "";
            var t = e,
                r = t.getFullYear(),
                n = t.getMonth() + 1;
            n = n < 10 ? "0" + n : n;
            var a = t.getDate();
            a = a < 10 ? "0" + a : a;
            var o = t.getHours();
            o = o < 10 ? "0" + o : o;
            var s = t.getMinutes(),
                i = t.getSeconds(),
                u = t.getMilliseconds();
            return u < 10 ? u = "00" + u : u < 100 && (u = "0" + u), r + "" + n + a + o + (s = s < 10 ? "0" + s : s) + (i = i < 10 ? "0" + i : i) + u
        }, exports.formatTamp = function(e, t) {
            if (null == e) return "";
            var r = e,
                n = r.getFullYear(),
                a = r.getMonth() + 1;
            a = a < 10 ? "0" + a : a;
            var o = r.getDate();
            if (o = o < 10 ? "0" + o : o, "CN" == t) return n + "年 " + a + "月 " + o + "日";
            if ("/" === t) return n + "/" + a + "/" + o;
            if ("all" === t) {
                var s = r.getHours();
                s = s < 10 ? "0" + s : s;
                var i = r.getMinutes();
                return n + "-" + a + "-" + o + " " + s + ":" + (i = i < 10 ? "0" + i : i)
            }
            return n + "-" + a + "-" + o
        }, exports.formatDay_zh = function(e, t) {
            e = e.split("-");
            return "line" == t ? e[1] + "-" + e[2] : e[1] + "月" + e[2] + "日"
        }, exports.formatWeekday = function(e, t) {
            var r;
            if (t && e == l(0) ? r = "今天" : "end" == t && e == l(1) ? r = "明天" : "end" == t && e == l(2) && (r = "后天"), "end" == t) return r;
            switch (new Date(e).getDay()) {
                case 0:
                    r = "周日";
                    break;
                case 1:
                    r = "周一";
                    break;
                case 2:
                    r = "周二";
                    break;
                case 3:
                    r = "周三";
                    break;
                case 4:
                    r = "周四";
                    break;
                case 5:
                    r = "周五";
                    break;
                case 6:
                    r = "周六"
            }
            return r
        }, exports.dateDifference = function(e, t) {
            var r = e.replace(/-/g, "/"),
                n = t.replace(/-/g, "/"),
                a = new Date(r),
                o = new Date(n),
                s = Math.abs(a - o);
            return Math.floor(s / 864e5)
        }, exports.dateReplace = function(e) {
            return e ? e.replace(/-/g, "/") : ""
        }, exports.historyCity = function(e) {
            var t = u("tv_historyCity"),
                r = [];
            if (t)
                for (var n in r = t, e) {
                    var a = e[n],
                        o = !1,
                        s = void 0;
                    for (var i in r) r[i].airportCode == a.airportCode && (o = !0, s = i);
                    o ? (r.splice(s, 1), r.unshift(a)) : r.length >= 6 ? (r.pop(), r.unshift(a)) : r.unshift(a)
                } else r = r.concat(e);
            wx.setStorageSync("tv_historyCity", r)
        }, exports.getVeriCode = function(e) {
            if (!e.timer) {
                var t = 60;
                e.disabledType = !1, e.timer = setInterval((function() {
                    t > 0 && t <= 60 ? (t--, e.countDown = t + " s", e.disabledType = !0) : (e.disabledType = !1, clearInterval(e.timer), e.timer = null, e.countDown = "获取验证码")
                }), 1e3)
            }
            return {
                timer: e.timer,
                disabledType: e.disabledType,
                countDown: e.countDown
            }
        }, exports.payTime = function(e) {
            return null == e.timer && (e.timer = setInterval((function() {
                0 === e.seconds && 0 !== e.minutes ? (e.seconds = 59, e.minutes -= 1) : 0 === e.minutes && 0 === e.seconds ? (e.seconds = 0, e.end = !0, clearInterval(e.timer)) : e.seconds -= 1
            }), 1e3)), {
                timer: e.timer,
                minutes: e.minutes,
                seconds: e.seconds,
                end: e.end
            }
        }, exports.checkStrLengths = function(e, t) {
            return e && e.length > t ? t : e.length
        }, exports.stopTime = function(e, t) {
            if (e && t) {
                e = f(e), t = f(t);
                var r = parseInt((t - e) / 60),
                    n = (t - e) % 60;
                return (r = r > 0 ? r + "小时" : "") + (n = n > 0 ? n + "分钟" : "")
            }
        }, exports.arraySum = function(e) {
            return e.reduce((function(e, t) {
                return e + t
            }))
        }, function(e) {
            var t = e.date + " " + e.time + ":00";
            return (t = new Date(t.replace(/\-/g, "/"))).valueOf(t) / 6e4
        }),
        d = exports.loginToken = function r(n, a) {
            var s = Number(u("tv_timediff")),
                l = Date.parse(new Date) / 1e3 - s,
                p = !0;
            if (null != u("tv_preTokenTime")) {
                var g = u("tv_preTokenTime");
                p = l - g > 7200 - Math.abs(s)
            }
            "expire" == n && c("tv_token");
            var f = !0;
            p || "gologin" != n || (f = !1);
            var d = u("tv_reset");
            d && 1 != d ? (0, e.getDictList)() : wx.request({
                url: o.common.token,
                method: "POST",
                data: {
                    localToken: u("tv_token") || "",
                    expired: f
                },
                success: function(a) {
                    var s = {
                            openId: u("openId"),
                            unionId: u("unionId")
                        },
                        p = a.data;
                    if (0 == p.statusCode) {
                        var g = Date.parse(new Date) / 1e3 - p.data.responseTime;
                        i("tv_timediff", g), i("tv_preTokenTime", l), i("tv_preTime", l);
                        var f = p.data.token;
                        i("tv_token", f);
                        p.data.transferSuccess;
                        if (p.data.needSetAesKey) {
                            d && 1 != d || (i("tv_keyID", t.tv_keyID), c("tv_localPass"));
                            var v = (0, t.nodeRSA)(p.data.publicKey);
                            wx.request({
                                url: o.common.aeslogin,
                                method: "POST",
                                data: {
                                    aesKey: v,
                                    token: f
                                },
                                success: function(r) {
                                    var a = r.data;
                                    if (0 == a.statusCode) {
                                        D(s);
                                        var o = (0, t.getAes)(t.tv_bID, t.tv_bID);
                                        i("tv_cuser", o);
                                        var c = [a.data, f, u("tv_keyID")],
                                            l = {};
                                        u("tv_user") && (l = JSON.parse(u("tv_user"))), l[o] = c, (0, e.getDictList)(), i("tv_user", JSON.stringify(l)), i("tv_reset", "0"), "gologin" == n && (i("tv_token", f), wx.navigateTo({
                                            url: "/package_user/pages/login/login"
                                        }))
                                    } else(0, e.getDictList)()
                                }
                            })
                        } else {
                            D(s), "gologin" == n && (i("tv_token", f), wx.navigateTo({
                                url: "/package_user/pages/login/login"
                            }));
                            var x = (0, t.getAes)(t.tv_bID, t.tv_bID);
                            if (i("tv_cuser", x), null != u("tv_user")) {
                                var m = JSON.parse(u("tv_user")),
                                    y = m[x];
                                y[0] = Date.parse(new Date) / 1e3, i("tv_keyID", y[2]), c("tv_localPass"), i("tv_token", y[1]), u("tv_user", JSON.stringify(m))
                            }(0, e.getDictList)(), i("tv_reset", "0")
                        }
                    } else if ("-102" == p.statusCode) {
                        var h = u("getTokenNumber");
                        (!h || h < 4) && (r(), h ? h++ : h = 0, i("getTokenNumber", h))
                    }
                }
            }, 0)
        },
        v = (exports.failModal = function(e, t, r) {
            e = e || "请求失败！请稍后重试！", wx.showModal({
                title: "",
                content: e,
                confirmColor: "#c20000",
                showCancel: !1,
                success: function(e) {
                    e.confirm && t && t()
                },
                fail: function() {
                    r && r()
                }
            })
        }, exports.failToast = function(e, t) {
            e = e || "请求失败！请稍后重试！", t = t || 3e3, wx.showToast({
                icon: "none",
                title: e,
                duration: t
            })
        }, exports.loginClear = function() {
            c("tv_reset"), c("tv_accessTime"), c("tv_login"), c("tv_loginType"), c("tv_userInfo"), c("tv_addSeatInfo")
        }),
        x = (exports.tokenClear = function() {
            clearToken({
                strValue: {}
            }).then((function(e) {
                0 == e.statusCode && (v(), d(), wx.navigateTo({
                    url: "/package_user/pages/login/login"
                }))
            }))
        }, exports.checkChildDay = function(e, t) {
            var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : new Date,
                n = r;
            "string" == typeof r && (n = new Date(r.replace(/-/g, "/")));
            var a = [];
            for (var o in a.push(n.getFullYear()), a.push(n.getMonth() + 1), a.push(n.getDate()), e = e.split("-")) e[o] = parseInt(e[o]);
            if (a[0] - e[0] < t) return !0;
            if (a[0] - e[0] == t) {
                if (a[1] < e[1]) return !0;
                if (a[1] > e[1]) return !1;
                if (a[1] == e[1]) {
                    if (a[2] < e[2]) return !0;
                    if (a[2] >= e[2]) return !1
                }
            }
            return !(a[0] - e[0] > t) && void 0
        }, exports.isINF = function(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : new Date,
                r = t;
            "string" == typeof t && (r = new Date(t.replace(/-/g, "/")));
            var n = new Date(r).getTime() - new Date(e).getTime();
            return n / 1e3 / 60 / 60 / 24 >= 14
        }, exports.passToBase64 = function(e) {
            var t = encodeURI(e);
            return (0, r.btoa)(t)
        }, exports.flyDate = function(e, t, r) {
            var n = e.split("-"),
                a = t.split("-");
            if (a[0] - n[0] > r) return !0;
            if (a[0] - n[0] == r) {
                if (a[1] - n[1] > 0) return !0;
                if (a[1] - n[1] == 0) return a[2] - n[2] >= 0;
                if (a[1] - n[1] < 0) return !1
            }
            return !(a[0] - n[0] < r) && void 0
        }, exports.generateParams = function(e) {
            if (!e) return "";
            var t = [];
            for (var r in e) {
                var n = e[r];
                null == n && (n = ""), t.push(String(r) + "=" + String(n))
            }
            return t.join("&")
        });

    function m(e) {
        if (e) {
            var t = n.KEYUTIL.getKey("-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxlcJo64sBTWnF8zbAEzZXbHpTzw0PAKDSk486BwIkFCoQE7uNqR6FdlkFapC8xC75uk2JkAZv2R1FQS6itfKIRNqUmVdmdyVTRnntLiRdzCIecK4nT6NNrC/88znEs7WzRa6WTw70gp430mgRmpS8i62gNlNV9vgpfudhl6c8DVFjXxEGYwFdbcyC8ns3YyAoEf2FudLBkr8o3JtcdgZGwHbCNvpRN0OyfthjMb+tjuFmAwPrytFUmCmmy6nXO4OeBqBAkPwbf6KDeOu18aBxJdT+8fiiWMIGRUwegqr7iXS47wu96wdkekzgNupd6deDRTmtsl3gsm2MA/wV/40qQIDAQAB-----END PUBLIC KEY-----").encrypt(e);
            return n.hex2b64(t)
        }
    }
    var D = exports.createWxUser = function(e) {
            if (e.openId) {
                var t = {
                    strValue: {
                        openId: m(e.openId),
                        unionId: e.unionId,
                        nickName: u("userInfo") ? u("userInfo").nickName : "--",
                        avatarUrl: u("userInfo") ? u("userInfo").avatarUrl : "--"
                    }
                };
                a.call(void 0, {
                    url: s.globalData.servsers + "/tribe/user/createWxUser",
                    data: t,
                    success: function(e) {
                        0 == e.statusCode && e.data.wxUser && (i("openId", e.data.wxUser.openId), i("unionId", e.data.wxUser.unionId), s.globalData.openId = e.data.wxUser.openId, s.globalData.unionId = e.data.wxUser.unionId, s.globalData.userInfo = e.data.wxUser)
                    },
                    fail: function(e) {}
                })
            }
        },
        y = (exports.contrast = function(e, t) {
            var r = [];
            for (var n in t)
                for (var a = t[n], o = 0; o < a.length; o++) a[o].airportEname.substring(0, e.length) != e && a[o].airportEname.substring(0, e.length).toLowerCase() != e.toLowerCase() && a[o].airportCode.substring(0, e.length) != e && a[o].airportCode.substring(0, e.length) != e.toUpperCase() && a[o].airportCname.substring(0, e.length) != e || r.push(a[o]);
            return r
        }, exports.resolveJulianDate = function(e) {
            var t = (new Date).getFullYear();
            return p(new Date(t + "/01/01"), "d", e - 1)
        }, exports.getFirstDateByMonth = function(e) {
            return e = e || new Date, new Date(e.getFullYear(), e.getMonth(), 1)
        }, exports.getLastDateByMonth = function(e) {
            return e = e || new Date, new Date(e.getFullYear(), e.getMonth() + 1, 0)
        }, exports.getNameLength = function(e) {
            var t = {
                zh: !0,
                size: 0
            };
            if (-1 !== e.search(/[\u4e00-\u9fa5]/)) {
                var r = e.split(""),
                    n = [];
                r.forEach((function(e) {
                    /[\u4e00-\u9fa5]/.test(e) && n.push(e)
                })), t.zh = !0, t.size = r.length + n.length
            } else t.zh = !1, t.size = e.length;
            return t
        }, exports.tingYun = function() {
            require("../agent/tingyun-mp-agent.js").config({
                beacon: "https://beacon-mp.tingyun.com",
                key: "ZBg1eByyxAY",
                id: "S_uF7gVhBIU",
                sampleRate: 1,
                custom: function(e) {
                    console.log(e)
                }
            })
        }, exports.getQuery = function(e, t) {
            var r = {};
            e = (e = e.slice(e.indexOf("?") + 1)).split("&");
            for (var n = 0; n < e.length; n++) {
                var a = e[n].indexOf("="),
                    o = e[n].slice(0, a),
                    s = e[n].slice(a + 1, e[n].length);
                r[o] = s
            }
            return t ? r[t] : r
        });
    exports.goPayPage = function(e) {
        if (e.auisBsp && e.auisBspUrl) {
            var t = e.auisBspUrl,
                r = y(t, "code"),
                n = y(t, "sign"),
                a = y(t, "timestamp"),
                o = y(t, "redirect_uri"),
                s = x({
                    title: "保险购买",
                    url: t.split("?")[0],
                    insurance: 1,
                    code: r,
                    sign: n,
                    timestamp: a,
                    redirect_uri: o
                });
            wx.redirectTo({
                url: "/pages/common/external/external?" + s
            })
        } else wx.redirectTo({
            url: "/package_ticket/pages/ticket/pay/pay"
        })
    };
});

define("configs/encrypt.js", function(require, module, exports, window, document, frames, self, location, navigator, localStorage, history, Caches, screen, alert, confirm, prompt, XMLHttpRequest, WebSocket, Reporter, webkit, WeixinJSCore) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.tv_keyID = exports.tv_bID = exports.nodeRSA = exports.getSign = exports.getCodeEncrypt = exports.getAppAes = exports.getAes = exports.decryDes = void 0;
    var e, t = (e = require("./jsencrypt.min.js")) && e.__esModule ? e : {
        default: e
    };
    var r = require("./cryptojs.js"),
        n = r.enc.Utf8.parse("5717ABAC3BG499D2"),
        o = r.enc.Utf8.parse("T(5717ABAC3BG499D2"),
        p = (exports.nodeRSA = function(e, r) {
            var n = new t.default;
            return n.setPublicKey(e), r ? n.encrypt(r) : n.encrypt(wx.getStorageSync("tv_keyID"))
        }, function() {
            for (var e = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], t = "", r = 0; r < 16; r++) {
                t += e[parseInt(61 * Math.random())]
            }
            return t
        }),
        s = exports.tv_keyID = null;
    exports.tv_keyID = s = p();
    var c, a = r.enc.Utf8.parse("s$eupsi@2020trav"),
        d = r.enc.Utf8.parse("eupsi#2020swcare");
    exports.getCodeEncrypt = function(e) {
        return e ? r.AES.encrypt(e, d, {
            mode: r.mode.CBC,
            iv: a,
            padding: r.pad.Pkcs7
        }).toString() : ""
    }, exports.getAppAes = function(e) {
        var t = r.enc.Utf8.parse(e),
            p = r.AES.encrypt(t, n, {
                iv: o,
                mode: r.mode.ECB,
                padding: r.pad.Pkcs7
            });
        return r.enc.Base64.stringify(p.ciphertext).toString()
    }, exports.getAes = function(e, t) {
        var n = r.enc.Utf8.parse(t),
            o = r.AES.encrypt(e, n, {
                iv: n,
                mode: r.mode.ECB,
                padding: r.pad.Pkcs7
            }).toString();
        return o = encodeURIComponent(o), encodeURIComponent(o)
    }, exports.decryDes = function(e, t) {
        var n = r.enc.Utf8.parse(t),
            o = e.toString();
        o = decodeURIComponent(decodeURIComponent(e));
        var p = r.AES.decrypt(o, n, {
            iv: n,
            mode: r.mode.ECB,
            padding: r.pad.Pkcs7
        });
        return r.enc.Utf8.stringify(p).toString()
    }, exports.getSign = function(e) {
        for (var t = Object.keys(e).sort(), n = "", o = 0; o < t.length; o++) n += t[o] + "=" + e[t[o]], o != t.length - 1 && (n += "&");
        var p = r.enc.Utf8.parse(wx.getStorageSync("tv_keyID")),
            s = r.enc.Utf8.parse(wx.getStorageSync("tv_keyID")),
            c = r.AES.encrypt(n, p, {
                iv: s,
                mode: r.mode.ECB,
                padding: r.pad.Pkcs7
            }).toString();
        return c = encodeURIComponent(c), encodeURIComponent(c)
    };
    wx.getStorageSync("tv_keyID") || wx.setStorageSync("tv_keyID", s), null == wx.getStorageSync("tv_bID") ? (exports.tv_bID = c = p(), wx.setStorageSync("tv_bID", c)) : exports.tv_bID = c = wx.getStorageSync("tv_bID");
});


define("configs/request.js", function(require, module, exports, window, document, frames, self, location, navigator, localStorage, history, Caches, screen, alert, confirm, prompt, XMLHttpRequest, WebSocket, Reporter, webkit, WeixinJSCore) {
    "use strict";
    require("../@babel/runtime/helpers/Arrayincludes");
    var e = require("./utils"),
        t = require("./enums"),
        o = require("./encrypt"),
        s = function() {
            wx.showModal({
                content: "当前登录已过期，请重新登录",
                confirmColor: "#c20000",
                showCancel: !1,
                confirmText: "重新登录",
                success: function() {
                    (0, e.loginClear)(), (0, e.loginToken)("expire"), wx.navigateTo({
                        url: "/package_user/pages/login/login"
                    })
                }
            })
        },
        a = 0,
        n = ["pages/checkin/list/list", "package_user/pages/user/flightDelay/result/result", "package_ticket/pages/ticket/fill/fill", "package_other/pages/changeUpgrade/list/list", "package_user/pages/coupon/receive/receive", "package_other/pages/activity/point/assist/assist", "package_other/pages/activity/point/assist/assist", "package_other/pages/activity/index/index", "package_other/pages/activity/point/assistPost/index", "package_other/pages/activity/detail/index", "package_other/pages/sepcialService/speciialFood/seletFood/index"],
        i = ["tribe/ticket/query", "tribe/ticket/addItem", "tribe/ticket/passengerAndInsurance", "tribe/ticket/commitOrder"],
        r = ["-102", "-11", "-12", "-200", "E190017", "E190018", "040009", "E190005", "000003", "000004", "E102006"];
    module.exports = function(c, l, u) {
        (c = c || {}).method = c.method || "POST", c.header = c.header || {}, c.header.Accept = c.header.Accept || "application/json", c.header["content-type"] = c.header["content-type"] || "application/json;charset:utf-8;";
        var d = c.data,
            g = getCurrentPages(),
            f = g[g.length - 1],
            p = g.length > 0 && f && "pages/ticket/index/index" === f.route,
            h = (0, e.getStore)("tv_login"),
            w = Number((0, e.getStore)("tv_timediff"));
        if (d.timestamp = Date.parse(new Date) / 1e3 - w, (0, e.getStore)("tv_preTime")) {
            var C = (0, e.getStore)("tv_preTime"),
                x = c.url.split(getApp().globalData.servsers)[1];
            if (d.timestamp - C > 300 && -1 !== x.indexOf(i));
            else if (d.timestamp - C > 7200 - Math.abs(w)) return 0 == h || !h || p ? ((0, e.loginClear)(), (0, e.loginToken)("expire")) : l || p ? s() : wx.showModal({
                content: "由于您长时间未操作，页面可能发生变化，请稍后重试",
                confirmColor: "#c20000",
                showCancel: !1,
                confirmText: "确定",
                success: function() {
                    (0, e.loginClear)(), (0, e.loginToken)("expire"), wx.navigateBack()
                }
            }), !1
        }
        if ((0, e.getStore)("tv_token")) {
            if (c.data.token = (0, e.getStore)("tv_token"), c.data.strValue = JSON.stringify(d.strValue), c.data.sign = o.getSign(d), 1 !== l || 0 != h && h) {
                var m = this,
                    k = function(e, t) {
                        e = !!e, t = !!t, 1 === u && (t ? m.setData({
                            isLoading: e
                        }) : m.setData({
                            isLoading: e,
                            isError: !e
                        }))
                    };
                k(!0, !1);
                var v = c.success;
                return c.success = function(o, s, i) {
                    if (k(!1, !0), 502 !== o.statusCode && 504 !== o.statusCode)
                        if (-1 != o.data.statusCode)
                            if ("-1101" != o.data.statusCode) {
                                if (0 == o.data.statusCode)(0, e.setStore)("tv_preTime", d.timestamp);
                                else {
                                    if ("-103" == o.data.statusCode) return wx.showLoading({
                                        title: "正在登录"
                                    }), setTimeout((function() {
                                        wx.hideLoading()
                                    }), 2e3), ++a < 10 && ((0, e.loginClear)(), void(0, e.loginToken)("gologin"));
                                    if ("-110" == o.data.statusCode)
                                        if (g.length > 0 && f && -1 == f.route.indexOf("login") && -1 == f.route.indexOf("ticketInfo") && -1 == f.route.indexOf("userInfo")) {
                                            var l = "";
                                            if (m) {
                                                var u = "{}" === JSON.stringify(m.options) ? "" : "?" + (0, e.generateParams)(m.options);
                                                l = m.route + u
                                            }
                                            l = "/" + l, wx.showModal({
                                                content: "当前登录已过期，请重新登录",
                                                confirmColor: "#c20000",
                                                showCancel: !1,
                                                success: function() {
                                                    return (0, e.setStore)("tv_login", "0"), (0, e.loginClear)(), wx.navigateTo({
                                                        url: "/package_user/pages/login/login?path=" + encodeURIComponent(l)
                                                    }), !1
                                                }
                                            })
                                        } else "-1101" == o.data.statusCode && wx.showModal({
                                            content: "当前登录已过期，请重新登录",
                                            confirmColor: "#c20000",
                                            showCancel: !1,
                                            success: function() {
                                                return (0, e.loginClear)(), (0, e.loginToken)("gologin"), !1
                                            }
                                        });
                                    else -1 !== t.sysErrorCode.indexOf(o.data.statusCode) ? "-111" == o.data.statusCode ? wx.showModal({
                                        content: o.data.statusMsg,
                                        showCancel: !1,
                                        confirmColor: "#c20000",
                                        success: function() {
                                            return !1
                                        }
                                    }) : "-500" == o.data.statusCode ? p || wx.showModal({
                                        content: "抱歉，遇到些问题！发生未知错误，您可返回主页再次预订。",
                                        confirmText: "返回首页",
                                        confirmColor: "#c20000",
                                        showCancel: !1,
                                        success: function() {
                                            return wx.switchTab({
                                                url: "/pages/ticket/index/index"
                                            }), !1
                                        }
                                    }) : p || wx.showModal({
                                        content: "系统异常",
                                        confirmText: "返回首页",
                                        confirmColor: "#c20000",
                                        showCancel: !1,
                                        success: function() {
                                            return wx.switchTab({
                                                url: "/pages/ticket/index/index"
                                            }), !1
                                        }
                                    }) : !o.data || t.sysErrorCode.includes(o.data.statusCode) || r.includes(o.data.statusCode) ? c.url.indexOf("getBoardingPassStatus") > -1 && wx.showModal({
                                        content: o.data.statusMsg,
                                        confirmColor: "#c20000",
                                        showCancel: !1,
                                        success: function() {}
                                    }) : g.length > 0 && f && !n.includes(f.route) && (c.url.indexOf("/live/") > -1 ? o.data.errcode : wx.showModal({
                                        content: o.data.statusMsg,
                                        confirmColor: "#c20000",
                                        showCancel: !1
                                    }))
                                }
                                v && v(o.data, s, i);
                                var h = c.fail;
                                c.fail = function(e) {
                                    k(!1, !1), h && (wx.showModal({
                                        content: e,
                                        confirmColor: "#c20000",
                                        showCancel: !1,
                                        success: function() {}
                                    }), h(e))
                                }
                            } else wx.showModal({
                                content: "当前登录已过期，请重新登录",
                                confirmColor: "#c20000",
                                showCancel: !1,
                                success: function() {
                                    (0, e.loginClear)(), (0, e.loginToken)("gologin")
                                }
                            });
                    else wx.showModal({
                        content: o.data.statusMsg,
                        confirmText: "确定",
                        confirmColor: "#sc20000",
                        showCancel: !1,
                        success: function() {}
                    });
                    else wx.showModal({
                        content: "服务器连接超时，请稍后重试",
                        confirmColor: "#c20000",
                        showCancel: !1,
                        success: function() {}
                    })
                }, wx.request(c)
            }
            s()
        } else(0, e.loginToken)("expire")
    };
});