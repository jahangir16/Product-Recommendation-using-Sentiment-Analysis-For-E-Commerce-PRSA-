const express = require("express");
const sequelize = require('sequelize')
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const db = require("./app/models");
const Role = require('./app/models/role.model')(db.sequelize, sequelize.Sequelize);



const app = express();
/**
function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}

// Call the initial function when the server starts, not as a middleware
initial();
 */
//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// var corsOptions = {
//   origin: ["http://localhost:8081", 
//           "http://localhost:5173"
//         ,"http://localhost:5174"]
// };

// app.use(cors(corsOptions));
app.use(cors());


// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


const productController = require("../Backend/app/controllers/product.controller.js");
const productRoutes = require("../Backend/app/routes/product.routes.js");

db.sequelize.sync().then(() => {
  console.log("db has been re sync")
})

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to FYP application." });
});

// Include product routes
productRoutes(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
