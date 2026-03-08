import Dish from '../models/Dish.js';

export const createDish = async (req, res) => {
    try {
        const {name, description, category, price, branch, imageUrl, imageId} = req?.body;
        if (!name || !description || !category || !price || !branch) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const newDish = new Dish({
            name,
            description,
            category,
            price,
            branch,
            imageUrl,
            imageId
        });
        await newDish.save();
        res.status(201).json({ success: true, dish: newDish });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}