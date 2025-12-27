// all logic comes here
const bcrypt = require("bcrypt");
const UserModel = require("../models/User.js");
const { z } = require("zod");

async function signup(req,res){
  try{
    const signupSchema = z.object({
      name: z.string().trim().toLowerCase(),
      email: z.email("Invalid email address").trim().toLowerCase(),
      password: z
        .string()
        .min(8, "Password too short")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/,
          "Password must contain uppercase, lowercase, number, and special character"
        ),
    });
    // safeParse returns success prop where parse just returns an error if
    const validatedData = signupSchema.safeParse(req.body);

    if(!validatedData.success){
        return res.status(400).json({
            success: false,
            msg : "input validation failed",
            error: validatedData.error.message
        });
    }

    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({email});
    if(user){
      return res.status(400).json({
        success: false,
        msg: "Email is already registered",
      });
    }

    const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
    if (!Number.isInteger(SALT_ROUNDS) || SALT_ROUNDS<=0) {
      throw new Error("Invalid SALT_ROUNDS value");
    }

    const hashedPassword = await bcrypt.hash(password,SALT_ROUNDS);

    await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(201).json({
      success: true,
      msg: "Signup successfull",
    });
  }
  catch(err){
    if (err && err.code === 11000) {
      return res.status(400).json({
        success: false,
        msg: "Email is already registered",
      });
    }
    console.error("Signup error:", err);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
}

async function login(req,res){
  try{

    const loginSchema = z.object({
      email: z.email("Invalid email").trim().toLowerCase(),
      password: z.string().min(8, "Password too short")
    });
  
    const validatedData = loginSchema.safeParse(req.body);
  
    if(!validatedData.success){
      return res.status(400).json({
        success: false,
        msg: "input validation failed",
        error: validatedData.error.message,
      });
    }
  
    // input has been validated successfully
    const email = req.body.email;
    const password = req.body.password;
  
    const user = await UserModel.findOne({email});
    if(!user){
      return res.status(401).json({
        success: false,
        msg: "Invalid email or password",
      });
    }
    
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        msg: "Invalid email or password",
      });
    }
  
    return res.status(200).json({
      success: true,
      msg: "Login successful",
    });
  }
  catch(err){
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
}

module.exports = {signup, login};