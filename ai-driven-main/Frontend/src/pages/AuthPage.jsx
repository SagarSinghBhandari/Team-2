import { useState } from "react";
import axios from "axios";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("send");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const backendUrl = "http://localhost:5000"; // ✅ Your backend base URL

  // ✅ Function to send OTP
  const sendOtp = async () => {
    if (!email) return setMessage("Please enter your email.");
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${backendUrl}/auth/send-otp`, { email });
      setMessage(res.data.message);
      setStep("verify");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Function to verify OTP
  const verifyOtp = async () => {
    if (!otp) return setMessage("Please enter the OTP.");
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${backendUrl}/auth/verify-otp`, {
        email,
        otp,
      });

      // Save token locally
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("✅ Login Successful!");
      alert("Login Successful!");

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Enter Your email
        </h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email"
          className="border border-gray-300 rounded-lg p-3 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={step === "verify"}
        />

        {/* OTP Input */}
        {step === "verify" && (
          <input
            type="text"
            placeholder="Enter OTP"
            className="border border-gray-300 rounded-lg p-3 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}

        {/* Action Button */}
        <button
          onClick={step === "send" ? sendOtp : verifyOtp}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition 
          ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading
            ? "Please wait..."
            : step === "send"
            ? "Send OTP"
            : "Verify OTP"}
        </button>

        {/* Message */}
        {message && (
          <p className="text-center text-sm mt-4 text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
