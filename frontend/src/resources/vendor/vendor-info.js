import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style/vendor-info.css";

const VendorInfo = () => {
  const [activeForm, setActiveForm] = useState("personal");
  const [vendorId, setVendorId] = useState(null);
  const navigate = useNavigate();
  const [personalData, setPersonalData] = useState({
    personal_name: "",
    personal_middle_name: "",
    personal_last_name: "",
    personal_address: "",
    personal_city: "",
    personal_state: "",
    personal_phone: "",
    personal_unique_id: "",
    idPhotoFront: null,
    idPhotoBack: null,
  });
  const [personalErrors, setPersonalErrors] = useState({});

  const handlePersonalFileChange = (e) => {
    const { name, files } = e.target;
    setPersonalData({ ...personalData, [name]: files[0] });
    setPersonalErrors({ ...personalErrors, [name]: "" });
  };

  const [businessData, setBusinessData] = useState({
    business_name: "",
    business_address: "",
    business_city: "",
    business_state: "",
    business_phone: "",
    blicense_number: "",
    addressProofImage: null,
    otherProofImages: [],
  });
  const [businessErrors, setBusinessErrors] = useState({});

  const handleBusinessFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "otherProofImages") {
      const selectedFiles = Array.from(files).slice(0, 5);
      setBusinessData({ ...businessData, [name]: selectedFiles });
      setBusinessErrors({ ...businessErrors, [name]: "" });
    } else {
      setBusinessData({ ...businessData, [name]: files[0] });
      setBusinessErrors({ ...businessErrors, [name]: "" });
    }
  };

  const [bankData, setBankData] = useState({
    bank_name: "",
    account_name: "",
    account_number: "",
  });
  const [bankErrors, setBankErrors] = useState({});

  const ethiopianBanks = [
    "Commercial Bank of Ethiopia",
    "Awash Bank",
    "Dashen Bank",
    "Bank of Abyssinia",
    "Nib International Bank",
    "Cooperative Bank of Oromia",
  ];

  const accountNumberLengths = {
    "Awash Bank": [13, 16],
    "Bank of Abyssinia": [13, 16],
    "Commercial Bank of Ethiopia": [12, 16],
    "Dashen Bank": [13, 16],
    "Nib International Bank": [13, 16],
    "Cooperative Bank of Oromia": [13, 16],
  };

  useEffect(() => {
    const vendorInfo = JSON.parse(localStorage.getItem("vendor-info"));
    if (vendorInfo) {
      setVendorId(vendorInfo.vendor_id);
    }
  }, []);

  // Helper function to check for invalid characters
  const containsInvalidChars = (str) => {
    return !/^[a-zA-Z\s]*$/.test(str);
  };

  // Helper function to check for invalid characters including numbers
  const containsInvalidCharsExtended = (str) => {
    return !/^[a-zA-Z\s,.-]*$/.test(str); // Added ,.- for address
  };

  const validatePersonal = () => {
    let errors = {};
    if (!personalData.personal_name.trim())
      errors.personal_name = "First Name is required";
    else if (containsInvalidChars(personalData.personal_name))
      errors.personal_name = "First Name cannot contain numbers or symbols";

    if (
      personalData.personal_middle_name &&
      containsInvalidChars(personalData.personal_middle_name)
    ) {
      errors.personal_middle_name =
        "Middle Name cannot contain numbers or symbols";
    }

    if (!personalData.personal_last_name.trim())
      errors.personal_last_name = "Last Name is required";
    else if (containsInvalidChars(personalData.personal_last_name))
      errors.personal_last_name = "Last Name cannot contain numbers or symbols";

    if (!personalData.personal_address.trim())
      errors.personal_address = "Address is required";
    else if (containsInvalidCharsExtended(personalData.personal_address))
      errors.personal_address = "Address cannot contain symbols";

    if (!personalData.personal_city.trim())
      errors.personal_city = "City is required";
    else if (containsInvalidChars(personalData.personal_city))
      errors.personal_city = "City cannot contain numbers or symbols";

    if (!personalData.personal_state.trim())
      errors.personal_state = "State is required";
    else if (containsInvalidChars(personalData.personal_state))
      errors.personal_state = "State cannot contain numbers or symbols";

    if (!personalData.personal_phone.trim()) {
      errors.personal_phone = "Mobile number is required";
    } else if (personalData.personal_phone.startsWith("+251")) {
      if (!/^\+251\d{9}$/.test(personalData.personal_phone)) {
        errors.personal_phone =
          "Invalid +251 format. Should be +251 followed by 9 digits (13 total)";
      }
    } else if (personalData.personal_phone.startsWith("09")) {
      if (!/^09\d{8}$/.test(personalData.personal_phone)) {
        errors.personal_phone =
          "Invalid 09 format. Should be 09 followed by 8 digits (10 total)";
      }
    } else {
      errors.personal_phone = "Mobile number must start with +251 or 09";
    }
    if (!personalData.personal_unique_id.trim())
      errors.personal_unique_id = "Unique ID is required";
    if (!personalData.idPhotoFront)
      errors.idPhotoFront = "ID Photo (Front) is required";
    if (!personalData.idPhotoBack)
      errors.idPhotoBack = "ID Photo (Back) is required";
    setPersonalErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const validateBusiness = () => {
    let errors = {};
    if (!businessData.business_name.trim()) {
      errors.business_name = "Business Name is required";
    } else if (containsInvalidChars(businessData.business_name)) {
      errors.business_name = "Business Name cannot contain numbers or symbols";
    }
    if (!businessData.business_address.trim()) {
      errors.business_address = "Business Address is required";
    }
    if (!businessData.business_city.trim()) {
      errors.business_city = "Business City is required";
    } else if (containsInvalidChars(businessData.business_city)) {
      errors.business_city = "Business City cannot contain numbers or symbols";
    }
    if (!businessData.business_state.trim()) {
      errors.business_state = "Business State is required";
    } else if (containsInvalidChars(businessData.business_state)) {
      errors.business_state =
        "Business State cannot contain numbers or symbols";
    }
    if (!businessData.business_phone.trim()) {
      errors.business_phone = "Business Mobile is required";
    } else if (businessData.business_phone.startsWith("+251")) {
      if (!/^\+251\d{9}$/.test(businessData.business_phone)) {
        errors.business_phone =
          "Invalid +251 format. Should be +251 followed by 9 digits (13 total)";
      }
    } else if (businessData.business_phone.startsWith("09")) {
      if (!/^09\d{8}$/.test(businessData.business_phone)) {
        errors.business_phone =
          "Invalid 09 format. Should be 09 followed by 8 digits (10 total)";
      }
    } else {
      errors.business_phone = "Mobile number must start with +251 or 09";
    }
    if (!businessData.blicense_number.trim()) {
      errors.blicense_number = "Business License Number is required";
    }
    if (!businessData.addressProofImage) {
      errors.addressProofImage = "Address Proof Image is required";
    }
    if (businessData.otherProofImages.length > 5) {
      errors.otherProofImages = "Maximum 5 other proof images are allowed";
    }
    setBusinessErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateBank = () => {
    let errors = {};
    if (!bankData.bank_name.trim()) errors.bank_name = "Bank Name is required";
    else if (containsInvalidChars(bankData.bank_name))
      errors.bank_name = "Bank name cannot contain numbers or symbols";

    if (!bankData.account_name.trim())
      errors.account_name = "Account Holder Name is required";
    else if (containsInvalidChars(bankData.account_name))
      errors.account_name =
        "Account Holder Name cannot contain numbers or symbols";

    if (!bankData.account_number.trim())
      errors.account_number = "Account Number is required";
    else if (bankData.bank_name && accountNumberLengths[bankData.bank_name]) {
      const validLengths = accountNumberLengths[bankData.bank_name];
      const numberLength = bankData.account_number.length;
      if (!validLengths.includes(numberLength)) {
        errors.account_number = `Account Number must be ${validLengths.join(
          " or "
        )} digits for ${bankData.bank_name}`;
      }
    }
    setBankErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isPersonalComplete = () =>
    Object.keys(personalErrors).length === 0 &&
    personalData.personal_name.trim() !== "" &&
    !containsInvalidChars(personalData.personal_name) &&
    personalData.personal_last_name.trim() !== "" &&
    !containsInvalidChars(personalData.personal_last_name) &&
    personalData.personal_address.trim() !== "" &&
    !containsInvalidCharsExtended(personalData.personal_address) &&
    personalData.personal_city.trim() !== "" &&
    !containsInvalidChars(personalData.personal_city) &&
    personalData.personal_state.trim() !== "" &&
    !containsInvalidChars(personalData.personal_state) &&
    personalData.personal_phone.trim() !== "" &&
    personalData.personal_unique_id.trim() !== "" &&
    personalData.idPhotoFront !== null &&
    personalData.idPhotoBack !== null;

  const isBusinessComplete = () =>
    Object.keys(businessErrors).length === 0 &&
    businessData.business_name.trim() !== "" &&
    !containsInvalidChars(businessData.business_name) &&
    businessData.business_address.trim() !== "" &&
    businessData.business_city.trim() !== "" &&
    !containsInvalidChars(businessData.business_city) &&
    businessData.business_state.trim() !== "" &&
    !containsInvalidChars(businessData.business_state) &&
    businessData.business_phone.trim() !== "" &&
    businessData.blicense_number.trim() !== "" &&
    businessData.addressProofImage !== null;

  const handlePersonalChange = (e) => {
    setPersonalData({ ...personalData, [e.target.name]: e.target.value });
    setPersonalErrors({ ...personalErrors, [e.target.name]: "" });
  };

  const handleBusinessChange = (e) => {
    setBusinessData({ ...businessData, [e.target.name]: e.target.value });
    setBusinessErrors({ ...businessErrors, [e.target.name]: "" });
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    if (name === "bank_name" && value !== bankData.bank_name) {
      setBankData({
        ...bankData,
        [name]: value,
        account_name: "",
        account_number: "",
      });
    } else {
      setBankData({ ...bankData, [name]: value });
    }
    setBankErrors({ ...bankErrors, [name]: "" });
  };

  const handleNext = () => {
    if (activeForm === "personal") {
      const isValid = validatePersonal();
      if (isValid) {
        setActiveForm("business");
      } else {
        toast.error("Please fill all required fields correctly.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } else if (activeForm === "business") {
      const isValid = validateBusiness();
      if (isValid) {
        setActiveForm("bank");
      } else {
        toast.error("Please fill all required fields correctly.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const handlePrevious = () => {
    if (activeForm === "business") {
      setActiveForm("personal");
    } else if (activeForm === "bank") {
      setActiveForm("business");
    }
  };

  const handleVendorSubmit = async (e) => {
    e.preventDefault();
    const isPersonalValid = validatePersonal();
    const isBusinessValid = validateBusiness();
    const isBankValid = validateBank();

    if (!isPersonalValid || !isBusinessValid || !isBankValid) {
      toast.error("Please fill all required fields correctly.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const formData = new FormData();

    Object.entries(personalData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    Object.entries(businessData).forEach(([key, value]) => {
      if (key === "otherProofImages" && Array.isArray(value)) {
        value.forEach((file) => {
          formData.append("otherProofImages[]", file);
        });
      } else {
        formData.append(key, value);
      }
    });

    Object.entries(bankData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("vendor_id", vendorId);

    try {
      const response = await fetch(
        "http://localhost:8000/api/vendor/vendorinfo",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Vendor Info Submitted!", {
          position: "top-right",
          autoClose: 3000,
        });
        // Redirect to vendor dashboard after successful submission
        navigate("/vendor/dashboard");
      } else {
        toast.error("Submission failed. Check your info.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("🔥 Error submitting vendor info:", error);
      toast.error("Something went wrong. Try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const renderPersonalInfo = () => (
    <div className="form-card fade-in">
      <h3>Vendor Personal Information</h3>
      <form>
        <label>First Name</label>
        <input
          type="text"
          name="personal_name"
          value={personalData.personal_name}
          onChange={handlePersonalChange}
        />
        {personalErrors.personal_name && (
          <p className="error-message">{personalErrors.personal_name}</p>
        )}

        <label>Middle Name</label>
        <input
          type="text"
          name="personal_middle_name"
          value={personalData.personal_middle_name}
          onChange={handlePersonalChange}
        />
        {personalErrors.personal_middle_name && (
          <p className="error-message">{personalErrors.personal_middle_name}</p>
        )}

        <label>Last Name</label>
        <input
          type="text"
          name="personal_last_name"
          value={personalData.personal_last_name}
          onChange={handlePersonalChange}
        />
        {personalErrors.personal_last_name && (
          <p className="error-message">{personalErrors.personal_last_name}</p>
        )}

        <label>Address</label>
        <input
          type="text"
          name="personal_address"
          value={personalData.personal_address}
          onChange={handlePersonalChange}
        />
        {personalErrors.personal_address && (
          <p className="error-message">{personalErrors.personal_address}</p>
        )}

        <label>City</label>
        <input
          type="text"
          name="personal_city"
          value={personalData.personal_city}
          onChange={handlePersonalChange}
        />
        {personalErrors.personal_city && (
          <p className="error-message">{personalErrors.personal_city}</p>
        )}

        <label>State</label>
        <input
          type="text"
          name="personal_state"
          value={personalData.personal_state}
          onChange={handlePersonalChange}
        />
        {personalErrors.personal_state && (
          <p className="error-message">{personalErrors.personal_state}</p>
        )}

        <label>Mobile</label>
        <input
          type="text"
          name="personal_phone"
          value={personalData.personal_phone}
          onChange={handlePersonalChange}
        />
        {personalErrors.personal_phone && (
          <p className="error-message">{personalErrors.personal_phone}</p>
        )}

        <label>Unique ID Number</label>
        <input
          type="text"
          name="personal_unique_id"
          value={personalData.personal_unique_id}
          onChange={handlePersonalChange}
        />
        {personalErrors.personal_unique_id && (
          <p className="error-message">{personalErrors.personal_unique_id}</p>
        )}

        <label>ID Photo (Front)</label>
        <input
          type="file"
          name="idPhotoFront"
          accept="image/*"
          onChange={handlePersonalFileChange}
        />
        {personalErrors.idPhotoFront && (
          <p className="error-message">{personalErrors.idPhotoFront}</p>
        )}

        <label>ID Photo (Back)</label>
        <input
          type="file"
          name="idPhotoBack"
          accept="image/*"
          onChange={handlePersonalFileChange}
        />
        {personalErrors.idPhotoBack && (
          <p className="error-message">{personalErrors.idPhotoBack}</p>
        )}

        <div className="form-navigation">
          <div className="nav-left">
            {/* Empty on personal info page since there's no previous */}
          </div>
          <div className="nav-right">
            <span className="nav-link next-link" onClick={handleNext}>
              Next &rarr;
            </span>
          </div>
        </div>
      </form>
    </div>
  );

  const renderBusinessInfo = () => (
    <div className="form-card fade-in">
      <h3>Vendor Business Information</h3>
      <form>
        <label>Business Name</label>
        <input
          type="text"
          name="business_name"
          value={businessData.business_name}
          onChange={handleBusinessChange}
        />
        {businessErrors.business_name && (
          <p className="error-message">{businessErrors.business_name}</p>
        )}

        <label>Business Address</label>
        <input
          type="text"
          name="business_address"
          value={businessData.business_address}
          onChange={handleBusinessChange}
        />
        {businessErrors.business_address && (
          <p className="error-message">{businessErrors.business_address}</p>
        )}

        <label>Business City</label>
        <input
          type="text"
          name="business_city"
          value={businessData.business_city}
          onChange={handleBusinessChange}
        />
        {businessErrors.business_city && (
          <p className="error-message">{businessErrors.business_city}</p>
        )}

        <label>Business State</label>
        <input
          type="text"
          name="business_state"
          value={businessData.business_state}
          onChange={handleBusinessChange}
        />
        {businessErrors.business_state && (
          <p className="error-message">{businessErrors.business_state}</p>
        )}

        <label>Business Phone</label>
        <input
          type="text"
          name="business_phone"
          value={businessData.business_phone}
          onChange={handleBusinessChange}
        />
        {businessErrors.business_phone && (
          <p className="error-message">{businessErrors.business_phone}</p>
        )}

        <label>Business License Number</label>
        <input
          type="text"
          name="blicense_number"
          value={businessData.blicense_number}
          onChange={handleBusinessChange}
        />
        {businessErrors.blicense_number && (
          <p className="error-message">{businessErrors.blicense_number}</p>
        )}

        <label>Address Proof Image</label>
        <input
          type="file"
          name="addressProofImage"
          accept="image/*"
          onChange={handleBusinessFileChange}
        />
        {businessErrors.addressProofImage && (
          <p className="error-message">{businessErrors.addressProofImage}</p>
        )}

        <label>Other Proof Images (Max 5)</label>
        <input
          type="file"
          name="otherProofImages"
          accept="image/*"
          multiple
          onChange={handleBusinessFileChange}
        />
        {businessErrors.otherProofImages && (
          <p className="error-message">{businessErrors.otherProofImages}</p>
        )}

        <div className="form-navigation">
          <div className="nav-left">
            <span className="nav-link prev-link" onClick={handlePrevious}>
              &larr; Previous
            </span>
          </div>
          <div className="nav-right">
            <span className="nav-link next-link" onClick={handleNext}>
              Next &rarr;
            </span>
          </div>
        </div>
      </form>
    </div>
  );

  const renderBankInfo = () => (
    <div className="form-card fade-in">
      <h3>Vendor Bank Information</h3>
      <form onSubmit={handleVendorSubmit}>
        <label>Bank Name</label>
        <select
          name="bank_name"
          value={bankData.bank_name}
          onChange={handleBankChange}
        >
          <option value="">Select Bank</option>
          {ethiopianBanks.map((bank) => (
            <option key={bank} value={bank}>
              {bank}
            </option>
          ))}
        </select>
        {bankErrors.bank_name && (
          <p className="error-message">{bankErrors.bank_name}</p>
        )}

        <label>Account Holder Name</label>
        <input
          type="text"
          name="account_name"
          value={bankData.account_name}
          onChange={handleBankChange}
        />
        {bankErrors.account_name && (
          <p className="error-message">{bankErrors.account_name}</p>
        )}

        <label>Account Number</label>
        <input
          type="text"
          name="account_number"
          value={bankData.account_number}
          onChange={handleBankChange}
        />
        {bankErrors.account_number && (
          <p className="error-message">{bankErrors.account_number}</p>
        )}

        <div className="form-navigation">
          <div className="nav-left">
            <span className="nav-link prev-link" onClick={handlePrevious}>
              &larr; Previous
            </span>
          </div>
          <div className="nav-right">
            <button type="submit" className="nav-link submit-link">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  const canAccessBusiness = isPersonalComplete();
  const canAccessBank = isBusinessComplete();

  return (
    <div className="vendor-info-container">
      <div className="button-group">
        <button
          className={activeForm === "personal" ? "active-tab" : ""}
          onClick={() => setActiveForm("personal")}
        >
          Personal Info
        </button>

        <button
          className={activeForm === "business" ? "active-tab" : ""}
          onClick={() => {
            if (canAccessBusiness) setActiveForm("business");
            else if (Object.keys(personalErrors).length > 0) {
              toast.error("Please complete the Personal Info form correctly.", {
                position: "top-right",
                autoClose: 3000,
              });
            }
          }}
          disabled={!canAccessBusiness}
        >
          Business Info
        </button>

        <button
          className={activeForm === "bank" ? "active-tab" : ""}
          onClick={() => {
            if (canAccessBank) setActiveForm("bank");
            else if (Object.keys(businessErrors).length > 0) {
              toast.error("Please complete the Business Info form correctly.", {
                position: "top-right",
                autoClose: 3000,
              });
            }
          }}
          disabled={!canAccessBank}
        >
          Bank Info
        </button>
      </div>

      {activeForm === "personal" && renderPersonalInfo()}
      {activeForm === "business" && renderBusinessInfo()}
      {activeForm === "bank" && renderBankInfo()}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default VendorInfo;
