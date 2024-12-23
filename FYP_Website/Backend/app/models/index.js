// models/index.js
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});



const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.product = require("./product.model.js")(sequelize, Sequelize);
db.review = require("./review.model.js")(sequelize, Sequelize);
db.favorite = require("./favorite.model.js")(sequelize, Sequelize);

// Define relationships
db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.ROLES = ["user", "admin", "moderator"];

db.product.hasMany(db.review, { as: "reviews", foreignKey: "product_id" });
db.review.belongsTo(db.product, { foreignKey: "product_id", as: "product" });

// Ensure the association is correctly defined
db.favorite.belongsTo(db.product, { foreignKey: 'product_id', as: 'product' });
db.favorite.belongsTo(db.user, { foreignKey: 'user_id', as: 'user' });


module.exports = db;