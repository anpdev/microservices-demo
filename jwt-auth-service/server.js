
import app from './app.js'
import connectDB from "./config/db.js";
import mongoose from 'mongoose';
import { generateToken, verifyToken ,verifyRefreshToken , generateRefreshToken} from './service/jwtService.js';
import User from './models/User.js';
import crypto from "crypto"; 
 
await connectDB();
await mongoose.connection.asPromise();
 
const db = mongoose.connection.db;
const PORT = process.env.PORT || 4000
const refreshTokenStore = new Map();
app.get('/', async (req, res, next) => {

  const users  =  await User.find({});
  return res.status(200).json({users});
})

app.post('/login', async (req, res, next) => { 
  console.log('login req body ->' , req.body);
  const { username, password } = req.body;
  try {

    const user = await User.findOne({ email: username }).lean();


    if (!user) {
      return res.status(404).json({ msg: 'Not a valid user!' });
    }
    const token = generateToken(user);

    const tokenId = crypto.randomUUID();
    const refreshToken = generateRefreshToken(user, tokenId);
     
  // Save refresh token server-side (demo)
    refreshTokenStore.set(tokenId, {
      token: refreshToken,
      userId: user.id,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    });

  // Set HttpOnly cookie with refresh token. Important flags:
  // - httpOnly: true -> not available to JS (protects from XSS)
  // - secure: true -> only over HTTPS (set to false for localhost dev if not using HTTPS)
  // - sameSite: "strict" or "lax" to reduce CSRF risk
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // set true in production (requires HTTPS)
    sameSite: "lax",
    path: "/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

    res.status(200).json({msg: 'logged in successfully' , accessToken: token});

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return { expired: true };
    }
    return null;
  }

  // const isPasswordValid = bcrypt.compareSync(password,user.password);
  // if(!isPasswordValid){ res.status(401).json('Invalid credentials'); }

}); 

app.post("/refresh", (req, res) => {
  // Use cookie parser — refresh token is in HttpOnly cookie
 
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  // Verify refresh token
  const payload = verifyRefreshToken(token);
  if (!payload) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }

  const { tokenId, id, username } = payload;
  const stored = refreshTokenStore.get(tokenId);

  // Check if token exists in store
  // if (!stored || stored.token !== token) {
  //   return res.status(403).json({ message: "Refresh token not found or invalid" });
  // }
    // OPTIONAL: rotate refresh token (recommended)
    const newTokenId = crypto.randomUUID();
    const newRefreshToken = generateRefreshToken({ id, username }, newTokenId);
    refreshTokenStore.delete(tokenId);
    refreshTokenStore.set(newTokenId, {
      token: newRefreshToken,
      userId: id,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    });

    // Set new cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      path: "/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Issue new short-lived access token
    const accessToken = generateToken({ id, username });
     res.status(200).json({msg: 'Token refrshed successfully', uname:username, accessToken: accessToken});

    
  });
 

app.post("/logout", (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_REFRESH);
      refreshTokenStore.delete(payload.tokenId);
    } catch (e) {
      // ignore
    }
  }
  // Clear cookie
  res.clearCookie("refreshToken", { path: "/refresh" });
  res.json({ ok: true });
});

// Example of protected API route that requires a valid access token in Authorization header
app.get("/protected", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Missing Authorization header" });

  const token = auth.split(" ")[1];
  const verify = verifyToken(token);
   res.json({ data: verify });
}); 





app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));