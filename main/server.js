const express = require('express');
const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
app.listen(PORT, () => {
  console.log('-----------------------------------------------------------------------')
  console.log('See the category-routes in action at...');
  console.log(`http://localhost:${PORT}/api/categories`)
  console.log('-----------------------------------------------------------------------')
  console.log('')
  console.log('-----------------------------------------------------------------------')
  console.log('See the product-routes in action at...');
  console.log(`http://localhost:${PORT}/api/products`)
  console.log('-----------------------------------------------------------------------')
  console.log('')
  console.log('-----------------------------------------------------------------------')
  console.log('See the tag-routes in action at...');
  console.log(`http://localhost:${PORT}/api/tags`)
  console.log('-----------------------------------------------------------------------')
  console.log('')
});
