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
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="contact-container">
      {/* Header with decorative elements */}
      <div className="contact-header">
        <div className="header-pattern"></div>
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">
          Connect with Kanku.in - Where tradition meets elegance
        </p>
      </div>

      <div className="contact-content">
        {/* Contact Information with Indian aesthetic */}
        <div className="contact-info">
          <div className="info-header">
            <h2 className="info-title">Let's Create Magic Together</h2>
            <div className="decorative-line"></div>
          </div>
          
          <p className="info-description">
            Whether you're seeking custom designs, need assistance with your order, 
            or simply want to share your love for ethnic fashion, we're here to listen 
            and help you shine in our traditional ensembles.
          </p>

          <div className="contact-methods">
            <div className="contact-method">
              <div className="method-icon">🎀</div>
              <div className="method-details">
                <h3>Email Us</h3>
                <p>support@kanku.in</p>
                <span>Traditional responses with modern speed</span>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">🌸</div>
              <div className="method-details">
                <h3>Call Us</h3>
                <p>+91 1800-KANKU-IN</p>
                <span>Mon-Sat, 10:00 AM - 7:00 PM</span>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">🏮</div>
              <div className="method-details">
                <h3>Boutique Visit</h3>
                <p>Heritage Fashion Street</p>
                <span>Mumbai, Maharashtra - 400001</span>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">📱</div>
              <div className="method-details">
                <h3>Follow Our Journey</h3>
                <p>@kanku.in</p>
                <span>On Instagram & Facebook</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form with ethnic design */}
        <div className="contact-form-container">
          <div className="form-header">
            <h2 className="form-title">Share Your Thoughts</h2>
            <p className="form-subtitle">We value your feedback and queries</p>
          </div>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Your Beautiful Name *
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
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject" className="form-label">
                How Can We Help You? *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Choose your query type</option>
                <option value="custom-design">Custom Design Consultation</option>
                <option value="order-inquiry">Order Status & Tracking</option>
                <option value="size-guide">Size & Fit Guidance</option>
                <option value="fabric-info">Fabric & Care Information</option>
                <option value="wedding-collection">Wedding Collection</option>
                <option value="collaboration">Collaboration & Partnerships</option>
                <option value="other">Other Assistance</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">
                Your Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                required
                rows="6"
                placeholder="Share your thoughts, questions, or custom requirements in detail..."
              ></textarea>
            </div>

            <button type="submit" className="submit-button">
              <span className="btn-text">Send Your Message</span>
            </button>
          </form>
        </div>
      </div>

      {/* Enhanced FAQ Section */}
      <div className="faq-section">
        <div className="faq-header">
          <h2 className="faq-title">Common Inquiries</h2>
          <p className="faq-subtitle">Quick answers to frequent questions</p>
        </div>
        
        <div className="faq-grid">
          <div className="faq-item">
            <div className="faq-icon">👗</div>
            <h3>Custom Sizing & Alterations</h3>
            <p>We offer custom tailoring for perfect fit. Share your measurements for bespoke creations that celebrate your unique beauty.</p>
          </div>
          
          <div className="faq-item">
            <div className="faq-icon">🚚</div>
            <h3>Shipping & Delivery</h3>
            <p>Standard delivery: 5-7 days. Express: 2-3 days. Free shipping on orders above ₹5000 across India.</p>
          </div>
          
          <div className="faq-item">
            <div className="faq-icon">💫</div>
            <h3>Return & Exchange Policy</h3>
            <p>30-day return policy for unworn items with tags. Custom orders are made with love and cannot be returned.</p>
          </div>
          
          <div className="faq-item">
            <div className="faq-icon">🌺</div>
            <h3>Fabric Care Guidance</h3>
            <p>Each piece comes with specific care instructions. Generally, dry clean silks and hand wash cotton for longevity.</p>
          </div>
          
          <div className="faq-item">
            <div className="faq-icon">🎁</div>
            <h3>Wedding & Special Occasions</h3>
            <p>Book personal consultations for wedding collections. We create magical ensembles for your special day.</p>
          </div>
          
          <div className="faq-item">
            <div className="faq-icon">🌟</div>
            <h3>Quality & Craftsmanship</h3>
            <p>Each piece is crafted with attention to detail, using premium fabrics and traditional techniques with modern finesse.</p>
          </div>
        </div>
      </div>

      {/* Closing decorative element */}
      <div className="closing-note">
        <div className="closing-pattern"></div>
        <p className="closing-text">
          Thank you for choosing Kanku.in - Where every thread tells a story of tradition and elegance
        </p>
      </div>
    </div>
  );
};

export default Contact;