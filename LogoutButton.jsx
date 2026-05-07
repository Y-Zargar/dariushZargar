import React from "react";
import { supabase } from "../lib/supabase";

function LogoutButton() {
  async function handleLogout() {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.reload();
  }

  return (
    <button className="logout-button" onClick={handleLogout}>
      خروج از سامانه
    </button>
  );
}

export default LogoutButton;