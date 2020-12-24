// pages/exampleShow/note/noteCanvas/noteCanvas.js

import * as echarts from '../../../../utils/ec-canvas/echarts';
let chartLine;
function getOption(xData, data_cur) {
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    grid: {
      top:10,
      bottom:20
    },
    xAxis: [
      {
        type: 'category',
        show: true,
        boundaryGap: true,
        axisLine: {
          lineStyle:{
            color:'#E9E9E9',  //坐标轴的颜色
          },
        },
        axisLabel: {
          textStyle: {
            color: '#747474'
          }
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false //坐标轴隔断不展示
        },
        data: xData
      },
      
    ],
    yAxis: [
      {
        type: 'log',
        show: false,
        splitLine: {
          show: false
        },
        max: function (value) {
          return value.max;
        },
        min: function (value) {
          return value.min;
        }
      }
    ],
    series: [{
      name: '账单',
      type: 'line',
      symbolSize: 8,
      symbol: 'circle',
      borderColor: 'black',
      lineStyle: {
        width:1,
        color: '#747474',
      },
      itemStyle: {
        borderWidth: 1,
        borderColor: '#3B393A',
        color: '#FFFF12'
      },
      label: {},
      data: data_cur || []
    }]
  };
  return option;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showClass:'tubiao', //tab
    noteType:['支出','收入'], //支出收入数据
    noteTypeIndex:0, //支出收入下标
    noteDate:['周','月','年'], //年月日数据
    noteDateIndex:0, //年月日下标
    nowIndex:0,//当前选择的scroll下标
    scrollLeft: 0,//scroll居中
    scrollViewWidth:0,//scroll长度
    ViewWidth:0,//scrollitem宽度
    // scroll数据
    scrollData:10,
    ecLine: {
      onInit: function (canvas, width, height) {
        //初始化echarts元素，绑定到全局变量，方便更改数据
        chartLine = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chartLine);
        console.log('123',chartLine)

        //可以先不setOption，等数据加载好后赋值，
        //不过那样没setOption前，echats元素是一片空白，体验不好，所有我先set。
        var xData = [1, 2, 3, 4, 5, 6];  // x轴数据 自己写
        var option = getOption(xData, []);
        chartLine.setOption(option);
      }
    }
  },
  // scroll下标选择
  showScrollItem(e){
    let that = this
    let offsetLeft = e.currentTarget.offsetLeft
    let {
      index
    } = e.currentTarget.dataset || {}
    let scrollLeft = offsetLeft - that.data.scrollViewWidth/2+ that.data.ViewWidth/2
    scrollLeft = scrollLeft < 0 ? 0 : scrollLeft
    console.log(scrollLeft)
    that.setData({
      nowIndex:index,
      scrollLeft
    })
    that.setCanvas()
  },
  // 支出/收入
  changeNoteType(e){
    let  {
      index
    } = e.currentTarget.dataset || {}
    this.setData({
      noteTypeIndex: index
    })
  },
  // 周/月/年
  changeNoteDate(e){
    let  {
      index
    } = e.currentTarget.dataset || {}
    this.setData({
      noteDateIndex: index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    setTimeout(function(){
      that.setCanvas()
    },2000)
  },
  // echarts图形
  setCanvas(){
    let maxdata = ["30", "16", "40", "14", "18", "13"]
    console.log(chartLine)
    chartLine.setOption({
      series: [{
        data: maxdata
      }]
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    wx.createSelectorQuery().select('.scrollDate').boundingClientRect((rect)=>{
      that.setData({
        scrollViewWidth:Math.round(rect.width)
      })
    }).exec()
    wx.createSelectorQuery().select('.itemDate').boundingClientRect((rect)=>{
      that.setData({
        ViewWidth:Math.round(rect.width)
      })
    }).exec()
    that.setCanvas()
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