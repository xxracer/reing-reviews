import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProgramPage.css';
import FAQ from '../components/FAQ';

const AdultProgram = () => {
  const [content, setContent] = useState({
    title: 'Adult Program',
    mainText: '<p>Our Adult Jiu Jitsu program provides a supportive environment for beginners and advanced students alike. Whether your goal is self-defense, fitness, or personal growth, you’ll find the right path here. Classes include both gi and no-gi Jiu Jitsu in Katy, TX.</p>',
    mainImage: [{ url: "https://static.wixstatic.com/media/c5947c_fae53860ebbd4e9a8644aa66c76e45e1~mv2.jpg" }],
    benefits: [
      {
        title: 'Self-Defense, Fitness, and Growth',
        text: '<p>Our classes are designed to help you achieve your goals, whether you\'re a beginner or an advanced student.</p><ul><li>- Learn effective self-defense techniques</li><li>- Improve your fitness and overall health</li><li>- Experience personal growth in a supportive community</li><li>- Classes include both Gi and No-Gi training</li></ul>',
        image: { url: "https://static.wixstatic.com/media/c5947c_200495ae287d4122be667a7e4a8f4551~mv2.jpg" },
      },
    ],
    galleryImage: [{ url: "https://static.wixstatic.com/media/c5947c_32c260b29da7493f94738d8603598770~mv2.jpg" }],
  });

  const pageFaqs = [
    {
      question: "Does the training cover self-defense techniques?",
      answer: "Jiu Jitsu is an inherently effective self-defense system. Our curriculum incorporates techniques for real-life situations, focusing on controlling an opponent regardless of size or strength."
    },
    {
      question: "Do I need any previous martial arts experience to join the Adult Program?",
      answer: "No. We welcome complete beginners and recommend starting with our Fundamentals Program to build a solid, safe foundation before moving to the main Adult classes."
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
        const response = await axios.get('/api/content/adult-program');
        if (response.data && Object.keys(response.data).length > 0) {
          setContent(prevContent => ({ ...prevContent, ...response.data }));
        }
      } catch (error) {
        console.error('Error fetching adult program content:', error);
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
          <img src={benefit.image.url} alt="Adults drilling techniques" />
        </div>
      </section>

      {galleryImageUrl && (
        <div style={{'textAlign':'center', 'marginBottom': '60px'}}>
          <img src={galleryImageUrl} alt="Group of adult students after a jiu jitsu class" />
        </div>
      )}

      <FAQ faqData={pageFaqs} title="Adult Program FAQs" />
    </div>
  );
};

export default AdultProgram;
