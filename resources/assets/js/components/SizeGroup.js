import React from "react"

class SizeGroup extends React.Component {
    render() {
        // const imgSrc = `url("/table/public/images/items/${this.props.imgSrc}")`;
        return (

            <div className="choice-group__content" onClick={() => { this.props.updateOrderItemSize(this.props.size) }}>
                {this.props.size.name} - ${this.props.size.price} - {this.props.size.size_level === this.props.pickedSize.size_level ? "Y" : "N"}

            </div>

        );
    }
}

export default SizeGroup