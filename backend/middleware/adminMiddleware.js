const adminMiddleware = (req, res, next) => {
    // console.log("Admin middleware req.user:", req.user.role);
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Admin access denied" });
    }
};

module.exports = adminMiddleware;