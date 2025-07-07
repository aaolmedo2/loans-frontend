import { useState } from 'react';
import type { ReactElement } from 'react';
import AprobarPrestamo from './AprobarPrestamo.jsx';
import GenerarCuotas from './GenerarCuotas.jsx';
import PagosCuotas from './PagosCuotas.jsx';
import ReportesPDF from './ReportesPDF.jsx';
import '../styles/PrestamoCliente.css';

type TabId = 'aprobar' | 'generar' | 'pagos' | 'reportes';

interface Tab {
    id: TabId;
    name: string;
    icon: string;
}

function PrestamoCliente(): ReactElement {
    const [activeTab, setActiveTab] = useState<TabId>('aprobar');

    const tabs: Tab[] = [
        { id: 'aprobar', name: 'Aprobar Préstamo', icon: '✅' },
        { id: 'generar', name: 'Generar Cuotas', icon: '📑' },
        { id: 'pagos', name: 'Pagos de Cuotas', icon: '💰' },
        { id: 'reportes', name: 'Reportes PDF', icon: '📄' }
    ];

    const renderActiveComponent = (): ReactElement => {
        switch (activeTab) {
            case 'aprobar':
                return <AprobarPrestamo />;
            case 'generar':
                return <GenerarCuotas />;
            case 'pagos':
                return <PagosCuotas />;
            case 'reportes':
                return <ReportesPDF />;
            default:
                return <AprobarPrestamo />;
        }
    };

    return (
        <div className="prestamo-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-nav">
                    <div style={{ display: 'flex' }}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                                style={{ background: 'none', border: 'none' }}
                            >
                                <span style={{ marginRight: '8px' }}>{tab.icon}</span>
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Contenido principal */}
            <main className="main-content">
                {renderActiveComponent()}
            </main>
        </div>
    );
}

export default PrestamoCliente;
