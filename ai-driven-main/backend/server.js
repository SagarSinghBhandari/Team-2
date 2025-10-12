import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * @route   POST /auth/send-otp
 * @desc    Sends a magic link or OTP to the user's email for login or signup.
 */
app.post("/auth/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithOtp({ email });

    if (error) throw error;

    res
      .status(200)
      .json({ message: "OTP sent successfully. Please check your email." });
  } catch (error) {
    console.error("Supabase OTP Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /auth/verify-otp
 * @desc    Verifies the OTP and returns a session (with JWT token).
 */
app.post("/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) throw error;

    res.status(200).json({
      token: data.session.access_token,
      user: data.user,
      message: "Logged in successfully!",
    });
  } catch (error) {
    console.error("Supabase Verification Error:", error.message);
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Server is running on port ${PORT} with Supabase 🚀`)
);
