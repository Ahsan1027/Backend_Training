import multer from 'multer';
import Product from '../../models/products';

const storage = multer.diskStorage({
  destination: (req, res, callback) => {
    callback(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).single('thumbnail');

export const EditProduct = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error uploading file' });
      }

      const { productId } = req.params;
      const {
        title,
        price,
        stock,
        rating,
        selectedSizes,
        selectedColors
      } = req.body;
      
      const updateFields = {};

      if (title !== undefined) updateFields.title = title;

      if (price !== undefined) updateFields.price = price;

      if (stock !== undefined) updateFields.stock = stock;

      if (rating !== undefined) updateFields.rating = rating;

      if (selectedColors !== undefined) updateFields.colors = selectedColors;

      if (selectedSizes !== undefined) updateFields.sizes = selectedSizes;

      if (req.file) updateFields.thumbnail = req.file.filename;

      const updatedProduct = await Product.findByIdAndUpdate(productId, updateFields, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
};
