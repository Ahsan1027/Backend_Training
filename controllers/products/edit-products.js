import multer from 'multer';
import Product from '../../models/products';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, res, callback) => {
    callback(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).any();

export const EditProduct = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Permission denied.' });
    }

    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error uploading file' });
      }

      const {
        prodId,
        title,
        price,
        stock,
        rating,
        selectedSizes,
        selectedColors,
        deleted,
        prodImages
      } = req.body;
      
      const updateFields = {};

      if (title) updateFields.title = title;

      if (price) updateFields.price = price;

      if (stock) updateFields.stock = stock;

      if (rating) updateFields.rating = rating;

      if (selectedColors) updateFields.colors = selectedColors;

      if (selectedSizes) updateFields.sizes = selectedSizes;

      if (req.files.length) {
        const newImages = req.files.map(file => file.filename);
        if (prodImages) {
          updateFields.images = [...prodImages, ...newImages];
        } else {
          updateFields.thumbnail = req.files[0].filename;
          updateFields.images = newImages.slice(1);
        }
      } else if (prodImages) {
        updateFields.images = prodImages;
      } else {
        updateFields.images = [];
      }

      if (deleted) {
        deleted.forEach((filename) => {
          const filePath = `uploads/${filename}`;
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`\n\n Error Deleting File: ${filename}`);
            }
          });
        });
      }

      const result = await Product.updateOne(
        { _id: prodId },
        { $set: updateFields }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const updatedProduct = await Product.findById(prodId);

      return res.status(200).json({
        message: 'Product updated successfully',
        updatedProduct
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
};
