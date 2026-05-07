import React, { useState } from "react";
import { supabase } from "../lib/supabase";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    const loginResult = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (loginResult.error) {
      setMessage("ایمیل یا رمز عبور اشتباه است.");
      setLoading(false);
      return;
    }

    const allowedResult = await supabase
      .from("allowed_users")
      .select("id,email,role")
      .ilike("email", normalizedEmail)
      .maybeSingle();

    if (allowedResult.error) {
      setMessage("خطا در بررسی دسترسی کاربر.");
      setLoading(false);
      return;
    }

    if (!allowedResult.data) {
      await supabase.auth.signOut();
      setMessage("این ایمیل اجازه دسترسی به سامانه را ندارد.");
      setLoading(false);
      return;
    }

    setLoading(false);
    onLogin();
  }

  return (
    <div className="login-page">
      <div className="login-bg-grid"></div>
      <div className="login-scan-line"></div>

      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">
          <div className="login-logo-ring">
            <span></span>
          </div>
        </div>

        <h1>داریوش زرگر</h1>
        <h2>سامانه پایش هوشمند آب قشم</h2>

        <div className="login-status">
          <span className="login-status-dot"></span>
          دسترسی محافظت‌شده
        </div>

        <label>ایمیل</label>
        <input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          dir="ltr"
        />

        <label>رمز عبور</label>
        <input
          type="password"
          placeholder="رمز عبور را وارد کنید"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          dir="ltr"
        />

        {message && <p className="login-error">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "در حال بررسی..." : "ورود به سامانه"}
        </button>

        <p className="login-footer">
          فقط کاربران مجاز امکان ورود به داشبورد را دارند
        </p>
      </form>
    </div>
  );
}

export default Login;