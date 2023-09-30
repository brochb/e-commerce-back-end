const express = require('express');
const routes = require('./routes');
// import sequelize connection

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
app.listen(PORT, () => {
  console.log(`Sample App listen at http://localhost:${PORT} !`);
});
