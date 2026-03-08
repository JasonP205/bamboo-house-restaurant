import Staff from "../models/Staff.js";
import Customer from "../models/Customer.js";
import Session from "../models/Session.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = {
  staff: 8 * 60 * 60 * 1000, // 8 hours
  customer: 2 * 60 * 60 * 1000, // 2 hours
};

const registerCustomer = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newCustomer = new Customer({
      email,
      passwordHash,
      displayName: `${firstName} ${lastName}`,
    });
    await newCustomer.save();
  } catch (error) {
    console.error("Error registering customer:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
const registerStaff = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      gender,
      branchId,
    } = req.body;

    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !gender ||
      !branchId
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (gender !== "Male" && gender !== "Female" && gender !== "Other") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid gender value" });
    }

    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }
    const StaffId = `BBH-${nanoid(6)}`;

    const passwordHash = await bcrypt.hash(password, 10);
    const newStaff = new Staff({
      StaffId,
      email,
      passwordHash,
      displayName: `${firstName} ${lastName}`,
      phoneNumber,
      gender,
      branchId,
    });
    await newStaff.save();
  } catch (error) {
    console.error("Error registering staff:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
const staffLogin = async (req, res) => {
  try {
    const { staffId, password } = req.body;
    if (!staffId || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Staff ID and password are required",
        });
    }

    const staff = await Staff.findOne({ StaffId: staffId });
    if (!staff) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Staff ID or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, staff.passwordHash);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Staff ID or password" });
    }

    const accessToken = jwt.sign(
      { staffId: staff._id },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );
    const refreshToken = crypto.randomBytes(64).toString("hex");

    const session = new Session({
      userId: staff._id,
      userType: "Staff",
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL.staff),
    });
    await session.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: REFRESH_TOKEN_TTL.staff,
    });
    return res.json({ success: true, accessToken });
  } catch (error) {
    console.error("Error during staff login:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
const customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, customer.passwordHash);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const accessToken = jwt.sign(
      { customerId: customer._id },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );
    const refreshToken = crypto.randomBytes(64).toString("hex");

    const session = new Session({
      userId: customer._id,
      userType: "Customer",
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL.customer),
    });
    await session.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: REFRESH_TOKEN_TTL.customer,
    });
    return res.json({ success: true, accessToken });
  } catch (error) {
    console.error("Error during customer login:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "Refresh token is required" });
    }

    await Session.findOneAndDelete({ refreshToken });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { registerCustomer, registerStaff, staffLogin, customerLogin, logout };
