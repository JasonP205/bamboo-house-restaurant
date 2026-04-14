import jwt from "jsonwebtoken";
import Staff from "../models/Staff.js";
import bcrypt from "bcrypt";

export const protectedRouteStaff = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ message: "Access token is missing" });
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedStaff) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Invalid or expired access token", err });
      }
      const staff = await Staff.findById(decodedStaff.id)
        .select("-hashedPassword")
        .exec();
      if (!staff) {
        return res
          .status(404)
          .json({ message: "Staff not found", decodedStaff });
      }
      req.staff = staff;
      req.role = staff.role;
      next();
    });
  } catch (error) {
    console.error("Error in staff validation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const managerMiddleware = async (req, res, next) => {
  try {
    const securityCode = req.body?.securityCode;

    if (securityCode) {
      const pass = bcrypt.compare(securityCode, process.env.PRIVATE_KEY);
      if (pass) {
        return next();
      }
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing",
      });
    }

    let staff;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired access token",
        });
      }
      decoded = decoded;
      staff = await Staff.findById(decoded.id).select("-hashedPassword").exec();

      if (!staff) {
        return res.status(404).json({
          success: false,
          message: "Staff not found",
        });
      }

      if (staff.role !== "manager") {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Manager access required",
        });
      }

      req.staff = staff;

      next();
    });
  } catch (error) {
    console.error("Error in manager middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const protectedRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access token is missing" });
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Invalid or expired access token" });
      }
      if (decoded.role === "staff" || decoded.role === "manager") {
        const staff = await Staff.findById(decoded.id)
          .select("-passwordHash")
          .exec();
        if (!staff) {
          return res.status(404).json({ message: "Staff not found" });
        }
        req.staff = staff;
        req.branchId = staff.branchId;
      } else if (decoded.role === "customer") {
        const customer = await Customer.findById(decoded.id)
          .select("-passwordHash")
          .exec();
        if (!customer) {
          return res.status(404).json({ message: "Customer not found" });
        }
        req.customer = customer;
      } else {
        return res.status(403).json({ message: "Invalid user role" });
      }
      next();
    });
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
