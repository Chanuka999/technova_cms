const ActivityLog = require("../models/ActivityLog");

// @desc    Get all activity logs (Admin only)
// @route   GET /api/activity-logs
// @access  Private (Admin)
exports.getActivityLogs = async (req, res, next) => {
  try {
    const {
      role,
      module,
      action,
      userId,
      limit = 50,
      page = 1,
      startDate,
      endDate,
    } = req.query;

    const filter = {};

    if (role) filter.userRole = role;
    if (module) filter.module = module;
    if (action) filter.action = action;
    if (userId) filter.userId = userId;

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) {
        filter.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.timestamp.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    const logs = await ActivityLog.find(filter)
      .populate("userId", "name email")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: logs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get activity logs by user role
// @route   GET /api/activity-logs/by-role/:role
// @access  Private
exports.getLogsByRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    const { limit = 30, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const logs = await ActivityLog.find({ userRole: role })
      .populate("userId", "name email")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments({ userRole: role });

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      data: logs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get activity logs by user
// @route   GET /api/activity-logs/user/:userId
// @access  Private
exports.getLogsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 30, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const logs = await ActivityLog.find({ userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments({ userId });

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      data: logs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get activity statistics
// @route   GET /api/activity-logs/stats/dashboard
// @access  Private (Admin)
exports.getActivityStats = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await ActivityLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$userRole",
          count: { $sum: 1 },
          actions: { $push: "$action" },
        },
      },
    ]);

    const actionStats = await ActivityLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
        },
      },
    ]);

    const moduleStats = await ActivityLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$module",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        byRole: stats,
        byAction: actionStats,
        byModule: moduleStats,
        period: `Last ${days} days`,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get today's activity summary
// @route   GET /api/activity-logs/summary/today
// @access  Private (Admin)
exports.getTodayActivitySummary = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const logs = await ActivityLog.find({
      timestamp: { $gte: today, $lt: tomorrow },
    }).sort({ timestamp: -1 });

    const totalLogins = logs.filter((log) => log.action === "LOGIN").length;
    const totalLogouts = logs.filter((log) => log.action === "LOGOUT").length;
    const totalCreations = logs.filter((log) => log.action === "CREATE").length;
    const totalUpdates = logs.filter((log) => log.action === "UPDATE").length;
    const totalDeletions = logs.filter((log) => log.action === "DELETE").length;

    const activeUsers = [
      ...new Set(
        logs
          .map((log) => {
            if (!log.userId) {
              return null;
            }

            return typeof log.userId === "object" && log.userId.toString
              ? log.userId.toString()
              : String(log.userId);
          })
          .filter(Boolean),
      ),
    ];

    res.status(200).json({
      success: true,
      data: {
        totalActivities: logs.length,
        totalLogins,
        totalLogouts,
        totalCreations,
        totalUpdates,
        totalDeletions,
        activeUsersCount: activeUsers.length,
        activeUsers: activeUsers,
        recentActivities: logs.slice(0, 10),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete activity logs (Admin only)
// @route   DELETE /api/activity-logs
// @access  Private (Admin)
exports.deleteActivityLogs = async (req, res, next) => {
  try {
    const { days = 90 } = req.query; // Delete logs older than specified days

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await ActivityLog.deleteMany({
      timestamp: { $lt: cutoffDate },
    });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} old activity logs`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
