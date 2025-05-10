import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Translation from "../translations/lang.json";

function ProtectPathVendor(props) {
  const [isChecking, setIsChecking] = useState(true);
  const [vendor, setVendor] = useState(null);
  const navigate = useNavigate();
  const Cmp = props.Cmp;

  useEffect(() => {
    const vendorInfo = localStorage.getItem('vendor-info');
    
    if (!vendorInfo) {
      navigate("/vendor/login");
    } else {
      const vendorData = JSON.parse(vendorInfo); // Assuming vendor info is stored as a JSON string
      setVendor(vendorData);

      // Check vendor status and navigate accordingly
      switch (vendorData.status) {
        case "UnVerified":
          navigate("/vendor/vendor-info/");
          break;
        case "Pending":
          navigate("/vendor/underreview/");
          break;
        case "Rejected":
          navigate("/vendor/vendor-info/");
          break;
        case "Suspended":
          navigate("/vendor/suspend/");
          break;
        default:
          setIsChecking(false); // Proceed to render the component if status is valid
      }
    }
  }, [navigate]);

  if (isChecking || !vendor) {
    return null; // or a loading spinner
  }

  return (
    <div>
      <Cmp />
    </div>
  );
}

export default ProtectPathVendor;
