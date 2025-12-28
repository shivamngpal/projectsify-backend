const jwt = require("jsonwebtoken");
function protectRoute(req,res,next){
    try{
        const authHeader= req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success: false,
                msg: "Unauthorized"
            });
        }
        // authHeader exists
        const token= authHeader.split(" ")[1];  //["Bearer","jwt_token"]
        if(!token){
            res.status(401).json({
                success:false,
                msg:"Token not sent"
            });
        }
        const jwt_secret = process.env.JWT_SECRET;
        const decodedToken = jwt.verify(token,jwt_secret);
    
        req.user=decodedToken; //{userId,iat(issued at),exp}
        next();
    }
    catch(err){
        return res.status(401).json({ 
            success: false,
            msg: "Invalid or expired token"
        });
    }
}

module.exports = protectRoute;