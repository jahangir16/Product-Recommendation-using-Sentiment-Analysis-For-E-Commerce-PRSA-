const db = require("../models");
const Product = db.product;
const Review = db.review;
/**
// Get all products with pagination
//you would make a GET request to /products?page=2&limit=20.
exports.getAllProducts = (req, res) => {
    const page = req.query.page ? req.query.page : 1; // Default to page 1
    const limit = req.query.limit ? req.query.limit : 10; // Default limit to 10 items
    const offset = (page - 1) * limit;

    Product.findAll({
        limit: +limit,
        offset: +offset
    })
    .then((products) => {
        // Preprocess the products
        const processedProducts = products.map(product => {
            const data = product.dataValues;
            const processedProduct = {
                ...data,
                productname: data.productname.replace(/[{}"]/g, ''),
                brandname: data.brandname.replace(/[{}"]/g, ''),
                discountprice: data.discountprice.replace(/[{}"]/g, ''),
                originalprice: data.originalprice.replace(/[{}"]/g, ''),
                rating: data.rating.replace(/[{}"]/g, ''),
                image_urls: data.image_urls.replace(/[{}"]/g, '')
            };
            return processedProduct;
        });
    
        res.send(processedProducts); // Send processed products data back to the client
    })
    .catch((err) => {
        res.status(500).send({ message: err.message || "Error retrieving products" });
    });
};

Let's break down data.productname.replace(/[{}"]/g, ''):

/[{}"]/g: This is a regular expression pattern enclosed within forward slashes /. 
The pattern [{}"] means match any of the characters {, }, or ".
 The g flag at the end indicates a global search, meaning it will replace all occurrences in the 
 string rather than just the first one.

'': This is the replacement string, which in this case is an empty string.
 It means that any occurrence of the characters {, }, or " in the data.productname string will be 
 replaced with nothing, effectively removing them from the string.

So, data.productname.replace(/[{}"]/g, '') essentially removes any occurrences of {, }, 
or " characters from the productname property of the data object. 

*/

// Get product with its reviews
exports.getProductWithReviews = (req, res) => {
    const productId = req.params.id;

    Product.findByPk(productId, { include: { model: Review, as: 'reviews' } })
        .then((product) => {
            if (!product) {
                return res.status(404).send({ message: "Product not found" });
            }

            // Preprocess the product data
            const { reviews: productReviews, ...data } = product.dataValues;
            const processedProduct = {
                ...data,
                productname: data.productname.replace(/[{}"]/g, ''),
                brandname: data.brandname.replace(/[{}"]/g, ''),
                discountprice: data.discountprice.replace(/[{}"]/g, ''),
                originalprice: data.originalprice.replace(/[{}"]/g, ''),
                rating: data.rating.replace(/[{}"]/g, ''),
                image_urls: data.image_urls.replace(/[{}"]/g, '')
            };

            // Check if there are any reviews
            const reviews = product.reviews;
            if (!reviews || reviews.length === 0) {
                return res.send({
                    product: processedProduct,
                    reviews: "No reviews"
                });
            }

            res.send({
                product: processedProduct,
                reviews: reviews,
            });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message || "Error retrieving product" });
        });
};

//you would make a GET request to /products?page=2&limit=20.
//, you can search for products by making a GET request to /products?search=samsung
exports.getAllProducts = (req, res) => {
    const page = req.query.page ? req.query.page : 1; // Default to page 1
    const limit = req.query.limit ? req.query.limit : 100; // Default limit to 12 items
    const offset = (page - 1) * limit;
    const search = req.query.search; // Get the search term from the query parameters
    const category = req.query.category; // Get the category from the query parameters

    // Define the where clause for the search and category
    const whereClause = {
        ...(search && { productname: { [db.Sequelize.Op.iLike]: `%${search}%` } }),
        ...(category && { category: category })
    };

    Product.findAll({
        limit: +limit,
        offset: +offset,
        where: whereClause
    })
    .then((products) => {
        // Preprocess the products
        const processedProducts = products.map(product => {
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

        res.send(processedProducts); // Send processed products data back to the client
    })
    .catch((err) => {
        res.status(500).send({ message: err.message || "Error retrieving products" });
    });
};

exports.getAllProductsByCategory = (req, res) => {
    const category = req.params.c; // Get the category from the request parameters

    // Query the database to get all products in the specified category
    Product.findAll({
        where: { category: category }
    })
    .then((products) => {
        const processedProducts = processProducts(products);
        res.send(processedProducts);
    })
    .catch((err) => {
        res.status(500).send({ message: err.message || "Error retrieving products" });
    });
}


// Function to process products
function processProducts(products) {
    return products.map(product => {
      const data = product;
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
  }
  
  // Get all products on which sentiment analysis performed successfully
  exports.allRecommendedProducts = (req, res) => {
    const page = req.query.page ? req.query.page : 1; // Default to page 1
    const limit = req.query.limit ? req.query.limit : 1000; // Default limit to 12 items
    const category = req.query.category; // Get the category from the query parameters
    const offset = (page - 1) * limit;
    Product.findAll({
        where: {sentiment_analyzed: true,
            ...(category && { category: category })
         },
        limit: +limit,
        offset: +offset
    })
    
      .then(async (products) => {
        const productScores = [];
  
        for (const product of products) {
          const reviews = await Review.findAll({
            where: { product_id: product.id }
          });
  
          const positiveReviews = reviews.filter(review => review.sentiment === "Positive").length;
          const totalReviews = reviews.length;
  
          // Clean the rating string to ensure it can be converted to float
          let ratingStr = product.rating || "0.0";
          ratingStr = ratingStr.replace(/[^0-9.]/g, '');
          const rating = parseFloat(ratingStr) || 0.0;
  
          // Clean the discount price and original price strings to ensure they can be converted to float
          const cleanPrice = (priceStr) => priceStr.replace(/[^0-9.]/g, '');
  
          const discountPriceStr = cleanPrice(product.discountprice || "0.0");
          const originalPriceStr = cleanPrice(product.originalprice || "0.0");
  
          const discount = parseFloat(discountPriceStr) / parseFloat(originalPriceStr) || 1.0;
  
          if (totalReviews > 0) {
            const sentimentScore = positiveReviews / totalReviews;
            const finalScore = (sentimentScore * 0.6) + (rating / 5 * 0.3) + (discount * 0.1);
            productScores.push({ 
              productname: product.productname, 
              brandname: product.brandname,
              discountprice: product.discountprice,
              category: product.category,
              originalprice: product.originalprice,
              rating: product.rating,
              image_urls: product.image_urls,
              sentiment_analyzed: product.sentiment_analyzed,
              FinalScore: finalScore, 
              id: product.id 
            });
          }
        }
  
        const rankedProducts = productScores.sort((a, b) => b.FinalScore - a.FinalScore);
        const processedRankedProducts = processProducts(rankedProducts);
        res.status(200).json(processedRankedProducts);
      })
      .catch((err) => {
        res.status(500).send({ message: err.message || "Error retrieving products" });
      });
  };


 
// Get product statistics
exports.getProductStatistics = async (req, res) => {
  try {
    // Get total number of products
    const totalProducts = await Product.count();

    // Get total number of products with sentiment_analyzed: true
    const totalSentimentAnalyzedProducts = await Product.count({
      where: { sentiment_analyzed: true }
    });

    // Send the response
    res.status(200).json({
      totalProducts,
      totalSentimentAnalyzedProducts
    });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error retrieving product statistics" });
  }
};

// Existing code...

/**
// Get all products
// Get all products with pagination
exports.getAllProducts = (req, res) => {
    const page = req.query.page ? req.query.page : 1; // Default to page 1
    const limit = req.query.limit ? req.query.limit : 10; // Default limit to 10 items
    const offset = (page - 1) * limit;

    Product.findAll({
        limit: +limit,
        offset: +offset
    })
    .then(products => {
        res.status(200).json(products);
    })
    .catch(err => {
        res.status(500).send({ message: err.message || "Error retrieving products" });
    });
};
/**
// Get all products
// Get all products with pagination
exports.getAllProducts = (req, res) => {
    const page = req.query.page ? req.query.page : 1; // Default to page 1
    const limit = req.query.limit ? req.query.limit : 10; // Default limit to 10 items
    const offset = (page - 1) * limit;

    Product.findAll({
        limit: +limit,
        offset: +offset
    })
    .then((products) => {
        res.send(products); // Send products data back to the client
    })
    .catch((err) => {
        res.status(500).send({ message: err.message || "Error retrieving products" });
    });
};
/**
// Get all products
exports.getAllProducts = (req, res) => {
    Product.findAll({ include: Review })
        .then((products) => {
            res.send(products);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message || "Error retrieving products" });
        });
};
/**



// Search product by ID
exports.getProductById = (req, res) => {
    const productId = req.params.id;

    Product.findByPk(productId, { include: Review })
        .then((product) => {
            if (!product) {
                return res.status(404).send({ message: "Product not found" });
            }
            res.send(product);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message || "Error retrieving product" });
        });
};

 */