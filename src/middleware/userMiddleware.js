const isUser = (req, res, next) => {
    console.log('User session in isUser:', req.session.user);
    if (!req.session.user) {
      return res.status(401).send({status: 'error', message: 'Unauthorized'})
    }
  
    if (req.session.user.role !== 'user') {
      return res.status(403).send({status: 'error', message: 'No tienes permisos para realizar esta acción'})
    }
  
    return next();
  }
  
  export default isUser;
  