import Toast from '@vant/weapp/toast/toast';
const app = getApp()
// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const isLogin = app.globalData.isLogin
    if (!isLogin) {
      wx.showToast({
        title: '请先登录',
        icon: 'error'
      })
      setTimeout(()=>{
        wx.redirectTo({
          url: '/pages/login/login',
        })
      },500)
      return
    }
    let user = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: user
    })
  },
  onList() {
    wx.navigateTo({
      url: '/pages/orderList/orderList',
    })
  },
  backLogin(){
    wx.removeStorageSync('userInfo')
    
  }
})