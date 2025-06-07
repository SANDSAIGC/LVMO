// miniprogram/pages/auth/login.js
Page({
  data: {
    canIUseGetUserProfile: false,
    userInfo: {},
    isAgreed: false
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  handleAgreementChange(e) {
    this.setData({
      isAgreed: e.detail.value.length > 0
    })
  },

  getUserProfile(e) {
    if (!this.data.isAgreed) {
      wx.showToast({
        title: '请先阅读并同意协议',
        icon: 'none'
      })
      return
    }

    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        const app = getApp()
        app.saveUserInfo(res.userInfo)
        wx.navigateTo({
          url: '/pages/auth/confirm'
        })
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err)
        wx.showToast({
          title: '授权失败，请重试',
          icon: 'error'
        })
      }
    })
  },

  navigateToService() {
    wx.switchTab({
      url: '/pages/service/service'
    })
  }
})