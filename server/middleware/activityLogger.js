const ActivityLog = require("../models/ActivityLog");

const SUPPORTED_MODULES = new Set([
  "products",
  "sales",
  "customers",
  "suppliers",
  "inventory",
  "users",
  "reports",
  "categories",
  "auth",
]);

const METHOD_TO_ACTION = {
  POST: "CREATE",
  PUT: "UPDATE",
  PATCH: "UPDATE",
  DELETE: "DELETE",
};

const logActivity = async (
  userId,
  userName,
  userRole,
  action,
  module,
  description,
  details = null,
  ipAddress = null,
) => {
  try {
    await ActivityLog.create({
      userId,
      userName,
      userRole,
      action,
      module,
      description,
      details,
      ipAddress,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error logging activity:", error.message);
  }
};

// Middleware to extract user info
const activityLoggerMiddleware = (req, res, next) => {
  req.logActivity = async (action, module, description, details = null) => {
    if (req.user) {
      const ipAddress =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      await logActivity(
        req.user.id,
        req.user.name,
        req.user.role,
        action,
        module,
        description,
        details,
        ipAddress,
      );
    }
  };

  res.on("finish", () => {
    const action = METHOD_TO_ACTION[req.method];

    if (!action) {
      return;
    }

    if (res.statusCode < 200 || res.statusCode >= 300) {
      return;
    }

    if (!req.user) {
      return;
    }

    const apiPrefix = "/api/";
    const path = req.originalUrl?.split("?")[0] || "";

    if (!path.startsWith(apiPrefix)) {
      return;
    }

    const module = path.slice(apiPrefix.length).split("/")[0];

    if (!SUPPORTED_MODULES.has(module) || module === "auth") {
      return;
    }

    const ipAddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    logActivity(
      req.user.id,
      req.user.name,
      req.user.role,
      action,
      module,
      `${action} action in ${module}`,
      {
        method: req.method,
        path,
      },
      ipAddress,
    ).catch((error) => {
      console.error("Auto activity logging failed:", error.message);
    });
  });

  next();
};

module.exports = { logActivity, activityLoggerMiddleware };
