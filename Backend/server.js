require("dotenv").config();
const app = require("./src/app");

// Global error handlers to avoid process crash on unexpected rejections/exceptions
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
