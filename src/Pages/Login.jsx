// import { useState } from "react";
// import "./auth.css";

// export default function Login({ setToken, setShowSignup }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   async function handleLogin() {
//     try {
//       const res = await fetch("http://localhost:5000/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password })
//       });

//       if (!res.ok) return alert("Invalid credentials");

//       const data = await res.json();
//       setToken(data.token);
//       localStorage.setItem("token", data.token);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   return (
//     <div className="auth-container">
//       <div className="auth-card"> {/* <-- Wrap in auth-card for proper styling */}
//         <h2>Login</h2>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button onClick={handleLogin}>Login</button>
//         <p>
//           Don't have an account?{" "}
//           <span onClick={() => setShowSignup(true)}>Sign up</span>
//         </p>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import "./auth.css";

export default function Login({ setToken, setShowSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        alert("Invalid credentials");
        return;
      }

      const data = await res.json();

      // ✅ LOGIN SUCCESS POPUP
      alert("Login successful!");

      setToken(data.token);
      localStorage.setItem("token", data.token);

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

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

        <button onClick={handleLogin}>Login</button>

        <p>
          Don't have an account?{" "}
          <span
            onClick={() => setShowSignup(true)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

