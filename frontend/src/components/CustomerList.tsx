/**
 * Customer Component
 * Displays a list of all customers with their feedback
 */

import { useState, useEffect } from 'react';
import { customerService } from '../services/customerService';
import type { Customer } from '../types/customer';

export function CustomerList() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);

    const fetchCustomers = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await customerService.getAll(0,100);
            setCustomers(response.customers);
            setTotal(response.total);
        } catch (err: any) {
            setError('Failed to load customers');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    if (loading) {
        return (
            <div className='w-full max-w-4xl mx-auto p-3 sm:p-6'>
                <div className='flex justify-center items-center py-8 sm:py-12'>
                    <div className='text-gray-600 text-sm sm:text-base'>Loading customers...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='w-full max-w-4xl mx-auto p-3 sm:p-6'>
                <div className='p-3 sm:p-4 bg-red-50 border-red-200 rounded-lg text-red-700 text-sm sm:text-base'>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className='w-full max-w-4xl mx-auto p-3 sm:p-6'>
            <div className='bg-white rounded-lg shadow-lg p-4 sm:p-6'>
                <div className='flex justify-between items-center mb-4 sm:mb-6'>
                    <h2 className='text-xl sm:text-2xl font-bold text-gray-800'>Customers</h2>
                    <span className='text-xs sm:text-sm text-gray-600'>Total: {total}</span>
                </div>

                {customers.length === 0 ? (
                    <p className='text-gray-600 text-center py-6 sm:py-8 text-sm sm:text-base'>No customers yet</p>
                ) : (
                    <div className='space-y-3 sm:space-y-4'>
                        {customers.map((customer) => (
                            <div
                                key={customer.id}
                                className={`p-3 sm:p-4 rounded-lg border ${
                                    customer.is_winner
                                        ? 'bg-yellow-50 border-yellow-300'
                                        : 'bg-gray-50 border-gray-200'
                                }`}
                            >
                                <div className='flex justify-between items-start mb-2 gap-2'>
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='font-semibold text-gray-900 text-sm sm:text-base truncate'>{customer.name}</h3>
                                        <p className='text-xs sm:text-sm text-gray-600 truncate'>{customer.email}</p>
                                    </div>
                                    {customer.is_winner && (
                                        <span className='px-2 sm:px-3 py-0.5 sm:py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-medium whitespace-nowrap'>
                                            Winner
                                        </span>
                                    )}
                                </div>
                                <p className='text-gray-700 text-xs sm:text-sm mt-2 break-words'>{customer.feedback}</p>
                                <p className='text-xs text-gray-500 mt-2'>
                                    {new Date(customer.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}