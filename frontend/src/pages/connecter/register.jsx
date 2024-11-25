import { useContext, useState } from "react";
import house from "../../assets/images/house.jpg";
import { AuthContext } from "../../AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const DividerWithOr = () => {
  return (
    <div className="flex items-center justify-center ">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="px-3 text-gray-500">or</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const { user, handleRegister, handleGoogleLogin } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState(""); // This will store the code from the backend
  const [userCode, setUserCode] = useState("");

  const handleError = () => {
    console.log("Login Failed");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const sendVerificationCode = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/send-verification", { email });
      if (response.data.success) {
        setVerificationCode(response.data.code); // Set the code received from the backend
        setIsVerificationSent(true);
        alert("Verification code sent to your email.");
      } else {
        setError("Failed to send verification code. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError("Error sending verification code. Please try again later.");
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    await sendVerificationCode();
  };
  const verifyCode = () => {
    if (userCode === verificationCode) {
      alert("Verification successful! Registration complete.");
      handleRegister({ name, email, password });
    } else {
      setError("Incorrect verification code.");
    }
  };
  return (
    <div className="flex flex-col h-[101vh]">
      <div className="h-20"></div>
      {user ? navigate("/account") : ""}
      <div className="border-4 flex-grow flex justify-center items-center">
        <div className="w-1/3 border flex flex-col gap-3">
          <form
            className="border px-24 flex flex-col gap-6 py-4"
            onSubmit={onSubmit}
          >
            <h1 className="text-center text-xl font-medium">Welcome</h1>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {!isVerificationSent && (
              <>
                <input
                  className=" block border px-4 py-[10px] w-full rounded-lg"
                  type="text"
                  value={name}
                  placeholder="Enter your name"
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className=" block border px-4 py-[10px] w-full rounded-lg"
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className=" block border px-4 py-[10px] w-full rounded-lg"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="px-4 py-[7px] text-white bg-blue-600 rounded hover:bg-blue-700 w-full"
                  type="submit"
                >
                  Continue
                </button>
                <h1 className="text-center text-sm">
                  Already have an account ?{" "}
                  <Link to="/login" className="text-green-500">
                    Login
                  </Link>
                </h1>
                <DividerWithOr />
                <div className="google-login">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={handleError}
                  />
                </div>
              </>
            )}
            {isVerificationSent && (
              <>
                <input
                  className="block border px-4 py-[10px] w-full rounded-lg"
                  type="text"
                  value={userCode}
                  placeholder="Enter verification code"
                  onChange={(e) => setUserCode(e.target.value)}
                />
                <button
                  className="px-4 py-[7px] text-white bg-green-600 rounded hover:bg-green-700 w-full"
                  type="button"
                  onClick={verifyCode}
                >
                  Verify Code
                </button>
              </>
            )}
          </form>
        </div>
        <div className="w-1/3 border">
          <img src={house} />
        </div>
      </div>
    </div>
  );
};

export default Register;
