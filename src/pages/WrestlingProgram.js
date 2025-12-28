import React from 'react';
import './ProgramPage.css';
import FAQ from '../components/FAQ';

const WrestlingProgram = () => {
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

  return (
    <div className="program-page">
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <section
        className="program-hero"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1600&q=80')"
        }}
      >
        <h1 className="program-hero-title">Wrestling Program</h1>
      </section>

      <section className="program-intro">
        <h2>Strong. Fast. Disciplined.</h2>
        <p>
          Wrestling is a complete sport that builds real-world athleticism: strength, balance, speed, coordination, and grit.
          Sessions focus on stance and motion, hand-fighting, level changes, shots, and safe finishes, taught with clear
          progressions and controlled intensity.
        </p>
      </section>

      <section className="program-details-section">
        <div className="program-details-text">
          <h2>Why It Matters</h2>
          <ul>
            <li>- Develops full-body strength and conditioning</li>
            <li>- Sharpens footwork, reaction time, and body control</li>
            <li>- Builds confidence, resilience, and work ethic</li>
            <li>- Takedown skills and top pressure directly support Jiu Jitsu and No-Gi</li>
          </ul>
        </div>
        <div className="program-details-image">
          <img
            src="https://placehold.co/600x400?text=Wrestling+Training+1"
            alt="Two athletes drilling wrestling stance and motion"
          />
        </div>
      </section>

      <section className="program-intro" style={{ maxWidth: '1000px' }}>
        <div className="program-details-text" style={{ margin: '0 auto' }}>
          <h2>Who It&apos;s For</h2>
          <p>Beginners, teens, and competitors looking to upgrade overall athletic performance.</p>
          <h2 style={{ marginTop: '40px' }}>What to Bring</h2>
          <p>Rashguard and shorts; wrestling shoes optional (clean soles). Mouthguard recommended.</p>
          <h2 style={{ marginTop: '40px' }}>Ready to train?</h2>
          <p>Join our Wrestling Program and build a stronger, faster version of you.</p>
        </div>
      </section>

      <div style={{ textAlign: 'center', margin: '0 auto 60px auto', maxWidth: '900px', padding: '0 20px' }}>
        <img
          src="https://placehold.co/900x500?text=Wrestling+Training+2"
          alt="Coach guiding wrestling technique"
          style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
        />
      </div>

      <FAQ faqData={pageFaqs} title="Wrestling Program FAQs" />
    </div>
  );
};

export default WrestlingProgram;
