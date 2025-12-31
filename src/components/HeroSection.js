import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HeroSection.css';

const HeroSection = ({ videoOpacity, content = {} }) => {
  const {
    heroTitle = 'Katys Premier Jiu Jitsu Academy',
    heroSubtitle = 'Kids Jiu-Jitsu • Adult Gi & No-Gi • Competition & Homeschool Training',
    heroVideo
  } = content;

  const videoUrl = heroVideo && heroVideo.length > 0 ? heroVideo[0].url : '/videos/reign.mp4';

  return (
    <section className="hero-section">
      <div className="hero-video-wrapper" style={{ opacity: videoOpacity }}>
        <video autoPlay loop muted playsInline className="hero-video-bg">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="hero-content">
        <h1 className="hero-main-title">{heroTitle}</h1>
        <p className="hero-sub-text">{heroSubtitle}</p>
        <a href="#contact" className="hero-cta-button">Book Your Trial Class</a>
      </div>
    </section>
  );
};

export default HeroSection;
