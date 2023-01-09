export default function authWithRequiredPermission(requiredPermission) {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user && req.user.role < requiredPermission) {
        return res.render("403", { layout: false });
      }
      next();
    }
  };
}
