import { getRanksRequest } from "../../services/ranks.js";

const app = getApp();

Page({
  data: {
    feedbackContent: ""
  },
  onLoad: function() {
    getRanksRequest({
      offset: this.data.offset,
      count: this.data.count
    }).then(res => {
      if (res.success) {
        this.updateData(res.data);
      }
    });
  },
  bindTextAreaInput: function(e) {
    this.setData({
      feedbackContent: e.detail.value
    });
  },
  bindSubmit: function() {
    console.log(this.data.feedbackContent);
  }
});
