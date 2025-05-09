import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

function ProtectPath(props) {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  let Cmp = props.Cmp;

  useEffect(() => {
    const user = localStorage.getItem('user-info');
    if (!user) {
      navigate("/login");
    } else {
      setIsChecking(false);
    }
  }, []);

  if (isChecking) {
    return null; // or a loading spinner if you prefer
  }

  return (
    <div>
      <Cmp />
    </div>
  );
}

export default ProtectPath;
