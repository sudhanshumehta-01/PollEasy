const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next){
    console.log("authorized");
    const authHeader = req.headers['authorization'];
    console.log("authHeader", authHeader);
    if(!authHeader){
        return res.status(401).json({error:'No token provided'});
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);
        req.user = decoded.user;
        // console.log("user name: ", req.user.role);
        next();
    }
    catch(err){
        console.log(err);
        res.json({error: 'Invalid or expired token'});
    }
}

module.exports = authMiddleware;