import React, { useState } from "react";
import "./contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-subtitle">
          We'd love to hear from you. Get in touch with any questions or feedback.
        </p>
      </div>

      <div className="contact-content">
        {/* Contact Information */}
        <div className="contact-info">
          <h2 className="info-title">Get in Touch</h2>
          <p className="info-description">
            Have questions about our collections or need assistance with your order? 
            Reach out to us - we're here to help you embrace elegance.
          </p>

          <div className="contact-methods">
            <div className="contact-method">
              <div className="method-icon">📧</div>
              <div className="method-details">
                <h3>Email Us</h3>
                <p>support@kanku.in</p>
                <span>We'll respond within 24 hours</span>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">📞</div>
              <div className="method-details">
                <h3>Call Us</h3>
                <p>+91 1800-123-4567</p>
                <span>Mon-Sat, 10AM-7PM</span>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">📍</div>
              <div className="method-details">
                <h3>Visit Us</h3>
                <p>123 Fashion Street</p>
                <span>Mumbai, Maharashtra - 400001</span>
              </div>
            </div>

          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-container">
          <h2 className="form-title">Send us a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject" className="form-label">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select a subject</option>
                <option value="order-inquiry">Order Inquiry</option>
                <option value="product-info">Product Information</option>
                <option value="size-guide">Size Guide Help</option>
                <option value="shipping">Shipping & Delivery</option>
                <option value="returns">Returns & Exchange</option>
                <option value="custom-order">Custom Order</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                required
                rows="5"
                placeholder="Tell us how we can help you..."
              ></textarea>
            </div>

            <button type="submit" className="submit-button">
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>What is your return policy?</h3>
            <p>We offer 30-day returns on all unworn items with original tags. Custom orders are final sale.</p>
          </div>
          <div className="faq-item">
            <h3>How long does shipping take?</h3>
            <p>Standard shipping takes 5-7 business days. Express shipping available for 2-3 day delivery.</p>
          </div>
          <div className="faq-item">
            <h3>Do you offer custom sizing?</h3>
            <p>Yes! We provide custom tailoring for most of our collections. Contact us for details.</p>
          </div>
          <div className="faq-item">
            <h3>How do I care for my ethnic wear?</h3>
            <p>We provide detailed care instructions with each purchase. Generally, dry cleaning is recommended.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;