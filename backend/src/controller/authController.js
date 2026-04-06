import Staff from "../models/Staff.js";
import Customer from "../models/Customer.js";
import Session from "../models/Session.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { nanoid } from "nanoid";
import passport from "../lib/passportConfig.js";

const ACCESS_TOKEN_TTL = "40m";
const REFRESH_TOKEN_TTL = {
  staff: 8 * 60 * 60 * 1000, // 8 hours
  customer: 2 * 60 * 60 * 1000, // 2 hours
};

const googleAuth = async (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
};

const googleAuthCallback = async (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user) => {
    if (err || !user) {
      return res.status(500).json({ success: false, message: "Google authentication failed" });
    }

    const isExistingCustomer = await Customer.findOne({ email: user.emails?.[0]?.value });
    if (!isExistingCustomer) {
      const newCustomer = new Customer({
        email: user.emails?.[0]?.value,
        displayName: user.displayName,
        provider: "google",
        providerId: user.id,
        avatarUrl: user.photos?.[0]?.value,
      });
      await newCustomer.save();

      const refreshToken = crypto.randomBytes(64).toString("hex");

      const session = new Session({
        userId: newCustomer._id,
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

      return res.redirect(
        `${process.env.CLIENT_URL || "http://localhost:2303"}/login-success?m=${encodeURIComponent(user.emails?.[0]?.value)}&a=${encodeURIComponent(user.photos?.[0]?.value)}`,
      );
    }
    const refreshToken = crypto.randomBytes(64).toString("hex");
    await Session.create({
      userId: isExistingCustomer._id,
      userType: "Customer",
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL.customer),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: REFRESH_TOKEN_TTL.customer,
    });

    return res.redirect(
      `${process.env.CLIENT_URL || "http://localhost:2303"}/login-success?m=${encodeURIComponent(user.emails?.[0]?.value)}&a=${encodeURIComponent(user.photos?.[0]?.value)}`,
    );
  })(req, res, next);
};

const googleAuthCallbackStaff = async (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user) => {
    if (err || !user) {
      return res.status(500).json({ success: false, message: "Google authentication failed" });
    }

    const staff = await Staff.findOne({ email: user.emails?.[0]?.value });
    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }
    const refreshToken = crypto.randomBytes(64).toString("hex");
    await Session.create({
      userId: staff._id,
      userType: "Staff",
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL.staff),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: REFRESH_TOKEN_TTL.staff,
    });

    return res.redirect(
      `${process.env.CLIENT_URL || "http://localhost:2303"}/login-success?m=${encodeURIComponent(user.emails?.[0]?.value)}&a=${encodeURIComponent(user.photos?.[0]?.value)}`,
    );
  })(req, res, next);
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
    return res.json({
      success: true,
      message:
        "Yay! You're officially a member. We can't wait to serve you soon!. Sign In now!!",
    });
  } catch (error) {
    console.error("Error registering customer:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
const registerStaff = async (req, res) => {
  try {
    const { email, firstName, lastName, phoneNumber, gender, branchId } =
      req.body;

    if (!email || !firstName || !lastName || !phoneNumber || !gender) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (gender !== "male" && gender !== "female" && gender !== "other") {
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
    const staffId = `BBH-${nanoid(6)}`;

    const passwordHash = await bcrypt.hash(staffId, 10);
    const newStaff = new Staff({
      staffId,
      email,
      passwordHash,
      displayName: `${firstName} ${lastName}`,
      phoneNumber,
      gender,
      branchId,
    });
    await newStaff.save();
    return res.json({
      success: true,
      message: "Staff registered successfully",
      staffId,
    });
  } catch (error) {
    console.error("Error registering staff:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
const staffLogin = async (req, res) => {
  try {
    const { staffId, password } = req.body;
    if (!staffId || !password) {
      return res.status(400).json({
        success: false,
        message: "Staff ID and password are required",
      });
    }

    const staff = await Staff.findOne({ staffId: staffId });
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
      { id: staff._id, role: "staff" },
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

    const isPasswordValid = await bcrypt.compare(
      password,
      customer.passwordHash,
    );
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const accessToken = jwt.sign(
      { id: customer._id, role: "customer" },
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
      return res
        .status(400)
        .json({ success: false, message: "Refresh token is required" });
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

const fetchMe = async (req, res) => {
  try {
    const staff = req?.staff;
    const customer = req?.customer;
    if (staff) {
      return res.json({
        success: true,
        user: staff,
      });
    } else if (customer) {
      return res.json({
        success: true,
        user: customer,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "Refresh token is required" });
    }

    const session = await Session.findOne({ refreshToken }).lean().exec();
    if (!session || session.expiresAt < new Date()) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }

    let user;
    if (session.userType === "Staff") {
      user = await Staff.findById(session.userId).lean().exec();
    } else if (session.userType === "Customer") {
      user = await Customer.findById(session.userId).lean().exec();
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: session.userType.toLowerCase() },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    return res.json({ success: true, accessToken });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  registerCustomer,
  registerStaff,
  staffLogin,
  customerLogin,
  logout,
  fetchMe,
  refresh,
  googleAuth,
  googleAuthCallback,
};
