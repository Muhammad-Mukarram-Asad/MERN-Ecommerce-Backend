import Cart from "../../models/Cart.js";
import Product from "../../models/Products.js";

// Adding items to the cart:
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    // Checking the data is valid or not
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        status: false,
        message: "Data is not valid. Either the user or product not exists.",
      });
    }

    // Checking the product exists or not
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        status: false,
        message: "Product not found",
      });
    }

    // Checking the cart exists or not of that particular user
    let cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      cart = new Cart({ userId: userId, items: [], quantity: 0 });
    }

    // Adding the product to the cart. First we need to check the product is already in the cart or not.
    // if it is already in the cart then we need to update the quantity otherwise we need to add the product

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId: productId, quantity: quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    // Saving the cart
    await cart.save();
    res.status(200).json({
      status: true,
      message: "Item added to cart successfully",
    });
  } catch (err) {
    console.log("Error occurred in addTocart: ", err);
    res.status(400).json({
      status: false,
      message: `Error occurred in adding item to cart: ${err}`,
    });
  }
};

// Fetch Cart Items:

export const fetchAllCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "User Id is not valid. Either the user or product not exists.",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        status: false,
        message: "Cart not found",
      });
    }

    // Here below I am handling the case where admin deletes the product from the database which I added to the cart so
    // I need to remove that product from the cart

    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
      message: "Cart items fetched successfully",
    });
  } catch (err) {
    console.log("Error occurred in fetchAllCartItems: ", err);
    res.status(400).json({
      status: false,
      message: `Error occurred in fetchAllCartItems: ${err}`,
    });
  }
};

export const updateCartItems = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    console.log("req.body => ", req.body);
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present !",
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const updatedPopulateCartItems = cart?.items?.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : null,
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      status: true,
      data: {
        ...cart._doc,
        items: updatedPopulateCartItems,
      },
      message: "Cart updated successfully",
    });
  } catch (err) {
    console.log("Error occurred in updateCartItems: ", err);
    res.status(400).json({
      status: false,
      message: `Error occurred in updateCartItems: ${err}`,
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Error",
    });
  }
};
