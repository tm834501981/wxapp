// pages/exampleShow/examplesData/examplesData.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weeks: ['日','一','二','三','四','五','六'],
    date:[],
    year: '',
    month: '',
    day: '',
    showday: '',
    datenumer: 0,
    nextdate: '',
    beforedate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this

    let nowDate = new Date()
    let year = nowDate.getFullYear()
    let month = nowDate.getMonth() + 1
    let day = nowDate.getDate()
    let showday = year + '/' + month + '/' + day
    that.setData({
      showday: showday
    })
    that.getnowdate(nowDate)
  },
  nextMonth() {
    let that = this
    that.getnowdate(new Date(that.data.nextdate))
  },
  beforeMonth() {
    let that = this
    that.getnowdate(new Date(that.data.beforedate))
  },
  getnowdate(nowDate) {
    let that = this
    let year = nowDate.getFullYear()
    let month = nowDate.getMonth() + 1
    let day = nowDate.getDate()
    let week = nowDate.getDay()
    if(week == 0) {
      week = 7
    }
    let datenumer = that.monthdate(month) 

    // 下一个月日期
    let nextmonth = 0
    let nextyear = 0
    if (month == 12) {
      nextmonth  = 1
      nextyear = year + 1
    } else {
      nextmonth = month + 1
      nextyear = year
    }
    let nextdate = nextyear + '/' + nextmonth + '/' + day

    // 上个一个月日期
    let beforemonth = 0
    let beforeyear = 0
    if (month == 1) {
      beforemonth = 12
      beforeyear = year - 1
    } else {
      beforemonth = month - 1
      beforeyear = year
    }
    let beforedate = beforeyear + '/' + beforemonth + '/' + day

    console.log(year, month, day, week, nextdate, beforedate)
    this.setData({
      year: year,
      month: month,
      day: day,
      datenumer: datenumer,
      nextdate: nextdate,
      beforedate: beforedate
    })

    that.getmoreDatestart(year,month, datenumer)
  },
  getmoreDatestart(year,month, datenumer) {
    let that = this
    let nowDate = new Date(year + '/' + month + '/1')
    let more = nowDate.getDay()
    let moreDatestart = []
    if(month == 1) {
      month = 12
    } else {
      month -= 1
    }
    let morenumber = that.monthdate(month)
    for(let i = 0 ; i < more; i++ ) {
      moreDatestart.unshift(morenumber-i)
    }
    let end = 7 - (datenumer + moreDatestart.length) % 7
    console.log(end)
    end = (end == 7)? 0:end
    let morDateend = []
    for(let i = 0 ; i < end; i++) {
      morDateend.push(i)
    }
    that.setData({
      moreDatestart: moreDatestart,
      morDateend: morDateend
    })
  },
  monthdate(e) {
    let that = this
    let datenumer = 0
    if (e == 1 || e == 3 || e == 5 || e == 7 || e == 8 || e == 10 || e == 12) {
      datenumer = 31
    } else if(e == 2) {
      if (that.data.year % 4 == 0) {
        datenumer = 29
      } else {
        datenumer = 28
      }
    } else if (e == 4 || e == 6 || e == 9 || e == 11) {
      datenumer = 30
    }
    return datenumer
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})