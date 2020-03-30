// pages/exampleShow/note/noteDetail/noteDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showClass:'mingxi',
    monthdate:'',
    yearDate:'',
    date: '',//当前选择时间
    multiArray: [['2017年', '2018年', '2019年', '2020年'], ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月','12月']],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let that = this
    let monthdate = that.data.multiArray[1][e.detail.value[1]]
    monthdate = that.add0(monthdate)
    let yearDate = that.data.multiArray[0][e.detail.value[0]]
    yearDate = that.add0(yearDate)
    that.setData({
      monthdate,
      yearDate
    })
  },
  add0(number) {
    number = number.substring(0, number.length - 1)
    if(Number(number) < 10) {
      return '0'+ number
    } else {
      return number
    }
  },
  onLoad: function (options) {
    let date = new Date()
    let that = this
    let yearDate = date.getFullYear()
    let monthdate = date.getMonth() + 1 +'月'
    monthdate = that.add0(monthdate)
    that.setData({
      yearDate,
      monthdate
    })
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
    return {
      title: '你若安好，便是晴天~',
      imageUrl: 'http://www.tminlife.cn/wxapp/share/noteshare.png'
    }
  }
})