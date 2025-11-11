import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

 dotenv.config();
 const JWT_SECRET = process.env.JWT_SECRET || '';
 const JWT_REFRESH = process.env.JWT_REFRESH || '';
 const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';

 export const generateToken= (payload)=> {

   return jwt.sign(payload, JWT_SECRET,{expiresIn:JWT_EXPIRY });

 } 

 export const generateRefreshToken = (payload, tokenId) => {
  // longer lived, e.g. 7 days
  return jwt.sign({ ...payload, tokenId }, JWT_REFRESH, { expiresIn: "7d" });
}

 export const verifyToken = (token)=>{
  try{
     return jwt.verify(token , JWT_SECRET);
  } catch(e){
      return null;
  }
    
 } 
 export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH);
  } catch (e) {
    return null; // token expired or invalid
  }
};