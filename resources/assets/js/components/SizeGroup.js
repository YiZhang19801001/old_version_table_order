import React from "react"

class SizeGroup extends React.Component {
    render() {
        // const imgSrc = `url("/table/public/images/items/${this.props.imgSrc}")`;
        return (

            <div
                className={
                    this.props.size.size_level === this.props.pickedSize.size_level ? "size-group__content active" : "size-group__content"
                }
                onClick={() => { this.props.updateOrderItemSize(this.props.size) }}>
                {this.props.size.name}  ${this.props.size.price}

            </div>

        );
    }
}

export default SizeGroup

