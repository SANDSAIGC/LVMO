// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { action, data } = event

  try {
    switch (action) {
      case 'add':
        return await addRecord(data, wxContext.OPENID)
      case 'list':
        return await getRecords(data, wxContext.OPENID)
      case 'update':
        return await updateRecord(data, wxContext.OPENID)
      case 'delete':
        return await deleteRecord(data, wxContext.OPENID)
      default:
        return {
          success: false,
          error: '未知操作类型'
        }
    }
  } catch (error) {
    console.error('云函数执行错误:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 添加按摩记录
async function addRecord(data, openid) {
  const record = {
    ...data,
    userId: openid,
    createTime: new Date(),
    updateTime: new Date()
  }

  const result = await db.collection('massage_records').add({
    data: record
  })

  return {
    success: true,
    data: {
      _id: result._id,
      ...record
    }
  }
}

// 获取按摩记录列表
async function getRecords(data, openid) {
  const { page = 1, limit = 10, startDate, endDate } = data
  
  let query = db.collection('massage_records').where({
    userId: openid
  })

  // 日期筛选
  if (startDate && endDate) {
    query = query.where({
      createTime: _.gte(new Date(startDate)).and(_.lte(new Date(endDate)))
    })
  }

  const result = await query
    .orderBy('createTime', 'desc')
    .skip((page - 1) * limit)
    .limit(limit)
    .get()

  // 获取总数
  const countResult = await db.collection('massage_records')
    .where({ userId: openid })
    .count()

  return {
    success: true,
    data: {
      records: result.data,
      total: countResult.total,
      page,
      limit
    }
  }
}

// 更新按摩记录
async function updateRecord(data, openid) {
  const { _id, ...updateData } = data
  
  const result = await db.collection('massage_records')
    .doc(_id)
    .update({
      data: {
        ...updateData,
        updateTime: new Date()
      }
    })

  return {
    success: true,
    data: result
  }
}

// 删除按摩记录
async function deleteRecord(data, openid) {
  const { _id } = data
  
  const result = await db.collection('massage_records')
    .doc(_id)
    .remove()

  return {
    success: true,
    data: result
  }
}