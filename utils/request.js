const httpRequest = data => {
  return new Promise(function(resolve, reject) {
    console.log("http request", data.url);
    let code = "";
    wx.getStorage({
      key: "code",
      success: res => {
        code = res.data;
        console.log("http request success", code);
        //发起网络请求
        wx.request({
          url: data.url,
          data: { ...data.data },
          method: data.method,
          header: {
            code: code,
            "content-type": "application/x-www-form-urlencoded" // 默认值
          },
          success: function(res) {
            if (res.data.success) {
              resolve(res.data);
            } else {
              // console.log(JSON.stringify(res));
              reject(res.data);
            }
          },
          fail: function(res) {
            console.log(JSON.stringify(res));
            reject(res);
          }
        });
      },
      fail: res => {
        console.log("http request failed", code);
        console.log("not found code in storage");
      }
    });
  });
};

export default httpRequest;
