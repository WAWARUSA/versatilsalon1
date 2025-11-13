// src/app/cortes/page.tsx

// Esta es una función de React que representa nuestra página
export default function CortesPage() {
  return (
    <main className="cortes-page">
      <section className="hero-cortes">
        <h1>Nuestros Cortes y Estilos</h1>
        <p>Descubre los looks que marcan tendencia y encuentra el estilo perfecto para ti.</p>
      </section>
      
      <section className="cortes-gallery">
        {/* Aquí es donde mostraremos todos los servicios */}
        <div className="cortes-grid">

          {/* Tarjeta de Servicio 1 */}
          <div className="corte-card">
            <img src="https://placehold.co/400x400/f8bbd0/444?text=Corte+Bob" alt="Corte estilo Bob" />
            <div className="card-content">
              <h2>Corte Bob Clásico</h2>
              <p>Un estilo icónico y versátil que nunca pasa de moda. Ideal para un look fresco y elegante.</p>
              <p className="price">$25.000</p>
            </div>
          </div>

          {/* Tarjeta de Servicio 2 */}
          <div className="corte-card">
            <img src="https://placehold.co/400x400/e1bee7/444?text=Balayage" alt="Técnica de Balayage" />
            <div className="card-content">
              <h2>Balayage</h2>
              <p>Iluminación sutil y natural aplicada a mano alzada para un efecto "besado por el sol".</p>
              <p className="price">$70.000</p>
            </div>
          </div>

          {/* Tarjeta de Servicio 3 */}
          <div className="corte-card">
            <img src="https://placehold.co/400x400/c5cae9/444?text=Corte+Pixie" alt="Corte estilo Pixie" />
            <div className="card-content">
              <h2>Corte Pixie</h2>
              <p>Atrevido, moderno y lleno de personalidad. Un corte corto que resalta tus facciones.</p>
              <p className="price">$28.000</p>
            </div>
          </div>
          
          {/* Puedes añadir más tarjetas aquí, copiando y pegando la estructura */}

        </div>
      </section>
    </main>
  );
}