import { uploadToCloudinary } from "../../utils/cloudinary.js";
import Product from "../../models/Products.js";
export const handleImageUploadToCloudinary = async (req,res) => {
    try{
      const b64 = Buffer.from(req.file.buffer).toString('base64');  // b64 means base 64
      const data = `data:${req.file.mimetype};base64,${b64}`;
      const result = await uploadToCloudinary(data);

      res.json({
        message: "Image uploaded successfully",
        success: true,
        data: result
      })
    }

    catch (error)
    {
      console.log("Error in handleImageUploadToCloudinary: ", error);
      res.json({
        message: error.message,
        success: false,
      })
    }
}

// Add New Product By Admin:

export const addNewProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    console.log("add body =>", image, title, description, category, brand, price, salePrice, totalStock, averageReview);

    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  }

  catch (error)
  {
    res.status(400).json({
      message: `Error occurred in addNewProduct: ${error}`,
      success: false,
    })
  }
}

// Fetch All Products:

export const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      data: products,
    });
  }

  catch (error) {
    res.status(400).json({
      message: `Error occurred in fetchAllProducts: ${error}`,
      success: false,
    });
  }
}

// Edit Product By Admin:

export const editProduct = async (req, res) => {
  try{
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    console.log("edit body => ", title, image, description, category, brand, price, salePrice, totalStock, averageReview);

    const findProduct = await Product.findById(req.params.id);
    if(findProduct)
    {
      findProduct.image = image || findProduct.image;
      findProduct.title = title || findProduct.title;
      findProduct.description = description || findProduct.description;
      findProduct.category = category || findProduct.category;
      findProduct.brand = brand || findProduct.brand;
      findProduct.price = price === "" ? 0 : price || findProduct.price;
      findProduct.salePrice = salePrice === "" ? 0 : salePrice || findProduct.salePrice;
      findProduct.totalStock = totalStock || findProduct.totalStock;
      findProduct.averageReview = averageReview || findProduct.averageReview;
      // Now update the existing product:

      await findProduct.save();
      res.status(200).json({
        success: true,
        data: findProduct,
      });
      
    }

    else{
      res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }
  }

  catch (error)
  {
    res.status(400).json({
      message: `Error occurred in editProduct: ${error}`,
      success: false,
    })
  }
}

// Delete product By Admin:

export const deleteProduct = async (req, res) => {
  try{
       const productToBeDeleted = await Product.findById(req.params.id);
       if(productToBeDeleted)
       {
        await productToBeDeleted.deleteOne();
        res.status(200).json({
          success: true,
          message: "Product deleted successfully",
        });
       }
       else{
        res.status(404).json({
          success: false,
          message: "Product not found",
        })
       }
  }
  catch (error)
  {
    res.status(400).json({
      message: `Error occurred in deleteProduct: ${error}`,
      success: false,
    })
  }

}