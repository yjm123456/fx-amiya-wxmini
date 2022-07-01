import http from '../../../utils/http';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    beautyDiaryManage:{},
    // 时间转化
    createDate:'',
    // 点赞数量
    givingLikes:'',
    play:false,
    stopFlag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {id,givingLikes} = options
    this.setData({
      id,
      givingLikes
    })
   
  },
  onShow(){
    const {id} = this.data
    this.getDiaryDetail(id)
  },
  // 获取详情数据
  getDiaryDetail(id){
    http("get", `/BeautyDiary/${id}`).then(res => {
      if (res.code === 0) {
        const {beautyDiaryManage} = res.data;
        // 判断分享出去的链接 如果是false提示未发布 
        if(beautyDiaryManage.releaseState === false){
          wx.showToast({ title: '该日记未发布', icon: 'none', duration: 2000 })
        }else{
           // 处理图片
            if(beautyDiaryManage.detailsDescription){
              beautyDiaryManage.detailsDescription = beautyDiaryManage.detailsDescription.replace(/\<img/g, '< img style="width:100%;height:auto;display:block"')
            }
            // 时间转换
            if(beautyDiaryManage.createDate){
              var data= new Date(beautyDiaryManage.createDate).toJSON();
                var creationTimeStr= new Date(+new Date(data) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
                // 兼容iOS 出现NaN情况
                let times = creationTimeStr.replace(/\-/g, '/') 
                let a = new Date(times).getTime();
                const date = new Date(a);
                const Y = date.getFullYear() + '-';
                const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                const D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + '  ';
                const dateString = Y + M + D ;
                this.setData({
                  createDate:dateString
                })
            }
            this.setData({
              beautyDiaryManage,
              givingLikes:beautyDiaryManage.givingLikes,
            })
            this.getViews(id)
        }
      }
    })
  },
  // 浏览量
  getViews(id){
    http("put", `/BeautyDiary/addViews/${id}`).then(res => {})
  },
  // 点赞
  like(e){
    const {id} = e.currentTarget.dataset
    let that = this
    http("put", `/BeautyDiary/${id}`).then(res => {
      if (res.code === 0) {
        that.setData({
          givingLikes:Number(that.data.givingLikes) + 1
        })
        wx.showToast({ title: '点赞成功', icon: 'none', duration: 2000 })
      }
    })
  },
  shareButton(){
    this.onShareAppMessage()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const {coverTitle ,  thumbPictureUrl , id } = this.data.beautyDiaryManage
    let shareObj = {
      title : coverTitle ,
      path : '/pages/index/diaryDetail/diaryDetail?id=' + id ,
      imageUrl : thumbPictureUrl
    }
    return shareObj
  },
  // 轮播图
  swiperChange(e){
    const { current } = e.detail
    if(current>=1){
      let VideoContext = wx.createVideoContext('myVideo')
      VideoContext.pause()
      this.setData({
        play:false,
      })
    }else{
      this.setData({
        // play:true,
        stopFlag:false
      })
    }
  },
  // videoTap(){
  //   this.setData({
  //     play:true,
  //     stopFlag:false
  //   })
  // },
  //开始播放按钮或者继续播放函数
  bindplay:function(){
    // console.log("开始播放")
    this.setData({
        autoplay: false,
    })
},

funended: function () {//播放结束按钮函数
    // console.log("播放结束")
    this.setData({
        autoplay: true,
    })
},
})