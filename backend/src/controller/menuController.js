import Dish from "../models/Dish.js";
import helper from "../lib/helper.js";
import { uploadDishImageFromBuffer } from "../middleware/fileMiddleware.js";
import { v2 as cloudinary } from "cloudinary";

export const createDish = async (req, res) => {
  try {
    let { name, description, category, price, dietary } = req?.body;
    if (!name || !description || !category || !price) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (typeof name === "string") {
      name = JSON.parse(name);
    }
    if (typeof price === "string") {
      price = parseFloat(price);
    }
    if (typeof dietary === "string") {
      dietary = JSON.parse(dietary);
    }
    if (!name.en || !name.vi) {
      return res.status(400).json({
        success: false,
        message: "Name must include both English and Vietnamese",
      });
    }
    if (description.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Description must be less than 500 characters",
      });
    }
    const descCurrentLanguage = helper.langDetector(description);
    let descObject = {
      en: descCurrentLanguage === "EN" ? description : "",
      vi: descCurrentLanguage === "VI" ? description : "",
    };
    let translatedDesc = "";

    try {
      translatedDesc = await helper.tralateText(
        description,
        descCurrentLanguage,
      );
    } catch (err) {
      console.error("Translate failed:", err.message);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    if (translatedDesc.length > 600) {
      return res.status(400).json({
        success: false,
        message: "Translated description must be less than 600 characters",
      });
    }

    if (descCurrentLanguage === "EN") {
      descObject.vi = translatedDesc;
    } else {
      descObject.en = translatedDesc;
    }
    const newDish = new Dish({
      name,
      description: descObject,
      category,
      price,
      dietary: dietary || [],
    });
    if (req.file) {
      const result = await uploadDishImageFromBuffer(req.file.buffer, {
        public_id: `dish_${newDish._id}`,
      });
      newDish.imageUrl = result.secure_url;
      newDish.imageId = result.public_id;
    }
    await newDish.save();
    res.status(201).json({ success: true, dish: newDish });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const getMenu = async (req, res) => {
  try {
    const menu = await Dish.find().select("-imageId -availableAt").lean();
    res.status(200).json({ success: true, menu });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const updateDishStatus = async (req, res) => {
  try {
    const { dishId } = req?.params;
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }
    dish.isAvailable = !dish.isAvailable;
    await dish.save();
    res.status(200).json({ success: true, result: dish.isAvailable });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const getDishById = async (req, res) => {
  try {
    const { dishId } = req?.params;
    if (!dishId) {
      return res
        .status(400)
        .json({ success: false, message: "Dish ID is required" });
    }
    const dish = await Dish.findById(dishId).lean();
    if (!dish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }
    res.status(200).json({ success: true, dish });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDish = async (req, res) => {
  try {
    const { dishId } = req?.params;
    let { name, description, category, price, dietary } = req?.body;

    if (!dishId) {
      return res
        .status(400)
        .json({ success: false, message: "Dish ID is required" });
    }

    const dish = await Dish.findById(dishId);

    if (!dish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    if (typeof name === "string") {
      name = JSON.parse(name);
    }
    if (typeof description === "string") {
      description = JSON.parse(description);
    }
    if (typeof price === "string") {
      price = parseFloat(price);
    }
    if (typeof dietary === "string") {
      dietary = JSON.parse(dietary);
    }

    const hasImage = !!req.file;
    const hasName = name !== undefined;
    const hasDescription = description !== undefined;
    const hasCategory = category !== undefined;
    const hasPrice = price !== undefined;
    const hasDietary = dietary !== undefined;

    if (!hasImage && !hasName && !hasDescription && !hasCategory && !hasPrice && !hasDietary) {
      return res
        .status(400)
        .json({ success: false, message: "No changes provided" });
    }

    if (hasName) {
      if (!name?.en || !name?.vi) {
        return res.status(400).json({
          success: false,
          message: "Name must include both English and Vietnamese",
        });
      }
      dish.name = name;
    }

    if (hasDescription) {
      if (!description?.en || !description?.vi) {
        return res.status(400).json({
          success: false,
          message: "Description must include both English and Vietnamese",
        });
      }
      dish.description = description;
    }

    if (hasCategory) {
      dish.category = category;
    }

    if (hasPrice) {
      if (typeof price !== "number" || Number.isNaN(price)) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid number",
        });
      }
      dish.price = price;
    }

    if (hasDietary) {
      dish.dietary = Array.isArray(dietary) ? dietary : [];
    }

    if (req.file) {
      const result = await uploadDishImageFromBuffer(req.file.buffer, {
        public_id: `dish_${dish._id}`,
        overwrite: true,
        invalidate: true,
      });

      dish.imageUrl = result.secure_url;
      dish.imageId = result.public_id;
    }

    await dish.save();

    return res.status(200).json({ success: true, dish });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDish = async (req, res) => {
  try {
    const { dishId } = req?.params;

    if (!dishId) {
      return res
        .status(400)
        .json({ success: false, message: "Dish ID is required" });
    }

    const dish = await Dish.findById(dishId);

    if (!dish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    if (dish.imageId) {
      try {
        await cloudinary.uploader.destroy(dish.imageId, {
          resource_type: "image",
          invalidate: true,
        });
      } catch (cloudinaryError) {
        console.error("Failed to delete dish image from Cloudinary:", cloudinaryError);
      }
    }

    await Dish.findByIdAndDelete(dishId);

    return res.status(200).json({
      success: true,
      message: "Dish deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
