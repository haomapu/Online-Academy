const userAuthorization = () => {
    return (req, res, next) => {
      if (typeof res.locals.user === "undefined") {
        res.locals.user = req.user;
      }
      next();
    };
  };
export default userAuthorization;