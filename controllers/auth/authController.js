import User from "../../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register Auth Controller
export const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
  } else {
    try {
      const checkUser = await User.findOne({ email });
      if (checkUser) {
        res
          .status(400)
          .json({
            message:
              "User already exist with the given email. Please register with a different email",
          });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        userName,
        email,
        password: hashedPassword,
      });
      res.status(201).json({ message: "User Created Successfully", user });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json({ message: `Error Occurred While Creating User: ${error}` });
    }
  }
};

// Login Auth Controller

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Either email or password is missing" });
  } else {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      res.status(404).json({ message: "User Not Found" });
    } else {
      const isMatchPassword = await bcrypt.compare(password, checkUser?.password);
      if (isMatchPassword) {
        const token = jwt.sign(
            { id: checkUser?._id, role: checkUser?.role, email: checkUser?.email },
             process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            })
        // Set the cookie using res.cookie (ensure this is correct)
        res.cookie("jwt_token", token, {
            httpOnly: true, // Ensures the cookie cannot be accessed via JavaScript
            secure: process.env.NODE_ENV === "production", // Use 'true' in production for HTTPS
            sameSite: "Strict", // Controls cross-site behavior
          });
       // Always return after setting response
    return res.status(200).json({
        message: "Login Successful",
        user: {
          id: checkUser._id,
          role: checkUser.role,
          email: checkUser.email,
          name: checkUser.userName,
        },
      });
      } 
      else {
       return res.status(401).json({ message: "Password doesn't match" });
      }
    }
  }
};

// Logout Auth Controller

export const logoutUser = async (req, res) => {
   res.clearCookie("jwt_token")
  .status(200)
  .json({ message: "Logged out Successfully"});
};

// auth Middleware (For retain the state after refreshing)

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt_token;
    if (!token) {
        console.log("token not found");
        return res.status(401).json({ message: "Unauthorized User!" });  // Add return here
      } 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized User!", error });
  }
};
