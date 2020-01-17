// pages/exampleShow/examplesDiDi/examplesDiDi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    latitude: 0,
    longitude: 0,
    polyline: [],
    scale: 16,
    // controls: [{
    //   id: 1,
    //   iconPath: '/resources/location.png',
    //   position: {
    //     left: 0,
    //     top: 300 - 50,
    //     width: 50,
    //     height: 50
    //   },
    //   clickable: true
    // }]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e)
  },
  controltap(e) {
    console.log(e.controlId)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getaddress() {
    let that = this
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: function (res) {
        console.log(res)
        if (res.latitude || res.longitude) {
          let polyline = [{
            points: [{
              latitude: that.data.latitude,
              longitude: that.data.longitude
            }],
            color: "#FF00DD",
            width: 2,
            dottedLine: true
          }]
          that.setData({
            polyline: polyline,
            latitude: res.latitude,
            longitude: res.longitude
          })
        }

      }
    });
  },
  onLoad: function (options) {
    let that = this
    that.getaddress()
    
  },
  myadress() {
    let that = this
    that.getaddress()
  },
  fangdacover() {
    let that = this
    let scale = that.data.scale
    if (scale >= 20) {
      scale = 20
    } else {
      scale++
    }
    that.setData({
      scale
    })
  },
  setmarkers () {
    let that = this
    let markers = [{
      iconPath: "http://www.tminlife.cn/wxapp/address.png",
      id: 0,
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      width: 30,
      height: 30
    }]
    that.setData({
      markers: markers
    })
  },
  searchaddress() {
    wx.navigateTo({
      url: '/pages/exampleShow/examplessearch/examplessearch',
    })
  },
  line() {
    wx.navigateTo({
      url: '/pages/exampleShow/examplesmapline/examplesmapline',
    })
  },
  suoxiaocover() {
    let that = this
    let scale = that.data.scale
    if (scale <= 0) {
      scale = 0
    } else {
      scale--
    }
    that.setData({
      scale
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

  }
})