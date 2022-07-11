// pages/shoppingCart/shoppingCart.js
import http from '../../utils/http';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectAll: false,
        //购物车商品列表
        list: [],
        //选中的商品列表
        result: [],
        sum: 0,
        //商品列表
        goodsList: [],
        pageNum: 1,
        pageSize: 10,
        nextPage: true,
        pageNums: 1,
        pageSizes: 10,
        //当前商品展示列表页码
        currentPageIndex: 1,
        goodsNextPage:true
    },
    onChange(event) {
        this.setData({
            result: event.detail,
        });
        if (this.data.result.length === this.data.list.length) {
            this.setData({
                selectAll: true
            })
        } else {
            this.setData({
                selectAll: false
            })
        }
        this.getAllMoney()
    },
    deleteFromCart() {
        const {goodsis,id}=e.currentTarget.dataset;
        const data={
            Id:id,
            status:0
        }
        http("put","/GoodsShopCar",data).then(res=>{
            if(res.code===0){
                this.getCartProduct();
            }
        });
    },
    //单元格触发复选框点击事件
    toggle(event) {
        const {
            index
        } = event.currentTarget.dataset;
        const checkbox = this.selectComponent(`.checkboxes-${index}`);
        checkbox.toggle();
    },

    noop() {},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getCartProduct();
        this.getGoodsList();
    },
    toShopMall() {
        wx.navigateTo({
          url: '/pages/shoppingMall/shoppingMall',
        })
    },
    getCartProduct() {
        const {  pageNum, pageSize } = this.data;
    const data = {
      keyword:"", pageNum, pageSize
    }
    http("get", `/GoodsShopCar/goodsShopCarList`, data).then(res => {
      if (res.code === 0) {
        let { list, totalCount } = res.data.goodsShopCarInfos;
        this.setData({
          list: [...this.data.list, ...list],
        })
        this.data.pageNum++
        if (this.data.list.length === totalCount) {
          this.setData({
            nextPage: false
          })
          this.getGoodsList();
        }
        
      }
    })
        
    },
    radioChange(e) {
        console.log('触发')
        if (this.data.selectAll) {

            this.setData({
                selectAll: false,
                result: []
            })
            this.getAllMoney()
        } else {
            this.setData({
                selectAll: true,
                result: this.data.list.map(item => {
                    return item.id.toString()
                })
            })
            this.getAllMoney();
        }
    },
    getAllMoney() {
        let sumMoney = 0;
        for (let i = 0; i < this.data.result.length; i++) {
            for (let j = 0; j < this.data.list.length; j++) {
                console.log(this.data.result[i]);
                console.log(this.data.list[j].id);
                if (this.data.result[i] === this.data.list[j].id) {
                    console.log("加入");
                    sumMoney += this.data.list[j].price;
                }
            }
        }
        this.setData({
            sum: sumMoney * 100
        })
    },
    getGoodsList() {
        const {
            currentPageIndex,
            pageSize,
            goodsNextPage
        } = this.data;
        if (!goodsNextPage) return;
        const pageNum = currentPageIndex
        const data = {
            pageNum,
            pageSize
        }
        http("get", `/Goods/likeInfoList`, data).then(res => {
            if (res.code === 0) {
                let {
                    list,
                    totalCount
                } = res.data.goodsInfos;
                this.setData({
                    goodsList: [...this.data.goodsList, ...list],
                })
                //callback && callback();
                this.data.currentPageIndex++;
                if (this.data.list.length === totalCount) {
                    this.setData({
                        goodsNextPage: false
                    })
                }
            }
        })
    },
    // 商品详情
    goodsDetails(e) {
        const {
            goodsid
        } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/productDetails/productDetails?goodsId=${goodsid}`
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
        console.log("底部")
        this.getCartProduct()
        this.getGoodsList();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})