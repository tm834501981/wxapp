//index.js
//获取应用实例
const app = getApp()
let dataShow = require('../../utils/data.js')
Page({
  data: {
    indexInfo: [], //首页数据
    showphotosShow: false, //展示照片
    imgindex: 0 ,//当前照片数目
    desWord: '', //当前说说
  },
  likeChange(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    console.log(index)
    that.data.indexInfo.photos[index].like = !that.data.indexInfo.photos[index].like
    that.setData({
      indexInfo: that.data.indexInfo
    })
  },
  onLoad: function () {
    // wx.showLoading({
    //   title: '精彩加载ing~~',
    // })
    let that = this
    console.log(dataShow.indexInfo)
    that.setData({
      indexInfo: dataShow.indexInfo
    })
  },
  // 关闭详细照片
  closephotosShow() {
    let that = this
    that.setData({
      showphotosShow: false
    })
  },
  //改变当前current
  changeCurrent(e) {
    let that = this
    let current = e.detail.current;
    that.setData({
      imgindex:current
    })
  },
  // 展示详细照片
  showBigImg(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let imgindex = e.currentTarget.dataset.imgindex
    let showPhotos = that.data.indexInfo.photos[index].content
    let desWord = that.data.indexInfo.photos[index].des
    console.log(imgindex, showPhotos)
    that.setData({
      showphotosShow: true,
      showPhotos,
      imgindex,
      desWord
    })
  },
  onShareAppMessage() {
    return {
      path:'/pages/index/index',
      title: '桃花坞里桃花庵，桃花庵下桃花仙；桃花仙人种桃树，又摘桃花卖酒钱。'
      
    }
  }
})
