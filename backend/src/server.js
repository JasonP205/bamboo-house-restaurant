import "./lib/envConfig.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import chalk from "chalk";
import { getLocalIP } from "./lib/network.js";
import {connectDB} from "./lib/db.js";
import customerRoute from "./routes/customerRoute.js";
import branchRoute from "./routes/branchRoute.js";
import staffRoute from "./routes/staffRoute.js";
import authRoute from "./routes/authRoute.js";
import testRoute from "./routes/testRoute.js";
import { protectedRouteStaff } from "./middleware/authMiddleware.js";
import { deviceIDMiddleware } from "./middleware/deviceIDMiddleware.js";
import { v2 as cloudinary } from "cloudinary";
import passport from "./lib/passportConfig.js";

const start = process.hrtime.bigint();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:2303",
    credentials: true,
  }),
);
app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());

//Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use("/api/test", testRoute);
app.use("/api/auth", authRoute);
app.use(deviceIDMiddleware);
app.use("/api/customers", customerRoute);
app.use("/api/branches", branchRoute);
app.use("/api/staff", protectedRouteStaff, staffRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    const end = process.hrtime.bigint();
    const time = Number(end - start) / 1e6;

    const localIP = getLocalIP();
    
    console.log(`
${chalk.bold("EXPRESS")} ${chalk.green("v1.0.0")} ${chalk.gray(`ready in ${time.toFixed(0)} ms`)}

${chalk.green("➜")}  ${chalk.bold("Local:")}   ${chalk.cyan(`http://localhost:${PORT}`)}
${chalk.green("➜")}  ${chalk.bold.gray("Network:")} ${chalk.cyan(`http://${localIP}:${PORT}`)}
${chalk.green("➜")}  ${chalk.bold.gray("ENV:")}     ${chalk.yellow(process.env.NODE_ENV || "development")}
`);
  });
});
