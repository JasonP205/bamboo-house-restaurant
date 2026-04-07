import Dish from "../models/Dish.js";
import helper from "../lib/helper.js";
import { uploadDishImageFromBuffer } from "../middleware/fileMiddleware.js";

export const createDish = async (req, res) => {
  try {
    const { branchId } = req?.params;
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
      branchId,
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
