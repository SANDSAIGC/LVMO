/**
 * 云函数测试脚本
 * 用于验证云函数功能是否正常
 */

// 测试数据
const testData = {
  // 测试按摩记录
  massageRecord: {
    chairId: "chair_001",
    mode: "舒缓模式",
    intensity: 3,
    duration: 20,
    actualDuration: 18,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 18 * 60 * 1000).toISOString(),
    satisfaction: 4,
    notes: "测试按摩记录 - 感觉很舒服"
  }
}

console.log('云函数测试数据准备完成')
console.log('测试数据:', JSON.stringify(testData, null, 2))

// 使用说明
console.log(`
使用说明：
1. 在微信开发者工具中打开云开发控制台
2. 进入云函数管理页面
3. 选择对应的云函数进行测试
4. 使用以上测试数据进行功能验证

测试用例：
- getOpenId: 无需参数，直接调用
- massageRecord (添加): { action: "add", data: testData.massageRecord }
- massageRecord (查询): { action: "list", data: {} }
- massageRecord (统计): { action: "stats", data: { period: "month" } }
`)