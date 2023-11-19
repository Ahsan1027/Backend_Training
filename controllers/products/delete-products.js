import Product from '../../models/products';

export const DeleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await Product.updateOne({ _id: productId }, { $set: { isDeleted: true } });

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({
      message: 'Product deleted successfully',
      productId
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error deleting product',
    });
  }
};
