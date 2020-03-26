import React, { Component } from "react";

export default class ChoiceGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      choiceClass: {
        contentWrap: "",
        checkMarkWrapper: "",
        checkMark: "",
        iconCover: "",
        choiceInfo: ""
      },
      isListView: true
    };
    this.setChoice = this.setChoice.bind(this);
    this.toggleListView = this.toggleListView.bind(this);
  }

  componentWillMount() {
    this.setState({
      choiceClass: {
        contentWrapper: "choice-group__content-wrapper-listview",
        checkMarkWrap: "checkmark-wrap-listview",
        checkMark: "checkmark-listview",
        iconCover: "choice-group__icon-cover-listview",
        choiceInfo: "choice-group__choice-info-listview"
      },
      isListView: this.props.isListView ? this.props.isListView : true
    });
  }

  componentWillReceiveProps(newProps) {
    if (this.state.isListView !== newProps.isListView) {
      this.setState({ isListView: newProps.isListView });
      this.toggleListView();
    }
  }

  setChoice(choice, action) {
    this.props.updateOrderItemChoice(
      choice,
      action
    );
  }

  toggleListView() {
    if (this.state.isListView === true) {
      this.setState({
        choiceClass: {
          contentWrapper: "choice-group__content-wrapper",
          checkMarkWrap: "checkmark-wrap",
          checkMark: "checkmark",
          iconCover: "choice-group__icon-cover",
          choiceInfo: "choice-group__choice-info"
        },
        isListView: false
      });
    } else {
      this.setState({
        choiceClass: {
          contentWrapper: "choice-group__content-wrapper-listview",
          checkMarkWrap: "checkmark-wrap-listview",
          checkMark: "checkmark-listview",
          iconCover: "choice-group__icon-cover-listview",
          choiceInfo: "choice-group__choice-info-listview"
        },
        isListView: true
      });
    }
  }

  render() {
    // const imgSrc = `url("/table/public/images/items/${this.props.imgSrc}")`;
    return (
      <div className="size-group__container">
        <div className="size-group__title">{this.props.choiceGroup.type}</div>
        <div className="size-group__subtitle">
          {this.props.app_conf.choice_form_title}
        </div>
        <div className="size-group">
          {this.props.choiceGroup.choices.map((choice, index) => {
            const isActive = this.props.pickedChoice.find(pc => pc.product_ext_id === choice.product_ext_id)
            return (
              <div
                key={`choiceTag${index}`}
                className={`size-group__content ${isActive ? 'active' : ''}`}
                onClick={() => { this.setChoice(choice, !isActive) }}
              >
                {choice.name} {this.props.choiceGroup.type_id == 9998 ? null : (parseFloat(choice.price) === 0 ? "free" : `$${choice.price}`)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
