import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProgramPage.css';
import FAQ from '../components/FAQ';
import { sanitizeAndSetInnerHTML } from '../utils/sanitize';

const WrestlingProgram = () => {
  const [content, setContent] = useState({
    title: 'Wrestling Program',
    mainText: '<h2>Strong. Fast. Disciplined.</h2><p>Wrestling is a complete sport that builds real-world athleticism: strength, balance, speed, coordination, and grit. Sessions focus on stance and motion, hand-fighting, level changes, shots, and safe finishes, taught with clear progressions and controlled intensity.</p>',
    mainImage: [{ url: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1600&q=80" }],
    benefits: [
      {
        title: 'Why It Matters',
        text: '<ul><li>- Develops full-body strength and conditioning</li><li>- Sharpens footwork, reaction time, and body control</li><li>- Builds confidence, resilience, and work ethic</li><li>- Takedown skills and top pressure directly support Jiu Jitsu and No-Gi</li></ul>',
        image: { url: "https://placehold.co/600x400?text=Wrestling+Training+1" },
      },
    ],
    additionalInfo: '<div class="program-details-text" style="margin: 0 auto"><h2>Who It&apos;s For</h2><p>Beginners, teens, and competitors looking to upgrade overall athletic performance.</p><h2 style="margin-top: 40px">What to Bring</h2><p>Rashguard and shorts; wrestling shoes optional (clean soles). Mouthguard recommended.</p><h2 style="margin-top: 40px">Ready to train?</h2><p>Join our Wrestling Program and build a stronger, faster version of you.</p></div>',
    galleryImage: [{ url: "https://placehold.co/900x500?text=Wrestling+Training+2" }],
  });

  const pageFaqs = [
    {
      question: 'Do I need prior wrestling experience to join?',
      answer:
        'No. We tailor instruction for newcomers and experienced grapplers alike, ensuring everyone learns proper stance, motion, and mat awareness from day one.'
    },
    {
      question: 'Can wrestling training help my Jiu Jitsu?',
      answer:
        'Absolutely. Takedown entries, level changes, and top control developed in wrestling directly boost your Gi and No-Gi performance.'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pageFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/content/wrestling-program');
        if (response.data && Object.keys(response.data).length > 0) {
          setContent(prevContent => ({ ...prevContent, ...response.data }));
        }
      } catch (error) {
        console.error('Error fetching wrestling program content:', error);
      }
    };
    fetchContent();
  }, []);

  const heroImageUrl = content.mainImage && content.mainImage[0] ? content.mainImage[0].url : '';
  const benefit = content.benefits && content.benefits[0] ? content.benefits[0] : { title: '', text: '', image: { url: '' } };
  const galleryImageUrl = content.galleryImage && content.galleryImage[0] ? content.galleryImage[0].url : '';

  return (
    <div className="program-page">
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <section
        className="program-hero"
        style={{
          backgroundImage: `url('${heroImageUrl}')`
        }}
      >
        <h1 className="program-hero-title">{content.title}</h1>
      </section>

      <section className="program-intro" dangerouslySetInnerHTML={sanitizeAndSetInnerHTML(content.mainText)} />

      <section className="program-details-section">
        <div className="program-details-text" dangerouslySetInnerHTML={sanitizeAndSetInnerHTML(benefit.text)} />
        <div className="program-details-image">
          <img
            src={benefit.image.url}
            alt="Two athletes drilling wrestling stance and motion"
          />
        </div>
      </section>

      <section className="program-intro" style={{ maxWidth: '1000px' }} dangerouslySetInnerHTML={sanitizeAndSetInnerHTML(content.additionalInfo)} />

      <div style={{ textAlign: 'center', margin: '0 auto 60px auto', maxWidth: '900px', padding: '0 20px' }}>
        <img
          src={galleryImageUrl}
          alt="Coach guiding wrestling technique"
          style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
        />
      </div>

      <FAQ faqData={pageFaqs} title="Wrestling Program FAQs" />
    </div>
  );
};

export default WrestlingProgram;
