const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET all tags
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name'],
        }
      ]
    });
    res.status(200).json(tagData);
  } catch (error) {
    res.status(500).json(err)
  }
});

// GET one tag
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name'],
        }
      ]
    });
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id' });
      return;
    }
    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err)
  }
});

// POST/Create new tag
router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (error) {
    console.log(err);
    res.status(500).json(error);
  }
});

// PUT/Update one tag
router.put('/:id', async (req, res) => {
  try {
    // Find the tag by its ID
    const tagToUpdate = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ['id'],
          through: ProductTag,
        },
      ],
    });

    // Check if the tag exists
    if (!tagToUpdate) {
      res.status(404).json({ message: 'No tag found with this id' });
      return;
    }

    // Update the tag's name
    if (req.body.tag_name) {
      tagToUpdate.tag_name = req.body.tag_name;
      await tagToUpdate.save();
    }

    // Update associated products if product IDs are provided in the request body
    if (req.body.products && Array.isArray(req.body.products)) {
      // Get the IDs of products associated with the tag before the update
      const previousProductIds = tagToUpdate.Products.map((product) => product.id);
      await tagToUpdate.setProducts(req.body.products);

      // Remove products from the database that are no longer associated with the tag
      const productsToRemoveIds = previousProductIds.filter(
        (productId) => !req.body.products.includes(productId)
      );
      await ProductTag.destroy({
        where: {
          tag_id: tagToUpdate.id,
          product_id: productsToRemoveIds,
        },
      });
    }

    // Respond with the updated tag data, including associated products
    res.status(200).json(tagToUpdate);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// DEL/Delete one tag
router.delete('/:id', async (req, res) => {
  try {
    const productData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!productData) {
      res.status(404).json({ message: 'No Tag with this id' });
      return;
    }
    res.status(200).json({ message: 'Category and associated products have been deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
