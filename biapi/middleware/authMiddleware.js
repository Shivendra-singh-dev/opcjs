const isAuthenticated = (req, res, next) => {
    if (
        !req.session ||
        !req.session.isLoggedIn ||
        !req.session.user
    ) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    next();
};

export default isAuthenticated;
