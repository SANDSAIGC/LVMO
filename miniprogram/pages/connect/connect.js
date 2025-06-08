// miniprogram/pages/connect/connect.js
Page({
  data: {
    isScanning: false,
    bluetoothEnabled: true, // Assume enabled by default, should be checked
    devices: [
      // Example data, replace with actual scan results
      { deviceId: 'XX:XX:XX:XX:XX:01', name: '旅摩按摩椅 A1', RSSI: -45, connected: false },
      { deviceId: 'XX:XX:XX:XX:XX:02', name: '旅摩按摩椅 S1 Pro', RSSI: -60, connected: false },
      { deviceId: 'XX:XX:XX:XX:XX:03', name: '旅摩车载伴侣', RSSI: -75, connected: true } // Example of a connected device
    ],
    connectedDeviceId: 'XX:XX:XX:XX:XX:03' // Store the ID of the currently connected device
  },

  onLoad(options) {
    // TODO: Initialize Bluetooth adapter, check Bluetooth status
    // For now, just simulate
    if (!this.data.bluetoothEnabled) {
      wx.showToast({ title: '请先开启蓝牙', icon: 'none' });
    } else {
      this.startScan();
    }
  },

  startScan() {
    if (!this.data.bluetoothEnabled) {
      wx.showToast({ title: '蓝牙未开启', icon: 'none' });
      return;
    }
    this.setData({ isScanning: true, devices: [] }); // Clear previous devices
    wx.showLoading({ title: '正在扫描...' });

    // TODO: Implement actual wx.startBluetoothDevicesDiscovery
    setTimeout(() => { // Simulate discovery
      this.setData({
        isScanning: false,
        devices: [
          { deviceId: 'AA:BB:CC:DD:EE:01', name: '旅摩智能座垫 X1', RSSI: -50, connected: false },
          { deviceId: 'AA:BB:CC:DD:EE:02', name: '车载按摩专家 Pro', RSSI: -65, connected: false },
        ]
      });
      wx.hideLoading();
      if (this.data.devices.length === 0) {
        wx.showToast({ title: '未发现设备', icon: 'none' });
      }
    }, 3000);
  },

  connectToDevice(event) {
    const { deviceId, name } = event.currentTarget.dataset.device;
    // TODO: Implement actual wx.createBLEConnection
    wx.showLoading({ title: `正在连接 ${name}...` });
    setTimeout(() => { // Simulate connection
      wx.hideLoading();
      wx.showToast({ title: `${name} 连接成功`, icon: 'success' });
      this.setData({
        connectedDeviceId: deviceId,
        // Update the specific device's connected status in the list
        devices: this.data.devices.map(dev => {
          if (dev.deviceId === deviceId) {
            return { ...dev, connected: true };
          }
          // If another device was connected, mark it as disconnected
          if (dev.connected && dev.deviceId !== deviceId) {
              return { ...dev, connected: false};
          }
          return dev;
        })
      });
      // Navigate back or to another page upon successful connection
      // wx.navigateBack();
    }, 2000);
  },

  disconnectDevice(event) {
    const { deviceId, name } = event.currentTarget.dataset.device;
    // TODO: Implement actual wx.closeBLEConnection
    wx.showLoading({ title: `正在断开 ${name}...` });
    setTimeout(() => { // Simulate disconnection
      wx.hideLoading();
      wx.showToast({ title: `${name} 已断开`, icon: 'none' });
      this.setData({
        connectedDeviceId: null,
        devices: this.data.devices.map(dev => {
          if (dev.deviceId === deviceId) {
            return { ...dev, connected: false };
          }
          return dev;
        })
      });
    }, 1000);
  },

  onUnload() {
    // TODO: Stop Bluetooth discovery if it's running
    // wx.stopBluetoothDevicesDiscovery()
  }
});
