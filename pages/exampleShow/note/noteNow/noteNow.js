// pages/exampleShow/note/noteNow/noteNow.js
import iconShow from "icondata"
import evalFn from "../../../../utils/eval.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notetype: '支出',
    showClass:'jizhang',
    icondata:[],
    desValue:'备注信息',
    numberValue:'',
    number1:'',
    number2:'',
    numberType:'',
    calcShow:[{
      'text':'7',
      'value':7
    },{
      'text':'8',
      'value':8
    },{
      'text':'9',
      'value':9
    },{
      'text':'2020/03/08',
      'value':'date'
    },{
      'text':'4',
      'value':4
    },{
      'text':'5',
      'value':5
    },{
      'text':'6',
      'value':6
    },{
      'text':'+',
      'value':'+'
    },{
      'text':'1',
      'value':1
    },{
      'text':'2',
      'value':2
    },{
      'text':'3',
      'value':3
    },{
      'text':'-',
      'value':'-'
    },{
      'text':'.',
      'value':'.'
    },{
      'text':'0',
      'value':'0'
    }]
  },
  gopay(){
    this.setData({
      notetype: '支出',
      icondata:iconShow.paydata
    })
  },
  goget() {
    this.setData({
      notetype: '收入',
      icondata:iconShow.getdata
    })

  },
  // 计算机点击
  getNumber(e){
    let that = this
    let {
      number
    } = e.currentTarget.dataset || {}
    if(number == '+' || number == '-'){
      if(that.data.numberType){
        let result = (evalFn.calCommonExp(that.data.numberValue)).toFixed(2)
        console.log(that.data.numberValue,result)
        that.setData({
          numberValue: result
        })
      } else {
        that.setData({
          numberType: number
        })
      }
    }
    let numberValue = that.data.numberValue + number
    that.setData({
      numberValue
    })
    // if(number == '+') {
    //   if(that.data.numberType) {
       
    //   } else {
    //     that.setData({
    //       numberType: '+'
    //     })
    //   }
    // } else if(number == '-') {
    //   that.setData({
    //     numberType: '-'
    //   })

    // } else if(number == 'date') {

    // } else {
    //   if(!that.data.numberType) {
    //     number = that.data.number1 + number
    //     that.setData({
    //       number1: number,
    //     })
    //   } else {
    //     number = that.data.number2 + number
    //     that.setData({
    //       number2: number,
    //     })
    //   }
    // }
    
    // console.log(that.data.number1,that.data.number2)
  },
  /**
   * 生命周期函数--监听页面加载
   */
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
    if(this.data.notetype == '收入'){
      this.setData({
        icondata:iconShow.getdata
      })
    } else {
      this.setData({
        icondata:iconShow.paydata
      })
    }
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