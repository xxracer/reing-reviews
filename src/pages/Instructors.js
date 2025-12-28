import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FAQ from '../components/FAQ';
import './Instructors.css'; // Import the new CSS file

const Instructors = () => {
  const [content, setContent] = useState({
    title: 'Meet Our World-Class Instructors',
    instructors: [],
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/content/instructors');
        if (response.data && Object.keys(response.data).length > 0) {
          setContent(prevContent => ({ ...prevContent, ...response.data }));
        }
      } catch (error) {
        console.error('Error fetching instructors content:', error);
      }
    };
    fetchContent();
  }, []);

  const pageFaqs = [
    {
      question: "What are the primary competition achievements of the instructors?",
      answer: "Our instructors are highly decorated competitors, with major titles including IBJJF World and Pan American championships."
    },
    {
      question: "What belt ranks do the instructors hold?",
      answer: "Our team is led by accomplished Black Belts, ensuring that students receive instruction at the highest level of technical knowledge and competitive experience."
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

  return (
    <div className="instructors-page">
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <h1>{content.title}</h1>

      {content.instructors.map((instructor, index) => (
        <div key={instructor.id} className={`instructor-item ${index % 2 !== 0 ? 'reverse' : ''}`}>
          <div className="instructor-image-wrapper">
            <img
              src={instructor.image}
              alt={instructor.name}
            />
          </div>
          <div className="instructor-bio">
            <h2>{instructor.name}</h2>
            {Array.isArray(instructor.bio) ? (
              instructor.bio.map((line, i) => {
                if (line.startsWith('#')) {
                  return <h3 key={i} className="instructor-bio-heading">{line.substring(1)}</h3>;
                } else if (line.startsWith('*')) {
                  return <p key={i} className="instructor-bio-bullet">{`• ${line.substring(1)}`}</p>;
                } else if (line.trim() === '') {
                  return <br key={i} />;
                } else {
                  return <p key={i}>{line}</p>;
                }
              })
            ) : (
              <p>{instructor.bio}</p>
            )}
          </div>
        </div>
      ))}

      <FAQ faqData={pageFaqs} title="Instructor FAQs" />
    </div>
  );
};

export default Instructors;
