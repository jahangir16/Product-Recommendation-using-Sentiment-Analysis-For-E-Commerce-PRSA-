// models/favorite.model.js
module.exports = (sequelize, Sequelize) => {
  const Favorite = sequelize.define("favorite", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    }
  }, {
    timestamps: false, // add this line
    // Other configurations if needed
    
});

  return Favorite;
};