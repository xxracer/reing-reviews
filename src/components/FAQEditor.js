import React from 'react';
import './FAQEditor.css';

const FAQEditor = ({ fieldName, value, onChange }) => {
    const faqs = Array.isArray(value) ? value : [];

    const handleQuestionChange = (index, newQuestion) => {
        const newFaqs = [...faqs];
        newFaqs[index] = { ...newFaqs[index], question: newQuestion };
        onChange(fieldName, newFaqs);
    };

    const handleAnswerChange = (index, newAnswer) => {
        const newFaqs = [...faqs];
        newFaqs[index] = { ...newFaqs[index], answer: newAnswer };
        onChange(fieldName, newFaqs);
    };

    const addFaq = () => {
        onChange(fieldName, [...faqs, { question: '', answer: '' }]);
    };

    const removeFaq = (index) => {
        const newFaqs = faqs.filter((_, i) => i !== index);
        onChange(fieldName, newFaqs);
    };

    return (
        <div className="faq-editor">
            {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                    <input
                        type="text"
                        placeholder="Question"
                        value={faq.question || ''}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                    />
                    <textarea
                        placeholder="Answer"
                        value={faq.answer || ''}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        rows="3"
                    />
                    <button type="button" onClick={() => removeFaq(index)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={addFaq}>Add FAQ</button>
        </div>
    );
};

export default FAQEditor;
