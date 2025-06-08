// miniprogram/pages/massage/massage.js
Page({
  data: {
    currentMode: { name: '全身舒展', id: 'mode001' }, // Example, should be passed from service page
    totalDuration: 15 * 60, // seconds (e.g., 15 minutes)
    remainingSeconds: 15 * 60,
    progress: 0, // 0 to 100
    isPaused: false,
    intensity: 3, // Example: 1 to 5
    maxIntensity: 5,
    timerId: null,
    // For body diagram, if used
    activeBodyParts: ['neck', 'back'] // Example
  },

  onLoad(options) {
    // const { modeId, duration } = options; // Get mode and duration from navigation options
    // this.setData({ currentMode: {name: options.modeName, id: options.modeId }, totalDuration: parseInt(options.duration) * 60, remainingSeconds: parseInt(options.duration) * 60 });
    this.startTimer();
    // Mock: Set initial mode if not passed
    if (!options || !options.modeName) {
        this.setData({
            currentMode: { name: '肩颈放松', id: 'mode002' },
            totalDuration: 10 * 60,
            remainingSeconds: 10 * 60,
        });
    } else {
        this.setData({
            currentMode: {name: options.modeName, id: options.modeId },
            totalDuration: parseInt(options.duration) * 60,
            remainingSeconds: parseInt(options.duration) * 60
        });
    }

  },

  onUnload() {
    this.clearTimer();
  },

  startTimer() {
    this.clearTimer(); // Clear existing timer before starting a new one
    const timerId = setInterval(() => {
      if (!this.data.isPaused && this.data.remainingSeconds > 0) {
        const remainingSeconds = this.data.remainingSeconds - 1;
        const progress = ((this.data.totalDuration - remainingSeconds) / this.data.totalDuration) * 100;
        this.setData({
          remainingSeconds,
          progress: Math.min(100, progress) // Ensure progress doesn't exceed 100
        });
      } else if (this.data.remainingSeconds <= 0) {
        this.clearTimer();
        wx.showToast({ title: '按摩已结束', icon: 'success', duration: 2000 });
        // Optionally navigate back or to a summary page
        // setTimeout(() => wx.navigateBack(), 2000);
      }
    }, 1000);
    this.setData({ timerId });
  },

  clearTimer() {
    if (this.data.timerId) {
      clearInterval(this.data.timerId);
      this.setData({ timerId: null });
    }
  },

  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  },

  togglePause() {
    this.setData({ isPaused: !this.data.isPaused });
    if (!this.data.isPaused && this.data.remainingSeconds > 0) {
      this.startTimer(); // Resume timer if it was paused and there's time left
    } else {
      this.clearTimer(); // Pause timer
    }
  },

  increaseIntensity() {
    if (this.data.intensity < this.data.maxIntensity) {
      this.setData({ intensity: this.data.intensity + 1 });
    }
  },

  decreaseIntensity() {
    if (this.data.intensity > 1) {
      this.setData({ intensity: this.data.intensity - 1 });
    }
  },

  stopMassage() {
    wx.showModal({
      title: '确认停止',
      content: '确定要结束当前的按摩吗？',
      success: (res) => {
        if (res.confirm) {
          this.clearTimer();
          this.setData({ remainingSeconds: 0, progress: 100, isPaused: true }); // Mark as finished
          wx.showToast({ title: '按摩已停止', icon: 'none' });
          // setTimeout(() => wx.navigateBack(), 1500);
        }
      }
    });
  }
});
