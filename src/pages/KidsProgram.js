import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProgramPage.css';
import FAQ from '../components/FAQ';

const KidsProgram = () => {
  const [content, setContent] = useState({
    title: 'Kids Program',
    mainText: '<p>Our Kids Jiu Jitsu classes are designed to help children build confidence, respect, and discipline while having fun. From preschoolers (ages 4 and up) to teens, our children’s Jiu Jitsu and teens Jiu Jitsu classes focus on developing coordination, teamwork, and self-defense skills. We also welcome families looking for family Jiu Jitsu programs.</p>',
    mainImage: [{ url: "https://static.wixstatic.com/media/c5947c_690fa9195b12420bb76a88e15c1502b1~mv2.jpeg" }],
    benefits: [
      {
        title: 'Building Confidence and Skills',
        text: '<p>We provide a safe and supportive environment where children can learn and grow. Our curriculum is designed to be engaging and effective.</p><ul><li>- Develop coordination and teamwork</li><li>- Learn valuable self-defense skills</li><li>- Build respect and discipline</li><li>- Have fun while learning</li></ul>',
        image: { url: "https://static.wixstatic.com/media/c5947c_78dcb424cd4245d9acc5de69236867dc~mv2.jpeg" },
      },
    ],
    galleryImage: [{ url: "https://static.wixstatic.com/media/c5947c_5cedfbdb69ec448a9e5e0c60dba8235a~mv2.jpeg" }],
  });

  const pageFaqs = [
    {
      question: "What is the minimum age for the Kids Program?",
      answer: "Our Kids Jiu Jitsu program is suitable for children ages 6 and up, focusing on fundamentals and character development."
    },
    {
      question: "What gear is required for my child's first class?",
      answer: "For the trial class, comfortable athletic wear is sufficient. If you enroll in an Unlimited Membership, a complimentary Gi (uniform) is often provided."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": pageFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/content/kids-program');
        if (response.data && Object.keys(response.data).length > 0) {
          setContent(prevContent => ({ ...prevContent, ...response.data }));
        }
      } catch (error) {
        console.error('Error fetching kids program content:', error);
      }
    };
    fetchContent();
  }, []);

  const heroImageUrl = content.mainImage && content.mainImage[0] ? content.mainImage[0].url : '';
  const benefit = content.benefits && content.benefits[0] ? content.benefits[0] : { title: '', text: '', image: { url: '' } };
  const galleryImageUrl = content.galleryImage && content.galleryImage[0] ? content.galleryImage[0].url : '';

  return (
    <div className="program-page">
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <section className="program-hero" style={{ backgroundImage: `url('${heroImageUrl}')` }}>
        <h1 className="program-hero-title">{content.title}</h1>
      </section>

      <section className="program-intro" dangerouslySetInnerHTML={{ __html: content.mainText }} />

      <section className="program-details-section">
        <div className="program-details-text">
          <h2>{benefit.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: benefit.text }} />
        </div>
        <div className="program-details-image">
          <img src={benefit.image.url} alt="Instructor teaching young kids" />
        </div>
      </section>

      {galleryImageUrl && (
        <div style={{'textAlign':'center'}}>
          <img src={galleryImageUrl} alt="Smiling kids after class" />
        </div>
      )}

      <FAQ faqData={pageFaqs} title="Kids Program FAQs" />
    </div>
  );
};

export default KidsProgram;
