const db = wx.cloud.database()
const app = getApp()

// pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store: {},
    sidebar: [],
    cartList: [],
    menu: [],
    newMenu: [
      [],
      [],
      [],
      [],
      [],
      []
    ],
    shopCart: [],
    activeKey: 0,
    toView: '',
    totalPrice: 0,
    totalNum: 0.00,
    show: false
  },
  showPopup() {
    this.setData({
      show: !this.data.show
    })
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  async onLoad(options) {
    const isLogin = app.globalData.isLogin
    if (!isLogin) {
      wx.showToast({
        title: '请先登录',
        icon: 'error'
      })
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }, 500)
      return
    }
    // 店铺数据
    db.collection('store').get({
      success: res => {
        this.setData({
          store: res.data[0]
        })
      }
    })
    // 侧边栏数据
    db.collection('sidebar').get({
      success: res => {
        this.setData({
          sidebar: res.data
        })
      }
    })
    // 菜单数据
    db.collection('menu').get().then(res => {
        this.setData({
          menu: res.data
        })
        db.collection('menu').skip(20).get().then(res => {
          let data = res.data
          data.forEach(item => {
            this.data.menu.push(item)
          })
          let newMenu = this.data.newMenu
          for (let i = 0; i < newMenu.length; i++) {
            newMenu[i] = this.data.menu.slice(i * 5, i * 5 + 5)
          }
          this.setData({
            newMenu: [...newMenu]
          })
        })
      }).catch(err => {
        console.log(err);
      }),
      // 购物车数据
      await db.collection('cart').get().then(res => {
        this.setData({
          shopCart: res.data
        })
      }).catch(err => {
        console.log(err);
      })
    // 监听菜单数据变化
    const menuWather = db.collection('menu').watch({
      onChange: (snapshot) => {
        let menu = snapshot.docs
        let newMenu = this.data.newMenu
        for (let i = 0; i < newMenu.length; i++) {
          newMenu[i] = menu.slice(i * 5, i * 5 + 5)
        }
        this.setData({
          newMenu: [...newMenu]
        })
      },
      onError(err) {
        console.log(err);
      }
    })
    // 监听购物车数据变化
    const cartWather = db.collection('cart').watch({
      onChange: (snapshot) => {
        console.log(snapshot);
        let cart = snapshot.docs
        let totalNum = cart.length
        // 计算总价
        const allPrice = cart.reduce((c, b) => {
          return c += b.price * b.count
        }, 0)

        this.setData({
          shopCart: cart,
          totalPrice: allPrice.toFixed(2),
          totalNum: totalNum
        })
      },
      onError(e) {
        console.log(e);
      }
    })

    this.wather = [menuWather, cartWather]
  },
  // 侧边栏发生变化时
  onChange(e) {
    const index = e.detail;
    this.setData({
      activeKey: index,
      toView: this.data.sidebar[index].id
    })
  },
  // 监听页面变化
  onShow(options) {
    this.setData({
      newMenu: this.data.newMenu
    })
  },

  // 滚动事件
  onContentScroll(e) {
    const scrollTop = e.detail.scrollTop;
    let list = [];
    wx.createSelectorQuery().selectAll('.menu-list').boundingClientRect(rects => {
      list = [...rects];
      let startHeight = 0;
      for (let i = 0; i < list.length; i++) {
        if (i === 0) {
          startHeight = 0
        } else {
          startHeight += list[i - 1].height
        }
        let endHeight = startHeight + list[i].height;

        if (scrollTop >= startHeight && scrollTop <= endHeight) {
          this.setData({
            activeKey: i
          })
        }
      }
    }).exec()
  },
  // 添加商品
  onAdd(e) {
    let id = e.currentTarget.dataset.id
    let cart = this.data.shopCart
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'add_count',
      data: {
        id: id,
        count: 1,
        dataName: 'menu'
      }
    }).then(res => {
      wx.hideLoading()
      wx.cloud.callFunction({
        name: 'add_cart',
        data: {
          id: id
        }
      })
    })
  },
  // 减少商品
  onReduce(e) {
    let id = e.currentTarget.dataset.id
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'add_count',
      data: {
        id: id,
        count: -1,
        dataName: 'menu'
      }
    }).then(res => {
      wx.hideLoading()
      wx.cloud.callFunction({
        name: 'add_cart',
        data: {
          id: id
        }
      }).then(res => {
        wx.cloud.callFunction({
          name: 'remove_cart',
          data: {}
        })
      })
    })
  },
  // 跳转到付款页面
  goBuy() {
    console.log(this.data.shopCart);
    if (this.data.shopCart.length === 0) {
      wx.showToast({
        icon: 'error',
        title: '请选择商品',
        mask: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/buy/buy',
      })
    }


  },
  onUnload() {
    for (let i = 0; i < this.wather.length; i++) {
      if (this.wather[i]) {
        this.wather[i].close()
      }
    }
  }
})