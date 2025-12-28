import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProgramPage.css';
import FAQ from '../components/FAQ';

const PrivateLessons = () => {
  const [content, setContent] = useState({
    title: 'Private Lessons',
    mainText: '<p>Accelerate your progress with Private BJJ lessons. Work directly with our instructors to focus on your goals, from self-defense to competition preparation. Many students find that private Jiu Jitsu classes near me give them the boost they need to succeed.</p>',
    mainImage: [{ url: "https://static.wixstatic.com/media/c5947c_32e7f546ef5043418e7e8229d64bb099~mv2.png" }],
    benefits: [
      {
        title: 'Focus on Your Goals',
        text: '<p>Private lessons are the fastest way to improve. Get personalized feedback and instruction tailored to your specific needs.</p><ul><li>- Accelerate your progress</li><li>- Focus on your specific goals</li><li>- Ideal for self-defense or competition prep</li><li>- Get the boost you need to succeed</li></ul>',
        image: { url: "https://static.wixstatic.com/media/c5947c_dfc350dae9d242e6b35ea9ab6499341c~mv2.png" },
      },
    ],
  });

  const pageFaqs = [
    {
      question: "Can I share a Private Lesson with a friend?",
      answer: "Yes, private lessons offer the flexibility to work with the coach on a one-on-one basis or in a small group environment, allowing you to train with a partner or small group."
    },
    {
      question: "Are Private Lessons suitable for complete beginners?",
      answer: "Absolutely. Beginners often find that private lessons help them build a solid foundation and confidence faster, making their subsequent transition into group classes more effective and enjoyable."
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
        const response = await axios.get('/api/content/private-lessons');
        if (response.data && Object.keys(response.data).length > 0) {
          setContent(prevContent => ({ ...prevContent, ...response.data }));
        }
      } catch (error) {
        console.error('Error fetching private lessons content:', error);
      }
    };
    fetchContent();
  }, []);

  const heroImageUrl = content.mainImage && content.mainImage[0] ? content.mainImage[0].url : '';
  const benefit = content.benefits && content.benefits[0] ? content.benefits[0] : { title: '', text: '', image: { url: '' } };

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
          <img src={benefit.image.url} alt="Instructor coaching a student" />
        </div>
      </section>

      <FAQ faqData={pageFaqs} title="Private Lessons FAQs" />
    </div>
  );
};

export default PrivateLessons;
