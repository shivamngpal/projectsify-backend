// all logic comes here
const UserModel = require("../models/User.js");
const { z } = require("zod");

async function signup(req,res){
    const signupSchema = z.object({
      name: z.string(),
      email: z.email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password too short")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/,
          "Password must contain uppercase, lowercase, number, and special character"
        ),
    });

    const validatedData = signupSchema.safeParse(req.body);

    if(!validatedData.success){
        return res.status(400).json({
            success: false,
            msg : "input validation failed",
            error: validatedData.error.message
        });
    }

    const email = req.body.email;
    const user = await UserModel.findOne({email});
    if(user){
        return res.status(400).json({
          success: false,
          msg: "Email is already registered",
        });
    }
    await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.status(201).json({
      success: true,
      msg: "Signup successfull",
    });
}

module.exports = signup;