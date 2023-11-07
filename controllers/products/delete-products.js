import Product from '../../models/products';

export const DeleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findByIdAndUpdate(productId, { isDeleted: true });

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({
      message: 'Product deleted successfully',
      deletedProduct
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error deleting product'
    });
  }
};
