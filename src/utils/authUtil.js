import passport from "passport";

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                console.log("Authentication failed:", info);
                return res.status(401).send({
                    error: info.message ? info.message : info.toString()
                });
            }

            // console.log("Authenticated user:", user);
            req.user = user;
            // req.session.user = user;
            next();
        })(req, res, next);
    }
}
