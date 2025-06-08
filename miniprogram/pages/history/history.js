// miniprogram/pages/history/history.js
Page({
  data: {
    historyRecords: [], // Will be populated with grouped records
    isLoading: true,
    // Example raw data structure, in a real app this would come from a database/API
    rawRecords: [
      { id: 'rec001', modeName: '全身舒展', date: '2024-07-15 10:30', duration: 20, cost: 15, deviceId: 'XYZ123' },
      { id: 'rec002', modeName: '肩颈放松', date: '2024-07-15 18:00', duration: 15, cost: 10, deviceId: 'XYZ123' },
      { id: 'rec003', modeName: '腰部按摩', date: '2024-07-14 12:00', duration: 30, cost: 25, deviceId: 'ABC456' },
      { id: 'rec004', modeName: '全身舒展', date: '2024-07-14 09:00', duration: 20, cost: 15, deviceId: 'XYZ123' },
      { id: 'rec005', modeName: '腿部放松', date: '2024-06-20 17:00', duration: 10, cost: 8, deviceId: 'DEF789' }
    ]
  },

  onLoad(options) {
    this.loadHistoryData();
  },

  loadHistoryData() {
    this.setData({ isLoading: true });
    // Simulate fetching data
    setTimeout(() => {
      const grouped = this.groupRecordsByDate(this.data.rawRecords);
      this.setData({ historyRecords: grouped, isLoading: false });
    }, 1000);
  },

  groupRecordsByDate(records) {
    if (!records || records.length === 0) return [];

    const grouped = records.reduce((acc, record) => {
      const dateKey = record.date.split(' ')[0]; // Group by YYYY-MM-DD
      if (!acc[dateKey]) {
        acc[dateKey] = {
          dateDisplay: this.formatDateDisplay(dateKey), // e.g., "2024年7月15日" or "今天", "昨天"
          records: []
        };
      }
      acc[dateKey].records.push({
          ...record,
          timeDisplay: record.date.split(' ')[1] // HH:mm
      });
      return acc;
    }, {});

    // Sort groups by date descending, and records within groups by time descending
    return Object.values(grouped).sort((a, b) => new Date(b.records[0].date) - new Date(a.records[0].date))
                 .map(group => {
                     group.records.sort((ra, rb) => new Date(rb.date) - new Date(ra.date));
                     return group;
                 });
  },

  formatDateDisplay(dateString) { // YYYY-MM-DD
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const recordDate = new Date(dateString);

    if (recordDate.toDateString() === today.toDateString()) return '今天';
    if (recordDate.toDateString() === yesterday.toDateString()) return '昨天';

    const year = recordDate.getFullYear();
    const month = (recordDate.getMonth() + 1).toString().padStart(2, '0');
    const day = recordDate.getDate().toString().padStart(2, '0');
    return `${year}年${month}月${day}日`;
  },

  viewRecordDetail(event) {
    const recordId = event.currentTarget.dataset.recordId;
    // wx.navigateTo({ url: `/pages/historyDetail/historyDetail?id=${recordId}` });
    wx.showToast({ title: `查看详情: ${recordId}`, icon: 'none' });
  }
});
