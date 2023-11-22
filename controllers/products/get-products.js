import Product from '../../models/products';

export const GetAllProducts = async (req, res) => {
  try {
    const {
      limit,
      skip,
      minPrice,
      maxPrice,
      sortField,
      sortOrder,
      size,
      color,
      title
    } = req.query;

    const filter = { isDeleted: false };

    if (title) filter.title = { $regex: new RegExp(title, 'i') };

    if (color) filter.colors = color;

    if (size) filter.sizes = size;

    if (minPrice != 0 && maxPrice != 0) filter.price = { $gte: minPrice, $lte: maxPrice };

    const defaultSort = { createdAt: 'desc' };
    const sort = sortField && sortOrder ? { [sortField]: sortOrder } : defaultSort;

    const [products, total] = await Promise.all([
      Product
        .find(filter)
        .sort(sort)
        .skip(skip || 0)
        .limit(limit || 5),
      Product.countDocuments(filter)
    ]);

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json({
      products,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};
