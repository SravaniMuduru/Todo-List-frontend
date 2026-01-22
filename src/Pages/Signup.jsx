import { useState } from "react";
import "./auth.css";

export default function Signup({ setShowSignup, setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;

  async function handleSignup(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Signup failed");
        return;
      }

      // ✅ Auto-login after signup
      localStorage.setItem("token", data.token);
      setToken(data.token);

      alert("Signup successful 🎉 You are now logged in!");

      // clear form
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
        <p>
          Already have an account?{" "}
          <span
            onClick={() => setShowSignup(false)}
            style={{ cursor: "pointer", color: "#2563eb" }}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
