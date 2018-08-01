const app = getApp();

Page({
  data: {
    rankList: [
      {
        nickName: "lxy",
        score: 100,
        src: "../../assets/image/index_bg@2x.png"
      },
      {
        nickName: "lxy",
        score: 100,
        src: "../../assets/image/index_bg@2x.png"
      }
    ]
  },
  onLoad: function() {
    wx.request({
      url: "test.php",
      data: {
        x: "",
        y: ""
      },
      header: {
        "content-type": "application/json" // 默认值
      },
      success: function(res) {
        this.setData({
          rankList: res.data
        });
      }
    });
  }
});
