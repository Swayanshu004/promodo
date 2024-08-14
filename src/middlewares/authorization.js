import jwt from "jsonwebtoken";

function authMiddlewareBrand(req, res, next){
    const authHeader = req.header("authorization") || "";
    try {
        const decoded = jwt.verify(authHeader,process.env.JWT_SECRET);
        console.log(decoded);
        if(decoded.brandId){
            req.brandId = decoded.brandId;
            return next();
        } else {
            return res.status(401).json({mesasage: "no brand found ! !"});
        }
    } catch (error) {
        return res.status(401).json({mesasage: "no brand found ! !"});
    }
}
function authMiddlewareCreator(req, res, next){
    const authHeader = req.header("authorization") || "";
    try {
        console.log("authHeader - ",authHeader);
        console.log("jwt - ",process.env.JWT_SECRET_CREATOR);
        const decodedCreator = jwt.verify(authHeader, process.env.JWT_SECRET_CREATOR);
        console.log("decoded - ",decodedCreator);
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