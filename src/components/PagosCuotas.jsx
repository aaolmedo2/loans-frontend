import { useState } from 'react';
import axios from 'axios';
import CuotaRow from './CuotaRow';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PagosCuotas() {
    const [idCliente, setIdCliente] = useState('');
    const [cuotas, setCuotas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const cuotasPerPage = 10;

    const obtenerCuotas = async () => {
        if (!idCliente.trim()) {
            setMessage({ type: 'error', text: 'Por favor ingresa un ID de cliente válido' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await axios.get(
                `${API_BASE_URL}/cronogramas-pagos/prestamo-cliente/${idCliente}`
            );
            setCuotas(res.data);
            setCurrentPage(1);
            if (res.data.length === 0) {
                setMessage({ type: 'info', text: 'No se encontraron cuotas para este cliente' });
            }
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Error al obtener las cuotas'
            });
            setCuotas([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePagoRealizado = () => {
        obtenerCuotas(); // Recargar cuotas después de un pago
    };

    const getStatusBadge = (estado) => {
        const statusClass = {
            'PENDIENTE': 'status-pendiente',
            'PAGADO': 'status-pagado',
            'VENCIDO': 'status-vencido'
        };

        return (
            <span className={`status-badge ${statusClass[estado] || ''}`}>
                {estado}
            </span>
        );
    };

    // Paginación
    const cuotasPaginadas = cuotas.slice(
        (currentPage - 1) * cuotasPerPage,
        currentPage * cuotasPerPage
    );

    const totalPages = Math.ceil(cuotas.length / cuotasPerPage);

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title">💰 Pagos de Cuotas</h2>
            </div>
            <div className="card-body">
                {message.text && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' :
                        message.type === 'info' ? 'alert-info' : 'alert-error'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="form-group">
                    <label className="form-label" htmlFor="idClientePagos">
                        ID del Prestamo-Cliente
                    </label>
                    <input
                        id="idClientePagos"
                        type="number"
                        value={idCliente}
                        onChange={(e) => setIdCliente(e.target.value)}
                        placeholder="Ingresa el ID del Prestamo-Cliente"
                        className="form-input"
                        disabled={loading}
                    />
                </div>

                <button
                    onClick={obtenerCuotas}
                    disabled={loading || !idCliente.trim()}
                    className="btn btn-primary"
                    style={{ marginBottom: '1.5rem' }}
                >
                    {loading ? 'Consultando...' : 'Consultar Cuotas'}
                </button>

                {cuotas.length > 0 && (
                    <>
                        <div className="table-container" id="tabla-cuotas">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Fecha</th>
                                        <th>Monto</th>
                                        <th>Interés</th>
                                        <th>Comisiones</th>
                                        <th>Seguros</th>
                                        <th>Total</th>
                                        <th>Saldo</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cuotasPaginadas.map((cuota) => (
                                        <CuotaRow
                                            key={cuota.id}
                                            cuota={cuota}
                                            onPagoRealizado={handlePagoRealizado}
                                            getStatusBadge={getStatusBadge}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="btn btn-secondary btn-sm"
                                >
                                    ← Anterior
                                </button>

                                <span className="pagination-info">
                                    Página {currentPage} de {totalPages}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="btn btn-secondary btn-sm"
                                >
                                    Siguiente →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default PagosCuotas;
