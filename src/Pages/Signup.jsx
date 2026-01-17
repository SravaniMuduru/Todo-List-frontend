import { useState } from "react";
import "./auth.css";

export default function Signup({ setShowSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Signup failed");
        return;
      }

      // ✅ SUCCESS POPUP
      alert("Signup successful! Please login.");

      // ✅ clear fields
      setEmail("");
      setPassword("");

      // ✅ move to login screen
      setShowSignup(false);

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>

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

        <button onClick={handleSignup}>Sign Up</button>

        <p>
          Already have an account?{" "}
          <span
            onClick={() => setShowSignup(false)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
