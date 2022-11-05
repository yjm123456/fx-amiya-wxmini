// pages/beautyDiary/beautyDiary.js
import http from '../../utils/http';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[],
        pageNum: 1,
        pageSize: 10,
        nextPage: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getDiary()
    },
    //获取美丽日记
    getDiary() {
        const {
            pageNum,
            pageSize,
            nextPage
        } = this.data;
        if (!nextPage) return;
        const data = {
            pageNum,
            pageSize
        }
        http("get", `/BeautyDiary/list`, data).then(res => {
            if (res.code === 0) {
                let {
                    list,
                    totalCount
                } = res.data.beautyDiaryManages;
                this.setData({
                    list: [...this.data.list, ...list],
                })
                //callback && callback();
                this.data.pageNum++;
                if (this.data.list.length === totalCount) {
                    this.setData({
                        nextPage: false
                    })
                }
            }
        })
    },
    toDiary(event){
        const{url}=event.currentTarget.dataset;
        let link=url.replace("#rd","");
        console.log(url);
        wx.navigateTo({
          url: '/pages/wechatDiary/wechatDiary?url='+encodeURIComponent(link),
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        this.getDiary();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})