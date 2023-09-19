// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let order = await db.collection('cart').get().then(res => {
    return res.data
  })
  let id = await db.collection('order').get().then(res => {
    return res.data.length + 1
  })

  let times = new Date().getTime()

  id = id < 10 ? '0' + id : id

  return await db.collection('order').add({
    data: {
      order: order,
      id: "wxz" + id,
      people: event.people,
      table: event.table,
      times:times,
      price:event.price,
      count:event.count
    }
  })
}