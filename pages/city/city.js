import { city } from "./../../data/city";

Page({
  data: {
    // 当前点击字母
    showLetter: "",

    // 滚动高度
    winHeight: 0,

    // 城市列表
    cityList: city.data.cities,

    // 点击字母弹出
    isShowLetter: false,

    //置顶高度
    scrollTop: 0,

    //置顶id
    scrollTopId: '',

    // 当前城市
    city: "",

    // 右边字母表
    searchLetter: ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"],

    // 热门城市
    hotcityList: [{ cityCode: 310000, city: '上海市' }, { cityCode: 440100, city: '广州市' }, { cityCode: 330100, city: '杭州市' }, { cityCode: 320100, city: '南京市' }]
  },
  onLoad: function (e) {
    const sysInfo = wx.getSystemInfoSync();
    this.setData({
      winHeight: sysInfo.windowHeight,
      city: e.city ? e.city : ''
    })
  },

  // 点击字母滚动
  clickLetter: function (e) {
    const showLetter = e.currentTarget.dataset.letter;
    this.setData({
      showLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    setTimeout(() => {
      this.setData({
        isShowLetter: false
      })
    }, 1000)
  },

  //选择城市
  bindCity: function (e) {
    this.setData({ city: e.currentTarget.dataset.city })
    this.back(this.data.city);
  },

  //选择热门城市
  bindHotCity: function (e) {
    this.setData({ city: e.currentTarget.dataset.city })
    this.back(this.data.city);
  },

  // 返回上一页
  back(city) {
    wx.setStorageSync('currentCity', city)
    //当前页面
    const pages = getCurrentPages();
    //上一页面
    const prevPage = pages[pages.length - 2];
    prevPage.setData({
      //直接给上一个页面赋值
      currentCity: city
    });
    wx.navigateBack({
      //返回
      delta: 1
    })
  },

  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({
      scrollTop: 0,
    })
  }
})