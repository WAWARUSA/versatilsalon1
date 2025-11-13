'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  professional: string;
  specialty: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  type: 'presencial' | 'virtual';
}

const services: Service[] = [
  { id: '1', name: 'Corte de Cabello', duration: 60, price: 25000, professional: 'María González', specialty: 'Estilista Senior' },
  { id: '2', name: 'Corte + Lavado', duration: 90, price: 30000, professional: 'Carlos Rodríguez', specialty: 'Estilista Master' },
  { id: '3', name: 'Peinado', duration: 45, price: 20000, professional: 'Ana Martínez', specialty: 'Peinadora Especialista' },
  { id: '4', name: 'Tinte', duration: 120, price: 45000, professional: 'Laura Sánchez', specialty: 'Colorista Certificada' },
  { id: '5', name: 'Mechas', duration: 150, price: 55000, professional: 'Roberto López', specialty: 'Especialista en Mechas' },
  { id: '6', name: 'Tratamiento Capilar', duration: 60, price: 35000, professional: 'Carmen Vega', specialty: 'Terapeuta Capilar' },
];

const timeSlots: TimeSlot[] = [
  { time: '09:00', available: true, type: 'presencial' },
  { time: '10:00', available: true, type: 'presencial' },
  { time: '11:00', available: false, type: 'presencial' },
  { time: '12:00', available: true, type: 'presencial' },
  { time: '13:00', available: true, type: 'presencial' },
  { time: '14:00', available: false, type: 'presencial' },
  { time: '15:00', available: true, type: 'presencial' },
  { time: '16:00', available: true, type: 'presencial' },
  { time: '16:45', available: true, type: 'presencial' },
  { time: '17:00', available: true, type: 'presencial' },
  { time: '18:00', available: false, type: 'presencial' },
];

export default function ReservarPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [step, setStep] = useState<'service' | 'time' | 'details'>('service');

  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que empiece en lunes
    startOfWeek.setDate(diff);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric' 
    });
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep('time');
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
    setCurrentWeek(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('details');
  };

  const handleConfirmReservation = () => {
    setShowConfirmation(true);
  };

  const weekDates = getWeekDates(currentWeek);
  const selectedDateObj = selectedDate ? new Date(selectedDate) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">Salón Belleza</h1>
                <p className="text-sm text-blue-400">Estilo y Elegancia</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="border-t border-gray-200">
            <div className="flex space-x-8">
              <Link href="/" className="py-4 text-gray-600 hover:text-blue-600 transition-colors">Inicio</Link>
              <Link href="/reservas" className="py-4 text-blue-600 border-b-2 border-blue-600 font-medium">Reserva de Cita</Link>
              <Link href="/servicios" className="py-4 text-gray-600 hover:text-blue-600 transition-colors">Servicios</Link>
              <Link href="/contacto" className="py-4 text-gray-600 hover:text-blue-600 transition-colors">Contacto</Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Blue Banner */}
      <div className="bg-blue-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {step === 'service' && 'Selecciona tu servicio'}
          {step === 'time' && 'Selecciona tu hora'}
          {step === 'details' && 'Confirma tu reserva'}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'service' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">¿Qué servicio necesitas?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(service => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{service.professional}</p>
                  <p className="text-xs text-blue-600 mb-3">{service.specialty}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">${service.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">{service.duration} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'time' && selectedService && (
          <div className="space-y-6">
            {/* Week Selector */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <h3 className="text-lg font-semibold text-gray-900">
                  Semana desde el {weekDates[0].getDate()} al {weekDates[6].getDate()} de {weekDates[0].toLocaleDateString('es-ES', { month: 'long' })}
                </h3>
                
                <button
                  onClick={() => setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {weekDates.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    className={`p-3 rounded-lg text-center ${
                      selectedDate === date.toISOString().split('T')[0]
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-xs font-medium">{formatDate(date).split(' ')[0]}</div>
                    <div className="text-sm font-semibold">{formatDate(date).split(' ')[1]}</div>
                    {index > 0 && index < 6 && (
                      <div className="w-1 h-1 bg-blue-400 rounded-full mx-auto mt-1"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Selection Card */}
            {selectedDate && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedDateObj && formatFullDate(selectedDateObj)}
                  </h3>
                </div>

                {/* Service Info */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedService.professional}</h4>
                    <p className="text-sm text-gray-600">{selectedService.specialty}</p>
                    <p className="text-sm text-blue-600">{selectedService.name}</p>
                  </div>
                </div>

                {/* Appointment Type */}
                <div className="mb-6">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
                    Presencial
                  </button>
                </div>

                {/* Time Slots */}
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                  {timeSlots.map(slot => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 rounded-lg font-medium transition-colors ${
                        slot.available
                          ? selectedTime === slot.time
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <button
                    onClick={() => setStep('service')}
                    className="px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Volver
                  </button>
                  <button
                    onClick={() => setCurrentWeek(new Date())}
                    className="px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Cambiar fecha
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'details' && selectedService && selectedTime && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Confirma tu reserva</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Servicio:</span>
                  <span className="font-medium">{selectedService.name}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Profesional:</span>
                  <span className="font-medium">{selectedService.professional}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">{selectedDateObj && formatFullDate(selectedDateObj)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Hora:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Duración:</span>
                  <span className="font-medium">{selectedService.duration} minutos</span>
                </div>
                
                <div className="flex justify-between items-center py-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-blue-600">${selectedService.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep('time')}
                  className="px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Volver
                </button>
                <button
                  onClick={handleConfirmReservation}
                  className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Confirmar Reserva
                </button>
              </div>
            </div>
          </div>
        )}

        {/* More Available Hours Section */}
        {step === 'time' && (
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="font-semibold text-gray-900">Más horarios disponibles</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Si no encuentras un horario que te convenga, puedes ver más opciones disponibles o contactarnos directamente.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¡Reserva Confirmada!
              </h3>
              
              <p className="text-gray-600 mb-6">
                Tu cita ha sido reservada exitosamente. Te contactaremos pronto para confirmar los detalles.
              </p>
              
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setStep('service');
                  setSelectedService(null);
                  setSelectedDate('');
                  setSelectedTime('');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Nueva Reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}