import React, { Component } from "react";
import _ from "lodash";

import ChoiceGroup from "./ChoiceGroup";
import SizeGroup from "./SizeGroup"

export default class ChoiceForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pickedChoice: "",
      pickedOption: "",
      product: { choices: [] },
      pickedChoice: [],
      isListView: true,
      pickedSize: { size_level: 0 },
    };

    this.updateShoppingCartList = this.updateShoppingCartList.bind(this);
    this.updateOrderItemChoice = this.updateOrderItemChoice.bind(this);
    this.updateOrderItemSize = this.updateOrderItemSize.bind(this);
  }

  componentDidMount() {
    this.setState({
      product: this.props.product,
      pickedSize: this.props.product.sizes.length > 0 ? this.props.product.sizes[0] : { size_level: 0 }
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      product: newProps.product,
      pickedSize: newProps.product.sizes.length > 0 ? newProps.product.sizes[0] : { size_level: 0 }

    });
  }

  /**
   * call the function in app.js to update details of shopping cart item list
   *
   * @param {bool} isCallApi- will call api if true and update database also broadcasting this item to the channel
   * @param {product} orderItem- new order item need to be modified
   * @param {'add' or 'sub'} action- modifier
   * @param {string} orderId- order id is the PK in temp_orders table
   * @param {string} tableId- table id
   */
  updateShoppingCartList() {
    const orderItem = {
      ...this.state.product,
      choices: this.state.product.choices.map(choice => {

        return { ...choice, pickedChoice: this.state.pickedChoice.filter(x => choice.choices.find(y => y.product_ext_id == x.product_ext_id)) };
      }),
      pickedSize: this.state.pickedSize
    };
    this.props.updateShoppingCartList(
      true,
      orderItem,
      this.props.mode,
      "add",
      this.props.orderId,
      this.props.tableNumber
    );
    this.props.closeChoiceForm();
  }

  /**
   * set picked choice for saving as order item
   * @param {string} pickedChoice
   * @param {boolean} action
   */
  updateOrderItemChoice(pickedChoice, action) {
    console.log({ pickedChoice, action });
    if (action) {
      console.log(pickedChoice.type != 8889);

      this.setState({
        pickedChoice: pickedChoice.type != 8889
          ? [...this.state.pickedChoice.filter(pc => pc.type != pickedChoice.type), pickedChoice]
          : [...this.state.pickedChoice, pickedChoice]
      });

    } else {
      this.setState({
        pickedChoice: this.state.pickedChoice.filter(
          choice => !_.isEqual(choice, pickedChoice)
        )
      });
    }
  }

  /**
 * set picked size for saving as order item
 * @param {object} pickedChoice
 */
  updateOrderItemSize(pickedSize) {
    this.setState({ pickedSize })
  }

  render() {
    const imgSrc = `/table/public/images/items/${this.state.product.image}`;


    return (
      <div>
        <div
          onClick={this.props.closeChoiceForm}
          className="choice-form-cover"
        />
        <div className="choice-form">
          <div className="header">
            <div className="choice-form-img-container">
              <img src={imgSrc} alt={this.state.product.name} />
            </div>
            <div className="choice-form-product-info">
              <div className="choice-form-product-name">
                {this.state.product.name}
              </div>
              <div className="choice-form-product-price">
                ${this.state.product.price}
              </div>
            </div>
            <div className="choice-form__view-button__container">
              <div className="choice-form__view-button">
                <i
                  className="material-icons"
                  onClick={() => {
                    this.setState({ isListView: !this.state.isListView });
                  }}
                >
                  {this.state.isListView ? "view_module" : "view_list"}
                </i>
              </div>
            </div>
          </div>
          <div className="choice-form__list-container">
            <div className="choice-form__list-content">

              {this.props.product.sizes.length > 0 && <div className="size-group__container">
                <div className="size-group__title">{'Size'}</div>
                <div className="size-group__subtitle">
                  {this.props.app_conf.size_form_title}
                </div>
                <div className="size-group">
                  {this.props.product.sizes.map((size, index) => {
                    return (
                      <SizeGroup
                        key={`sizeGroup${index}`}
                        size={size}
                        pickedSize={this.state.pickedSize}
                        updateOrderItemSize={this.updateOrderItemSize}
                        app_conf={this.props.app_conf}
                        index={index}
                        isListView={this.state.isListView}
                      />
                    );
                  })}
                </div>
              </div>
              }
              {this.state.product.choices.map((choiceGroup, index) => {
                return (
                  <ChoiceGroup
                    key={`choiceGroup${index}`}
                    choiceGroup={choiceGroup}
                    updateOrderItemChoice={this.updateOrderItemChoice}
                    pickedChoice={this.state.pickedChoice}
                    app_conf={this.props.app_conf}
                    index={index}
                    isListView={this.state.isListView}
                  />
                );
              })}
            </div>
          </div>
          <div className="choice-form__confirm-button-container">
            <div
              onClick={this.updateShoppingCartList}
              className="choice-form__confirm-button"
            >
              {this.props.app_conf.choice_form_button}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
