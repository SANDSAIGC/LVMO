// miniprogram/pages/auth/confirm.js
Page({
  data: {
    userInfo: {}
  },

  onLoad() {
    const app = getApp()
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  confirmLogin() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  editProfile() {
    wx.navigateTo({
      url: '/pages/user/profile'
    })
  }
})