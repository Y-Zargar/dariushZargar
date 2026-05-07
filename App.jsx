import React, { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { supabase } from "./lib/supabase";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  async function checkAccess() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      setIsAllowed(false);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("allowed_users")
      .select("id")
      .eq("email", user.email.toLowerCase())
      .single();

    if (error || !data) {
      await supabase.auth.signOut();
      setIsAllowed(false);
      setLoading(false);
      return;
    }

    setIsAllowed(true);
    setLoading(false);
  }

  useEffect(() => {
    checkAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAccess();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        Lade...
      </div>
    );
  }

  if (!isAllowed) {
    return <Login onLogin={checkAccess} />;
  }

  return <Dashboard />;
}