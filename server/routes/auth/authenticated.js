//checks if the user has a session; generally for posting and stuff
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log("ISAUTH", req.user);
        return next();
    } else {
        console.log("THE USER IS NOT AUTHENTICATED!!!!");
        return res.status(401).json({success: false, redirect: "home", message: "Not logged in"});
    }
}

module.exports = {
  isAuthenticated
};
