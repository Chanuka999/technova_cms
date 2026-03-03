const ActivityLog = require("../models/ActivityLog");

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
  next();
};

module.exports = { logActivity, activityLoggerMiddleware };
