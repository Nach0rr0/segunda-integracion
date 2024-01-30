import CartModel from "../../dao/models/Cart.model.js";

const ITEMS_PER_PAGE = 10; // Establece el número de carritos por página según tus necesidades

export default class CartsService {
  async createCart() {
    try {
      const cart = await CartModel.create({ products: [] });

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async getCarts(page = 1) {
    try {
      const skipItems = (page - 1) * ITEMS_PER_PAGE;

      const carts = await CartModel.find()
        .skip(skipItems)
        .limit(ITEMS_PER_PAGE)
        .lean();

      return carts;
    } catch (error) {
      throw error;
    }
  }

  async getCartById(cid) {
    try {
      const cart = await CartModel.findById(cid).lean();

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const productExistsInCart = await CartModel.exists({ _id: cid, "products.product": pid });
      let cart;
      if (!productExistsInCart) {
        cart = await CartModel.findByIdAndUpdate(
          cid,
          { $push: { products: { product: pid, quantity: 1 } } },
          { new: true }
        ).lean();
      } else {
        cart = await CartModel.findOneAndUpdate(
          { _id: cid, "products.product": pid },
          { $inc: { "products.$.quantity": 1 } },
          { new: true }
        ).lean();
      }

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateProductQuantity(pid, cid, quantity) {
    try {
      const productExistsInCart = await CartModel.exists({ _id: cid, "products.product": pid });
      if (!productExistsInCart) {
        return { message: "Product not found in cart" };
      }

      const cart = await CartModel.findOneAndUpdate(
        { _id: cid, "products.product": pid },
        { $set: { "products.$.quantity": quantity } },
        { new: true }
      ).lean();

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const productExistsInCart = await CartModel.exists({ _id: cid, "products.product": pid });

      if (!productExistsInCart) {
        return { message: "Product not found in cart" };
      }

      const cart = await CartModel.findByIdAndUpdate(
        cid,
        { $pull: { products: { product: pid } } },
        { new: true }
      ).lean();

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async emptyCart(cid) {
    try {
      const cart = await CartModel.findByIdAndUpdate(cid, { $set: { products: [] } }, { new: true }).lean();

      return cart;
    } catch (error) {
      throw error;
    }
  }
}
