import React, { useState, useEffect, useRef } from 'react';
import FAQ from '../components/FAQ';

// Import components
import HeroSection from '../components/HeroSection';
import WelcomeSection from '../components/WelcomeSection';
import Programs from '../components/Programs';
import Facility from '../components/Facility';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';
import ContactUs from '../components/ContactUs';
import InstagramFeed from '../components/InstagramFeed';
import './HomePage.css'; // Import new CSS for homepage structure

import axios from 'axios';

const HomePage = () => {
  const [content, setContent] = useState({});
  const [videoOpacity, setVideoOpacity] = useState(1);
  const welcomeRef = useRef(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/content/home');
        setContent(response.data || {});
      } catch (error) {
        console.error('Error fetching homepage content:', error);
      }
    };
    fetchContent();

    const handleScroll = () => {
      if (welcomeRef.current) {
        const { top } = welcomeRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const fadeStartPoint = windowHeight;
        const fadeEndPoint = 0;
        if (top < fadeStartPoint) {
          const progress = (fadeStartPoint - top) / (fadeStartPoint - fadeEndPoint);
          const newOpacity = 1 - Math.min(progress, 1);
          setVideoOpacity(newOpacity);
        } else {
          setVideoOpacity(1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="homepage-container">
      <HeroSection videoOpacity={videoOpacity} content={content} />
      <div className="welcome-section-wrapper" ref={welcomeRef}>
        <WelcomeSection content={content} />
        <Programs />
        <Facility content={content} />
        <Testimonials />
        <CallToAction content={content} />
        <ContactUs />
        <InstagramFeed />
        <div style={{ maxWidth: '900px', margin: '0 auto 60px auto' }}>
          <FAQ faqData={content.homepageFaqs} title="About Our Programs" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;