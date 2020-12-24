// pages/exampleShow/weather/weather.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var util = require('../../../utils/util.js');
var qqmapsdk;
import * as echarts from '../../../utils/ec-canvas/echarts';
let chartLine;
function getOption(xData, data_cur, data_his) {
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
      x: 28,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false, 
        show: false,
        splitLine: {
          show: false
        },
        data: xData
      },
      
    ],
    yAxis: [
      {
        type: 'value',
        show: false,
        splitLine: {
          show: false
        },
      }
    ],
    series: [{
      name: '白天',
      zIndex: 2,
      type: 'line',
      smooth: true,
      symbolSize: 10,
      symbol: 'circle',
      borderColor: 'yellow',
      lineStyle: {
        color: '#FFB639',
      },
      itemStyle: {
        borderWidth: 2,
        borderColor: 'white',
        color: '#FFB639'
      },
      label: {
        normal: {
          show: true,
          fontSize : 17,
          position: 'top',
          formatter: '{c}°',
        }
      },
      data: data_cur || []
    }, {
      name: '夜晚',
      zIndex: 1,
      type: 'line',
      symbolSize: 10,
      smooth: true,
      symbol: 'circle',
      lineStyle: {
        color: '#34C4FF',
      },
      itemStyle: {
        borderWidth: 2,
        borderColor: 'white',
        color: '#34C4FF'
      }, 
      label: {
        normal: {
          formatter: '{c}°',
          show: true,
          fontSize: 17,
          position: 'bottom'
        }
      },
      data: data_his || []
    }]
  };
  return option;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showbgBlur: false, //背景模糊度
    showlifeBg: false, //生活指数弹窗
    showairBg: false, //空气质量弹窗
    houersInfo:{},//每小时的天气信息
    adinfo:{}, //地理位置
    now: {}, //现在天气
    lifestyle: {}, //生活指数
    showLife:{}, //指数弹窗信息
    sevenday:{}, //7天天气
    aircity: {},//当前城市空气质量
    src: 'http://www.tminlife.cn/wxapp/lifestyle/', //指数图标前缀
    tips: '观潮起落风云涌，思国阴晴民冷暖。国之阴晴扛在肩，民之冷暖挂在心。',
    ecLine: {
      onInit: function (canvas, width, height) {
        console.log(chartLine)
        //初始化echarts元素，绑定到全局变量，方便更改数据
        chartLine = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chartLine);

        //可以先不setOption，等数据加载好后赋值，
        //不过那样没setOption前，echats元素是一片空白，体验不好，所有我先set。
        var xData = [1, 2, 3, 4, 5, 6];  // x轴数据 自己写
        var option = getOption(xData, [], []);
        chartLine.setOption(option);
      }
    }
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.showLoading({
      title: '加载中~',
    })
    that.getmyaddress()
  },
  // 获取我的位置信息
  getmyaddress() {
    let that = this
    wx.getLocation({
      success: function (res) {
        console.log('当前地位经纬度',res)
        util.require("https://apis.map.qq.com/ws/geocoder/v1/?location=" + res.latitude + ',' + res.longitude +"&get_poi=1&key=UCYBZ-TLG6W-FGRRG-R5KP7-WO3RE-DAB4Q",{},'GET').then(res=>{
          if(res.status == 0) {
            console.log('当前城市信息',res.result.ad_info)
            that.setData({
              adinfo: res.result.ad_info
            })
            wx.hideLoading()
            that.getnow(res.result.ad_info.adcode)
            that.getlifestyle(res.result.ad_info.adcode)
            that.getAir(res.result.ad_info.city)
            that.getsevenDay(res.result.ad_info.adcode)
            that.gethouersInfo(res.result.ad_info.adcode)
          } else {
            wx.showToast({
              title: res.message,
              icon: "none"
            })
          }
        })
      },
    })
  },
  // 获取空气质量
  getAir(location) {
    let that = this
    util.require('https://free-api.heweather.net/s6/air/now?location=' + location + '&key=9b7255acc6cf4d2a973f6d92f6b67bed', {}, 'GET').then(res => {
      res = res.HeWeather6[0]
      if (res.status == 'ok') {
        console.log('当前空气质量', res.air_now_city)
        let color = Number(res.air_now_city.aqi)
        if(color <= 50) {
          color = '#2CAF08'
        } else if (color > 50 && color <= 100) {
          color = '#EECD34'
        } else if( color > 100 && color <= 150) {
          color = '#F5830A'
        } else if (color > 150 && color <= 200) {
          color = '#ED520A'
        } else if (color > 200 && color <= 250) {
          color = '#F52E05'
        } else if (color > 250 && color <= 300) {
          color = '#FF2903'
        } else if (color > 300) {
          color = 'red'
        }
        res.air_now_city.color = color
        that.setData({
          aircity: res.air_now_city
        })
      } else {
        wx.showToast({
          title: '空气质量查询失败',
          icon: 'none'
        })
      }
    })
  },
  // 获取每小时的天气
  gethouersInfo(location) {
    let that = this
    util.require('https://free-api.heweather.net/s6/weather/hourly?location=' + location + '&key=9b7255acc6cf4d2a973f6d92f6b67bed', {}, 'GET').then(res => {
      res = res.HeWeather6[0]
      if (res.status == 'ok') {
        console.log('每小时天气', res.hourly)
        res.hourly.forEach(item=>{
          item.hour = item.time.slice(item.time.length-5)
        })
        that.setData({
          houersInfo: res.hourly
        })
      } else {
        wx.showToast({
          title: '每小时天气查询失败',
          icon: 'none'
        })
      }
    })
  },
  //获取接下来7天的天气
  getsevenDay(location) {
    let that = this
    util.require('https://free-api.heweather.net/s6/weather/forecast?location=' + location + '&key=9b7255acc6cf4d2a973f6d92f6b67bed', {}, 'GET').then(res => {
      res = res.HeWeather6[0]
      if (res.status == 'ok') {
        console.log('当前7天天气', res.daily_forecast)
        let weeks = (new Date()).getDay()
        console.log(weeks)
        let maxdata = []
        let mindata = []
        let days = ['周一','周二','周三','周四','周五','周六','周日']
        res.daily_forecast.forEach((item,index)=>{
          item.days = days[(weeks + index - 1) % 7]
          switch(index) {
            case 0:
              item.days = '今天'
              break;
            case 1:
              item.days = '明天'
              break;
            case 2:
              item.days = '后天'
              break;
          }
          item.dates = item.date.slice(item.date.length-5)
          item.wind_sc = item.wind_sc.substr(0,1)
          maxdata.push(item.tmp_max)
          mindata.push(item.tmp_min)
        })
        console.log(maxdata,mindata)
        chartLine.setOption({
          series: [{
            data: maxdata
          }, {
            data: mindata
          }]
        });
        that.setData({
          sevenday: res.daily_forecast,
        })
      } else {
        wx.showToast({
          title: '7天天气查询失败',
          icon: 'none'
        })
      }
    })

  },
  // 获取当前天气
  getnow(location) {
    let that = this 
    util.require('https://free-api.heweather.net/s6/weather/now?location=' + location +'&key=9b7255acc6cf4d2a973f6d92f6b67bed',{},'GET').then(res=>{
      res = res.HeWeather6[0]
      if(res.status == 'ok') {
        console.log('当前天气', res.now)
        that.setData({
          now: res.now
        })
      } else {
        wx.showToast({
          title: '天气查询失败',
          icon:'none'
        })
      }
    })
  },
  // 获取生活指数
  getlifestyle(location) {
    let that = this
    util.require('https://free-api.heweather.net/s6/weather/lifestyle?location=' + location + '&key=9b7255acc6cf4d2a973f6d92f6b67bed', {}, 'GET').then(res => {
      res = res.HeWeather6[0]
      if (res.status == 'ok') {
        res.lifestyle.forEach(item=> {
          switch(item.type){
            case 'comf':
              item.typename = '舒适度指数'
              item.icon = that.data.src + 'shushidu.png'
              break;
            case 'cw':
              item.typename = '洗车指数'
              item.icon = that.data.src + 'xichekaidan.png'
              break;
            case 'drsg':
              item.typename = '穿衣指数'
              item.icon = that.data.src + 'chuanyixiguan.png'
              break;
            case 'flu':
              item.typename = '感冒指数'
              item.icon = that.data.src + 'ganmaoyaowu.png'
              break;
            case 'sport':
              item.typename = '运动指数'
              item.icon = that.data.src + 'yundong.png'
              break;
            case 'trav':
              item.typename = '旅游指数'
              item.icon = that.data.src + 'lvyou.png'
              break;
            case 'uv':
              item.typename = '紫外线指数'
              item.icon = that.data.src + 'ai250.png'
              break;
            case 'air':
              item.typename = '空气污染扩散条件'
              item.icon = that.data.src + 'kongqizhiyiban.png'
              break;
          }
        })
        console.log('当前生活指数', res.lifestyle)

        that.setData({
          lifestyle: res.lifestyle
        })
        
      } else {
        wx.showToast({
          title: '生活指数查询失败',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // 展示详细的生活指数
  showinfo(e) {
    let {
      item
    } = e.currentTarget.dataset || {}
    console.log(item)
    let that = this
    that.setData({
      showlifeBg: true,
      showbgBlur:true,
      showLife: item
    })
  },
  // 展示空气质量
  showAir() {
    let that = this
    that.setData({
      showbgBlur: true,
      showairBg: true
    })
  },
  // 关闭弹窗
  closetap() {
    let that = this
    that.setData({
      showlifeBg: false,
      showbgBlur: false,
      showairBg: false
    })
  },
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
    return{
      title:'你若安好，便是晴天~',
      imageUrl:'http://www.tminlife.cn/wxapp/share/weather.png'
    }

  }
})