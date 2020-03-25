import React, { Component } from "react";
import { QRCode } from "react-qr-svg";
import { Link } from "react-router-dom";
import Axios from "axios";

import OrderItemCard from "./OrderItemCard";

export default class Confirm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qrString: "",
      shoppingCartList: [],
      orderId: "",
      tableId: "",
      isShowConfirm: false,
      allowSubmit: true
    };
    this.createQrCode = this.createQrCode.bind(this);
    this.getOrderItemQuantityTotal = this.getOrderItemQuantityTotal.bind(this);
    this.getTotalPrice = this.getTotalPrice.bind(this);
    this.confirmOrder = this.confirmOrder.bind(this);
  }

  componentDidMount() {
    if (
      this.props.mode === "preorder" &&
      localStorage.getItem("preorderList")
    ) {
      this.setState({
        shoppingCartList: JSON.parse(localStorage.getItem("preorderList"))
      });
    } else if (this.props.mode === "table") {
      this.setState({ shoppingCartList: this.props.shoppingCartList });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.mode === "table") {
      this.setState({ shoppingCartList: newProps.shoppingCartList });
    }
  }

  getOrderItemQuantityTotal() {
    let quantity = 0;

    this.state.shoppingCartList.map(orderItem => {
      quantity += orderItem.quantity;
    });

    return quantity;
  }

  createQrCode() {
    let qr = "=QROD=";
    if (
      this.state.shoppingCartList !== null &&
      this.state.shoppingCartList.length !== 0
    ) {
      this.state.shoppingCartList.forEach(el => {
        qr = qr + el.item.upc + ",";
        qr = qr + el.quantity + ",";
        qr = qr + (el.item.pickedSize ? el.item.pickedSize.size_level : 0) + ";";

        el.item.choices.forEach(choice => {
          if (choice.pickedChoice !== null) {
            choice.pickedChoice.forEach(ele => {
              qr = qr + ele.barcode + "," + el.quantity + "," + 0 + ";";
            });
          }
        });
        el.item.options.forEach(option => {
          qr = qr + option.option_name + "," + option.pickedOption + ",";
        });
        //qr = qr + "0" + ";";
      });
      this.QrValue = qr;
    } else {
      this.QrValue = qr;
    }

    return qr;
  }

  getTotalPrice() {
    let sum = 0;

    console.log(this.state.shoppingCartList)

    this.state.shoppingCartList.map(orderItem => {
      let resPrice = (orderItem.item.pickedSize && orderItem.item.pickedSize.size_level !== 0) ? orderItem.item.pickedSize.price : orderItem.item.price;
      sum += resPrice * orderItem.quantity;
      if (orderItem.item.choices) {
        orderItem.item.choices.forEach(c => {
          if (c.pickedChoice) {
            c.pickedChoice.forEach(pc => {
              sum += parseFloat(pc.price) * orderItem.quantity;
            })
          }
        })
      }
    });

    return sum.toFixed(2);
  }

  confirmOrder() {
    if (this.state.allowSubmit) {
      this.setState({ allowSubmit: false });
      Axios.post(`/table/public/api/confirm`, {
        orderList: this.state.shoppingCartList,
        order_id: this.props.match.params.orderId,
        store_id: "4",
        store_name: "some store",
        store_url: "http://kidsnparty.com.au/table/public",
        total: this.getTotalPrice(),
        paymentMethod: "Dive in",
        v: this.props.v,
        lang: this.props.lang,
        userId: this.props.userId
      })
        .then(res => {
          this.props.updateHistoryCartList(res.data.historyList);
          this.props.history.push(
            `/table/public/complete/${this.props.match.params.tableId}/${
            this.props.match.params.orderId
            }`
          );
        })
        .catch(err => {
          window.location.reload();
          // console.log(err);
        });
    }
  }

  render() {
    const qr_section = (
      <div className="qrcode-section">
        <div className="qrcode-container">
          <QRCode
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="Q"
            style={{ width: 180 }}
            value={this.createQrCode()}
          />
        </div>
        <div className="confirm__subtitle">
          {this.props.match.params.mode === "preorder"
            ? this.props.app_conf.preorder_qr_tips
            : this.props.app_conf.tableorder_qr_tips}
        </div>
      </div>
    );

    console.log({ cartList: this.state.shoppingCartList });


    return (
      <div className="confirm">
        {this.state.isShowConfirm ? (
          <div className="confirm-modal">
            <div className="order-confirm-dialog">
              <div className="order-confirm-icon">
                <img
                  src="/table/public/images/layout/confirm_order.png"
                  alt=""
                  className="order-confirm-icon__img"
                />
                <span className="order-confirm-title">
                  Order will be Submitted
                </span>
              </div>
              <div className="order-confirm-message">
                {`Are you sure to submit`}
                <br />
                {`this order`}
              </div>
              <div className="button-pannel">
                <div onClick={this.confirmOrder} className="confirm-button">
                  {this.props.app_conf.confirm_order}
                </div>
                <div
                  onClick={() => {
                    this.setState({ isShowConfirm: false });
                  }}
                  className="cancel-button"
                >
                  {this.props.app_conf.cancel}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {this.props.match.params.mode === "preorder" ? (
          <div className="confirm__title">
            <img src="/table/public/images/layout/icon_confirm.png" alt="" />
            <span className="confirm__title-text">
              {this.props.app_conf.preorder_confirm_text}
            </span>
          </div>
        ) : null}
        {this.props.match.params.mode === "preorder" ? qr_section : null}
        <div className="confirm__order-list__title">
          <span className="confirm__order-list__title-text">
            {this.props.app_conf.your_order_title}
          </span>
          <span className="confirm__order-list__quantity">
            <span className="confirm__order-list__quantity-title">
              {this.props.app_conf.quantity}
            </span>
            <span className="confirm__order-list__quantity-number">
              {this.getOrderItemQuantityTotal()}
            </span>
          </span>
        </div>
        <div className="confirm__order-list__container">
          {this.state.shoppingCartList.map((orderItem, index) => {
            return (
              <OrderItemCard
                orderItem={orderItem}
                mode={2}
                key={`orderItemInShoppingCart${index}`}
              />
            );
          })}
        </div>

        <div>
          <div className="confirm__order-list__total">
            <span className="confirm__order-list__total-title">
              {this.props.app_conf.confirm_total}
            </span>
            <span className="confirm__order-list__total-number">
              ${this.getTotalPrice()}
            </span>
          </div>
          <div className="confirm__back-button-container">
            <Link
              to={
                this.props.mode === "preorder"
                  ? `/table/public/preorder`
                  : this.props.originPath
              }
              className="confirm__back-button"
            >
              {this.props.app_conf.continue_order}
            </Link>
          </div>
        </div>

        {this.props.match.params.mode === "table" ? (
          <div className="confirm__footer">
            <span className="confirm__footer__total">
              <span className="text">{this.props.app_conf.total}</span>
              <span className="number">${this.getTotalPrice()}</span>
            </span>
            <span className="confirm__footer__table-number">
              <span className="text">
                {this.props.app_conf.app_header_title}
              </span>
              <span className="number">{this.props.match.params.tableId}</span>
            </span>
            <span className="confirm__footer__order-number">
              <span className="text">{this.props.app_conf.order}</span>
              <span className="number">{this.props.match.params.orderId}</span>
            </span>
            <span
              onClick={() => {
                this.setState({ isShowConfirm: true });
              }}
              className="confirm__footer__button"
            >
              <span>{this.props.app_conf.confirm_order}</span>
            </span>
          </div>
        ) : null}
      </div>
    );
  }
}
