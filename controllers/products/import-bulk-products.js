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
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Permission denied.' });
    }

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

          if (!data.Title) missingFields.push('Title missing');

          if (!data.Price) missingFields.push('Price missing');
          else if ((data.Price) < 0 || data.Price % 1 !== 0) missingFields.push('Invalid Price');

          if (!data.Stock) missingFields.push('Stock missing');
          else if ((data.Stock) < 0 || data.Stock % 1 !== 0) missingFields.push('Invalid Stock');

          if (!data.Rating) missingFields.push('Rating missing');
          else if ((data.Rating) < 0 || data.Rating % 1 !== 0) missingFields.push('Invalid Rating');

          if (!data.Sizes) missingFields.push('Sizes missing');

          if (!data.Colors) missingFields.push('Colors missing');

          if (!data.Thumbnail) missingFields.push('Thumbnail missing');

          if (!data.Images) missingFields.push('Images missing');

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
              images: data.Images.split('/').map(image => image),
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


// import Product from '../../models/products';
// import multer from 'multer';
// import csv from 'csv-parser';
// import fs from 'fs';

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage: storage }).any();

// const chunkSize = 2;

// export const ImportBulkProducts = async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Permission denied.' });
//     }

//     upload(req, res, async (err) => {
//       if (err) {
//         return res.status(500).json({ message: 'Error uploading file' });
//       }

//       if (!req.files || req.files.length === 0) {
//         return res.status(400).json({ message: 'No files uploaded' });
//       }

//       const csvFilePath = req.files[0].path;
//       const errorRows = [];
//       let rowIndex = 1;
//       let chunkData = [];

//       const processChunk = async () => {
//         try {
//           if (chunkData.length > 0) {
//             await Product.insertMany(chunkData);
//             const chunkToSend = [...chunkData];
//             chunkData = [];

//             res.json({
//               message: 'Products added successfully',
//               errorRows,
//               productsData: chunkToSend,
//               rowIndex,
//             });
//           }
//         } catch (error) {
//           console.error('Error saving chunk to database:', error);
//           res.status(500).json({ message: 'Error adding products', error });
//         }
//       };

//       fs.createReadStream(csvFilePath)
//         .pipe(csv())
//         .on('data', async (data) => {
//           const missingFields = [];
//           if (!data.Title) missingFields.push('Title missing');

//           if (!data.Price) missingFields.push('Price missing');
//           else if ((data.Price) < 0 || data.Price % 1 !== 0) missingFields.push('Invalid Price');

//           if (!data.Stock) missingFields.push('Stock missing');
//           else if ((data.Stock) < 0 || data.Stock % 1 !== 0) missingFields.push('Invalid Stock');

//           if (!data.Rating) missingFields.push('Rating missing');
//           else if ((data.Rating) < 0 || data.Rating % 1 !== 0) missingFields.push('Invalid Rating');

//           if (!data.Sizes) missingFields.push('Sizes missing');

//           if (!data.Colors) missingFields.push('Colors missing');

//           if (!data.Thumbnail) missingFields.push('Thumbnail missing');

//           if (!data.Images) missingFields.push('Images missing');


//           if (missingFields.length > 0) {
//             errorRows.push({ rowIndex, missingFields });
//           } else {
//             const product = {
//               title: data.Title,
//               price: data.Price,
//               stock: data.Stock,
//               rating: data.Rating,
//               thumbnail: data.Thumbnail,
//               sold: 0,
//               sizes: data.Sizes.split('-'),
//               colors: data.Colors.split('-'),
//               images: data.Images.split('/').map(image => image),
//             };

//             chunkData.push(product);

//             if (chunkData.length >= chunkSize) {
//               await processChunk();
//             }
//           }
//           rowIndex++;
//         })
//         .on('end', async () => {
//           await processChunk();
//         });
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding products', error });
//   }
// };

