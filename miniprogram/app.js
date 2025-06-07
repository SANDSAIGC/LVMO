// app.js
App({
  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'sands-0guvvxuy305fdeff',
        traceUser: true,
      })
    }

    // 检查更新
    this.checkForUpdate()
    
    // 获取系统信息
    this.getSystemInfo()
  },

  onShow() {
    // 小程序显示时的逻辑
    console.log('小程序显示')
  },

  onHide() {
    // 小程序隐藏时的逻辑
    console.log('小程序隐藏')
  },

  /**
   * 检查小程序更新
   */
  checkForUpdate() {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      console.log('检查更新结果:', res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      console.log('新版本下载失败')
    })
  },

  /**
   * 获取系统信息
   */
  getSystemInfo() {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res
        console.log('系统信息:', res)
      },
      fail: (err) => {
        console.error('获取系统信息失败:', err)
      }
    })
  },

  /**
   * 全局数据
   */
  globalData: {
    userInfo: null,
    openid: null,
    systemInfo: null,
    deviceInfo: {
      connected: false,
      deviceId: null,
      deviceName: null,
      batteryLevel: 0
    },
    massageStatus: {
      isRunning: false,
      currentMode: null,
      remainingTime: 0,
      intensity: 50,
      temperature: 25
    }
  },

  /**
   * 获取用户OpenID
   */
  async getOpenId() {
    if (this.globalData.openid) {
      return this.globalData.openid
    }

    try {
      const res = await wx.cloud.callFunction({
        name: 'getOpenId'
      })
      
      if (res.result && res.result.openid) {
        this.globalData.openid = res.result.openid
        return res.result.openid
      }
    } catch (error) {
      console.error('获取OpenID失败:', error)
    }
    
    return null
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    return new Promise((resolve) => {
      wx.checkSession({
        success: () => {
          // session有效
          if (this.globalData.userInfo) {
            resolve(true)
          } else {
            // 尝试从本地存储获取用户信息
            const userInfo = wx.getStorageSync('userInfo')
            if (userInfo) {
              this.globalData.userInfo = userInfo
              resolve(true)
            } else {
              resolve(false)
            }
          }
        },
        fail: () => {
          // session失效，需要重新登录
          resolve(false)
        }
      })
    })
  },

  /**
   * 保存用户信息
   */
  saveUserInfo(userInfo) {
    this.globalData.userInfo = userInfo
    wx.setStorageSync('userInfo', userInfo)
  },

  /**
   * 清除用户信息
   */
  clearUserInfo() {
    this.globalData.userInfo = null
    this.globalData.openid = null
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('openid')
  },

  /**
   * 显示加载提示
   */
  showLoading(title = '加载中...') {
    wx.showLoading({
      title: title,
      mask: true
    })
  },

  /**
   * 隐藏加载提示
   */
  hideLoading() {
    wx.hideLoading()
  },

  /**
   * 显示提示信息
   */
  showToast(title, icon = 'none', duration = 2000) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration
    })
  }
})