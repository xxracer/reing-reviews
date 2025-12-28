import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProgramPage.css';
import FAQ from '../components/FAQ';

const HomeschoolProgram = () => {
  const [content, setContent] = useState({
    title: 'Homeschool Program',
    mainText: '<p>Reign Jiu Jitsu proudly offers a Homeschool Jiu Jitsu program tailored to families seeking daytime martial arts training. Students benefit from physical fitness, social interaction, and learning the values of discipline and perseverance. If you’re searching for homeschool martial arts near me, our program is the perfect fit.</p>',
    mainImage: [{ url: "https://static.wixstatic.com/media/c5947c_84d1216506fb4e4485d07d065cea8b98~mv2.png" }],
    benefits: [
      {
        title: 'Physical Fitness & Social Interaction',
        text: '<p>Our program is designed to provide a comprehensive experience for homeschool students, focusing on key areas of development.</p><ul><li>- Benefit from physical fitness</li><li>- Develop social interaction skills</li><li>- Learn the values of discipline and perseverance</li><li>- Perfect for daytime martial arts training</li></ul>',
        image: { url: "https://static.wixstatic.com/media/c5947c_b0565367f7d345408d6f1e8853fb5f2f~mv2.png" },
      },
    ],
    galleryImage: [{ url: "https://static.wixstatic.com/media/c5947c_d824ca9346fc4e299f2d533a72eae649~mv2.png" }],
  });

  const pageFaqs = [
    {
      question: "What are the qualifications of the instructor for the Homeschool program?",
      answer: "The program is led by a black belt instructor who also has a background as a Physical Education and Health teacher, providing a unique and qualified perspective for homeschool students."
    },
    {
      question: "Can these classes count toward my child’s P.E. requirement?",
      answer: "Yes, the program emphasizes physical fitness, helping children build strength, flexibility, and overall health, fulfilling the physical activity goals often associated with P.E. "
    },
    {
      question: "What unique benefits does the program offer for homeschool children?",
      answer: "It provides valuable social development and connection with peers, alongside specialized instruction in confidence, discipline, and physical fitness in a screen-free environment. "
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
        const response = await axios.get('/api/content/homeschool-program');
        if (response.data && Object.keys(response.data).length > 0) {
          setContent(prevContent => ({ ...prevContent, ...response.data }));
        }
      } catch (error) {
        console.error('Error fetching homeschool program content:', error);
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
          <img src={benefit.image.url} alt="Small homeschool class" />
        </div>
      </section>

      {galleryImageUrl && (
        <div style={{'textAlign':'center', 'marginBottom': '60px'}}>
          <img src={galleryImageUrl} alt="Parents watching kids train" />
        </div>
      )}

      <FAQ faqData={pageFaqs} title="Homeschool Program FAQs" />
    </div>
  );
};

export default HomeschoolProgram;
