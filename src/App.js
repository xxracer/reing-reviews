import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import AdminLayout from './components/AdminLayout'; // Import the new layout
import EditablePage from './pages/EditablePage'; // Import the new editable page component

import GoogleReviewsButton from './components/GoogleReviewsButton';

const DefaultLayout = ({ children }) => (
  <div className="App">
    <Navbar />
    <main>{children}</main>
    <Footer />
    <GoogleReviewsButton />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="edit/home" replace />} />
          <Route path="edit/:pageName" element={<EditablePage />} />
        </Route>
        <Route
          path="/*"
          element={
            <DefaultLayout>
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
            </DefaultLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
