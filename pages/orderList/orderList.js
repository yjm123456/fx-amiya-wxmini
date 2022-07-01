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

  },

  handleTabChange(event) {
    /**
     * WAIT_BUYER_PAY   待付款
      WAIT_SELLER_SEND_GOODS   待发货
      WAIT_BUYER_CONFIRM_GOODS   待收货
     */
    const { name } = event.detail;
    this.setData({
      active: name
    })
  },

  onReachBottom() {
    const { active } = this.data;
    switch (active) {
      case 0:
        this.selectComponent("#all").getOrderList()
        break;
      case 1:
        this.selectComponent("#waitPay").getOrderList()
        break;
      case 2:
        this.selectComponent("#waitSendGoods").getOrderList()
        break;
      default:
        this.selectComponent("#waitConfirm").getOrderList()
    }
  }
})
