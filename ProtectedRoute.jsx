import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !user.email) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      const { data: allowedUser } = await supabase
        .from("allowed_users")
        .select("*")
        .eq("email", user.email.toLowerCase())
        .single();

      setAllowed(!!allowedUser);
      setLoading(false);
    }

    checkUser();
  }, []);

  if (loading) {
    return <div className="loading-screen">Lade...</div>;
  }

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;