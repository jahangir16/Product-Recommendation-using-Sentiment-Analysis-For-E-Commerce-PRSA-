exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
  };

// user.controller.js
const db = require("../models");
const Favorite = db.favorite;
const Product = db.product;

exports.addFavoriteProduct = (req, res) => {
  const userId = req.userId; // Assuming you have middleware to set req.userId
  const productId = req.body.productId;

  Favorite.create({
    user_id: userId,
    product_id: productId
  })
  .then(() => {
    res.send({ message: "Product added to favorites successfully!" });
  })
  .catch(err => {
    res.status(500).send({ message: err.message || "Error adding product to favorites" });
  });
};


exports.removeFavoriteProduct = (req, res) => {
  const userId = req.userId; // Assuming you have middleware to set req.userId
  const productId = req.body.productId;

  Favorite.destroy({
    where: {
      user_id: userId,
      product_id: productId
    }
  })
  .then(() => {
    res.send({ message: "Product removed from favorites successfully!" });
  })
  .catch(err => {
    res.status(500).send({ message: err.message || "Error removing product from favorites" });
  });
};


exports.getFavoriteProducts = (req, res) => {
  const userId = req.userId; // Assuming you have middleware to set req.userId

  console.log(`Fetching favorite products for user ID: ${userId}`);

  Favorite.findAll({
    where: { user_id: userId },
    include: [{
      model: Product,
      as: 'product'
    }]
  })
  .then(favorites => {
    console.log(`Favorites found: ${favorites.length}`);
    const favoriteProducts = favorites.map(favorite => favorite.product);
    const processedProducts = favoriteProducts.map(product => {
      const data = product.dataValues;
      const processedProduct = {
        ...data,
        productname: data.productname.replace(/[{}"]/g, ''),
        brandname: data.brandname.replace(/[{}"]/g, ''),
        discountprice: data.discountprice.replace(/[{}"]/g, ''),
        originalprice: data.originalprice.replace(/[{}"]/g, ''),
        rating: data.rating.replace(/[{}"]/g, ''),
        image_urls: data.image_urls.replace(/[{}"]/g, ''),
        sentiment_analyzed: data.sentiment_analyzed
      };
      return processedProduct;
    });
    res.send(processedProducts);
  })
  .catch(err => {
    console.error(`Error retrieving favorite products: ${err.message}`);
    res.status(500).send({ message: err.message || "Error retrieving favorite products" });
  });
};
