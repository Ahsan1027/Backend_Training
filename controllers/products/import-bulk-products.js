import Product from '../../models/products';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).any();

export const ImportBulkProducts = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error uploading file' });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const csvFilePath = req.files[0].path;
      const results = [];
      const errorRows = [];
      let rowIndex = 1;

      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
          const missingFields = [];

          if (!data.Title) missingFields.push('Title');

          if (!data.Price) missingFields.push('Price');

          if (!data.Stock) missingFields.push('Stock');

          if (!data.Rating) missingFields.push('Rating');

          if (!data.Sizes) missingFields.push('Sizes');

          if (!data.Colors) missingFields.push('Colors');

          if (!data.Thumbnail) missingFields.push('Thumbnail');

          if (missingFields.length > 0) {
            errorRows.push({ rowIndex, missingFields });
          } else {
            results.push(data);
          }
          rowIndex++;
        })
        .on('end', async () => {
          const productsData = [];

          for (const productData of results) {
            const newProduct = new Product({
              title: productData.Title,
              price: productData.Price,
              stock: productData.Stock,
              rating: productData.Rating,
              thumbnail: productData.Thumbnail,
              sold: 0,
              sizes: productData.Sizes.split('-'),
              colors: productData.Colors.split('-'),
            });

            await newProduct.save();
            productsData.push(newProduct);
          }
          const total = rowIndex - 1
          const filename = req.files[0].originalname;
          res.status(201).json({ message: 'Products added successfully', productsData, errorRows, filename, total, rowIndex });
        });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product' });
  }
};
