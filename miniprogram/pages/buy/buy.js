const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buyData: [],
    totalPrice: 0.00,
    totalNum: 0,
    message: '',
    show: false,
    password: '',
    friendShow: false,
    numberPeople: '1人',
    people: [{
        name: '1人',
      },
      {
        name: '2~4人',
      },
      {
        name: '4~6人'
      },
      {
        name: '6~8人'
      }
    ],
    tableShow: false,
    table: '1号桌',
    tableNum: [{
        name: '1号桌',
      },
      {
        name: '2号桌',
      },
      {
        name: '3号桌'
      },
      {
        name: '4号桌'
      },
      {
        name: '5号桌'
      },
      {
        name: '6号桌'
      }
    ]
  },
  openPeople(event) {
    this.setData({
      friendShow: true
    })
  },
  openTable() {
    this.setData({
      tableShow: true
    })
  },
  onPeopleSelect(event) {
    this.setData({
      numberPeople: event.detail.name
    })
  },
  onTableSelect(event) {
    this.setData({
      table: event.detail.name
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    db.collection('cart').get().then(res => {
      let buyData = res.data
      const price = buyData.reduce((allPrice, data) => {
        return allPrice += data.price * data.count
      }, 0)
      let totalNum = 0
      buyData.forEach(item => {
        totalNum += item.count
      })


      this.setData({
        buyData: buyData,
        totalPrice: price.toFixed(2),
        totalNum: totalNum
      })
    }).catch(err => {
      console.log(err);
    })
  },
  // 提交订单弹出付款
  onSubmit() {
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false,
      friendShow: false,
      tableShow: false
    })
  },
  async payment(event) {
    // console.log(event);
    if (event.detail.length == 6) {
      if (event.detail == 123456) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        })
        this.setData({
          password: ''
        })
        wx.cloud.callFunction({
          name: 'add_order',
          data: {
            table: this.data.table,
            people: this.data.numberPeople,
            price: this.data.totalPrice,
            count: this.data.totalNum
          }
        })
        let data = []
        // 将菜单数据还原
        await db.collection('menu').get().then(res => {
          data = res.data
          db.collection('menu').skip(20).get().then(res => {
            let newData = res.data
            newData.forEach(item => {
              data.push(item)
            })
            data.forEach(item => {
              if (item.count != 0) {
                wx.cloud.callFunction({
                  name: 'add_count',
                  data: {
                    id: item.id,
                    count: -item.count,
                    dataName: 'menu'
                  }
                }).then(res => {
                  console.log(res);
                })
              }
            })
          })
        })
        // 清空购物车
        await db.collection('cart').get().then(res => {
          let cart = res.data
          cart.forEach(item => {
            wx.cloud.callFunction({
              name: 'add_count',
              data: {
                id: item.id,
                count: -item.count,
                dataName: "cart"
              }
            }).then(res => {
              console.log(res);
              wx.cloud.callFunction({
                name: 'remove_cart',
                data: {}
              }).then(res => {
                console.log('删除成功');
                wx.redirectTo({
                  url: '/pages/orderList/orderList',
                })
              })
            })
          })
        })
      } else {
        wx.showToast({
          title: '密码错误',
          icon: 'error',
          duration: 2000
        })
      }
    }
  }
})