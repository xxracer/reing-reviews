import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProgramPage.css';
import FAQ from '../components/FAQ';
import { sanitizeAndSetInnerHTML } from '../utils/sanitize';

const AdultProgram = () => {
  const [content, setContent] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/content/adult-program');
        setContent(response.data || {});
      } catch (error) {
        console.error('Error fetching adult program content:', error);
      }
    };
    fetchContent();
  }, []);

  const {
    title = 'Adult Program',
    mainText = '<p>Our Adult Jiu Jitsu program provides a supportive environment for beginners and advanced students alike. Whether your goal is self-defense, fitness, or personal growth, you’ll find the right path here. Classes include both gi and no-gi Jiu Jitsu in Katy, TX.</p>',
    mainImage,
    benefits_title = 'Self-Defense, Fitness, and Growth',
    benefits_text = '<p>Our classes are designed to help you achieve your goals, whether you\'re a beginner or an advanced student.</p><ul><li>- Learn effective self-defense techniques</li><li>- Improve your fitness and overall health</li><li>- Experience personal growth in a supportive community</li><li>- Classes include both Gi and No-Gi training</li></ul>',
    benefits_image,
    galleryImage,
    faqs = [],
  } = content;

  const heroImageUrl = mainImage && mainImage.url ? mainImage.url : "https://static.wixstatic.com/media/c5947c_fae53860ebbd4e9a8644aa66c76e45e1~mv2.jpg";
  const benefitsImageUrl = benefits_image && benefits_image.url ? benefits_image.url : "https://static.wixstatic.com/media/c5947c_200495ae287d4122be667a7e4a8f4551~mv2.jpg";
  const galleryImageUrl = galleryImage && galleryImage.url ? galleryImage.url : "https://static.wixstatic.com/media/c5947c_32c260b29da7493f94738d8603598770~mv2.jpg";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="program-page">
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <section className="program-hero" style={{ backgroundImage: `url('${heroImageUrl}')` }}>
        <h1 className="program-hero-title">{title}</h1>
      </section>

      <section className="program-intro" dangerouslySetInnerHTML={sanitizeAndSetInnerHTML(mainText)} />

      <section className="program-details-section">
        <div className="program-details-text">
          <h2>{benefits_title}</h2>
          <div dangerouslySetInnerHTML={sanitizeAndSetInnerHTML(benefits_text)} />
        </div>
        <div className="program-details-image">
          <img src={benefitsImageUrl} alt="Adults drilling techniques" />
        </div>
      </section>

      {galleryImageUrl && (
        <div style={{'textAlign':'center', 'marginBottom': '60px'}}>
          <img src={galleryImageUrl} alt="Group of adult students after a jiu jitsu class" />
        </div>
      )}

      <FAQ faqData={faqs} title="Adult Program FAQs" />
    </div>
  );
};

export default AdultProgram;
