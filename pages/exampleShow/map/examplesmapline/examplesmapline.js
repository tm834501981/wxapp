// pages/exampleShow/examplesmapline/examplesmapline.js
var QQMapWX = require('../../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '',
    latitude: '',
    polyline: [],
    showclick: 'driving',
    markers:[],
    inputend:'输入终点',
    inputstart: '输入起点', //
    myaddress: {}, //我的位置
    startaddress: {}, //起点位置
    endaddress:{}, //终点位置
    inputtext:'', //搜索框默认字
    showline: true, //是否展示路线终点起点
    address: '', //搜索的地址
    showclose: false, //是否展示清除按钮
    showhistory: true, //是否展现搜索历史
    showlinetype: false, //是否展示路线种类
    historydata: [], //搜索历史
    translatex: 0,//移动位置,
    coverdata: [],//滑块数据
    dotindex: 0, //滑块下标
    linesdata: [],//公交名称
    scale: 16,
  },
  //输入起点
  showstartinput() {
    console.log('展示导航')
    let that = this
    that.setData({
      showline: false,
      inputtext: '输入起点',
      showlinetype: false
    })
  },
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
  // 输入名称搜索地址
  getaddress(e) {
    let that = this
    let value = e.detail.value
    if(value) {
      that.setData({
        showclose:true,
        address: value
      })
      console.log(that.data.myaddress)
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
            showhistory:false
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
    console.log(value)
  },
  //历史记录位置选择
  choosehistory(e) {
    console.log(e)
    let that = this
    let data = e.currentTarget.dataset.data
    console.log(data)
    let address = data
    that.setData({
      inputend: data.title,
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
      showline: true,
      showhistory: true,
      showclose: false,
      address: '',
      historydata: that.data.historydata
    })
    that.showtype()
  },
  //选中搜索内容
  chooseserach(e) {
    console.log(e)
    let that = this
    let data = e.currentTarget.dataset.data
    console.log(data)
    let address = data
    address.address = data.addr
    if (that.data.inputtext == '输入终点') {
      that.setData({
        inputend: data.title,
        endaddress: address
      })
    } else if (that.data.inputtext == '输入起点') {
      that.setData({
        inputstart: data.title,
        startaddress: address
      })
    }

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
      showline: true,
      showhistory: true,
      showclose:false,
      address: '',
      historydata:that.data.historydata
    })
    that.showtype()
  },
  // 转换起点终点
  change:function() {
    let that = this
    if (that.data.inputend !== '输入终点' || 
      that.data.inputstart!== '输入起点') {
      let inputend= that.data.inputstart,
        inputstart = that.data.inputend,
        endaddress = that.data.startaddress,
        startaddress = that.data.endaddress
        
      if (inputend == '输入起点') {
        inputend = '输入终点'
      } 
      if (inputstart == '输入终点') {
        inputstart = '输入起点'
      }
      that.setData({
        inputend,
        inputstart,
        endaddress,
        startaddress
      })
    }
    that.showtype()
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
  // 取消
  clearchoose() {
    let that = this
    wx.navigateBack({
      delta: 1
    })
  },
  //输入我的终点
  showendinput() {
    let that = this
    that.setData({
      showline: false,
      inputtext: '输入终点',
      showlinetype: false
    })
  },
  // 我的位置
  myaddress() {
    let that = this
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: function (res) {
        res.id = 0
        res.title = '我的位置'
        console.log(res)
        if (that.data.inputtext == '输入终点') {
          that.setData({
            inputend: '我的位置',
            endaddress: res
          })
        } else if (that.data.inputtext == '输入起点') {
          that.setData({
            inputstart: '我的位置',
            startaddress: res
          })
        }
        
        that.setData({
          showline: true,
          inputtext: '',
          address: '',
          showhistory: true
        })
        that.showtype()
      },
    })
  },
  //清除历史
  clearhistory:function() {
    let that = this
    that.setData({
      historydata: []
    })
  },
  // 地图选点
  chooseaddress() {
    let that = this
    wx.chooseLocation({
      success: function(res) {
        res.id = 1
        console.log(res)
        res.title = res.name
        if (that.data.inputtext == '输入终点') {
          that.setData({
            inputend: res.name,
            endaddress: res
          })
        } else if (that.data.inputtext == '输入起点') {
          that.setData({
            inputstart: res.name,
            startaddress: res
          })
        }

        // if (that.data.historydata && that.data.historydata.length) {
        //   let flag = true
        //   that.data.historydata.forEach(item => {
        //     console.log(item.title, res.title)
        //     if (item.title == res.title) {
        //       flag = false
        //     }
        //   })
        //   if (flag) {
        //     that.data.historydata.unshift(res)
        //   }
        // } else {
        //   that.data.historydata.unshift(res)
        // }

        // console.log(that.data.historydata, res.title)

        that.setData({
          showline: true,
          inputtext: '',
          address: '',
          // historydata: that.data.historydata,
          showclose: false,
          showhistory: true
        })
        that.showtype()
      },
    })
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
    if(mi < 1000){
      mi = mi + '米'
    } else {
      mi = (mi/1000).toFixed(1) + '千米'
    }
    return mi

  },
  // 公交路线
  showbus: function() {
    let that = this
    wx.showLoading({
      title: '寻找路线中',
    })
    that.setData({
      showclick: 'bus',
      showlinetype: true,
      dotindex: 0
    })
    let start = {
      latitude: that.data.startaddress.latitude,
      longitude: that.data.startaddress.longitude
    }
    let end = {
      latitude: that.data.endaddress.latitude,
      longitude: that.data.endaddress.longitude
    }
    qqmapsdk.direction({
      mode: 'transit',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      //from参数不填默认当前地址
      from: start,
      to: end,
      success: function (res) {
        console.log(res);
        var ret = res;
        let coverdata = res.result.routes
        coverdata.forEach(item => {
          if (item.distance > 1000) {
            item.distance = (item.distance / 1000).toFixed(1) + '千米'
          } else {
            item.distance += '米'
          }
          item.duration = that.timeStamp(item.duration)
          let walkstep = 0
          let linesdata = []
          item.steps.forEach(item=>{
            if (item.mode == 'WALKING') {
              walkstep += item.distance
            }
            if (item.mode == 'TRANSIT') {
              let lines = item.lines
              let itemslines = []
              lines.forEach(showitem => {
                itemslines.push({
                  title: showitem.title,
                  vehicle: showitem.vehicle
                })
              })
              linesdata.push(itemslines)
            }
          })
          item.linesdata = linesdata
          console.log(walkstep)
          if (walkstep > 1000) {
            item.walkstep = (walkstep / 1000).toFixed(1) + '千米'
          } else {
            item.walkstep = walkstep + '米'
          }
          item.polyline = that.setStep(item)
          item.markers = that.setmarks(item)
        })
        console.log('滑块', coverdata)
        // that.setStep(coverdata[0])
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        that.setData({
          coverdata: coverdata
        })
        that.setData({
          markers: coverdata[0].markers,
          polyline: coverdata[0].polyline
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
        if (res.status == 326) {
          wx.showToast({
            title: '距离过近，建议步行',
            icon: 'none'
          })
          that.showwalk()
        } 
        wx.hideLoading()
      }
    })
  },
  setlabel(res){
    return {
      content: res,
      fontSize: 12,
      borderRadius: 3,
      color: '#000',
      bgColor: '#fff',
      padding: 4,
      textAlign: 'center',
      display: 'ALWAYS'
    }
  },
  // 设置公交marks
  setmarks: function(res) {
    let that = this
    let markers = [{
      iconPath: "http://www.tminlife.cn/wxapp/start.png",
      id: 0,
      latitude: that.data.startaddress.latitude,
      longitude: that.data.startaddress.longitude,
      width: 30,
      height: 30
    }, {
      iconPath: "http://www.tminlife.cn/wxapp/end.png",
      id: 1,
      latitude: that.data.endaddress.latitude,
      longitude: that.data.endaddress.longitude,
      width: 30,
      height: 30
    }]
    console.log('markers',res)
    res.steps.forEach(item => {
      if (item.mode == 'TRANSIT') {
        let markersitem = item.lines[0]
        if(markersitem.vehicle == 'BUS') {
          markers.push({
            iconPath: "http://www.tminlife.cn/wxapp/subbus.png",
            id: markersitem.geton.id,
            latitude: markersitem.geton.location.lat,
            longitude: markersitem.geton.location.lng,
            width: 30,
            height: 30,
            callout: that.setlabel(markersitem.geton.title)
          })
          markers.push({
            iconPath: "http://www.tminlife.cn/wxapp/subbus.png",
            id: markersitem.getoff.id,
            latitude: markersitem.getoff.location.lat,
            longitude: markersitem.getoff.location.lng,
            width: 30,
            height: 30,
            callout: that.setlabel(markersitem.getoff.title)
          })
        } else if (markersitem.vehicle == 'SUBWAY') {
          markers.push({
            iconPath: "http://www.tminlife.cn/wxapp/subway.png",
            id: markersitem.geton.id,
            latitude: markersitem.geton.location.lat,
            longitude: markersitem.geton.location.lng,
            width: 30,
            height: 30,
            callout: that.setlabel(markersitem.geton.title)
          })
          markers.push({
            iconPath: "http://www.tminlife.cn/wxapp/subway.png",
            id: markersitem.getoff.id,
            latitude: markersitem.getoff.location.lat,
            longitude: markersitem.getoff.location.lng,
            width: 30,
            height: 30,
            callout: that.setlabel(markersitem.getoff.title)
          })
        }
      } 
    })
    console.log(markers)
    return markers
  },
  // 公交车路线
  setStep:function(res) {
    let that = this
    let polylineData = []
    console.log
    res.steps.forEach(item=>{
      if (item.mode == 'TRANSIT') {
        let coors = item.lines[0].polyline, pl = [];
         let kr = 1000000;
        for (let i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (let i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        if (item.lines[0].vehicle == 'SUBWAY') {
          polylineData.push({
            points: pl,
            color: '#2781D7',
            width: 10,
          })
        } else {
          polylineData.push({
            points: pl,
            color: '#A2A5A7',
            width: 10,
          })
        }
        // //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        
      } else if(item.mode == 'WALKING') {
        let coors = item.polyline, pl = [];
        let kr = 1000000;
        for (let i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (let i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        // //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        polylineData.push({
          points: pl,
          color: '#2781D7',
          width: 7,
          dottedLine: true
        })
      }
    })
    console.log('polyline', polylineData)
    return polylineData
  },
  // 驾车路线
  showdriving: function () {
    let that = this
    wx.showLoading({
      title: '寻找路线中',
    })
    that.setData({
      showclick: 'driving',
      dotindex: 0,
      showlinetype: true
    })
    let start = {
      latitude: that.data.startaddress.latitude,
      longitude: that.data.startaddress.longitude
    }
    let end = {
      latitude: that.data.endaddress.latitude,
      longitude: that.data.endaddress.longitude
    }
    qqmapsdk.direction({
      mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      //from参数不填默认当前地址
      from: start,
      to: end,
      success: function (res) {
        console.log(res);
        var ret = res;
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        console.log(pl)
        let coverdata = res.result.routes
        coverdata.forEach(item => {
          if (item.distance > 1000) {
            item.distance = (item.distance / 1000).toFixed(1) + '千米'
          } else {
            item.distance += '米'
          }
          item.duration = that.timeStamp(item.duration)
        })
        console.log('滑块', coverdata)
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        that.setData({
          coverdata: coverdata,
          latitude: pl[0].latitude,
          longitude: pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#40A926',
            width: 10,
            borderWidth: 1,
            borderColor: "#000"
          }],
          markers: [{
            iconPath: "http://www.tminlife.cn/wxapp/start.png",
            id: 0,
            latitude: that.data.startaddress.latitude,
            longitude: that.data.startaddress.longitude,
            width: 30,
            height: 30
          }, {
            iconPath: "http://www.tminlife.cn/wxapp/end.png",
            id: 1,
            latitude: that.data.endaddress.latitude,
            longitude: that.data.endaddress.longitude,
            width: 30,
            height: 30
          }]
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
        wx.hideLoading();
      }
    });
  },
  // 走路路线
  showwalk:function() {
    let that = this
    wx.showLoading({
      title: '寻找路线中',
    })
    that.setData({
      showclick: 'walk',
      dotindex: 0,
      showlinetype: true
    })
    let start = {
      latitude: that.data.startaddress.latitude,
      longitude: that.data.startaddress.longitude
    }
    let end = {
      latitude: that.data.endaddress.latitude,
      longitude: that.data.endaddress.longitude
    }
    qqmapsdk.direction({
      mode: 'walking',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      //from参数不填默认当前地址
      from: start,
      to: end,
      success: function (res) {
        console.log(res);
        var ret = res;
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        console.log(pl)
        let coverdata = res.result.routes
        coverdata.forEach(item => {
          if (item.distance > 1000) {
            item.distance = (item.distance / 1000).toFixed(1) + '千米'
          } else {
            item.distance += '米'
          }
          item.duration = that.timeStamp(item.duration)
        })
        console.log('滑块', coverdata)
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        that.setData({
          coverdata: coverdata,
          latitude: pl[0].latitude,
          longitude: pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#40A926',
            width: 10,
            borderWidth: 1,
            borderColor: "#000"
          }],
          markers: [{
            iconPath: "http://www.tminlife.cn/wxapp/start.png",
            id: 0,
            latitude: that.data.startaddress.latitude,
            longitude: that.data.startaddress.longitude,
            width: 30,
            height: 30
          }, {
            iconPath: "http://www.tminlife.cn/wxapp/end.png",
            id: 1,
            latitude: that.data.endaddress.latitude,
            longitude: that.data.endaddress.longitude,
            width: 30,
            height: 30
          }]
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
        wx.hideLoading()
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    qqmapsdk = new QQMapWX({
      key: 'UCYBZ-TLG6W-FGRRG-R5KP7-WO3RE-DAB4Q'
    });
    let historydata = wx.getStorageSync('historydata') ? wx.getStorageSync('historydata'):[]
    let endaddress = wx.getStorageSync('endaddress') ? wx.getStorageSync('endaddress') : []
    wx.removeStorageSync('endaddress')
    that.setData({
      historydata
    })
    // 起点默认我的位置
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: function (res) {
        console.log(res)
        res.id = 0
        res.title = '我的位置'
        that.setData({
          inputstart: '我的位置',
          myaddress: res,
          startaddress: res
        },function() {
          if (endaddress && endaddress.length != 0) {
            that.setData({
              endaddress,
              inputend: endaddress.title,
              showline: true,
              showhistory: true,
              showclose: false,
              address: '',
            })
            that.showtype()
          }
        })
      },
    })
  },
  myadress() {
    let that = this
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: function (res) {
        console.log(res)
        if (res.latitude || res.longitude) {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            scale: 16
          })
        }
      }
    });
  },
  // getTouchData:function (endX, endY, startX, startY) {
  //   let turn = "";
  //   if (endX - startX > 50 && Math.abs(endY - startY) < 50) {      //右滑
  //     turn = "right";
  //   } else if (endX - startX < -50 && Math.abs(endY - startY) < 50) {   //左滑
  //     turn = "left";
  //   }
  //   return turn;
  // },
  // touchStart:function(e) {
  //   this.setData({
  //     "touchX": e.changedTouches[0].clientX,
  //     "touchY": e.changedTouches[0].clientY
  //   });
  // },
  // 路线滑块
  coverviewmove: function (e) {
    let that = this
    // console.log(e)
    let dotindex = e.detail.current
    that.setData({
      dotindex: dotindex
    })
    that.setData({
      markers: that.data.coverdata[dotindex].markers,
      polyline: that.data.coverdata[dotindex].polyline
    })

  },
  //路线展示
  showtype() {
    let that = this
    console.log( that.data.endaddress.title, that.data.startaddress.title)
    if (that.data.startaddress.title && that.data.endaddress.title) {
      if (that.data.startaddress.title == that.data.endaddress.title) {
        wx.showToast({
          title: '起点和终点名称相同',
          icon:'none'
        })
        return
      }
      if (that.data.showclick == 'driving') {
        that.showdriving()
      } else if (that.data.showclick == 'bus') {
        that.showbus()
      } else if (that.data.showclick == 'walk') {
        that.showwalk()
      }
    }
    
  },

  timeStamp: function (StatusMinute) {
    var day = parseInt(StatusMinute / 60 / 24);
    var hour = parseInt(StatusMinute / 60 % 24);
    var min = parseInt(StatusMinute % 60);
    StatusMinute = "";
    if(day > 0) {
      StatusMinute = day + "天";
    }
    if (hour > 0) {
      StatusMinute += hour + "小时";
    }
    if (min > 0) {
      StatusMinute += parseFloat(min) + "分钟";
    }
    //三元运算符 传入的分钟数不够一分钟 默认为0分钟，else return 运算后的StatusMinute 
    return StatusMinute == "" ? "0分钟" : StatusMinute;
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
    return {
      path: '/pages/exampleShow/map/examplesDiDi/examplesDiDi',
      title: '你若安好，便是晴天~',
      imageUrl: 'http://www.tminlife.cn/wxapp/share/map.png'
    }
  }
})