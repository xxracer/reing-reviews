import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProgramPage.css';
import FAQ from '../components/FAQ';
import { sanitizeAndSetInnerHTML } from '../utils/sanitize';

const CompetitionTraining = () => {
  const [content, setContent] = useState({
    title: 'Competition Training',
    mainText: '<p>For those who want to take their training to the next level, our Competition Training program is led by experienced coaches who prepare students for local, national, and international tournaments. Push yourself, sharpen your game, and represent BJJ Katy Texas with pride.</p>',
    mainImage: [{ url: "https://static.wixstatic.com/media/c5947c_80a936d01653434093c7bf7f4276b689~mv2.png" }],
    benefits: [
      {
        title: 'Prepare for the Podium',
        text: '<p>Our program is designed to sharpen your game and prepare you for the highest levels of competition.</p><ul><li>- Led by experienced, world-class coaches</li><li>- Prepare for local, national, and international tournaments</li><li>- Sharpen your game and push your limits</li><li>- Represent BJJ in Katy, Texas with pride</li></ul>',
        image: { url: "https://static.wixstatic.com/media/c5947c_8ff5a096294b498eb84b3f63dd24889b~mv2.jpg" },
      },
    ],
  });

  const pageFaqs = [
    {
      question: "Does the program include nutritional guidance?",
      answer: "Yes, our customized training includes key nutrition strategies and advice from a dedicated coach to optimize weight cuts and maximize in-competition performance."
    },
    {
      question: "What level of experience is required for Competition Training?",
      answer: "This program is geared toward intermediate to advanced practitioners (typically blue belt and up) who have a solid understanding of the fundamentals and are looking to specialize."
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
        const response = await axios.get('/api/content/competition-training');
        if (response.data && Object.keys(response.data).length > 0) {
          setContent(prevContent => ({ ...prevContent, ...response.data }));
        }
      } catch (error) {
        console.error('Error fetching competition training content:', error);
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

      <section className="program-intro" dangerouslySetInnerHTML={sanitizeAndSetInnerHTML(content.mainText)} />

      <section className="program-details-section">
        <div className="program-details-text">
          <h2>{benefit.title}</h2>
          <div dangerouslySetInnerHTML={sanitizeAndSetInnerHTML(benefit.text)} />
        </div>
        <div className="program-details-image">
          <img src={benefit.image.url} alt="Team with medals" />
        </div>
      </section>

      <FAQ faqData={pageFaqs} title="Competition Training FAQs" />
    </div>
  );
};

export default CompetitionTraining;
