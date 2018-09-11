import { getRanksRequest } from "../../services/ranks.js";

const app = getApp();

Page({
  data: {
    rankList: [],
    currentRank: 1,
    score: 0,
    level: "",
    user: {},
    offset: 0,
    count: 20,
    amount: 0,
    isHideLoadMore: true,
    isHideLoadAll: true
  },
  onLoad: function() {
    wx.showShareMenu({
      withShareTicket: true
    });
    getRanksRequest({
      offset: this.data.offset,
      count: this.data.count
    }).then(res => {
      if (res.success) {
        this.updateData(res.data);
      }
    });
  },
  //下拉刷新
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    this.setData({ offset: 0, isHideLoadMore: true });
    getRanksRequest({ offset: this.data.offset, count: this.data.count }).then(
      res => {
        if (res.success) {
          this.setData({
            rankList: res.data.rankList,
            offset: this.data.offset + this.data.count
          });
        }
        wx.hideNavigationBarLoading(); //在标题栏中停止加载
        wx.stopPullDownRefresh(); //停止下拉刷新
      }
    );
  },
  //加载更多
  onReachBottom: function() {
    if (this.data.amount > this.data.offset) {
      this.setData({ isHideLoadMore: false });
      getRanksRequest({
        offset: this.data.offset,
        count: this.data.count
      }).then(res => {
        if (res.success) {
          this.updateData(res.data);
          this.setData({ isHideLoadMore: true });
        }
      });
    } else {
      this.setData({ isHideLoadAll: false });
    }
  },
  updateData: function(data) {
    this.setData({
      rankList: [...this.data.rankList, ...data.rankList],
      currentRank: data.currentRank,
      score: data.score,
      level: data.level,
      user: data.user,
      offset: this.data.offset + this.data.count,
      amount: data.amount
    });
  }
});
