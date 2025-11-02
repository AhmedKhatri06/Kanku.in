import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./about.css"; // Add this import

const AboutUs = () => {
  return (
    <div className="about-container">
        <h1 className="about-title">
          About Us
        </h1>
        <p className="about-tagline">
          "Where Tradition Becomes Timeless Luxury"
        </p>

        {/* Section 1 - Intro */}
        <section className="about-section">
          <p className="about-text-lg about-leading-relaxed">
            At <span className="about-highlight">Kanku.in</span>, we
            redefine ethnic elegance by blending India's rich heritage of
            craftsmanship with the sophistication of modern design. Our
            collections are crafted for the contemporary woman who values
            authenticity, artistry, and timeless beauty.
          </p>
        </section>

        {/* Section 2 - Essence */}
        <section className="about-section">
          <h2 className="about-section-heading">
            Our Essence
          </h2>
          <p className="about-text-lg about-leading-relaxed">
            Rooted in tradition yet inspired by today's world, Kanku.in is more
            than a fashion label — it is a celebration of India's cultural
            legacy. Each ensemble embodies the spirit of craftsmanship, from the
            intricate weaves of handloom sarees to the delicate embroidery of
            bespoke kurtas. Every creation tells a story — of artisans,
            heritage, and the enduring charm of Indian artistry.
          </p>
        </section>

        {/* Section 3 - Experience */}
        <section className="about-section">
          <h2 className="about-section-heading">
            The Kanku Experience
          </h2>
          <p className="about-text-lg about-leading-relaxed">
            Every piece at Kanku.in is handpicked and thoughtfully designed to
            bring <strong className="about-strong">luxury, comfort, and culture</strong> together. We
            believe in quality that speaks, fabrics that breathe, and designs
            that transcend trends.
          </p>
          <ul className="about-list">
            <li>🌸 Designer Sarees & Lehengas — handcrafted for grace</li>
            <li>🪡 Elegant Kurtas & Sets — where comfort meets sophistication</li>
            <li>💍 Artisanal Accessories — crafted to complete your elegance</li>
          </ul>
        </section>

        {/* Section 4 - Promise */}
        <section className="about-section">
          <h2 className="about-section-heading">
            Our Promise of Excellence
          </h2>
          <p className="about-text-lg about-leading-relaxed">
            We are committed to sustainable craftsmanship, ethical sourcing, and
            exceptional quality. Each creation is made with attention to detail
            and a passion for preserving traditional artistry. We partner with
            skilled artisans across India, ensuring that every product carries
            the soul of its origin.
          </p>
        </section>

        {/* Section 5 - Vision */}
        <section className="about-section">
          <h2 className="about-section-heading">
            Our Vision
          </h2>
          <p className="about-text-lg about-leading-relaxed">
            To become India's most trusted destination for premium ethnic wear —
            a brand that not only celebrates culture but also empowers the hands
            that create it. At Kanku.in, we aim to make every customer feel
            connected to their roots, adorned with elegance and pride.
          </p>
        </section>

        {/* Footer Line */}
        <div className="about-footer">
          <p className="about-text-lg about-text-gray-700">
            ✨ <span className="about-footer-highlight">Kanku.in</span> — 
            Crafted with Tradition. Defined by Elegance.
          </p>
        </div>
    </div>
  );
};

export default AboutUs;