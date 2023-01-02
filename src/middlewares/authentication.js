const authenticationMiddleware = () => {
    return (req, res, next) => {
      if (req.isAuthenticated()) {
        return next();
      }
      return next();
    };
  };
export default authenticationMiddleware;