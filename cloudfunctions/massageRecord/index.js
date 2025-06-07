/**
 * 按摩记录云函数
 * 处理按摩记录的增删改查操作
 */

const cloud = require('wx-server-sdk')

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

/**
 * 云函数入口函数
 */
exports.main = async (event, context) => {
  const { action, data } = event
  const { OPENID } = cloud.getWXContext()

  try {
    switch (action) {
      case 'add':
        return await addMassageRecord(data, OPENID)
      case 'update':
        return await updateMassageRecord(data, OPENID)
      case 'list':
        return await getMassageRecords(data, OPENID)
      case 'delete':
        return await deleteMassageRecord(data, OPENID)
      case 'stats':
        return await getMassageStats(data, OPENID)
      default:
        return {
          success: false,
          message: '不支持的操作类型'
        }
    }
  } catch (error) {
    console.error('云函数执行错误:', error)
    return {
      success: false,
      message: error.message || '服务器内部错误'
    }
  }
}

/**
 * 添加按摩记录
 */
async function addMassageRecord(data, openid) {
  const record = {
    ...data,
    openid,
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
    },
    message: '记录添加成功'
  }
}

/**
 * 更新按摩记录
 */
async function updateMassageRecord(data, openid) {
  const { _id, ...updateData } = data
  
  if (!_id) {
    throw new Error('记录ID不能为空')
  }

  updateData.updateTime = new Date()

  const result = await db.collection('massage_records')
    .where({
      _id,
      openid
    })
    .update({
      data: updateData
    })

  return {
    success: true,
    data: result,
    message: '记录更新成功'
  }
}

/**
 * 获取按摩记录列表
 */
async function getMassageRecords(data, openid) {
  const { page = 1, limit = 20, startDate, endDate } = data || {}
  
  let query = db.collection('massage_records').where({
    openid
  })

  // 日期筛选
  if (startDate || endDate) {
    const dateFilter = {}
    if (startDate) {
      dateFilter[_.gte] = new Date(startDate)
    }
    if (endDate) {
      dateFilter[_.lte] = new Date(endDate)
    }
    query = query.where({
      createTime: dateFilter
    })
  }

  // 分页查询
  const result = await query
    .orderBy('createTime', 'desc')
    .skip((page - 1) * limit)
    .limit(limit)
    .get()

  // 获取总数
  const countResult = await query.count()

  return {
    success: true,
    data: {
      records: result.data,
      total: countResult.total,
      page,
      limit,
      totalPages: Math.ceil(countResult.total / limit)
    },
    message: '获取记录成功'
  }
}

/**
 * 删除按摩记录
 */
async function deleteMassageRecord(data, openid) {
  const { _id } = data
  
  if (!_id) {
    throw new Error('记录ID不能为空')
  }

  const result = await db.collection('massage_records')
    .where({
      _id,
      openid
    })
    .remove()

  return {
    success: true,
    data: result,
    message: '记录删除成功'
  }
}

/**
 * 获取按摩统计数据
 */
async function getMassageStats(data, openid) {
  const { period = 'month' } = data || {}
  
  // 计算时间范围
  const now = new Date()
  let startDate
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1)
      break
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  // 获取时间范围内的记录
  const records = await db.collection('massage_records')
    .where({
      openid,
      createTime: _.gte(startDate)
    })
    .get()

  // 计算统计数据
  const stats = calculateStats(records.data)

  return {
    success: true,
    data: {
      period,
      startDate,
      endDate: now,
      ...stats
    },
    message: '获取统计数据成功'
  }
}

/**
 * 计算统计数据
 */
function calculateStats(records) {
  if (!records || records.length === 0) {
    return {
      totalSessions: 0,
      totalDuration: 0,
      averageDuration: 0,
      favoriteMode: null,
      averageIntensity: 0,
      modeDistribution: {},
      intensityDistribution: {},
      dailyUsage: []
    }
  }

  const totalSessions = records.length
  const totalDuration = records.reduce((sum, record) => {
    return sum + (record.actualDuration || record.duration || 0)
  }, 0)
  const averageDuration = totalDuration / totalSessions

  // 模式分布统计
  const modeDistribution = {}
  records.forEach(record => {
    const mode = record.mode || 'unknown'
    modeDistribution[mode] = (modeDistribution[mode] || 0) + 1
  })

  // 最喜欢的模式
  const favoriteMode = Object.keys(modeDistribution).reduce((a, b) => 
    modeDistribution[a] > modeDistribution[b] ? a : b
  )

  // 强度分布统计
  const intensityDistribution = {}
  let totalIntensity = 0
  records.forEach(record => {
    const intensity = record.intensity || 1
    intensityDistribution[intensity] = (intensityDistribution[intensity] || 0) + 1
    totalIntensity += intensity
  })
  const averageIntensity = totalIntensity / totalSessions

  // 每日使用统计（最近7天）
  const dailyUsage = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split('T')[0]
    
    const dayRecords = records.filter(record => {
      const recordDate = new Date(record.createTime).toISOString().split('T')[0]
      return recordDate === dateStr
    })
    
    dailyUsage.push({
      date: dateStr,
      sessions: dayRecords.length,
      duration: dayRecords.reduce((sum, record) => {
        return sum + (record.actualDuration || record.duration || 0)
      }, 0)
    })
  }

  return {
    totalSessions,
    totalDuration: Math.round(totalDuration * 100) / 100,
    averageDuration: Math.round(averageDuration * 100) / 100,
    favoriteMode,
    averageIntensity: Math.round(averageIntensity * 100) / 100,
    modeDistribution,
    intensityDistribution,
    dailyUsage
  }
}