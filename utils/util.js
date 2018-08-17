const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

// 显示繁忙提示
var showBusy = text =>
  wx.showToast({
    title: text,
    icon: "loading",
    duration: 10000
  });

// 显示成功提示
var showSuccess = text =>
  wx.showToast({
    title: text,
    icon: "success",
    duration: 800
  });

// 显示失败提示,需要用户点击
var showModel = (title, content, callback) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content) || "",
    showCancel: false,
    success: callback
  });
};

// 清理storgage

var removeStorage = key => {
  wx.removeStorage({
    key: key,
    success: function(res) {
      console.log(key + "缓存已被清理");
    }
  });
};

module.exports = {
  formatTime,
  showBusy,
  showSuccess,
  showModel,
  removeStorage
};
