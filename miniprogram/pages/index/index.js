// pages/index/index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    store: [],
    label: [],
    popularity: [],
    
    tabs: [{
        ft_name: "推荐",
        ft_id: "a"
      },
      {
        ft_name: "锡纸饭套餐",
        ft_id: "b"
      },
      {
        ft_name: "锡纸烤饭",
        ft_id: "c"
      },
      {
        ft_name: "精品冷碟",
        ft_id: "d"
      }
    ],
  },
  onLoad(options) {
    db.collection('store').get({
      success: res => {
        console.log(res.data[0]);
        this.setData({
          store: res.data[0]
        })
      }
    })
    db.collection('recommend').get({
      success: res => {
        console.log(res.data);
        this.setData({
          label: res.data
        })
      }
    })
    db.collection('popularity').get({
      success: res => {
        this.setData({
          popularity: res.data
        })
      }
    })


  }
})