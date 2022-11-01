// pages/skinCare/skinCare.js
import http from '../../utils/http';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {
    iscustomer,
    isAuthorizationUserInfo
} from "./../../api/user";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: '',
        sysheight: '',
        showShare: false,
        options: [{
            name: '微信',
            icon: 'wechat',
            openType: 'share'
        }],
        controlAuthPhone: false,
        showVoucherTip: false,
        numList:[],
        saleCount:78,
        goodsInfo:{}
        // msgList: [    { url: "url", title: "131****9898已下单" },    { url: "url", title: "131****9898已下单" },    { url: "url", title: "131****9898已下单" }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const {
            name
        } = options;
        this.setData({
            name: name
        });
        var code=name+'mfq';
        this.getSkincareInfo(code);
        this.getMoble();
        wx.getSystemInfo({ //获取设备屏幕真实高度
            success: (result) => {
                this.setData({
                    sysheight: result.windowHeight
                })
            },
        })
    },
    // 根据商品编号获取商品详情,同时添加一个quantity字段表示购买数量默认值为0
    getSkincareInfo(code) {
        this.setData({
            code
        })
        //获取的信息包含商品信息轮播图信息和对应的医院价格复制给goodsinfo同时添加一个默认购买数量quantity:1
        http("get", `/Goods/infoBySimpleCode/${code}`, ).then(res => {
            if (res.code === 0) {
                const {
                    goodsInfo
                } = res.data;
                if (goodsInfo.goodsDetailHtml) {
                    goodsInfo.goodsDetailHtml = goodsInfo.goodsDetailHtml.replace(/\<img/g, '<img style="width:100%;height:auto;display:block"')
                }
                this.setData({
                    goodsInfo,
                    goodsInfo: {
                        ...goodsInfo,
                        quantity: 1,
                        allmoney:goodsInfo.salePrice                       
                    }
                })
            }
        })
    },
    getMoble(){
        var numArray = new Array("139","138","137","136","135","134","159","158","157","150","151","152","188","187","182","183","184","178","130","131","132","156","155","186","185","176","133","153","189","180","181","177");  //这是目前找到的除了数据卡外的手机卡前三位，类型是字符串数组
        var numList = "";  //创建一个数组用来存放10个手机号
        var arraryLength = numArray.length;  //获取数组长度，这样如果手机号前三位取值单位发生变化，在下一步求i的地方就不用修改随机数取值范围了
        for( var n = 0; n < 10; n++){
            var i = parseInt( Math.random() * arraryLength); //注意乘以的是上面numArray数组的长度，这样就可以取出数组中的随机一个数。random的取值范围是大于等于0.0，小于1.0，相乘后得到的就是0到（数组长度-1）的值。
            var num = numArray[i];  //取出随机的手机号前三位并赋值给num，手机号前三位是字符串类型的
            for ( var j = 0; j < 8; j++){
                num = num + Math.floor(Math.random() * 10);   //num是字符串，后面的数字被当做字符串。所以变成两个字符串拼接了
                var result = num.substr(0,3) + "****" + num.substr(7)

            }
            if(n == 0){
                numList = numList + result;  //第一个手机号前不出现“，”
            }else{
                numList = numList = numList +"已下单" + "," + result;//从第一个手机号后面到最后一个之前用逗号分隔
            }

        }
        console.log(numList);
        numList= numList.split(',').map(_item => {
            return {
                title:_item
            }
        })
        this.setData({
            numList:numList
        })

    },
    toOrder(event) {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                const {goodsInfo}=this.data;
                const {
                    name
                } = event.currentTarget.dataset;
                wx.navigateTo({
                    url: '/pages/LiveAnchorOrder/LiveAnchorOrder?name=' + name + '&type=mf&goodsInfo='+encodeURIComponent(JSON.stringify([goodsInfo])),
                })
            } else {
                this.showVoucherTips()
            }
        })
    },
    isCustomer(callback) {
        iscustomer().then(res => {
            if (res.code === 0) {
                const {
                    isCustomer
                } = res.data;
                callback && callback(isCustomer)
            }
        })
    },
    //显示绑定赠送抵用券提示
    showVoucherTips() {
        Dialog.alert({
            title: '新人福利',
            theme: 'round-button',
            confirmButtonText: '立即领取',
            closeOnClickOverlay: true,
            customStyle: 'display:flex;flex-direction:column;justify-content:center;align-items:center;background-color: transparent !important;',
            selector: "#skbind_tip",
            context:this
        }).then(() => {
            this.handleBindPhone();
        });
    },
    // 绑定手机号
    handleBindPhone() {
        this.setData({
            controlAuthPhone: true
        })
    },
    // 成功绑定手机号
    successBindPhone() {
        this.setData({
            controlAuthPhone: false
        })
        //绑定成功后获取分享信息
        this.getShareInfo();
    },

    // 取消绑定手机号
    cancelBindPhone() {
        this.setData({
            controlAuthPhone: false
        })
    },
    //抵用券分享
    share(e) {
        this.setData({
            showShare: true
        });
    },
    onClose() {
        this.setData({
            showShare: false
        });
    },

    onSelect(event) {
        this.onClose();
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: '分享给好友',
            path: '/pages/skinCare/skinCare?name=' + this.data.name
        }
    }
})