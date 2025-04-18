import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
    Truck,
    MapPin,
    Calendar,
    Clock,
    FileText,
    FileSignature,
    DollarSign,
    ListOrdered,
    ArrowRight,
    CheckCircle
} from 'lucide-react';

interface StopData {
    id_load: string;
    stop_type: string;
    address: string;
    date_stop: string;
    time_note: string;
    bol_document: string;
    lumper_document: string;
    fee_lumper_paid_broker: number;
    fee_lumper: string;
    order_stop: number;
}

const CreateStopLoad: React.FC = () => {
    const [stopData, setStopData] = useState<StopData>({
        id_load: '',
        stop_type: '',
        address: '',
        date_stop: '',
        time_note: '',
        bol_document: '',
        lumper_document: '',
        fee_lumper_paid_broker: 0,
        fee_lumper: '',
        order_stop: 1,
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setStopData(prev => ({
            ...prev,
            [name]: name === 'fee_lumper_paid_broker' || name === 'order_stop' ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('Stop Data submitted:', stopData);
        // Submit to API
        alert("Stop load created successfully!");
    };

    // Form fields configuration with icons
    const formFields = [
        { name: 'id_load', type: 'text', placeholder: 'Load ID', icon: <Truck size={18} /> },
        { name: 'stop_type', type: 'text', placeholder: 'Stop Type', icon: <MapPin size={18} /> },
        { name: 'address', type: 'text', placeholder: 'Address', icon: <MapPin size={18} /> },
        { name: 'date_stop', type: 'date', placeholder: 'Stop Date', icon: <Calendar size={18} /> },
        { name: 'time_note', type: 'text', placeholder: 'Time Note', icon: <Clock size={18} /> },
        { name: 'bol_document', type: 'text', placeholder: 'BOL Document', icon: <FileText size={18} /> },
        { name: 'lumper_document', type: 'text', placeholder: 'Lumper Document', icon: <FileSignature size={18} /> },
        { name: 'fee_lumper_paid_broker', type: 'number', placeholder: 'Lumper Fee Paid by Broker', icon: <DollarSign size={18} /> },
        { name: 'fee_lumper', type: 'text', placeholder: 'Lumper Fee', icon: <DollarSign size={18} /> },
        { name: 'order_stop', type: 'number', placeholder: 'Stop Order', icon: <ListOrdered size={18} /> },
    ];

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Create New Stop Load</h2>
                <p className="text-gray-500 mt-2">Enter the stop details for the load</p>
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
                                value={(stopData as any)[field.name]}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm hover:border-teal-300"
                                min={field.type === 'number' ? '0' : undefined}
                            />
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="mt-8 border-t border-gray-100 pt-8">
                    <div className="flex flex-col items-center">
                        <button
                            type="submit"
                            className="relative group w-full max-w-lg bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            {/* Button Animation Effects */}
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

                            <div className="relative flex items-center justify-center gap-3">
                                <CheckCircle size={22} className="text-white" />
                                <span>Create Stop Load</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>

                        <p className="text-sm text-gray-500 mt-3">
                            Review all information before submitting
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateStopLoad;