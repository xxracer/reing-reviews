import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ImageEditor from '../components/ImageEditor';
import ProgramsEditor from '../components/ProgramsEditor';
import InstructorEditor from '../components/InstructorEditor';
import FAQEditor from '../components/FAQEditor';

import './EditablePage.css';

// Define the structure of your pages here
const pageStructure = {
    home: {
        heroTitle: { type: 'text' },
        heroSubtitle: { type: 'text' },
        heroVideo: { type: 'image', aspect: 16 / 9 }, // Simplified as image upload
        welcomeTitle: { type: 'text' },
        welcomeText: { type: 'richtext' },
        welcomeImage: { type: 'image', aspect: 4 / 3 },
        facilityTitle: { type: 'text' },
        facilityText: { type: 'textarea' },
        facilityImages: { type: 'image' }, // Should handle multiple images
        facilityVideo: { type: 'text' }, // YouTube URL
        ctaTitle: { type: 'text' },
        ctaText: { type: 'textarea' },
        homepageFaqs: { type: 'custom', editor: 'FAQEditor' },
    },
    about: {
        title: { type: 'text' },
        headerImage: { type: 'image', aspect: 16 / 9 },
        aboutText: { type: 'richtext' },
    },
    instructors: {
        title: { type: 'text' },
        headerImage: { type: 'image', aspect: 16 / 9 },
        instructors_list: { type: 'custom', editor: 'InstructorEditor' },
    },
    'kids-program': {
        title: { type: 'text' },
        mainText: { type: 'richtext' },
        mainImage: { type: 'image', aspect: 16/9 },
        benefits_title: { type: 'text' },
        benefits_text: { type: 'richtext' },
        benefits_image: { type: 'image', aspect: 1/1 },
        galleryImage: { type: 'image', aspect: 16/9 },
        faqs: { type: 'custom', editor: 'FAQEditor' },
    },
    'homeschool-program': {
        header_image: { type: 'image', aspect: 16/9 },
        title: { type: 'text' },
        description: { type: 'richtext' },
        schedule_info: { type: 'richtext' },
    },
    'adult-program': {
        title: { type: 'text' },
        mainText: { type: 'richtext' },
        mainImage: { type: 'image', aspect: 16/9 },
        benefits_title: { type: 'text' },
        benefits_text: { type: 'richtext' },
        benefits_image: { type: 'image', aspect: 1/1 },
        galleryImage: { type: 'image', aspect: 16/9 },
        faqs: { type: 'custom', editor: 'FAQEditor' },
    },
    'fundamentals-program': {
        header_image: { type: 'image', aspect: 16/9 },
        title: { type: 'text' },
        description: { type: 'richtext' },
        curriculum_details: { type: 'richtext' },
    },
    'competition-training': {
        header_image: { type: 'image', aspect: 16/9 },
        title: { type: 'text' },
        description: { type: 'richtext' },
        team_achievements: { type: 'richtext' },
    },
    'wrestling-program': {
        header_image: { type: 'image', aspect: 16/9 },
        title: { type: 'text' },
        description: { type: 'richtext' },
        coach_bio: { type: 'richtext' },
    },
    'private-lessons': {
        header_image: { type: 'image', aspect: 16/9 },
        title: { type: 'text' },
        description: { type: 'richtext' },
        booking_info: { type: 'richtext' },
    },
    schedule: {
        scheduleImage: { type: 'image', aspect: 1 / 1 },
        scheduleText: {type: 'richtext'}
    },
     contact: {
        address: { type: 'text' },
        phone: { type: 'text' },
        email: { type: 'text' },
    },
    // Simplified pages for now
    'affiliate-schools': {
        title: { type: 'text' },
        content: { type: 'richtext' },
    },
    blog: {
        title: { type: 'text' },
        posts: { type: 'richtext' }, // very simplified for now
    },
    'our-facility': {
         title: { type: 'text' },
         description: { type: 'richtext' },
         images: { type: 'image' },
    },
    testimonials: {
        title: { type: 'text' },
        reviews: { type: 'richtext' }, // simplified
    }
};

const EditablePage = () => {
    const { pageName } = useParams();
    const [content, setContent] = useState({});
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const structure = pageStructure[pageName] || {};

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`/api/content/${pageName}`);
            setContent(response.data || {});
        } catch (error) {
            console.error('Error fetching content:', error);
            setFeedback({ message: 'Failed to load content.', type: 'error' });
        }
    }, [pageName]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFieldChange = (fieldName, value) => {
        setContent(prevContent => ({
            ...prevContent,
            [fieldName]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback({ message: 'Saving...', type: 'info' });

        const formData = new FormData();

        for (const key in content) {
            const value = content[key];
            if (value instanceof File) {
                 formData.append(key, value, value.name);
            } else if (typeof value === 'object' && value !== null) {
                // Handle JSON objects (like from complex editors)
                formData.append(key, JSON.stringify(value));
            } else if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        }

        try {
            await axios.post(`/api/content/${pageName}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setFeedback({ message: 'Content saved successfully!', type: 'success' });
            setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
        } catch (error) {
            console.error('Error saving content:', error);
            setFeedback({ message: 'Error saving content!', type: 'error' });
        }
    };

    const renderField = (fieldName, fieldConfig) => {
        const value = content[fieldName];

        switch (fieldConfig.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        id={fieldName}
                        value={value || ''}
                        onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                    />
                );
            case 'textarea':
                return (
                    <textarea
                        id={fieldName}
                        value={value || ''}
                        onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                        rows="5"
                    />
                );
            case 'richtext':
                return (
                    <textarea
                        id={fieldName}
                        value={value || ''}
                        onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                        rows="10"
                        className="richtext-editor"
                    />
                );
            case 'image':
                return (
                    <ImageEditor
                        fieldName={fieldName}
                        initialImageUrl={value?.url || value || ''}
                        onChange={handleFieldChange}
                        aspect={fieldConfig.aspect}
                    />
                );
            case 'custom':
                switch (fieldConfig.editor) {
                    case 'ProgramsEditor':
                        return (
                            <ProgramsEditor
                                fieldName={fieldName}
                                value={value || []}
                                onChange={handleFieldChange}
                            />
                        );
                    case 'InstructorEditor':
                        return (
                            <InstructorEditor
                                fieldName={fieldName}
                                value={value || []}
                                onChange={handleFieldChange}
                            />
                        );
                    case 'FAQEditor':
                        return (
                            <FAQEditor
                                fieldName={fieldName}
                                value={value || []}
                                onChange={handleFieldChange}
                            />
                        );
                    default:
                        return <p>Unknown custom editor: {fieldConfig.editor}</p>;
                }
            default:
                return <p>Unknown field type: {fieldConfig.type}</p>;
        }
    };

    return (
        <div className="editable-page">
            <h2 className="page-title">Editing: {pageName.replace(/-/g, ' ')}</h2>
            <form onSubmit={handleSubmit} className="edit-form">
                {Object.keys(structure).map(fieldName => (
                    <div className="form-field" key={fieldName}>
                        <label htmlFor={fieldName} className="field-label">
                            {fieldName.replace(/_/g, ' ')}
                        </label>
                        {renderField(fieldName, structure[fieldName])}
                    </div>
                ))}
                <button type="submit" className="save-button">Save Changes</button>
            </form>
            {feedback.message && (
                <div className={`feedback-message ${feedback.type}`}>
                    {feedback.message}
                </div>
            )}
        </div>
    );
};

export default EditablePage;
