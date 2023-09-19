// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let cartShop = await db.collection('menu').where({
    id: event.id
  }).get()

  let newCartShop = await db.collection('cart').where({
    id: event.id
  }).get()

  const a = cartShop.data[0].count

  // return newCartShop.data.length

  if (newCartShop.data.length !== 0) {
    return await db.collection('cart').where({
      id: event.id
    }).update({
      data:{
        count: a
      }
    })
  }

  return await db.collection('cart').add({
    data: {
      id: cartShop.data[0].id,
      img: cartShop.data[0].img,
      name: cartShop.data[0].name,
      price: cartShop.data[0].price,
      count: cartShop.data[0].count
    }
  })
}