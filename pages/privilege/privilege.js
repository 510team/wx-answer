import { getUserLevel } from "../../services/game-over";
import { uploadBackground } from "../../config/index.js";
import { showModal, showToast } from "../../utils/util.js";

const app = getApp();

Page({
  data: {
    hasPrivilege: false,
    backgroundUrl: "",
    code: ""
  },
  onLoad: function() {
    this.setData({ backgroundUrl: app.globalData.background });
    wx.getStorage({
      key: "code",
      success: res => {
        this.setData({ code: res.data });
      }
    });
    getUserLevel().then(res => {
      if (res.success) {
        this.setData({
          hasPrivilege: res.current_level.name == "叫兽"
        });
      }
    });
  },
  onPlay: function() {
    wx.redirectTo({
      url: "/pages/answer/answer"
    });
  },
  onUpload: function() {
    const t = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        t.uploadFile(tempFilePaths, t.data.code);
      }
    });
  },
  uploadFile: function(tempFilePaths, code) {
    const t = this;
    wx.uploadFile({
      url: uploadBackground.url,
      filePath: tempFilePaths[0],
      header: {
        "content-Type": "multipart/form-data",
        code: code
      },
      name: "file",
      success: function(res) {
        var data = JSON.parse(res.data);
        if (data.success) {
          showModal({
            title: "上传壁纸成功",
            content: "通过系统审核后即可展示",
            confirmText: "去首页",
            cancelText: "重传一张",
            successFun: function() {
              wx.navigateTo({
                url: "/pages/index/index"
              });
            },
            cancleFun: function() {
              t.onUpload();
            }
          });
        }
      },
      fail: function(res) {
        showToast("不小心上传失败了，请稍后再试试");
      }
    });
  }
});
