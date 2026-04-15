import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("IDLE");
  const [mode, setMode] = useState("login"); 
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const pushLog = (text) => {
    setLogs((prev) => [...prev.slice(-6), text]);
  };

  useEffect(() => {
    setTimeout(() => pushLog("> system.initialized"), 300);
    setTimeout(() => pushLog("> awaiting input..."), 900);
  }, []);

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setStatus("SCANNING");
    pushLog("> identifier detected");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setStatus("VERIFYING");
    pushLog("> secure key received");
  };

  const handleAuth = async () => {
  setStatus("PROCESSING");
  pushLog(
    `> ${mode === "login" ? "verifying" : "creating"} credentials...`
  );

  try {
    const url =
      mode === "login"
        ? "http://localhost:5000/adminlogin"
        : "http://localhost:5000/adminregister";

    const res = await axios.post(url, {
      name,
      email,
      password,
    });

    if (mode === "login") {
      const token = res.data.token;
      localStorage.setItem("token", token);

      setStatus("GRANTED");
      pushLog("> access granted");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } else {
      setStatus("GRANTED");
      pushLog("> account created");

      setTimeout(() => {
        setMode("login"); 
        setName("");
      }, 800);
    }

  } catch (err) {
    console.log(err.response?.data);
    setError(
      mode === "login" ? "access denied" : "registration failed"
    );
    setStatus("ANOMALY");
    pushLog("> anomaly detected");
  }
};

  const statusColor = {
    IDLE: "text-gray-500",
    SCANNING: "text-blue-400",
    VERIFYING: "text-blue-400",
    PROCESSING: "text-yellow-400",
    GRANTED: "text-green-400",
    ANOMALY: "text-red-400",
  };

  return (
    <div className="h-screen flex bg-[#05080F] text-white overflow-hidden">

      {/* LEFT PANEL */}
      <div className="w-1/2 relative p-8 flex flex-col justify-between border-r border-white/10">

        {/* STATUS */}
        <div className="space-y-2 text-xs font-mono">
          <p className={`${statusColor[status]}`}>
            &gt; status: {status.toLowerCase()}
          </p>
          <p className="text-gray-500">&gt; model: active</p>
          <p className="text-gray-500">
            &gt; confidence: {status === "GRANTED" ? "98%" : "72%"}
          </p>
        </div>

        {/* SIGNAL */}
        <div className="relative h-40 flex items-center justify-center">

          {/* STATIC GRID */}
          <div className="absolute inset-0 grid grid-cols-12 gap-[2px] opacity-10">
            {[...Array(96)].map((_, i) => (
              <div key={i} className="bg-blue-400/20" />
            ))}
          </div>

          {/* SCAN LINE */}
          <motion.div
            className="absolute w-full h-[2px] bg-blue-400/40"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          {/* CORE */}
          <motion.div
            className={`w-3 h-3 rounded-full ${
              status === "ANOMALY"
                ? "bg-red-400"
                : status === "GRANTED"
                ? "bg-green-400"
                : "bg-blue-400"
            }`}
            animate={{
              scale: status === "PROCESSING" ? [1, 1.5, 1] : 1,
            }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </div>

        {/* LOGS */}
        <div className="font-mono text-xs text-gray-500 space-y-1 h-[120px] overflow-hidden">
          {logs.map((log, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {log}
            </motion.p>
          ))}
        </div>

        {/* SOFT GLOW */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[300px] h-[300px] bg-blue-500/5 blur-3xl rounded-full" />
        </div>
      </div>

      {/* DIVIDER */}
      <div className="w-[1px] bg-white/10" />

      {/* RIGHT PANEL */}
      <div className="w-1/2 flex items-center justify-center">

        <div className="w-[320px] space-y-8">

          <h2 className="text-gray-400 text-sm tracking-wide">
            {mode === "login" ? "/authenticate" : "/register"}
          </h2>

          {/* NAME (ONLY FOR SIGNUP) */}
{mode === "signup" && (
  <div>
    <p className="text-xs text-gray-500 mb-1">name</p>
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-blue-400 transition"
    />
  </div>
)}

          {/* EMAIL */}
          <div>
            <p className="text-xs text-gray-500 mb-1">identifier</p>
            <input
              value={email}
              onChange={handleEmail}
              className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-blue-400 transition"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <p className="text-xs text-gray-500 mb-1">secure_key</p>
            <input
              type="password"
              value={password}
              onChange={handlePassword}
              className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-blue-400 transition"
            />
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

          {/* BUTTON */}
          <button
            onClick={handleAuth}
            className="w-full text-left text-blue-400 text-sm hover:opacity-70 transition"
          >
            &gt; {mode === "login" ? "execute authentication" : "create account"}
          </button>
          <div className="text-xs text-gray-500 pt-4">
  {mode === "login" ? (
    <>
      new here?{" "}
      <span
        className="text-blue-400 cursor-pointer"
        onClick={() => {
          setMode("signup");
          setName("");
          setError("");
          pushLog("> switching to registration mode");
        }}
      >
        create account
      </span>
    </>
  ) : (
    <>
      already registered?{" "}
      <span
        className="text-blue-400 cursor-pointer"
        onClick={() => {
          setMode("login");
          setName("");
          setError("");
          pushLog("> switching to authentication mode");
        }}
      >
        login
      </span>
    </>
  )}
</div>
        </div>
      </div>
    </div>
  );
}