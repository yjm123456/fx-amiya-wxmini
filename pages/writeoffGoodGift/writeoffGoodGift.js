import http from '../../utils/http';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 0,
        categoryIdList: [],
        selectCategoryId: '',
        pageNum: 1,
        pageSize: 10,
        nextPage: true,
        show: false,
        list:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
     
        this.getGiftCategoryList();
    },
    //获取所有的礼品分类
    getGiftCategoryList() {
        http("get", `/Gift/nameList`).then(res => {
            if (res.code === 0) {
                this.setData({
                    categoryIdList: res.data.nameList
                })
                this.setData({
                    selectCategoryId: (res.data.nameList[0]).id
                })
                this.setData({
                    active:0,
                    show: true
                })
                this.getOrderList();
            }
        })
    },
    //查看物流信息
    lookLogistics(e) {
        const {
            courierNumber,
            receiverPhone,
            expressId
        } = e.currentTarget.dataset.item
        // courierNumber={{item.courierNumber}}&expressId={{item.expressId}}&receiverPhone={{item.receiverPhone
        if (expressId) {
            wx.navigateTo({
                url: '/pages/logistics/logistics?courierNumber=' + courierNumber + '&receiverPhone=' + receiverPhone + '&expressId=' + expressId + '&type=1',
            })
        } else {
            wx.showToast({
                title: '暂无物流信息',
                icon: 'none',
                duration: 2000
            })
        }
    },
    getOrderList(callback) {
        const {
            pageNum,
            pageSize,
            nextPage,
            selectCategoryId
        } = this.data;
        if (!nextPage) return;
        const data = {
            pageNum,
            pageSize,
            categoryId: selectCategoryId
        }
        http("get", `/Gift/receiveGift`, data).then(res => {
            if (res.code === 0) {
                const {
                    list,
                    totalCount
                } = res.data.receiveGift;
                this.setData({
                    list: [...this.data.list, ...list],
                })
                callback && callback();
                this.data.pageNum++;
                if (this.data.list.length === totalCount) {
                    this.setData({
                        nextPage: false
                    })
                }
            }
        })
    },
    handleTabChange(event) {
        const {
            name
        } = event.detail;
        this.setData({
            active: name
        })
    },
    onChange(event) {
        this.handleReset();
        this.setData({
            selectCategoryId:event.detail.name
        })
        this.getOrderList();
      },
    handleReset() {
        this.setData({
            pageNum: 1,
            list: [],
            nextPage: true,
        })
    },

    onReachBottom() {
        const {
            active
        } = this.data;
        switch (active) {
            case 0:
                this.selectComponent("#notClaimed").getOrderList()
                break;
            default:
                this.selectComponent("#received")
        }
    }
})