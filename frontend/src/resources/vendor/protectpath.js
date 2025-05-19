// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// function ProtectPathVendor(props) {
//   // const [vendors, setVendors] = useState([]);
//   let Cmp = props.Cmp;
//   const navigate = useNavigate();
//   useEffect(() => {
//     // const fetchUsers = async () => {
//     //   try {
//     //     const response = await fetch(
//     //       "http://localhost:8000/api/vendor/vendorstatus"
//     //     );
//     //     const data = await response.json();
//     //     setVendors(data.users);
//     //   } catch (error) {
//     //     console.error("Error fetching data:", error);
//     //   }
//     // };

// if (!localStorage.getItem("vendor-info")) {
//       navigate("/vendor/login");
//     }
    
//     // if (!localStorage.getItem("vendor-info")) {
//     //   navigate("/vendor/login");
//     // } else if (localStorage.getItem("vendor-info")) {
//     //   if (vendors.status === "UnVerified") {
//     //     navigate("/vendor/vendor-info/");
//     //   } else if (vendors.status === "Pending") {
//     //     navigate("/vendor/underreview/");
//     //   } else if (vendors.status === "Rejected") {
//     //     navigate("/vendor/vendor-info/");
//     //   } else if (vendors.status === "Suspended") {
//     //     navigate("/vendor/suspend/");
//     //   }
//     // }
//   }, []);
//   return (
//     <div>
//       <Cmp />
//     </div>
//   );
// }

// export default ProtectPathVendor;





import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

function ProtectPathVendor(props) {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  let Cmp = props.Cmp;

  useEffect(() => {
    const user = localStorage.getItem("vendor-info");

    if (!user) {
       navigate("/vendor/login");
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

export default ProtectPathVendor;
