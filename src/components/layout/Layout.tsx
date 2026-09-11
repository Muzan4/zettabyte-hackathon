import Header from './Header';
import CrewPanel from '../crew/CrewPanel';
import DossierPanel from '../dossier/DossierPanel';
import RaidmasterPanel from '../raidmaster/RaidmasterPanel';
import PlankModal from '../shared/PlankModal';

export default function Layout() {
  return (
    <div className="app-root">
      <Header />
      <main className="main-grid">
        <section className="panel-left">
          <CrewPanel />
        </section>
        <section className="panel-right">
          <div className="panel-right-top">
            <DossierPanel />
          </div>
          <div className="panel-right-bottom">
            <RaidmasterPanel />
          </div>
        </section>
      </main>
      <PlankModal />
    </div>
  );
}
