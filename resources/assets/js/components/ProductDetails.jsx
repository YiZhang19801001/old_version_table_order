import React from "react";

const ProductDetails = ({ product, close }) => {
  return (
    <div className="component-product-details" onClick={close}>
      <div className="component-product-details__container">
        <img
          className="component-product-details__image"
          src={`/table/public/images/items/${product.image}`}
          alt=""
        />
        <div className="component-product-details__information">
          <div className="component-product-details__information__name">
            {product.name}
          </div>
          <div className="component-product-details__information__price">
            ${product.price}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
