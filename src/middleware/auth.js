
export const authorization = () => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({
                error: 'Unauthorized'
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).send({
                error: 'Forbidden'
            });
        }

        next();
    }
}