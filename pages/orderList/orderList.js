Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.active) {
            this.setData({
                active: parseInt(options.active)
            });
        }
    },

    handleTabChange(event) {
        
        const {
            name
        } = event.detail;
        this.setData({
            active: name
        })
    },

    onReachBottom() {
        const {
            active
        } = this.data;
        switch (active) {
            case 0:
                this.selectComponent("#all").getOrderList()
                break;
            case 1:
                this.selectComponent("#waitPay").getOrderList()
                break;
            case 2:
                this.selectComponent("#pay").getOrderList()               
                break;
            case 3:
                this.selectComponent("#waitSendGoods").getOrderList()
                break;
            case 4:
                this.selectComponent("#waitConfirm").getOrderList()
                break;
            case 5:
                this.selectComponent("#waitEvaluation").getOrderList();
                break;
            case 6:
                this.selectComponent("#afterSales").getOrderList();
                break;
            default:
                this.selectComponent("#all").getOrderList()
        }
    }
})