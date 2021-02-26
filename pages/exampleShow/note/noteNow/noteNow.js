// pages/exampleShow/note/noteNow/noteNow.js
import iconShow from "icondata"
import evalFn from "../../../../utils/eval.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showClac: false, //展示计算器
    showDialog: false, //备注信息蒙版
    notetype: '支出',
    showClass:'jizhang',
    icondata:[],
    desValue:'',
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
  // 删除
  deleteNumber(){
    let numberValue = this.data.numberValue
    if(numberValue) {
      numberValue = numberValue.slice(0,numberValue.length-1)
    }
    console.log(numberValue)
    this.setData({
      numberValue
    })
  },
  // =/完成
  getResult() {
    let that = this
    let numberValue = that.data.numberValue
    if(numberValue.indexOf('.',numberValue.length - 1) != -1) {
      numberValue = numberValue.substring(0,numberValue.length - 1)
    }
    if(numberValue.indexOf('+') != -1 && numberValue.indexOf('+') == (numberValue.length - 1)) {
      numberValue = numberValue.substring(0,numberValue.length - 1)
    }
    if(numberValue.indexOf('-') != -1 && numberValue.indexOf('-') == (numberValue.length - 1)) {
      numberValue = numberValue.substring(0,numberValue.length - 1)
    }
    let result = (evalFn.calCommonExp(numberValue)).toFixed(2)
    that.setData({
      numberValue: result
    })
  },
  // 计算机点击
  getNumber(e){
    let that = this
    let {
      number
    } = e.currentTarget.dataset || {}
    let number1 = that.data.number1
    let number2 = that.data.number2
    if(number == 'date' ){
      return
    }
    if(number == '+' || number == '-'){
      let numberValue = that.data.numberValue
      if(numberValue.indexOf('.',numberValue.length - 1) != -1) {
        numberValue = numberValue.substring(0,numberValue.length - 1)
      }
      if(numberValue.indexOf('+') != -1 && numberValue.indexOf('+') == (numberValue.length - 1)) {
        numberValue = numberValue.substring(0,numberValue.length - 1)
      }
      if(numberValue.indexOf('-') != -1 && numberValue.indexOf('-') == (numberValue.length - 1)) {
        numberValue = numberValue.substring(0,numberValue.length - 1)
      }
      if(that.data.numberType){
        let result = (evalFn.calCommonExp(numberValue)).toFixed(2)
        number1 = result
        that.setData({
          numberValue: result,
          numberType:number
        })
      } else {
        that.setData({
          numberType: number
        })
      }
    } 
    let numberValue
    numberValue = that.data.numberValue + number
    //小数点最多两位&长度不超过8
    if(!that.data.numberType) {
      number1 = numberValue
    } else {
      let index = numberValue.indexOf(that.data.numberType) + 1
      number2 = numberValue.slice(index,numberValue.length)
    }
    if(number1.indexOf('.') != -1) {
      let dotIndex =number1.length - number1.indexOf('.')
      if(dotIndex >= 2 && number == '.') {
        if(!number2 && number == '.') {
          return
        }
      }
      if(dotIndex > 3) {
        return
      }
    } else if(number1.length > 8) {
      return
    }
    if(number2.indexOf('.') != -1) {
      let dotIndex =number2.length - number2.indexOf('.')
      if(dotIndex >= 2 && number == '.') {
        return
      }
      if(dotIndex > 3) {
        return
      }
      
    } else if(number2.length > 8) {
      return
    }

    that.setData({
      numberValue,
      number1,
      number2
    })

  },
  // 备注信息
  getCover(e) {
    this.setData({
      showDialog: true
    })
  },
  removeCover() {
    this.setData({
      showDialog: false
    })
  },
  getDes(e) {
    this.setData({
      desValue: e.detail.value
    })
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
  // 选择图标记录
  getClac(e) {
    let {
      data
    } = e.currentTarget.dataset || {}
    console.log(data)
    this.setData({
      showClac: true
    })
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