//index.js
//获取应用实例
import config from '../../config'
import req from '../../utils/request'
var app = getApp()
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false , // loading
    userInfo: {},
    swiperCurrent: 0,  
    scrollTop:"0",
    loadingMoreHidden:true,

    serverUrl:config.serverUrl,
    goodsList:[],
    banners:[]
  },

  //事件处理函数
  swiperchange: function(e) {
      //console.log(e.detail.current)
       this.setData({  
        swiperCurrent: e.detail.current  
    })  
  },
  toDetailsTap:function(e){
    wx.navigateTo({
      url:"/pages/goods-details/index?id="+e.currentTarget.dataset.id
    })
  },
  tapBanner: function(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  scroll: function (e) {
    var that = this,scrollTop=that.data.scrollTop;
    that.setData({
      scrollTop:e.detail.scrollTop
    })
  },
  onLoad: function () {
    var that = this
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })

    this.loadBanners()
    this.loadProducts()
  },
  loadProducts(){
    return req.get('/api/product/latest')
      .then(res => res.data)
      .then(data => {
        if (data.code === 0) {
          this.setData({
            goodsList: data.data
          })
        }
      })
  },
  loadBanners(){
    return req.get('/api/banner')
      .then(res=>res.data)
      .then(data=>{
        if(data.code === 0){
          this.setData({
            banners: data.data
          })
        }
      })
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh() {
    wx.showLoading({
      title: '',
    })
    this.loadBanners()
      .then(()=>this.loadProducts()
          .then(()=>{
            wx.hideLoading()
            wx.stopPullDownRefresh()
          }))
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
})
