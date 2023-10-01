const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [
        { model: Category, attributes: ['id', 'category_name'] },
        { model: Tag, attributes: ['id', 'tag_name'] },
      ]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err)
  }
});

// GET one product
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ['id', 'category_name'] },
        { model: Tag, attributes: ['id', 'tag_name'] },
      ]
    });
    if (!productData) {
      res.status(404).json({ message: 'No Product found with this id' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err)
  }
});

// POST/Create new product
router.post('/', async (req, res) => {
  try {
    // Create the product using Product model and req.body
    const productData = await Product.create(req.body);
    if (req.body.tagIds) {
      // Create an array of product-tag associations
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: productData.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    // Respond with the created product
    res.status(200).json(productData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// PUT/Update one product
router.put('/:id', async (req, res) => {
  try {
    // Find the product by its ID
    const productData = await Product.findByPk(req.params.id);

    // Check if the tag exists
    if (!productData) {
      res.status(404).json({ message: 'No product found with this id' });
      return;
    }

    // Update product data
    const updatedProduct = await productData.update(req.body);

    // Handle product tags
    if (req.body.tagIds && req.body.tagIds.length) {
      const currentProductTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });

      const currentTagIds = currentProductTags.map(({ tag_id }) => tag_id);
      const newTagIds = req.body.tagIds.filter((tag_id) => !currentTagIds.includes(tag_id));
      const tagsToRemove = currentProductTags.filter(({ tag_id }) => !req.body.tagIds.includes(tag_id));

      // Remove tags that are no longer associated
      await ProductTag.destroy({ where: { id: tagsToRemove.map(({ id }) => id) } });

      // Add new tags
      const newProductTags = newTagIds.map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });

      await ProductTag.bulkCreate(newProductTags);
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// DEL/Delete one Product
router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!productData) {
      res.status(404).json({ message: 'No Product with this id' });
      return;
    }
    res.status(200).json({ message: 'Category and associated products have been deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
