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
  },
  // 详情页
  goDetailShow(e){
    // let {

    // } = e.currentTarget.dataset || {}
    wx.navigateTo({
      url: '/pages/exampleShow/note/noteLineDetail/noteLineDetail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为',e.detail.value)
    let that = this
    let date =  e.detail.value
    let monthdate = date.substring(5,7)
    let yearDate = date.substring(0,4)
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