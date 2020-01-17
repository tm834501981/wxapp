// pages/exampleShow/examplessearch/examplessearch.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    suggestion: [],
    address: '', //搜索的地址
    showclose: false, //是否展示清除按钮
    showhistory: true, //是否展现搜索历史
    historydata: [], //搜索历史
    myaddress: {}, //我的位置
    endaddress: {}, //终点位置
    showmap: false, //地图展示
    scale:16,
    longitude:0,
    latitude:0,
    markers:[],
    polyline:[],
    restitle:'',//选点的标题
    resdistance: '',//选点距离
    resaddress: '',//选点详细地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 取消
  clearchoose() {
    let that = this
    wx.navigateBack({
      delta: 1
    })
  },
  //获取到地址
  getsearchaddress(e) {
    let that = this
    let value = e.detail.value
    console.log(value)
    if (value) {
      that.setData({
        showclose: true,
        address: value
      })
      qqmapsdk.getSuggestion({
        //获取输入框值并设置keyword参数
        keyword: value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
        location: {
          latitude: that.data.myaddress.latitude,
          longitude: that.data.myaddress.longitude
        },
        page_size: 20,
        //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
        success: function (res) {//搜索成功后的回调
          console.log(res);
          var sug = [];

          res.data.sort(that.compare)
          console.log(res.data);
          for (var i = 0; i < res.data.length; i++) {
            sug.push({ // 获取返回结果，放到sug数组中
              title: res.data[i].title,
              id: res.data[i].id,
              addr: res.data[i].address,
              city: res.data[i].city,
              district: res.data[i].district,
              latitude: res.data[i].location.lat,
              longitude: res.data[i].location.lng,
              mi: that.getDistance(that.data.myaddress.latitude, that.data.myaddress.longitude, res.data[i].location.lat, res.data[i].location.lng)
            });
          }
          that.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
            suggestion: sug,
            showhistory: false
          });
        },
        fail: function (error) {
          console.error(error);
        },
        complete: function (res) {
          console.log(res);
        }
      });

    } else {
      that.setData({
        showhistory: true,
        address: ''
      })
    }
  },
  //选中搜索内容
  chooseserach(e) {
    console.log(e)
    let that = this
    let data = e.currentTarget.dataset.data
    console.log(data)
    let address = data
    address.address = data.addr
    that.setData({
      endaddress: address
    })
    if (that.data.historydata && that.data.historydata.length) {
      let flag = true
      that.data.historydata.forEach(item => {
        console.log(item.title, address.title)
        if (item.title == address.title) {
          flag = false
        }
      })
      if (flag) {
        that.data.historydata.unshift(address)
      }
    } else {
      that.data.historydata.unshift(address)
    }
    that.setData({
      showhistory: true,
      showmap: true,
      showclose: false,
      address: '',
      historydata: that.data.historydata
    })
    that.setDot(address)
  },
  //地图位置
  setDot(res) {
    let that = this
    console.log('选中的位置',res)
    let markers = [{
      iconPath: "http://www.tminlife.cn/wxapp/addressshow.png",
      id: 0,
      latitude: res.latitude,
      longitude: res.longitude,
      width: 40,
      height: 40
    }]
    that.setData({
      latitude: res.latitude,
      longitude: res.longitude,
      restitle:res.title,
      resdistance: res.mi,
      resaddress: res.address,
      markers
    })
  },

  // 路线
  line() {
    let that = this
    wx.setStorageSync('endaddress', that.data.endaddress)
    wx.navigateTo({
      url: '/pages/exampleShow/examplesmapline/examplesmapline',
    })
  },

  // 获取我的位置
  getaddress() {
    let that = this
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: function (res) {
        console.log(res)
        if (res.latitude || res.longitude) {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
        }

      }
    });
  },

  // 缩小地图
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
  // 放大地图
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
  //历史记录位置选择
  choosehistory(e) {
    console.log(e)
    let that = this
    let data = e.currentTarget.dataset.data
    console.log(data)
    let address = data
    that.setData({
      endaddress: address
    })
    if (that.data.historydata && that.data.historydata.length) {
      let flag = true
      that.data.historydata.forEach(item => {
        console.log(item.title, address.title)
        if (item.title == address.title) {
          flag = false
        }
      })
      if (flag) {
        that.data.historydata.unshift(address)
      }
    } else {
      that.data.historydata.unshift(address)
    }
    that.setData({
      showmap: true,
      showhistory: true,
      showclose: false,
      address: '',
      historydata: that.data.historydata
    })
    that.setDot(address)
  },
  // 比较大小
  compare: function (obj1, obj2) {
    var val1 = obj1._distance;
    var val2 = obj2._distance;
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0;
    }
  },
  // 米数计算
  getDistance: function (lat1, lng1, lat2, lng2) {

    lat1 = lat1 || 0;

    lng1 = lng1 || 0;

    lat2 = lat2 || 0;

    lng2 = lng2 || 0;

    var rad1 = lat1 * Math.PI / 180.0;

    var rad2 = lat2 * Math.PI / 180.0;

    var a = rad1 - rad2;

    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

    var r = 6378137;
    let mi = (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0)
    if (mi < 1000) {
      mi = mi + '米'
    } else {
      mi = (mi / 1000).toFixed(1) + '千米'
    }
    return mi

  },
  //清除历史
  clearhistory: function () {
    let that = this
    that.setData({
      historydata: []
    })
  },
  // 删除搜索内容
  clearaddress() {
    let that = this
    that.setData({
      showclose: false,
      address: '',
      showhistory: true
    })
  },
  onLoad: function (options) {
    let that = this
    qqmapsdk = new QQMapWX({
      key: 'UCYBZ-TLG6W-FGRRG-R5KP7-WO3RE-DAB4Q'
    });
    let historydata = wx.getStorageSync('historydata') ? wx.getStorageSync('historydata') : []
    that.setData({
      historydata
    })
    // 起点默认我的位置
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: function (res) {
        console.log(res)
        that.setData({
          myaddress: res
        })

      },
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
    let that = this
    wx.setStorage({
      key: 'historydata',
      data: that.data.historydata,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this
    wx.setStorage({
      key: 'historydata',
      data: that.data.historydata,
    })
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