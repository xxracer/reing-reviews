import React from 'react';
import './HeroSection.css';

const HeroSection = ({ videoOpacity }) => {
  return (
    <section className="hero-section">
      <div className="hero-video-wrapper" style={{ opacity: videoOpacity }}>
        <video autoPlay loop muted playsInline className="hero-video-bg">
          <source src="/videos/reign.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="hero-content">
        <h1 className="hero-main-title">Katys Premier Jiu Jitsu Academy</h1>
        <p className="hero-sub-text">Kids Jiu-Jitsu • Adult Gi & No-Gi • Competition & Homeschool Training</p>
        <a href="#contact" className="hero-cta-button">Book Your Trial Class</a>
      </div>
    </section>
  );
};

export default HeroSection;
