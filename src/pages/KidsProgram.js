import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProgramPage.css';
import FAQ from '../components/FAQ';
import { sanitizeAndSetInnerHTML } from '../utils/sanitize';

const KidsProgram = () => {
  const [content, setContent] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/content/kids-program');
        setContent(response.data || {});
      } catch (error) {
        console.error('Error fetching kids program content:', error);
      }
    };
    fetchContent();
  }, []);

  const {
    title = 'Kids Program',
    mainText = '<p>Our Kids Jiu Jitsu classes are designed to help children build confidence, respect, and discipline while having fun. From preschoolers (ages 4 and up) to teens, our children’s Jiu Jitsu and teens Jiu Jitsu classes focus on developing coordination, teamwork, and self-defense skills. We also welcome families looking for family Jiu Jitsu programs.</p>',
    mainImage,
    benefits_title = 'Building Confidence and Skills',
    benefits_text = '<p>We provide a safe and supportive environment where children can learn and grow. Our curriculum is designed to be engaging and effective.</p><ul><li>- Develop coordination and teamwork</li><li>- Learn valuable self-defense skills</li><li>- Build respect and discipline</li><li>- Have fun while learning</li></ul>',
    benefits_image,
    galleryImage,
    faqs = [],
  } = content;

  const heroImageUrl = mainImage && mainImage.url ? mainImage.url : "https://static.wixstatic.com/media/c5947c_690fa9195b12420bb76a88e15c1502b1~mv2.jpeg";
  const benefitsImageUrl = benefits_image && benefits_image.url ? benefits_image.url : "https://static.wixstatic.com/media/c5947c_78dcb424cd4245d9acc5de69236867dc~mv2.jpeg";
  const galleryImageUrl = galleryImage && galleryImage.url ? galleryImage.url : "https://static.wixstatic.com/media/c5947c_5cedfbdb69ec448a9e5e0c60dba8235a~mv2.jpeg";

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
          <img src={benefitsImageUrl} alt="Instructor teaching young kids" />
        </div>
      </section>

      {galleryImageUrl && (
        <div style={{'textAlign':'center'}}>
          <img src={galleryImageUrl} alt="Smiling kids after class" />
        </div>
      )}

      <FAQ faqData={faqs} title="Kids Program FAQs" />
    </div>
  );
};

export default KidsProgram;
