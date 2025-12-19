/** 
 * CustomerForm Component
 * Form for submitting customer feedback
 */

import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { customerService } from '../services/customerService';
import { useTheme } from '../contexts/ThemeContext';
import type { CustomerCreate } from '../types/customer';

interface CustomerFormProps {
    onSuccess?: () => void;
    organization_slug?: string;
}

export function CustomerForm({onSuccess, organization_slug = 'didi-beauty'}: CustomerFormProps) {
    const { theme } = useTheme();
    const [formData, setFormData] = useState<CustomerCreate>({
        name: '',
        email: '',
        feedback: '',
        organization_slug: organization_slug,
    });

    // Update form data if organization_slug prop changes
    useEffect(() => {
        setFormData(prev => ({ ...prev, organization_slug }));
    }, [organization_slug]);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [consentGiven, setConsentGiven] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // Prevent duplicate submissions
        if (isSubmitting) return;
        
        setError(null);
        setSuccess(false);
        setIsSubmitting(true);
        
        try {
            await customerService.create(formData);
            setSuccess(true);
            setFormData({name: '', email: '', feedback: '', organization_slug: 'didi-beauty'});

            if (onSuccess) {
                onSuccess();
            }
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            let errorMessage = 'Failed to submit feedback. Please try again.';
            
            if (typeof detail === 'string') {
                errorMessage = detail;
            } else if (Array.isArray(detail)) {
                // Handle FastAPI validation error list
                errorMessage = detail.map((e: any) => e.msg).join(', ');
            } else if (detail && typeof detail === 'object') {
                errorMessage = JSON.stringify(detail);
            }
            
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg'>
            <h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800'>Submit Your Feedback</h2>
            <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-5'>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name Input */}
                    <div>
                        <label htmlFor='name' className='block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1.5 text-left'>
                            Name
                        </label>
                        <input
                            type='text'
                            id='name'
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className='w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color,theme(colors.blue.500))] focus:bg-white focus:border-transparent text-sm outline-none transition-all'
                            placeholder='Your name'
                            disabled={isSubmitting}
                        />
                    </div>
                    {/* Email Input */}
                    <div>
                        <label htmlFor='email' className='block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1.5 text-left'>
                            Email
                        </label>
                        <input
                            type='email'
                            id='email'
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className='w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color,theme(colors.blue.500))] focus:bg-white focus:border-transparent text-sm outline-none transition-all'
                            placeholder='Your email'
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                {/* Feedback Textarea */}
                <div>
                    <label htmlFor='feedback' className='block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1.5 text-left'>
                        Your Thoughts & Feedback
                    </label>
                    <textarea
                        id='feedback'
                        required
                        value={formData.feedback}
                        onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                        rows={8}
                        className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color,theme(colors.blue.500))] focus:bg-white focus:border-transparent resize-none text-base outline-none transition-all leading-relaxed'
                        placeholder='Share your experience with us...'
                        disabled={isSubmitting}
                    />
                </div>
                {/* Privacy Policy Consent */}
                <div className="flex items-start">
                    <input
                        type="checkbox"
                        id="consent"
                        checked={consentGiven}
                        onChange={(e) => setConsentGiven(e.target.checked)}
                        className="mt-1 mr-2 h-4 w-4 text-[var(--primary-color,theme(colors.blue.600))] border-gray-300 rounded focus:ring-[var(--primary-color,theme(colors.blue.500))]"
                        required
                    />
                    <label htmlFor="consent" className="text-xs sm:text-sm text-gray-700 text-left">
                        I agree to the{' '}
                        <Link to={`/privacy/${formData.organization_slug}`} className="text-[var(--primary-color,theme(colors.blue.600))] hover:opacity-80 underline" target="_blank">
                            Privacy Policy
                        </Link>
                        {' '}and consent to my data being stored for prize draw purposes.
                    </label>
                </div>
                {/* Error Message */}
                {error && (
                    <div className='p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm'>
                        {error}
                    </div>
                )}
                {/* Success Message */}
                { success && (
                    <div className='p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs sm:text-sm'>
                        Thank you for your feedback! You're now entered in the draw.
                    </div>
                )}
                {/* Submit Button */}
                <button
                    type='submit'
                    disabled={isSubmitting || !consentGiven}
                    className={`w-full text-white py-2 sm:py-2.5 px-4 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-95 disabled:bg-gray-400 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base shadow-lg ${
                        isSubmitting || !consentGiven ? 'bg-gray-400' : `bg-gradient-to-r ${theme.gradients.button}`
                    }`}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    )
}