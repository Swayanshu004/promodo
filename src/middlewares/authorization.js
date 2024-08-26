import jwt from "jsonwebtoken";

function authMiddlewareBrand(req, res, next){
    const authHeader = req.header("authorization") || req.query.brandJwt;
    // console.log(authHeader);
    try {
        const decoded = jwt.verify(authHeader,process.env.JWT_SECRET);
        // console.log(decoded);
        if(decoded.brandId){
            req.brandId = decoded.brandId;
            // console.log("success");
            
            return next();
        } else {
            // console.log("fail");
            return res.status(401).json({mesasage: "no brand found ! !"});
        }
    } catch (error) {
        return res.status(401).json({mesasage: "no brand found ! !"});
    }
}
function authMiddlewareCreator(req, res, next){
    const authHeader = req.headers["authorization"] || "";
    try {
        const decodedCreator = jwt.verify(authHeader, process.env.JWT_SECRET_CREATOR);
        // console.log("decoded - ",process.env.JWT_SECRET_CREATOR);
        if(decodedCreator.creatorId){
            req.creatorId = decodedCreator.creatorId;
            return next();
        } else {
            return res.status(401).json({mesasage: "no creator found ! "});
        }
    } catch (error) {
        return res.status(401).json({mesasage: "no creator found ! !"});
    }
}

export {
    authMiddlewareBrand,
    authMiddlewareCreator
}