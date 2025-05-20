import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

function ProtectPathSAdmin(props) {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const Cmp = props.Cmp;

  useEffect(() => {
    try {
      const adminInfo = localStorage.getItem("admin-info");

      if (!adminInfo) {
        navigate("/admin/login");
        return;
      }

      const admin = JSON.parse(adminInfo);

      if (admin.admin_role_id === "Admin") {
        navigate("/admin/");
      } else if (!admin.admin_role_id) {
        navigate("/");
      } else {
        setIsChecking(false); // allow access
      }
    } catch (err) {
      console.error("Invalid admin-info in localStorage", err);
      navigate("/admin/login");
    }
  }, []);

  if (isChecking) return null; // prevent flicker before redirect

  return <Cmp />;
}

export default ProtectPathSAdmin;
