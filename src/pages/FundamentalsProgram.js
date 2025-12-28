import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProgramPage.css';
import FAQ from '../components/FAQ';

const FundamentalsProgram = () => {
  const [content, setContent] = useState({
    title: 'Fundamentals Program',
    mainText: '<p>Start your journey with our Fundamentals Jiu Jitsu classes. This program covers basic movements, positions, and techniques, ensuring that new students build a strong foundation. Perfect for those looking for beginner Jiu Jitsu near me.</p>',
    mainImage: [{ url: "https://static.wixstatic.com/media/c5947c_c7ef85e5ccc24f99b71c499e9c5d41fd~mv2.jpg" }],
    benefits: [
      {
        title: 'Build a Strong Foundation',
        text: '<p>Our fundamentals program is designed to give you the confidence and skills you need to succeed in your Jiu Jitsu journey.</p><ul><li>- Learn basic movements and positions</li><li>- Understand core techniques</li><li>- Build a solid foundation for advanced classes</li><li>- Perfect for beginners</li></ul>',
        image: { url: "https://static.wixstatic.com/media/c5947c_9de5932b95dc4de18b8a7277f4f8509b~mv2.png" },
      },
    ],
    galleryImage: [{ url: "https://static.wixstatic.com/media/c5947c_b9ce4dd9773847f0b3a64d02df753405~mv2.png" }],
  });

  const pageFaqs = [
    {
      question: "Who is the Fundamentals Program for?",
      answer: "It's designed for new students who are just beginning their Jiu Jitsu journey. It's the perfect entry point before joining the main adult classes."
    },
    {
      question: "What will I learn in this program?",
      answer: "You will learn the core movements, body positioning, and essential self-defense techniques that form the bedrock of the art, all in a safe and supportive environment."
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
        const response = await axios.get('/api/content/fundamentals-program');
        if (response.data && Object.keys(response.data).length > 0) {
          setContent(prevContent => ({ ...prevContent, ...response.data }));
        }
      } catch (error) {
        console.error('Error fetching fundamentals program content:', error);
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
          <img src={benefit.image.url} alt="Instructor demonstrating a basic move" />
        </div>
      </section>

      {galleryImageUrl && (
        <div style={{'textAlign':'center', 'marginBottom': '60px'}}>
          <img src={galleryImageUrl} alt="New students practicing" />
        </div>
      )}

      <FAQ faqData={pageFaqs} title="Fundamentals Program FAQs" />
    </div>
  );
};

export default FundamentalsProgram;
