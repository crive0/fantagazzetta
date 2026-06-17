import { useEffect, useState } from "react";

import "./App.css";

import { Hero } from "./components/Hero";
import { SectionTitle } from "./components/SectionTitle";
import { CoachCard } from "./components/CoachCard";
import { RatingCard } from "./components/RatingCard";
import { TeamRosterCard } from "./components/TeamRosterCard";
import { HonorBoard } from "./components/HonorBoard";
import { loadAppData } from "./data/loaders";
import type { AppData } from "./data/types";

const emptyData: AppData = {
  coaches: [],
  ratings: [],
  rosters: [],
  honorBoard: []
};

function App() {
  const [data, setData] = useState<AppData>(emptyData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadAppData()
      .then((loadedData) => {
        if (!cancelled) {
          setData(loadedData);
          setError(null);
        }
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Errore nel caricamento dati");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="app">
      <header className="site-header">
        <div className="site-header__logo">FG</div>

        <nav className="site-header__nav">
          <a href="#lega">La Lega</a>
          <a href="#allenatori">Allenatori</a>
          <a href="#squadre">Squadre</a>
          <a href="#pagellone">Pagellone</a>
          <a href="#albo">Albo d'Oro</a>
        </nav>
      </header>

      <main>
        <Hero />

        <section id="lega" className="section section--intro">
          <SectionTitle
            eyebrow="La competizione"
            title="Una lega nata per gioco, degenerata per colpa dei bonus e della grappa rumena"
            description="Ogni anno gli stessi protagonisti si sfidano tra aste infinite, scambi sospetti, gufate preventive e formazioni dimenticate alle 18:01."
          />

          <div className="intro-box">
            <p>
              Benvenuti nel giornale ufficiale della nostra fantalega: il luogo
              dove ogni vittoria viene celebrata oltre il necessario e ogni
              sconfitta viene analizzata con una cattiveria francamente evitabile.
            </p>

            <p>
              Qui troverete pagelle, schede allenatori, premi discutibili,
              statistiche inutili e ricostruzioni romanzate di eventi realmente
              accaduti, purtroppo.
            </p>
          </div>
        </section>

        <section id="allenatori" className="section">
          <SectionTitle
            eyebrow="I protagonisti"
            title="Fanta Allenatori"
            description="Profili tecnici, psicologici e vagamente diffamatori dei manager della lega."
          />

          {isLoading && <p className="state-message">Caricamento allenatori...</p>}
          {error && <p className="state-message state-message--error">{error}</p>}

          <div className="coach-grid">
            {data.coaches.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        </section>

        <section id="squadre" className="section section--intro">
          <SectionTitle
            eyebrow="Le rose"
            title="Squadre dei Fanta Allenatori"
          />

          {isLoading && <p className="state-message">Caricamento rose...</p>}
          {!isLoading && !error && data.rosters.length === 0 && (
            <p className="state-message">Nessuna rosa trovata nel file Excel.</p>
          )}

          <div className="roster-grid">
            {data.rosters.map((roster) => (
              <TeamRosterCard key={roster.id} roster={roster} />
            ))}
          </div>
        </section>

        <section id="pagellone" className="section">
          <SectionTitle
            eyebrow="Fine stagione"
            title="Pagellone Finale 2025/2026"
            description="Voti assegnati con apparente imparzialità, ma con evidenti rancori personali."
          />

          {isLoading && <p className="state-message">Caricamento pagelle...</p>}

          <div className="rating-list">
            {data.ratings.map((rating) => (
              <RatingCard key={rating.id} rating={rating} />
            ))}
          </div>
        </section>

        <section id="albo" className="section section--dark">
          <SectionTitle
            eyebrow="Storia"
            title="Albo d'Oro"
            description="La memoria ufficiale della lega, utile soprattutto a chi ha vinto e insopportabile per tutti gli altri."
          />

          {isLoading && <p className="state-message state-message--dark">Caricamento albo d'oro...</p>}

          <HonorBoard entries={data.honorBoard} />
        </section>
      </main>
    </div>
  );
}

export default App;
