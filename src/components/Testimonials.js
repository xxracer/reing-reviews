import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Testimonials.css';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('/api/google-reviews')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setReviews(data.reviews);
        }
      })
      .catch(error => console.error('Error fetching Google Reviews:', error));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  };

  return (
    <section id="testimonials-section" className="testimonials-section">
      <h2 className="section-title">What Our Members Say</h2>
      <div className="testimonials-container">
        <Slider {...settings}>
          {reviews.map((review, index) => (
            <div key={index}>
              <div className="testimonial-card">
                <p className="testimonial-quote">“{review.text}”</p>
                <p className="testimonial-author">— {review.author_name}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;