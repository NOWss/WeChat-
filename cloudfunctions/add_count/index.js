// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // console.log(event);
  let count = await db.collection(event.dataName).where({
    id: event.id
  }).get()
  // return count

  return await db.collection(event.dataName).where({
    id: event.id
  }).update({
    data: {
      count: Number(event.count) + Number(count.data[0].count)
    }
  })
}