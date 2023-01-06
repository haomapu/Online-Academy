const userAuthorization = () => {
    return (req, res, next) => {
      res.locals.categories = req.session.categories;
      res.locals.retUrl = req.session.retUrl;
      if (typeof res.locals.user === "undefined") {
        res.locals.user = req.user;
      }
      next();
    };
  };
export default userAuthorization;