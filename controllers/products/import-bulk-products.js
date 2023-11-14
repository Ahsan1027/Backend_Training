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

const chunkSize = 2;

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
      const productsData = [];
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
            const product = {
              title: data.Title,
              price: data.Price,
              stock: data.Stock,
              rating: data.Rating,
              thumbnail: data.Thumbnail,
              sold: 0,
              sizes: data.Sizes.split('-'),
              colors: data.Colors.split('-'),
            };
            productsData.push(product);
          }
          rowIndex++;
        })
        .on('end', async () => {
          const total = rowIndex - 1;
          const filename = req.files[0].originalname;

          for (let i = 0; i < productsData.length; i += chunkSize) {
            const chunk = productsData.slice(i, i + chunkSize);
            console.log('\n\n check chunk', chunk, i, productsData.length);

            await Product.insertMany(chunk);
          }

          res.status(201).json({
            message: 'Products added successfully',
            productsData,
            errorRows,
            filename,
            total,
            rowIndex,
          });
        });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding products' });
  }
};
