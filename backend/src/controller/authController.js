import Staff from "../models/Staff.js";
import Session from "../models/Session.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { nanoid } from "nanoid";
import passport from "../lib/passportConfig.js";
import { uploadStaffImageFromBuffer } from "../middleware/fileMiddleware.js";

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
      return res
        .status(500)
        .json({ success: false, message: "Google authentication failed" });
    }

    const isExistingCustomer = await Staff.findOne({
      email: user.emails?.[0]?.value,
    });
    if (!isExistingCustomer) {
      return res.redirect(
        `${process.env.CLIENT_URL || "http://localhost:2303"}/login-callback?error=${encodeURIComponent("This Google account is not registered as staff. Please contact your manager.")}`,
      );
    }
    const refreshToken = crypto.randomBytes(64).toString("hex");
    await Session.create({
      userId: isExistingCustomer._id,
      userType: "Staff",
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL.staff),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL.staff,
    });

    return res.redirect(
      `${process.env.CLIENT_URL || "http://localhost:2303"}/login-callback?m=${encodeURIComponent(user.emails?.[0]?.value)}&a=${encodeURIComponent(user.photos?.[0]?.value)}`,
    );
  })(req, res, next);
};

const registerStaff = async (req, res) => {
  try {
    const { email, firstName, lastName, gender, branchId } = req.body;

    if (!email || !firstName || !lastName || !gender || !branchId) {
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
      gender,
      branchId,
    });
    if (req.file) {
      const uploadResult = await uploadStaffImageFromBuffer(req.file.buffer, {
        public_id: `staff_${newStaff._id}`,
      });
      newStaff.avatarUrl = uploadResult.secure_url;
      newStaff.avatarId = uploadResult.public_id;
    }
    await newStaff.save();
    return res.json({
      success: true,
      staff: newStaff,
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
      { id: staff._id, role: staff.role.toLowerCase() },
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
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL.staff,
    });
    return res.json({ success: true, accessToken });
  } catch (error) {
    console.error("Error during staff login:", error);
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
      sameSite: "none",
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
  registerStaff,
  staffLogin,
  logout,
  fetchMe,
  refresh,
  googleAuth,
  googleAuthCallback,
};
