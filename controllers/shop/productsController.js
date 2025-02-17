import Product from "../../models/Products.js";
export const getFilteredProducts = async (req, res) => {
  try {
    const {
      category = [],
      brand = [],
      sortBy = "price-Low-to-High",
    } = req.query;
    let filters = {};
    let sort = {};

    if (category.length > 0) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length > 0) {
      filters.brand = { $in: brand.split(",") };
    }

    switch (sortBy) {
      case "price-Low-to-High":
        sort.price = 1;
        break;
      case "price-High-to-Low":
        sort.price = -1;
        break;
      case "title-A-to-Z":
        sort.title = 1;
        break;
      case "title-Z-to-A":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    const products = await Product.find(filters).sort(sort);
    res.status(200).json({
      status: true,
      data: products,
    });
  } catch (err) {
    console.log("Error in getFilteredProducts: ", err);
    res
      .status(400)
      .json({
        status: false,
        message: `some error occurred in getFilteredProducts : ${err}`,
      });
  }
};

export const getProductDetails = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        if(product)
        {
            res.status(200).json({
                status: true,
                data: product
            })
        }

        else
        {
            res.status(400).json({
                status: false,
                message: "Product not found. try again"
            })
        }

    }

    catch (err)
    {
        console.log("Error in getting Product details : ", err);
        res
          .status(400)
          .json({
            status: false,
            message: `some error occurred in getProductDetails : ${err}`,
          });

    }
}
