 
import { verifyToken } from "./jwtService";

const authenticate  = (req,res,next)=>{ 

    const authHeader  = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Token required' });
    const token = authHeader.split(' ')[1];
    const decode = verifyToken(token);
    if (!decoded) return res.status(401).json({ message: 'Invalid token' });

    req.user = decoded; // attach user info to request
    next();

}