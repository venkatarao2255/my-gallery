import React, { useState } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");

  const quotes = [
    "Photography is the story I fail to put into words.",
    "A picture is a poem without words.",
    "Photography takes an instant out of time, altering life by holding it still.",
    "A photograph is the pause button on life.",
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const handleAuth = async () => {
    setMessage("");
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage("✅ Account created successfully! You can now log in.");
        setIsRegistering(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setMessage("❌ " + error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("⚠ Please enter your email first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("📧 Password reset email sent. Check your inbox.");
    } catch (error) {
      setMessage("❌ " + error.message);
    }
  };

  return (
    <div className="login-background">
      <div className="app-title">Galleri.O</div>
      <div className="quote-text">"{randomQuote}"</div>

      <div className="login-container">
        <h2>{isRegistering ? "Register" : "Login"}</h2>
        {message && <p className="message">{message}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleAuth}>
          {isRegistering ? "Register" : "Login"}
        </button>

        {!isRegistering && (
          <button className="forgot-btn" onClick={handleForgotPassword}>
            Forgot Password?
          </button>
        )}

        <p>
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            className="toggle-link"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Login here" : "Register here"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
