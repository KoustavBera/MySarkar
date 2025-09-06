//Configuration imports
import express from "express";
import "dotenv/config";
import connectDB from "./config/connectDB.js";
import cors from "cors";

//Router imports

import authRouter from "./routes/auth.routes.js";
import schemeRouter from "./routes/scheme.routes.js";
import applicationRouter from "./routes/application.routes.js";
import all_schemes_router from "./routes/all_schemes_router.js";
import postRouter from "./routes/post.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import eligibilityRouter from "./routes/eligibility.routes.js";
import notificationRouter from "./routes/notification.routes.js";

const app = express();

//<Middlewares>
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//Heath check for pinging on render

app.get("/health", (req, res) => {
  console.log(`[${new Date().toISOString()}] Health check ping received`);
  res.send("OK");
});

//</Middlewares>

//Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/schemes", schemeRouter);
app.use("/api/v1/applications", applicationRouter);
app.use("/api/v1/all_schemes", all_schemes_router);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/admin-dashboard", dashboardRouter);
app.use("/api/v1/eligibility", eligibilityRouter);
app.use("/api/v1/notification", notificationRouter);
const PORT = process.env.PORT;
app.get("/", (req, res) => {
  res.send("Backend is on!");
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running successfully on http://localhost:${PORT}`);
});
