import Link from 'next/link';
import Navigation from '../components/Navigation';

const services = [
  {
    id: 1,
    name: 'Cortes Modernos',
    description: 'Cortes de cabello contemporáneos que se adaptan a tu personalidad y estilo de vida. Desde cortes clásicos hasta las últimas tendencias.',
    price: 25000,
    duration: '60 min',
    features: ['Consulta personalizada', 'Técnicas modernas', 'Productos premium'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
      </svg>
    ),
    gradient: 'from-amber-500 to-yellow-500'
  },
  {
    id: 2,
    name: 'Coloración Premium',
    description: 'Tintes y mechas profesionales con productos de las mejores marcas del mercado. Colores vibrantes y duraderos.',
    price: 45000,
    duration: '120 min',
    features: ['Productos internacionales', 'Técnicas avanzadas', 'Consulta de color'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    gradient: 'from-yellow-500 to-amber-600'
  },
  {
    id: 3,
    name: 'Tratamientos Capilares',
    description: 'Tratamientos especializados para restaurar, nutrir y fortalecer tu cabello. Soluciones para cada tipo de cabello.',
    price: 35000,
    duration: '90 min',
    features: ['Diagnóstico capilar', 'Tratamientos personalizados', 'Productos especializados'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    gradient: 'from-amber-600 to-yellow-500'
  },
  {
    id: 4,
    name: 'Peinados Especiales',
    description: 'Peinados para ocasiones especiales. Desde eventos formales hasta looks casuales con un toque elegante.',
    price: 20000,
    duration: '45 min',
    features: ['Peinados para eventos', 'Técnicas profesionales', 'Productos de fijación'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    gradient: 'from-yellow-400 to-amber-500'
  },
  {
    id: 5,
    name: 'Mechas y Balayage',
    description: 'Técnicas de coloración avanzadas como balayage, highlights y mechas para lograr looks naturales y modernos.',
    price: 55000,
    duration: '150 min',
    features: ['Técnicas avanzadas', 'Colores naturales', 'Efectos degradados'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    gradient: 'from-amber-500 to-yellow-600'
  },
  {
    id: 6,
    name: 'Corte + Lavado',
    description: 'Servicio completo que incluye lavado profesional, corte moderno y styling final para un look perfecto.',
    price: 30000,
    duration: '90 min',
    features: ['Lavado profesional', 'Corte personalizado', 'Styling final'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'from-yellow-500 to-amber-500'
  }
];

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-md rounded-full text-sm font-medium mb-6 border border-amber-500/30">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 animate-pulse"></span>
              Nuestros Servicios
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Servicios de <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent animate-gradient-x">Excelencia</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Descubre nuestra amplia gama de servicios profesionales diseñados para realzar tu belleza natural 
              y expresar tu personalidad única.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 overflow-hidden border border-gray-800 hover:border-amber-500/50 transform hover:scale-105">
                {/* Service Header */}
                <div className={`relative h-48 bg-gradient-to-br ${service.gradient} p-8 flex items-center justify-center`}>
                  <div className="text-black group-hover:scale-110 transition-transform duration-500">
                    {service.icon}
                  </div>
                  <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-sm font-medium">{service.duration}</span>
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{service.name}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{service.description}</p>
                  
                  {/* Features */}
                  <ul className="space-y-2 mb-8">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-300">
                        <svg className="w-4 h-4 text-amber-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">${service.price.toLocaleString()}</span>
                    </div>
                    <Link 
                      href="/reservas"
                      className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-500 text-black font-bold py-3 px-6 rounded-full text-sm transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-amber-500/30 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-transparent"></div>
                      <span className="relative z-10">Reservar</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-md rounded-full text-sm font-medium mb-6 border border-amber-500/30">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 animate-pulse"></span>
              Nuestro Proceso
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Cómo <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent animate-gradient-x">Trabajamos</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto">
              Un proceso estructurado que garantiza resultados excepcionales en cada visita
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-transparent"></div>
                <span className="text-2xl font-bold text-black relative z-10">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Consulta</h3>
              <p className="text-gray-300">Analizamos tu cabello y discutimos tus deseos y expectativas.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-transparent"></div>
                <span className="text-2xl font-bold text-black relative z-10">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Planificación</h3>
              <p className="text-gray-300">Creamos un plan personalizado basado en tus necesidades específicas.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-transparent"></div>
                <span className="text-2xl font-bold text-black relative z-10">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ejecución</h3>
              <p className="text-gray-300">Aplicamos técnicas profesionales con productos de alta calidad.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-transparent"></div>
                <span className="text-2xl font-bold text-black relative z-10">4</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Finalización</h3>
              <p className="text-gray-300">Styling final y consejos para mantener tu nuevo look.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6">
            ¿Lista para tu Transformación?
          </h2>
          <p className="text-lg sm:text-xl text-black/80 mb-10 max-w-3xl mx-auto">
            Reserva tu cita ahora y descubre por qué somos la opción preferida para el cuidado de tu cabello.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Link 
              href="/reservas" 
              className="bg-black text-amber-400 hover:bg-gray-900 font-bold py-4 px-8 sm:px-10 rounded-full text-base sm:text-lg transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-black/30"
            >
              Reservar Cita
            </Link>
            <Link 
              href="/contacto" 
              className="border-2 border-black text-black hover:bg-black hover:text-amber-400 font-bold py-4 px-8 sm:px-10 rounded-full text-base sm:text-lg transition-all duration-500"
            >
              Consultar Disponibilidad
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}