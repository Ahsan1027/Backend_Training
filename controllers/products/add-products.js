import Product from '../../models/products';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).any();

export const AddProduct = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error uploading file' });
      }
      const {
        title,
        price,
        stock,
        rating,
        selectedSizes,
        selectedColors
      } = req.body;

      if (!title || !price || !stock || !rating || !selectedSizes || !selectedColors) {
        return res.status(400).json({ message: 'Title, price, stock, colors, sizes and rating are required fields' });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }
      const thumbnail = req.files[0].filename;
      const images = req.files.slice(1).map(file => file.filename);

      const newProduct = new Product({
        title,
        price,
        stock,
        rating,
        thumbnail,
        images,
        sold: 0,
        sizes: selectedSizes,
        colors: selectedColors,
      });
      await newProduct.save();

      res.status(201).json({ message: 'Product added successfully', productsData: newProduct });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product' });
  }
};
