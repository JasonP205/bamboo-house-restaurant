import jwt from "jsonwebtoken";
import Session from "../models/Session.js";
import Staff from "../models/Staff.js";
import Customer from "../models/Customer.js";

export const protectedRouteStaff = async (req, res, next) => {
    try {
        //Lấy token từ header
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
        //Xác minh token
        if (!token) {
            return res.status(401).json({ message: "Access token is missing" });
        }
        //Kiểm tra user
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedStaff) => {
            if (err) {
                console.error("JWT verification error:", err);
                return res.status(403).json({ message: "Invalid or expired access token" });
            }
            const staff = await Staff.findById(decodedStaff._id).select("-hashedPassword").exec();
            if (!staff) {
                return res.status(404).json({ message: "Staff not found" });
            }
            req.staff = staff;
            req.branchId = staff.branchId;

            next();
        });
    } catch (error) {
        console.error("Error in staff validation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const protectedRouteCustomer = async (req, res, next) => {
    try {
        //Lấy token từ header
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
        //Xác minh token
        if (!token) {
            return res.status(401).json({ message: "Access token is missing" });
        }
        //Kiểm tra user
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedCustomer) => {
            if (err) {
                console.error("JWT verification error:", err);
                return res.status(403).json({ message: "Invalid or expired access token" });
            }
            const customer = await Customer.findById(decodedCustomer._id).select("-hashedPassword").exec();
            if (!customer) {
                return res.status(404).json({ message: "Customer not found" });
            }
            req.customer = customer;

            next();
        });
    } catch (error) {
        console.error("Error in customer validation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const optionalAuthCustomer = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        
        if (!token) {
            return next(); // Không có token thì vẫn cho qua
        }
        
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedCustomer) => {
            if (err) {
                return next(); // Token không hợp lệ thì vẫn cho qua
            }
            const customer = await Customer.findById(decodedCustomer._id).select("-hashedPassword").exec();
            if (customer) {
                req.customer = customer;
            }
            next();
        });
    } catch (error) {
        next(); // Lỗi thì vẫn cho qua
    }
};

export const managerMiddleware = async (req, res, next) => {
  try {
    const staff = req?.staff;
    if (!staff) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (staff.role !== "Manager") {
      return res.status(403).json({ success: false, message: "Forbidden: Manager access required" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};