/** 
 * CustomerForm Component
 * Form for submitting customer feedback
 */

import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { customerService } from '../services/customerService';
import type { CustomerCreate } from '../types/customer';

interface CustomerFormProps {
    onSuccess?: () => void;
}

export function CustomerForm({onSuccess}: CustomerFormProps) {
    const [formData, setFormData] = useState<CustomerCreate>({
        name: '',
        email: '',
        feedback: '',
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [consentGiven, setConsentGiven] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setIsSubmitting(true);
        
        try {
            await customerService.create(formData);
            setSuccess(true);
            setFormData({name: '', email: '', feedback: ''});

            if (onSuccess) {
                onSuccess();
            }
        } catch (err: unknown) {
            const errorMessage = (err as any).response?.data?.detail || 'Failed to submit feedback. Please try again.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg'>
            <h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800'>Submit Your Feedback</h2>
            <form onSubmit={handleSubmit} className='space-y-3 sm:space-y-4'>
                {/* Name Input */}
                <div>
                    <label htmlFor='name' className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 text-left'>
                        Name
                    </label>
                    <input
                        type='text'
                        id='name'
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className='w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base'
                        placeholder='Enter your name'
                        disabled={isSubmitting}
                    />
                </div>
                {/* Email Input */}
                <div>
                    <label htmlFor='email' className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 text-left'>
                        Email
                    </label>
                    <input
                        type='email'
                        id='email'
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className='w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base'
                        placeholder='Enter your email'
                        disabled={isSubmitting}
                    />
                </div>
                {/* Feedback Textarea */}
                <div>
                    <label htmlFor='feedback' className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 text-left'>
                        Feedback
                    </label>
                    <textarea
                        id='feedback'
                        required
                        value={formData.feedback}
                        onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                        rows={4}
                        className='w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base'
                        placeholder='Share your thoughts...'
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
                        className="mt-1 mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        required
                    />
                    <label htmlFor="consent" className="text-xs sm:text-sm text-gray-700 text-left">
                        I agree to the{' '}
                        <Link to="/privacy" className="text-blue-600 hover:text-blue-700 underline" target="_blank">
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
                    className='w-full bg-blue-600 text-white py-2 sm:py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base'
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    )
}