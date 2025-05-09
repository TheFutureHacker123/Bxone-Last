import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

function ProtectPathAdmin(props) {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const Cmp = props.Cmp;

  useEffect(() => {
    try {
      const adminInfo = localStorage.getItem("admin-info");

      if (!adminInfo) {
        navigate("/admin/login");
        return;
      }

      const admin = JSON.parse(adminInfo);

      if (admin.admin_role_id === "SuperAdmin") {
        navigate("/superadmin/");
      } else if (!admin.admin_role_id) {
        navigate("/");
      } else {
        setIsAuthorized(true); // Authorized admin
      }
    } catch (err) {
      console.error("Invalid admin-info in localStorage", err);
      navigate("/admin/login");
    } finally {
      setAuthChecked(true);
    }
  }, []);

  // ⏳ Block rendering until auth check finishes
  if (!authChecked) return null;

  return isAuthorized ? <Cmp /> : null;
}

export default ProtectPathAdmin;
