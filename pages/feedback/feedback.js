import { addFeedbackRequest } from "../../services/feedback.js";

const app = getApp();

Page({
  data: {
    btnLoading: false,
    feedbackContent: "",
    backgroundUrl: ""
  },
  onLoad: function() {
    this.setData({ backgroundUrl: app.globalData.background });
  },
  bindTextAreaInput: function(e) {
    this.setData({
      feedbackContent: e.detail.value
    });
  },
  bindSubmit: function(e) {
    this.setData({
      btnLoading: true
    });
    addFeedbackRequest({
      content: e.detail.value.feedbackContent.trim()
    }).then(res => {
      if (res.success) {
        this.setData({
          btnLoading: false,
          feedbackContent: ""
        });
        this.showToast("提交成功，感谢您的反馈");
      } else {
        console.log("fail");
        this.showToast("提交失败，请稍后再试");
      }
    });
    wx.reportAnalytics("action_tap_feedback");
  },
  viewImage: function(e) {
    const src = e.target.dataset.src;
    wx.previewImage({
      urls: [src],
      success: function(data) {
        wx.getImageInfo({
          src: src,
          success: function(res) {
            wx.saveImageToPhotosAlbum({
              filePath: res.path,
              success: function() {
                console.log("save photo success");
              },
              fail: function() {
                console.log("save photo failed");
              }
            });
            // wx.getSetting({
            //   success: function(result) {
            //     // if (!result.authSetting["scope.writePhotosAlbum"]) {
            //     //   wx.authorize({
            //     //     scope: "scope.writePhotosAlbum",
            //     //     success: function() {
            //     //       wx.saveImageToPhotosAlbum({
            //     //         filePath: res.path,
            //     //         success: function() {
            //     //           console.log("save photo success");
            //     //         },
            //     //         fail: function() {
            //     //           console.log("save photo failed");
            //     //         }
            //     //       });
            //     //     }
            //     //   });
            //     // } else {
            //     //   wx.saveImageToPhotosAlbum({
            //     //     filePath: res.path,
            //     //     success: function() {
            //     //       console.log("save photo success");
            //     //     },
            //     //     fail: function() {
            //     //       console.log("save photo failed");
            //     //     }
            //     //   });
            //     // }
            //   },
            //   fail: function() {
            //     console.log("authsetting failed");
            //   }
            // });
          }
        });
      },
      fail: function() {
        console.log("fail");
      }
    });
  },
  showToast: function(title, icon = "none", duration = 2000) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration
    });
  }
});
