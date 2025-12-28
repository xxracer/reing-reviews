import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import core layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import page components
import HomePage from './pages/HomePage';
import KidsProgram from './pages/KidsProgram';
import HomeschoolProgram from './pages/HomeschoolProgram';
import AdultProgram from './pages/AdultProgram';
import FundamentalsProgram from './pages/FundamentalsProgram';
import CompetitionTraining from './pages/CompetitionTraining';
import WrestlingProgram from './pages/WrestlingProgram';
import PrivateLessons from './pages/PrivateLessons';
import Schedule from './pages/Schedule';
import TrainingSchedule from './pages/TrainingSchedule';
import Instructors from './pages/Instructors';
import OurFacility from './pages/OurFacility';
import AffiliateSchools from './pages/AffiliateSchools';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import UpdateInstructors from './pages/UpdateInstructors';

import GoogleReviewsButton from './components/GoogleReviewsButton';

// This new component handles the layout
const AppLayout = () => {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kids-program" element={<KidsProgram />} />
          <Route path="/homeschool-program" element={<HomeschoolProgram />} />
          <Route path="/adult-program" element={<AdultProgram />} />
          <Route path="/fundamentals-program" element={<FundamentalsProgram />} />
          <Route path="/competition-training" element={<CompetitionTraining />} />
          <Route path="/wrestling-program" element={<WrestlingProgram />} />
          <Route path="/private-lessons" element={<PrivateLessons />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/training-schedule" element={<TrainingSchedule />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/facility" element={<OurFacility />} />
          <Route path="/affiliate-schools" element={<AffiliateSchools />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/update-instructors" element={<UpdateInstructors />} />
        </Routes>
      </main>
      <Footer />
      <GoogleReviewsButton />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;