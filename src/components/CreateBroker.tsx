import React, { useState, ChangeEvent, FormEvent } from 'react';
import { ClipboardCheck, MapPin, Phone, Mail, Info, DollarSign, User, Calendar, CheckCircle } from 'lucide-react';
import { backendUrl } from '../../lib/apiUrl';

interface BrokerData {
    broker_name: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    county: string;
    zipcode: string;
    phone_number: string;
    email: string;
    mc_number: string;
    dot_number: string;
    avg_days_to_pay: string;
    link_to_ui: string;
    active: string;
    date_register: string;
}

const CreateBroker: React.FC = () => {
    const [brokerData, setBrokerData] = useState<BrokerData>({
        broker_name: '',
        address: '',
        address2: '',
        city: '',
        state: '',
        county: '',
        zipcode: '',
        phone_number: '',
        email: '',
        mc_number: '',
        dot_number: '',
        avg_days_to_pay: '',
        link_to_ui: '',
        active: '1',
        date_register: '',
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBrokerData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // API Call to Submit Broker Data
        try {
            const response = await fetch(`${backendUrl}/insert-brokers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(brokerData),
            });

            if (!response.ok) {
                throw new Error('Failed to create broker');
            }

            const data = await response.json();
            console.log('Broker created successfully:', data);

            // Optionally, show success message or redirect to another page
            alert('Broker created successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error creating the broker.');
        }
    };

    // Group fields for better layout
    const formFields = [
        { name: 'broker_name', type: 'text', placeholder: 'Broker Name', icon: <User size={18} /> },
        { name: 'address', type: 'text', placeholder: 'Address', icon: <MapPin size={18} /> },
        { name: 'address2', type: 'text', placeholder: 'Address 2', icon: <MapPin size={18} /> },
        { name: 'city', type: 'text', placeholder: 'City', icon: <MapPin size={18} /> },
        { name: 'state', type: 'text', placeholder: 'State', icon: <MapPin size={18} /> },
        { name: 'county', type: 'text', placeholder: 'County', icon: <MapPin size={18} /> },
        { name: 'zipcode', type: 'text', placeholder: 'Zipcode', icon: <MapPin size={18} /> },
        { name: 'phone_number', type: 'text', placeholder: 'Phone Number', icon: <Phone size={18} /> },
        { name: 'email', type: 'text', placeholder: 'Email', icon: <Mail size={18} /> },
        { name: 'mc_number', type: 'text', placeholder: 'MC Number', icon: <ClipboardCheck size={18} /> },
        { name: 'dot_number', type: 'text', placeholder: 'DOT Number', icon: <ClipboardCheck size={18} /> },
        { name: 'avg_days_to_pay', type: 'text', placeholder: 'Avg Days to Pay', icon: <DollarSign size={18} /> },
        { name: 'link_to_ui', type: 'text', placeholder: 'Link to UI', icon: <Info size={18} /> },
        { name: 'active', type: 'text', placeholder: 'Active', icon: <CheckCircle size={18} /> },
        { name: 'date_register', type: 'date', placeholder: 'Date Register', icon: <Calendar size={18} /> },
    ];

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Create New Broker</h2>
                <p className="text-gray-500 mt-2">Enter the broker details below to create a new broker entry</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formFields.map((field) => (
                        <div key={field.name} className="flex flex-col">
                            <label htmlFor={field.name} className="mb-1 text-sm font-medium text-gray-700 flex items-center gap-2">
                                <span className="text-teal-500">{field.icon}</span>
                                {field.placeholder}
                            </label>
                            <input
                                type={field.type}
                                name={field.name}
                                id={field.name}
                                placeholder={field.placeholder}
                                value={(brokerData as any)[field.name]}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm hover:border-teal-300"
                            />
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="mt-8 border-t border-gray-100 pt-8">
                    <div className="flex flex-col items-center">
                        <button
                            type="submit"
                            className="relative group w-full max-w-lg bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-medium text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            {/* Button Animation Effects */}
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

                            <div className="relative flex items-center justify-center gap-3">
                                <ClipboardCheck size={22} className="text-white" />
                                <span>Create Broker</span>
                            </div>
                        </button>

                        <p className="text-sm text-gray-500 mt-3">
                            Click to create a new broker entry
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateBroker;
