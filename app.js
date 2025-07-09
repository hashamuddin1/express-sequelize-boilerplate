// To create a seeders file= npx sequelize-cli seed:generate --name demo-user
// To Create a migration file= npx sequelize-cli migration:generate --name create-user
const express = require('express');
const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();
const port=process.env.PORT

const app = express();
app.use(express.json());
app.use('/user', userRoutes);

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log('Server is running on port 3002');
  });
});
