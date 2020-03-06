const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const require = function (url, data = {}, method = 'GET', callback) {
  return new Promise(function(resolve,reject){
    wx.request({
      url: url,
      data: data,
      header: {
        'content-type': 'application/json'
      },
      method: method,
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.statusCode == 200) {
          resolve(res.data)
        } else {
          reject(res.errMsg)
        }
      },
      fail: function (err) {
        reject(err)
      },
      complete: function (res) {
        callback && callback()
      },
    })

  })
 
  
}
module.exports = {
  formatTime: formatTime,
  require
}
