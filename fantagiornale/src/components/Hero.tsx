export function Hero() {
  return (
    <section className="hero">
      <div className="hero__label">Edizione speciale</div>

      <h1>La Gazzetta del Fantacalcio</h1>

      <p className="hero__subtitle">
        Il giornale ufficiale della lega più competitiva, caotica e inutilmente
        polemica del fantacalcio tra amici.
      </p>

      <div className="hero__actions">
        <a href="#allenatori" className="button button--primary">
          Scopri gli allenatori
        </a>

        <a href="#pagellone" className="button button--secondary">
          Vai al pagellone
        </a>
      </div>
    </section>
  );
}