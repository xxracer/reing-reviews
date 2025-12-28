import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FAQ from '../components/FAQ';

const Schedule = () => {
  const [content, setContent] = useState({
    title: 'Class Schedule',
    mainText: '<p>Our flexible schedule makes it easy to fit training into your life. Morning, evening, and weekend classes are available for kids, adults, and families. Whether you’re looking for Jiu Jitsu near me open now or planning ahead, our timetable works for everyone.</p>',
    mainImage: [{ url: "https://placehold.co/900x600?text=Class+Schedule+Graphic" }],
  });

  const pageFaqs = [
    {
      question: "Are there classes available for different times of the day?",
      answer: "Yes, we offer flexible training times with morning, noon, and evening classes to accommodate various schedules, including those of busy professionals and parents."
    },
    {
      question: "Is the schedule consistent on weekends?",
      answer: "Our weekend schedule typically includes morning classes and open mat sessions. Please check the current schedule page for specific Saturday and Sunday times."
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
        const response = await axios.get('/api/content/schedule');
        if (response.data && Object.keys(response.data).length > 0) {
          setContent(prevContent => ({ ...prevContent, ...response.data }));
        }
      } catch (error) {
        console.error('Error fetching schedule content:', error);
      }
    };
    fetchContent();
  }, []);

  const imageUrl = content.mainImage && content.mainImage[0] ? content.mainImage[0].url : '';

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '60px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <h1 style={{ marginBottom: '20px' }}>{content.title}</h1>
      <div style={{ marginBottom: '40px', fontSize: '18px', lineHeight: '1.7' }} dangerouslySetInnerHTML={{ __html: content.mainText }} />
      <img
        src={imageUrl}
        alt="Screenshot or graphic of class schedule"
        style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '60px' }}
      />
      <FAQ faqData={pageFaqs} title="Schedule FAQs" />
    </div>
  );
};

export default Schedule;
