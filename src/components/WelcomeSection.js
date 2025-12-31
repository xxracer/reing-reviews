import React from 'react';
import { sanitizeAndSetInnerHTML } from '../utils/sanitize';
import './WelcomeSection.css';

const WelcomeSection = ({ content = {} }) => {
  const {
    welcomeTitle = 'Welcome to Reign Jiu-Jitsu',
    welcomeText = `
      <p>Reign Jiu-Jitsu is home to multiple youth champions and one of the nation’s most respected teams. Whether you’re a beginner, competitor, or parent looking for a family-friendly program, our world-class facility combines elite training, a full gym, and a positive culture built to help you grow.</p>
      <p>From kids to adults, beginners to competitors, our students develop strength, discipline, and confidence through Brazilian Jiu-Jitsu. We’re home to multiple youth champions and one of the nation’s most respected competition teams, offering:</p>
      <ul>
        <li>✅ Competition Training for serious athletes</li>
        <li>✅ Homeschool Jiu-Jitsu Program for growing minds and bodies</li>
        <li>✅ Fundamentals for Beginners to build a solid foundation</li>
        <li>✅ Adult Gi & No-Gi Classes in a motivating, inclusive environment</li>
      </ul>
      <p>Scroll down to explore why Reign Jiu-Jitsu is recognized among the best in the World.</p>
    `,
    welcomeImage
  } = content;

  const image = welcomeImage && welcomeImage.length > 0 ? welcomeImage[0] : { url: 'https://static.wixstatic.com/media/c5947c_bf5a3cd828194df2944c8bb4eaf4cae0~mv2.jpg', align: 'center', width: '100%' };

  return (
    <section id="welcome-section" className="welcome-section">
      <div className="welcome-container">
        <div className="welcome-text-content">
          <h2>{welcomeTitle}</h2>
          <div dangerouslySetInnerHTML={sanitizeAndSetInnerHTML(welcomeText)} />
          <button className="welcome-info-button">Get more info</button>
        </div>
        <div className="welcome-image-wrapper" style={{ textAlign: image.align }}>
          <img src={image.url} alt="Group of mixed-age students on the mats" style={{ width: image.width }} />
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
