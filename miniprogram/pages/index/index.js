// miniprogram/pages/index/index.js
Page({
  data: {
    deviceStatus: 'unconnected', // 'unconnected', 'connecting', 'connected'
    deviceName: '旅摩智能按摩座驾 S1', // Example device name
    userInfo: null, // Store user info if needed
    quickActions: [
      { id: 'connect', name: '连接设备', icon: '/images/icons/bluetooth.png', page: '/pages/connect/connect' },
      { id: 'services', name: '选择服务', icon: '/images/icons/massage.png', page: '/pages/service/service' },
      { id: 'history', name: '历史记录', icon: '/images/icons/history.png', page: '/pages/history/history' },
      { id: 'profile', name: '个人中心', icon: '/images/icons/profile.png', page: '/pages/user/user' } // Assuming a user page
    ]
  },
  onLoad(options) {
    // Simulate fetching device status or user info
    // In a real app, you'd get this from storage or an API
  },
  connectDevice() {
    wx.navigateTo({ url: '/pages/connect/connect' });
  },
  navigateToPage(event) {
    const page = event.currentTarget.dataset.page;
    if (page) {
      wx.navigateTo({ url: page });
    }
  }
});
