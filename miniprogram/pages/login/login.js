// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  login() {
    wx.getUserProfile({
      desc: '获取您的授权信息',
    }).then(res => {
      console.log(res);
      getApp().globalData.isLogin = true
      let userInfo = res.userInfo
      wx.setStorageSync('userInfo', userInfo)
      wx.showToast({
        title: '授权成功',
        icon: 'success'
      })
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }, 500)
     
    }).catch(err => {
      console.log(err);
    })
  }
})