// miniprogram/pages/service/service.js
Page({
  data: {
    services: [
      { id: 1, name: '颈部按摩', icon: 'neck', duration: 15 },
      { id: 2, name: '背部按摩', icon: 'back', duration: 20 },
      { id: 3, name: '腰部按摩', icon: 'waist', duration: 15 },
      { id: 4, name: '全身放松', icon: 'full', duration: 30 },
      { id: 5, name: '深度解压', icon: 'deep', duration: 25 },
      { id: 6, name: '快速唤醒', icon: 'energy', duration: 10 }
    ],
    favorites: [1, 3]
  },

  onLoad() {
    // 从全局状态获取设备连接状态
    const app = getApp()
    if (!app.globalData.deviceInfo.connected) {
      wx.showToast({
        title: '请先连接设备',
        icon: 'none',
        duration: 2000,
        complete: () => {
          setTimeout(() => {
            wx.switchTab({ url: '/pages/connect/connect' })
          }, 2000)
        }
      })
    }
  },

  selectService(e) {
    const serviceId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/massage/massage?serviceId=${serviceId}`
    })
  },

  toggleFavorite(e) {
    const serviceId = e.currentTarget.dataset.id
    const { favorites } = this.data
    const index = favorites.indexOf(serviceId)
    
    if (index >= 0) {
      favorites.splice(index, 1)
    } else {
      favorites.push(serviceId)
    }
    
    this.setData({ favorites: [...favorites] })
    wx.setStorageSync('favoriteServices', favorites)
  }
})