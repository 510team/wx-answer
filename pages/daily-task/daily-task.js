import {
  signInRequest,
  canSignInRequest,
  canShareRequest,
  shareRequest
} from "../../services/signIn.js";
import { showModal, showToast } from "../../utils/util.js";

const app = getApp();

Page({
  data: {
    btnLoading: false,
    feedbackContent: "",
    backgroundUrl: "",
    canSignIn: false,
    canShare: false
  },
  onLoad: function() {
    this.setData({ backgroundUrl: app.globalData.background });

    canSignInRequest().then(res => {
      if (res.success) {
        this.setData({
          canSignIn: res.can_sign_in
        });
      }
    });
    canShareRequest().then(res => {
      if (res.success) {
        this.setData({
          canShare: res.can_share
        });
      }
    });
    // 是否获取群信息
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  onSignIn: function(e) {
    signInRequest({
      type: e.currentTarget.dataset.type
    }).then(res => {
      if (res.success) {
        this.setData({
          canSignIn: false
        });
        showToast(`签到成功，奉上${res.data.isAweek ? 100 : 20}积分`);
      } else {
        showToast("签到失败，请稍后再试试");
      }
    });
  },
  onShareAppMessage: function(options) {
    const t = this;
    return {
      title: "【你问我猜猜猜】快和我一起来签到，赚取积分换好礼吧",
      path: "pages/index/index",
      imageUrl: "../../assets/image/share.jpg",
      success: function(res) {
        const shareTickets = res.shareTickets; // 只有转发到群聊中打开才可以获取到sharetickets
        if (shareTickets.length == 0) {
          showToast("只有转发到微信群才可以获得积分呦");
          return false;
        }
        // 获取群信息
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function(res) {
            shareRequest().then(res => {
              if (res.success) {
                showToast("转发成功，奉上30积分");
                t.setData({ canShare: false });
              } else {
                showToast("转发失败了，请再试一次");
              }
            });
          },
          fail: function(res) {
            showToast("转发失败了，请再试一次");
          }
        });
      },
      fail: function(res) {
        console.log("转发到群失败");
      }
    };
  }
});
