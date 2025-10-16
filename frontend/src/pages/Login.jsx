import React, { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { backendURL, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [state, setState] = useState("Sign Up");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const ontSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendURL}/api/user/register`, {
          name,
          email,
          password,
        });
        if (data?.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendURL}/api/user/login`, {
          email,
          password,
        });
        if (data?.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Login successful");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      const msg = error?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }
  };
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <form
        onSubmit={ontSubmitHandler}
        className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col gap-5 border border-blue-100"
      >
        <div className="text-center mb-2">
          <p className="text-3xl font-bold text-blue-700 mb-1 tracking-wide drop-shadow-sm">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </p>
          <p className="text-gray-500 text-base">
            Please {state === "Sign Up" ? "sign up" : "log in"} to book
            appointment
          </p>
        </div>
        {state === "Sign Up" && (
          <div className="w-full">
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              className="border border-zinc-300 rounded-xl w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Enter your full name"
              autoComplete="name"
            />
          </div>
        )}
        <div className="w-full">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            className="border border-zinc-300 rounded-xl w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter your email"
            autoComplete="email"
          />
        </div>
        <div className="w-full">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            className="border border-zinc-300 rounded-xl w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter your password"
            autoComplete={
              state === "Sign Up" ? "new-password" : "current-password"
            }
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-full py-3 rounded-2xl text-base font-semibold mt-2 shadow-md hover:from-blue-600 hover:to-purple-600 transition duration-200 cursor-pointer"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <p className="text-sm text-center mt-2 text-gray-600">
          {state === "Sign Up"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            onClick={() => {
              state === "Sign Up" ? setState("Login") : setState("Sign Up");
            }}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            {state === "Sign Up" ? "Login" : "Sign Up"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
