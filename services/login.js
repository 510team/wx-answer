import { Login, SaveUserInfo } from "../config/index.js";
import httpRequest from "../utils/request.js";

const loginApi = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            success: res => {
                if (res.code) {
                    resolve(res.code);
                } else {
                    reject(res.errMsg);
                }
            }
        });
    });
}
const loginServer = (code) => {
    //根据code 换取 openid
    return new Promise((resolve, reject) => {
        wx.request({
            url: Login.url, //仅为示例，并非真实的接口地址
            data: {
                code
            },
            success: function (res) {
                resolve(res);
                //getUserInfo.call(this, this);
            }
        });
    });
}
const setUserInfo = (rawData, signature) => {
    return httpRequest({
        method: SaveUserInfo.method,
        data: { rawData, signature },
        url: SaveUserInfo.url
    }).then(data => {
        console.log(data);
    });
}

const getUserInfo = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: res => {
                if (res.authSetting["scope.userInfo"]) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            resolve(res);
                        }
                    });
                }
            }
        });
    })
}


export { loginApi, loginServer, setUserInfo, getUserInfo }