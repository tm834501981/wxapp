// pages/examples/examples.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardData: [
      {
        name:'1',
        active: ''
      }, {
        name: '2',
        active: ''
      }, {
        name: '3',
        active: ''
      }, {
        name: '4',
        active: ''
      }, {
        name: '5',
        active: ''
      }
    ],//卡面数目
    cardlength: 3,//卡片展示数目
    returndata: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 卡片上滑特效
  goUp(e) {
    let that = this
    console.log(that.data.returndata)
    if (that.data.returndata == false) {
      let {
        index
      } = e.currentTarget.dataset || {}

      that.setData({
        returndata: true
      })

      that.data.cardData[0].active = 'animate'
      that.setData({
        cardData: that.data.cardData
      }, function () {
        setTimeout(function () {
          that.data.cardData[0].active = ''
          for (let i = 1; i <= that.data.cardlength; i++) {
            that.data.cardData[i].active = 'animatereturn'
          }
          that.data.cardData.push(that.data.cardData[0])
          that.data.cardData.shift()
          console.log(that.data.cardData)
          that.setData({
            cardData: that.data.cardData
          }, function () {
            setTimeout(function () {
              that.data.cardData.forEach(item => {
                item.active = ''
              })
              that.setData({
                cardData: that.data.cardData,
                returndata: false
              })
            }, 100)
          })
        }, 400)
      })
    } 
    
  },
  onLoad: function (options) {

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
      imageUrl: 'http://www.tminlife.cn/wxapp/flower.png'
    }
  }
})