import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import chalk from "chalk";
import { getLocalIP } from "./lib/network.js";
import connectDB from "./lib/db.js";
import customerRoute from "./routes/customerRoute.js";
import staffRoute from "./routes/staffRoute.js";
import orderRoute from "./routes/orderRoute.js";
import branchRoute from "./routes/branchRoute.js";


dotenv.config();
const start = process.hrtime.bigint();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/customers", customerRoute);
app.use("/api/staff", staffRoute);
app.use("/api/orders", orderRoute);
app.use("/api/branches", branchRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    const end = process.hrtime.bigint();
    const time = Number(end - start) / 1e6;

    const localIP = getLocalIP();
    console.clear();
    console.log(`
${chalk.bold("EXPRESS")} ${chalk.green("v1.0.0")} ${chalk.gray(`ready in ${time.toFixed(0)} ms`)}

${chalk.green("➜")}  ${chalk.bold("Local:")}   ${chalk.cyan(`http://localhost:${PORT}`)}
${chalk.green("➜")}  ${chalk.bold.gray("Network:")} ${chalk.cyan(`http://${localIP}:${PORT}`)}
${chalk.green("➜")}  ${chalk.bold.gray("ENV:")}     ${chalk.yellow(process.env.NODE_ENV || "development")}
`);
  });
});
