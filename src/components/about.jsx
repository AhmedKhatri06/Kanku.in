import React from "react";
import { BrowserRouter } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="bg-[#fffaf5] text-gray-800 py-16 px-6 md:px-20 font-sans">
        <h1 className="text-4xl md:text-5xl font-semibold text-center mb-8 text-amber-800">
          About Us
        </h1>
        <p className="text-center text-lg md:text-xl text-gray-600 mb-12 italic">
          “Where Tradition Becomes Timeless Luxury”
        </p>

        {/* Section 1 - Intro */}
        <section className="mb-12">
          <p className="text-lg leading-relaxed mb-4">
            At <span className="font-semibold text-amber-700">Kanku.in</span>, we
            redefine ethnic elegance by blending India’s rich heritage of
            craftsmanship with the sophistication of modern design. Our
            collections are crafted for the contemporary woman who values
            authenticity, artistry, and timeless beauty.
          </p>
        </section>

        {/* Section 2 - Essence */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-amber-800 mb-3">
            Our Essence
          </h2>
          <p className="text-lg leading-relaxed">
            Rooted in tradition yet inspired by today’s world, Kanku.in is more
            than a fashion label — it is a celebration of India’s cultural
            legacy. Each ensemble embodies the spirit of craftsmanship, from the
            intricate weaves of handloom sarees to the delicate embroidery of
            bespoke kurtas. Every creation tells a story — of artisans,
            heritage, and the enduring charm of Indian artistry.
          </p>
        </section>

        {/* Section 3 - Experience */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-amber-800 mb-3">
            The Kanku Experience
          </h2>
          <p className="text-lg leading-relaxed mb-3">
            Every piece at Kanku.in is handpicked and thoughtfully designed to
            bring <strong>luxury, comfort, and culture</strong> together. We
            believe in quality that speaks, fabrics that breathe, and designs
            that transcend trends.
          </p>
          <ul className="list-disc list-inside text-lg text-gray-700 ml-2">
            <li>🌸 Designer Sarees & Lehengas — handcrafted for grace</li>
            <li>🪡 Elegant Kurtas & Sets — where comfort meets sophistication</li>
            <li>💍 Artisanal Accessories — crafted to complete your elegance</li>
          </ul>
        </section>

        {/* Section 4 - Promise */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-amber-800 mb-3">
            Our Promise of Excellence
          </h2>
          <p className="text-lg leading-relaxed">
            We are committed to sustainable craftsmanship, ethical sourcing, and
            exceptional quality. Each creation is made with attention to detail
            and a passion for preserving traditional artistry. We partner with
            skilled artisans across India, ensuring that every product carries
            the soul of its origin.
          </p>
        </section>

        {/* Section 5 - Vision */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-amber-800 mb-3">
            Our Vision
          </h2>
          <p className="text-lg leading-relaxed">
            To become India’s most trusted destination for premium ethnic wear —
            a brand that not only celebrates culture but also empowers the hands
            that create it. At Kanku.in, we aim to make every customer feel
            connected to their roots, adorned with elegance and pride.
          </p>
        </section>

        {/* Footer Line */}
        <div className="text-center mt-16 border-t border-amber-200 pt-6">
          <p className="text-lg text-gray-700">
            ✨ <span className="font-semibold text-amber-700">Kanku.in</span> — 
            Crafted with Tradition. Defined by Elegance.
          </p>
        </div>
    </div>
  );
};

export default AboutUs;
