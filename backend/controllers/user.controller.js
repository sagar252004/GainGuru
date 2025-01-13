import  {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async(req, res) => {
    try {
        const { fullname, email,password} = req.body;

        // Check if any required field is missing
        if (!fullname || !email) {
            return res.status(400).json({
                message: "Required All Fileds",
                success: false,
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
        });
       
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
            user: newUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
            error: error.message,
            false: error
        });
    }
};

export const login = async(req, res) => {
    try {
    
        const { email, password} = req.body;
        if (!email || !password) {
            
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }
  
        let user = await User.findOne({ email });
        if (!user) {
           
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }       

        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'None', 
                secure: true,
            })
            .json({
                message: `Welcome back ${user.fullname}`,
                user,
                success: true,
            });
    } 
    catch (error) {
        console.error("Error in login route:", {
            message: error.message,
            stack: error.stack,
        });

        // Send detailed error in response
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message, // Add error details here
            success: false,
        });
    }
};

export const logout = async(req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};

export const addFunds = async (req, res) => {
    try {
        // Get user ID and the amount to add from request body
        const { userId, amountToAdd } = req.body;
  
        if (!userId || !amountToAdd) {
            return res.status(400).json({ success: false, error: 'User ID and amount are required.' });
        }
  
        // Find user by userId
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found.' });
        }
  
        // Ensure the amount to add is positive
        if (amountToAdd <= 0) {
            return res.status(400).json({ success: false, error: 'Amount to add must be greater than zero.' });
        }
  
        // Add funds to user's wallet
        user.walletBalance += amountToAdd;
  
        // Save the updated user record
        await user.save();
  
        return res.status(200).json({ success: true,message: `Successfully added ${amountToAdd} to wallet.`,  walletBalance: user.walletBalance });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'An error occurred while adding funds.' });
    }
};
  
export const withdrawFunds = async (req, res) => {
    try {
        // Get user ID and the amount to withdraw from request body
        const { userId, amountToWithdraw } = req.body;
  
        if (!userId || !amountToWithdraw) {
            return res.status(400).json({ success: false, error: 'User ID and amount are required.' });
        }
  
        // Find user by userId
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found.' });
        }
  
        // Ensure the amount to withdraw is positive and less than or equal to the wallet balance
        if (amountToWithdraw <= 0) {
            return res.status(400).json({ success: false, error: 'Amount to withdraw must be greater than zero.' });
        }
  
        if (user.walletBalance < amountToWithdraw) {
            return res.status(400).json({ success: false, error: 'Insufficient funds in the wallet.' });
        }
  
        // Subtract funds from the user's wallet
        user.walletBalance -= amountToWithdraw;
  
        // Save the updated user record
        await user.save();
  
        return res.status(200).json({ success: true, message: `Successfully withdrew ${amountToWithdraw} from wallet.`,  walletBalance: user.walletBalance});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'An error occurred while withdrawing funds.' });
    }
};