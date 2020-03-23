import React, { Component } from "react";

export default class ButtonIncrease extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`button-increase ${this.props.mode}`}>
        <i onClick={this.props.onClick} className="material-icons">
          {"add"}
        </i>
      </div>
    );
  }
}
