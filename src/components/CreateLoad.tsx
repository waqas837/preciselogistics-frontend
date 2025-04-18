import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Truck, Calendar, DollarSign, CheckCircle, ClipboardCheck } from 'lucide-react';
import { backendUrl } from '../../lib/apiUrl';

interface LoadData {
  load_number: string;
  id_broker: string;
  id_carrier_driver: string;
  id_status: string;
  date_status: string;
  date_delivery: string;
  amount_due: string;
  carrier_payment_date: string;
  delivered_confirmation: string;
}

interface Broker {
  id: string;
  broker_name: string;
}

interface Driver {
  id_carrier_driver: string;
  fullname: string;
}

const CreateLoad: React.FC = () => {
  const [loadData, setLoadData] = useState<LoadData>({
    load_number: '',
    id_broker: '',
    id_carrier_driver: '',
    id_status: '',
    date_status: '',
    date_delivery: '',
    amount_due: '',
    carrier_payment_date: '',
    delivered_confirmation: '',
  });

  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('driverToken'); // or however you're storing the token

        const [brokerRes, driverRes] = await Promise.all([
          fetch(`${backendUrl}/get-brokers`),
          fetch(`${backendUrl}/carriers/drivers`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
        ]);

        const brokersData = await brokerRes.json();
        const driversData = await driverRes.json();

        if (brokersData.success !== "false") {
          setBrokers(brokersData.data);
        }

        if (Array.isArray(driversData)) {
          setDrivers(driversData);
        }
      } catch (error) {
        console.error('Error fetching brokers or drivers:', error);
      }
    }

    fetchData();
  }, []);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLoadData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirmDelivery = () => {
    setLoadData(prev => ({
      ...prev,
      delivered_confirmation: 'confirmed',
    }));
    alert("Delivery has been confirmed!");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('driverToken'); // Use correct token key

    try {
      const response = await fetch(`${backendUrl}/insert-loads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // if required
        },
        body: JSON.stringify(loadData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Load successfully created!');
        console.log('Success:', result);
        // Optionally reset form
        setLoadData({
          load_number: '',
          id_broker: '',
          id_carrier_driver: '',
          id_status: '',
          date_status: '',
          date_delivery: '',
          amount_due: '',
          carrier_payment_date: '',
          delivered_confirmation: '',
        });
      } else {
        alert(`Failed to create load: ${result.message || 'Unknown error'}`);
        console.error('Error:', result);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Something went wrong while creating the load.');
    }
  };


  const formFields = [
    { name: 'load_number', type: 'text', placeholder: 'Load Number', icon: <Truck size={18} /> },
    { name: 'id_status', type: 'text', placeholder: 'Status ID', icon: <ClipboardCheck size={18} /> },
    { name: 'date_status', type: 'date', placeholder: 'Status Date', icon: <Calendar size={18} /> },
    { name: 'date_delivery', type: 'date', placeholder: 'Delivery Date', icon: <Calendar size={18} /> },
    { name: 'amount_due', type: 'text', placeholder: 'Amount Due', icon: <DollarSign size={18} /> },
    { name: 'carrier_payment_date', type: 'date', placeholder: 'Carrier Payment Date', icon: <Calendar size={18} /> },
    { name: 'delivered_confirmation', type: 'text', placeholder: 'Delivered Confirmation', icon: <CheckCircle size={18} /> },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Create New Load</h2>
        <p className="text-gray-500 mt-2">Enter the details below to create a new load entry</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Broker Select */}
          <div className="flex flex-col">
            <label htmlFor="id_broker" className="mb-1 text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="text-teal-500"><ClipboardCheck size={18} /></span>
              Broker
            </label>
            <select
              name="id_broker"
              id="id_broker"
              value={loadData.id_broker}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm hover:border-teal-300"
            >
              <option value="" disabled>Select a Broker</option>
              {brokers.map((broker) => (
                <option key={broker.id} value={broker.id}>{broker.broker_name}</option>
              ))}
            </select>
          </div>

          {/* Carrier Driver Select */}
          <div className="flex flex-col">
            <label htmlFor="id_carrier_driver" className="mb-1 text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="text-teal-500"><ClipboardCheck size={18} /></span>
              Carrier Driver
            </label>
            <select
              name="id_carrier_driver"
              id="id_carrier_driver"
              value={loadData.id_carrier_driver}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm hover:border-teal-300"
            >
              <option value="" disabled>Select a Driver</option>
              {drivers.map((driver) => (
                <option key={driver.id_carrier_driver} value={driver.id_carrier_driver}>
                  {driver.fullname}
                </option>
              ))}
            </select>
          </div>

          {/* Remaining Fields */}
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
                value={(loadData as any)[field.name]}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm hover:border-teal-300"
              />
            </div>
          ))}
        </div>

        {/* Confirm Delivery Button */}
        <div className="mt-8 border-t border-gray-100 pt-8">
          <div className="flex flex-col items-center">
            <button
              type="submit"
              // onClick={handleConfirmDelivery}
              className="relative group w-full max-w-lg bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-medium text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              <div className="relative flex items-center justify-center gap-3">
                <CheckCircle size={22} className="text-white" />
                <span>Create Load</span>
              </div>
            </button>
            <p className="text-sm text-gray-500 mt-3">Click to confirm successful delivery of this load</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateLoad;
