// pages/exampleShow/note/noteYear/noteYear.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showClass:'zhangdan',
    checkYear:'',//当前选择年份
  },
  // 选择当前笔记年份
  chooseYear(e){
    this.setData({
      checkYear: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = new Date()
    let that = this
    let checkYear = date.getFullYear()
    this.setData({
      checkYear
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