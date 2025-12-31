import React from 'react';
import './CallToAction.css';

const CallToAction = ({ content = {} }) => {
    const {
        ctaTitle = 'Try Katy’s Favorite Jiu Jitsu Classes Today',
        ctaText = 'Join athletes and families across Katy who trust Reign Jiu Jitsu for expert coaching and a positive learning environment. Take the first step today!',
    } = content;

    return (
        <section className="cta-section">
            <div className="cta-container">
                <h2 className="cta-title">{ctaTitle}</h2>
                <p className="cta-text">{ctaText}</p>
                <a href="#contact" className="cta-button">Get More Info</a>
            </div>
        </section>
    );
};

export default CallToAction;