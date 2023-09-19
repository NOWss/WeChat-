// pages/orderList/orderList.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
    db.collection('order').get().then(res => {
      let orderList = res.data
      orderList.forEach(item => {
        item.times = this.formatTime(item.times / 1000, 'Y-M-D h:m:s')
      })
      orderList = orderList.reverse()
      this.setData({
        orderList: orderList
      })
    }).catch(err => {
      console.log(err);
    })
  },

  // 时间戳转换日期
  formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  },

  formatTime(number, format) {

    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];

    var date = new Date(number * 1000);
    returnArr.push(date.getFullYear());
    returnArr.push(this.formatNumber(date.getMonth() + 1));
    returnArr.push(this.formatNumber(date.getDate()));

    returnArr.push(this.formatNumber(date.getHours()));
    returnArr.push(this.formatNumber(date.getMinutes()));
    returnArr.push(this.formatNumber(date.getSeconds()));

    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
  }
})