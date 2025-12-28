import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TrainingSchedule.css';

const TrainingSchedule = () => {
  const [content, setContent] = useState({
    title: 'Training Schedule',
    intro: '<p>Below is the latest weekly schedule for Reign Jiu Jitsu in Katy, including daytime homeschool sessions, evening classes, and our brand-new Wrestling Program. Use it to plan your training and make the most of every mat time opportunity.</p>',
    schedule: [
      {
        day: 'Monday',
        sessions: [
          { time: '10:00 AM - 11:00 AM', title: 'Homeschool Kids', tags: ['kids'] },
          { time: '11:00 AM - 12:00 PM', title: 'Adults Jiu Jitsu (all levels)', tags: ['adults'] },
          { time: '4:00 PM - 5:00 PM', title: 'Private Lessons', tags: ['private'] },
          { time: '5:00 PM - 5:55 PM', title: 'Kids (7-9 yrs)', tags: ['kids'] },
          { time: '5:00 PM - 6:00 PM', title: 'Wrestling Program', tags: ['wrestling'] },
          { time: '6:00 PM - 6:55 PM', title: 'Kids (10-13 yrs)', tags: ['kids'] },
          { time: '7:00 PM - 8:00 PM', title: 'Adults Gi (all levels)', tags: ['adults'] }
        ]
      },
      // ... (rest of the default schedule)
    ],
    cta: 'Looking for a private training slot or have scheduling questions? <a href="/contact">Contact us</a> and our team will help you get started.'
  });

  const tagLabels = {
    kids: 'Kids',
    adults: 'Adults',
    private: 'Private Training',
    wrestling: 'Wrestling'
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/content/training-schedule');
        if (response.data && Object.keys(response.data).length > 0) {
          setContent(prevContent => ({ ...prevContent, ...response.data }));
        }
      } catch (error) {
        console.error('Error fetching training schedule content:', error);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="schedule-page">
      <h1>{content.title}</h1>
      <div className="schedule-intro" dangerouslySetInnerHTML={{ __html: content.intro }} />

      <div className="schedule-grid">
        {content.schedule.map((day) => (
          <div key={day.day} className="schedule-day">
            <h2>{day.day}</h2>
            <ul className="schedule-sessions">
              {day.sessions.length === 0 ? (
                <li className="schedule-session">
                  <span className="time">—</span>
                  <p className="title">No scheduled sessions</p>
                </li>
              ) : (
                day.sessions.map((session, index) => (
                  <li key={`${day.day}-${index}`} className="schedule-session">
                    <span className="time">{session.time}</span>
                    <p className="title">{session.title}</p>
                    {session.tags && session.tags.length > 0 && (
                      <div className="session-tags">
                        {session.tags.map((tag) => (
                          <span key={tag} className={`session-tag ${tag}`}>
                            {tagLabels[tag] || tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className="schedule-cta" dangerouslySetInnerHTML={{ __html: content.cta }} />
    </div>
  );
};

export default TrainingSchedule;
