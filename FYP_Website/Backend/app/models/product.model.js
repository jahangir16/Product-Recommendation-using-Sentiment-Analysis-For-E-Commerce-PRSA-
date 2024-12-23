// models/product.model.js
module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("products", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    productname: {
      type: Sequelize.STRING
    },
    brandname: {
      type: Sequelize.STRING
    },
    discountprice: {
      type: Sequelize.STRING
    },
    originalprice: {
      type: Sequelize.STRING
    },
    rating: {
      type: Sequelize.STRING
    },
    category: {
      type: Sequelize.STRING
    },
    producturl: {
      type: Sequelize.STRING
    },
    image_urls: {
      type: Sequelize.STRING
    },
    sentiment_analyzed: {
      type: Sequelize.BOOLEAN
    }
  }, {
    timestamps: false, // add this line
    // Other configurations if needed
    
});

  return Product;
};