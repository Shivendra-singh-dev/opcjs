"use client"; 

import Navbar from "@/components/navbar";
import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Smartlib() {
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bookTitle: "",
    genre: "fiction",
  });

  // Errors for each field
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    bookTitle: "",
  });

  // Toast
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    variant: "success",
  });

  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef(null);

  const validateField = (field, value) => {
    let error = "";
    if (field === "name" && !value.trim()) {
      error = "Full name is required";
    } else if (field === "email") {
      if (!value.trim()) {
        error = "Email address is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Please enter a valid email address";
      }
    } else if (field === "bookTitle" && !value.trim()) {
      error = "Book title is required";
    }
    return error;
  };

  const debouncedValidate = (field, value) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }, 3000);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = {
      nameInput: "name",
      emailInput: "email",
      bookInput: "bookTitle",
      genreSelect: "genre",
    };
    const field = fieldMap[id];
    if (!field) return;

    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "name" || field === "email" || field === "bookTitle") {
      debouncedValidate(field, value);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const showToast = (message, variant) => {
    setToast({ visible: true, message, variant });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  const validateAll = () => {
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      bookTitle: validateField("bookTitle", formData.bookTitle),
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.bookTitle;
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      showToast("Please correct the highlighted fields.", "danger");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save record");
      }

      showToast("Book entry created successfully!", "success");
      setFormData({ name: "", email: "", bookTitle: "", genre: "fiction" });
      setErrors({ name: "", email: "", bookTitle: "" });
    } catch (err) {
      showToast(err.message || "Something went wrong", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <h1 className="mb-0">📚 Smart Library</h1>
          <span className="badge bg-primary rounded-pill">New</span>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h5 className="card-title mb-3">Add a New Book Entry</h5>

            <form onSubmit={submitForm} noValidate>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      id="nameInput"
                      placeholder="e.g. Alex Johnson"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <label htmlFor="nameInput">Full Name</label>
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      id="emailInput"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <label htmlFor="emailInput">Email address</label>
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="form-floating">
                    <input
                      type="text"
                      className={`form-control ${errors.bookTitle ? "is-invalid" : ""}`}
                      id="bookInput"
                      placeholder="e.g. The Great Gatsby"
                      value={formData.bookTitle}
                      onChange={handleChange}
                    />
                    <label htmlFor="bookInput">Book Title</label>
                    {errors.bookTitle && (
                      <div className="invalid-feedback">{errors.bookTitle}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      id="genreSelect"
                      value={formData.genre}
                      onChange={handleChange}
                    >
                      <option value="fiction">Fiction</option>
                      <option value="nonfiction">Non‑Fiction</option>
                      <option value="sci-fi">Sci‑Fi</option>
                      <option value="fantasy">Fantasy</option>
                      <option value="biography">Biography</option>
                    </select>
                    <label htmlFor="genreSelect">Genre</label>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg px-5"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle me-2"></i> Add Book
                    </>
                  )}
                </button>
                <button
                  type="reset"
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => {
                    setFormData({ name: "", email: "", bookTitle: "", genre: "fiction" });
                    setErrors({ name: "", email: "", bookTitle: "" });
                  }}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="text-muted text-center mt-3 small">
          Use the form above to add a new book to your library.
        </p>
      </div>

      {toast.visible && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div
            className={`toast show align-items-center text-white bg-${toast.variant} border-0`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body">{toast.message}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}