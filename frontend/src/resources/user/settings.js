import React, { useState, useEffect } from "react";
import { Container, Button, Form, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import Translation from "../translations/lang.json";
import "react-toastify/dist/ReactToastify.css";
import "./styles/settings.css"; // Import custom CSS

const ethiopianRegions = {
  "Addis Ababa": "1000",
  Oromia: "", // Many postal codes
  Amhara: "", // Many postal codes
  Tigray: "", // Many postal codes
  SNNPR: "", // Many postal codes
  Sidama: "", // Many postal codes
  "South West Ethiopia Peoples' Region": "", // Many postal codes
  Afar: "", // Many postal codes
  Somali: "", // Many postal codes
  "Benishangul-Gumuz": "", // Many postal codes
  Gambella: "", // Many postal codes
  Harari: "", // Specific postal codes
  "Dire Dawa": "", // Specific postal codes
};

function Settings() {
  const [showPopup, setShowPopup] = useState(false);
  const [region, setRegion] = useState("");
  const [showBankPopup, setShowBankPopup] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [bankBranch, setBankBranch] = useState("");

  const handleClose = () => setShowPopup(false);
  const handleShow = () => setShowPopup(true);

  const defaultFontSize = "medium";
  const defaultFontColor = "#000000";
  const defaultLanguage = "english"; // Default language

  const [fontSize, setFontSize] = useState(
    () => localStorage.getItem("fontSize") || defaultFontSize
  );
  const [fontColor, setFontColor] = useState(
    () => localStorage.getItem("fontColor") || defaultFontColor
  );
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || defaultLanguage
  );
  const [content, setContent] = useState(Translation[language]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-size", fontSize);
    document.documentElement.style.setProperty("--font-color", fontColor);

    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("fontColor", fontColor);
    localStorage.setItem("language", language);

    // Update content based on selected language
    setContent(Translation[language]);
  }, [fontSize, fontColor, language]);

  const resetToDefault = () => {
    setFontSize(defaultFontSize);
    setFontColor(defaultFontColor);
    setLanguage(defaultLanguage);
    localStorage.removeItem("fontSize");
    localStorage.removeItem("fontColor");
    localStorage.removeItem("language");
    toast.success(
      content?.settings_reset_success || "Settings reset to default."
    );
  };

  const handleRegionChange = (event) => {
    const selectedRegion = event.target.value;
    setRegion(selectedRegion);
    // Immediately fill postal code if a specific region with a known prefix is selected
    if (selectedRegion === "Addis Ababa") {
      document.getElementById("zipcode").value = "1000";
    } else {
      document.getElementById("zipcode").value = ""; // Clear if other region
    }
  };

  const saveAddress = async () => {
    // Retrieve user info from local storage
    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    const userId = userInfo ? userInfo.user_id : null; // Get user_id

    const fullName = document.getElementById("buyername").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const country = document.getElementById("country").value.trim();
    const state = region; // Use the selected region as state
    const city = document.getElementById("city").value.trim();
    const post = document.getElementById("zipcode").value.trim();

    if (!fullName) {
      toast.error(content?.name_required || "Please enter your name.");
      return;
    }
    if (!phone) {
      toast.error(content?.phone_required || "Please enter your phone number.");
      return;
    } else if (!/^((\+251)|0)?9\d{8}$|^07\d{8}$/.test(phone)) {
      toast.error(
        content?.invalid_phone_et ||
          "Please enter a valid Ethiopian phone number (e.g., +2519..., 09..., 07...)."
      );
      return;
    }
    if (!country) {
      toast.error(content?.country_required || "Please enter the country.");
      return;
    } else if (country.toLowerCase() !== "ethiopia") {
      toast.warn(
        content?.country_suggestion_et ||
          "Are you sure the country is not Ethiopia?"
      );
    }
    if (!state) {
      toast.error(
        content?.region_required_et || "Please select a region in Ethiopia."
      );
      return;
    }
    if (!city) {
      toast.error(content?.city_required || "Please enter the city.");
      return;
    }
    if (!post) {
      toast.error(
        content?.postal_code_required || "Please enter the postal code."
      );
      return;
    }
    if (!userId) {
      toast.error(content?.user_id_missing || "User information is missing.");
      return;
    }

    const formData = {
      user_id: userId,
      full_name: fullName,
      phone: phone,
      country: country,
      state: state,
      city: city,
      post: post,
    };

    try {
      
      console.warn("Form Data:", formData); // Log form data for debugging
      const response = await fetch("http://localhost:8000/api/addaddress", {
        // Changed to addaddress
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json(); // Parse JSON response

      if (!response.ok) {
        throw new Error(
          data.message ||
            content?.failed_to_save_address ||
            "Failed to save address."
        );
      }

      // Show success toast
      toast.success(
        data.message ||
          content?.address_saved_success ||
          "Address saved successfully!"
      );
      handleClose();
    } catch (error) {
      console.error("Error saving address:", error);
      // Show error toast with a message from the error object
      toast.error(
        error.message ||
          content?.failed_to_save_address ||
          "Failed to save address."
      );
    }
  };

  const saveBankInfo = async () => {
    const userInfo = JSON.parse(localStorage.getItem("user-info"));
    const userId = userInfo ? userInfo.user_id : null;

    if (!bankName || !accountNumber || !accountHolder) {
      toast.error(content?.all_fields_required || "All fields are required.");
      return;
    }
    if (!userId) {
      toast.error(content?.user_id_missing || "User information is missing.");
      return;
    }

    const bankData = {
      user_id: userId,
      bank_name: bankName,
      account_number: accountNumber,
      account_holder: accountHolder,
      bank_branch: bankBranch,
    };

    try {
      const response = await fetch("http://localhost:8000/api/addbankinfo", {
        method: "POST",
        body: JSON.stringify(bankData),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save bank info.");
      }

      toast.success(data.message || "Bank information saved!");
      setShowBankPopup(false);
      setBankName("");
      setAccountNumber("");
      setAccountHolder("");
      setBankBranch("");
    } catch (error) {
      toast.error(error.message || "Failed to save bank info.");
    }
  };

  return (
    <Container className="settings-container mt-3">
      <Form>
        <h2 className="text-start" style={{ color: "var(--font-color)" }}>
          {content?.settings || "Settings"}
        </h2>

        <div className="button-container"> {/* Changed to a div with class */}
          <Button
            id="add-address-btn"
            className="custom-button"
            style={{ fontSize: "var(--font-size)", color: "var(--font-color)" }}
            onClick={handleShow}
          >
            {content?.add_address || "Add Address"}
          </Button>

          <Button
            id="add-bank-btn"
            className="custom-button"
            style={{ fontSize: "var(--font-size)", color: "var(--font-color)" }}
            onClick={() => setShowBankPopup(true)}
          >
            {content?.add_bank_info || "Add Bank Information"}
          </Button>
        </div>

        <Form.Group controlId="language">
          <Form.Label>{content?.language || "Language"}:</Form.Label>
          <Form.Control
            as="select"
            value={language}
            onChange={(e) => {
              const selectedLanguage = e.target.value;
              setLanguage(selectedLanguage);
              localStorage.setItem("language", selectedLanguage);
              setContent(Translation[selectedLanguage]); // Update content immediately
            }}
          >
            <option value="english">English</option>
            <option value="amharic">አማርኛ</option>
            <option value="afan_oromo">Afaan Oromoo</option>
            <option value="ethiopian_somali">Somali</option>
            <option value="tigrinya">ትግሪኛ</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="font-size">
          <Form.Label>{content?.font_size || "Font Size"}:</Form.Label>
          <Form.Control
            as="select"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          >
            <option
              value="small"
              style={{
                fontSize: "var(--font-size)",
                color: "var(--font-color)",
              }}
            >
              {content?.small || "Small"}
            </option>
            <option
              value="medium"
              style={{
                fontSize: "var(--font-size)",
                color: "var(--font-color)",
              }}
            >
              {content?.medium || "Medium"}
            </option>
            <option
              value="large"
              style={{
                fontSize: "var(--font-size)",
                color: "var(--font-color)",
              }}
            >
              {content?.large || "Large"}
            </option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="font-color">
          <Form.Label>{content?.font_color || "Font Color"}:</Form.Label>
          <Form.Control
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
          />
        </Form.Group>

        <Button
          variant="outline-secondary"
          style={{ color: "var(--font-color)" }}
          className="custom-button mt-3"
          onClick={() => window.history.back()}
        >
          {content?.back || "Back"}
        </Button>
        {/* <Button
          variant="primary"
          type="button"
          className="custom-button-save mt-3 "
          style={{ color: "var(--font-color)" }}
        >
          {content?.save_settings || "Save Settings"}
        </Button> */}
        <Button
          variant="secondary"
          style={{ fontSize: "var(--font-size)", color: "var(--font-color)" }}
          className="custom-button mt-3"
          onClick={resetToDefault}
        >
          {content?.set_to_default || "Set to Default"}
        </Button>
      </Form>

      {/* Popup for Adding Address */}
      <Modal show={showPopup} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{content?.add_address || "Add Address"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="buyername" className="form-label">
                {content?.name || "Name"}
              </label>
              <input
                type="text"
                className="custom-form-control"
                id="buyername"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                {content?.phone || "Phone"}
              </label>
              <input
                type="text"
                className="custom-form-control"
                id="phone"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="country" className="form-label">
                {content?.country || "Country"}
              </label>
              <input
                type="text"
                className="custom-form-control"
                id="country"
                defaultValue="Ethiopia"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="region" className="form-label">
                {content?.region_et || "Region"}
              </label>
              <Form.Control
                as="select"
                id="region"
                value={region}
                onChange={handleRegionChange}
                required
              >
                <option value="">
                  {content?.select_region_et || "Select Region"}
                </option>
                {Object.keys(ethiopianRegions).map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </Form.Control>
            </div>
            <div className="mb-3">
              <label htmlFor="city" className="form-label">
                {content?.city || "City"}
              </label>
              <input
                type="text"
                className="custom-form-control"
                id="city"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="zipcode" className="form-label">
                {content?.postal_code || "Postal Code"}
              </label>
              <input
                type="text"
                className="custom-form-control"
                id="zipcode"
                required
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="custom-button"
            onClick={handleClose}
          >
            {content?.close || "Close"}
          </Button>
          <Button
            variant="primary"
            onClick={saveAddress}
            className="custom-button"
          >
            {content?.save_address || "Save Address"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Popup for Adding Bank Info */}
      <Modal show={showBankPopup} onHide={() => setShowBankPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{content?.add_bank_info || "Add Bank Information"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="bankName" className="form-label">
                {content?.bank_name || "Bank Name"}
              </label>
              <input
                type="text"
                className="custom-form-control"
                id="bankName"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="accountNumber" className="form-label">
                {content?.account_number || "Account Number"}
              </label>
              <input
                type="text"
                className="custom-form-control"
                id="accountNumber"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="accountHolder" className="form-label">
                {content?.account_holder || "Account Holder"}
              </label>
              <input
                type="text"
                className="custom-form-control"
                id="accountHolder"
                value={accountHolder}
                onChange={e => setAccountHolder(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="bankBranch" className="form-label">
                {content?.bank_branch || "Bank Branch"}
              </label>
              <input
                type="text"
                className="custom-form-control"
                id="bankBranch"
                value={bankBranch}
                onChange={e => setBankBranch(e.target.value)}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="custom-button"
            onClick={() => setShowBankPopup(false)}
          >
            {content?.close || "Close"}
          </Button>
          <Button
            variant="primary"
            onClick={saveBankInfo}
            className="custom-button"
          >
            {content?.save_bank_info || "Save Bank Info"}
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </Container>
  );
}

export default Settings;
