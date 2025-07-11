import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ReportesPDF() {
    const [idCliente, setIdCliente] = useState('');
    const [cuotas, setCuotas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const obtenerCuotasParaPDF = async () => {
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
            if (res.data.length === 0) {
                setMessage({ type: 'info', text: 'No se encontraron cuotas para este cliente' });
            } else {
                setMessage({ type: 'success', text: 'Cuotas cargadas. Ahora puedes generar el PDF.' });
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

    const generarPDF = () => {
        if (cuotas.length === 0) {
            alert('Primero debes cargar las cuotas del cliente');
            return;
        }

        const ventana = window.open('', '', 'height=600,width=800');
        if (ventana) {
            const formatCurrency = (amount) => {
                return new Intl.NumberFormat('es-PE', {
                    style: 'currency',
                    currency: 'PEN'
                }).format(amount || 0);
            };

            const formatDate = (dateString) => {
                if (!dateString) return '';
                return new Date(dateString).toLocaleDateString('es-PE');
            };

            const htmlContent = `
                <html>
                <head>
                    <title>Reporte de Cuotas - Cliente ${idCliente}</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            margin: 20px;
                            color: #333;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                            border-bottom: 2px solid #3b82f6;
                            padding-bottom: 20px;
                        }
                        .client-info {
                            background: #f8fafc;
                            padding: 15px;
                            border-radius: 8px;
                            margin-bottom: 20px;
                        }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 20px;
                            font-size: 12px;
                        }
                        th, td { 
                            border: 1px solid #e2e8f0; 
                            padding: 8px; 
                            text-align: left; 
                        }
                        th { 
                            background-color: #f8fafc; 
                            font-weight: bold;
                            color: #374151;
                        }
                        tr:nth-child(even) { 
                            background-color: #f9fafb; 
                        }
                        .status-pendiente { color: #d97706; font-weight: bold; }
                        .status-pagado { color: #059669; font-weight: bold; }
                        .status-vencido { color: #dc2626; font-weight: bold; }
                        .totals {
                            margin-top: 20px;
                            background: #f8fafc;
                            padding: 15px;
                            border-radius: 8px;
                        }
                        .footer {
                            margin-top: 30px;
                            text-align: center;
                            font-size: 10px;
                            color: #6b7280;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Reporte de Cuotas</h1>
                        <p>Sistema de Gestión de Préstamos</p>
                    </div>
                    
                    <div class="client-info">
                        <h3>Información del Cliente</h3>
                        <p><strong>ID Cliente:</strong> ${idCliente}</p>
                        <p><strong>Fecha de generación:</strong> ${new Date().toLocaleDateString('es-PE')}</p>
                        <p><strong>Total de cuotas:</strong> ${cuotas.length}</p>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Fecha Programada</th>
                                <th>Monto Cuota</th>
                                <th>Interés</th>
                                <th>Comisiones</th>
                                <th>Seguros</th>
                                <th>Total</th>
                                <th>Saldo Pendiente</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cuotas.map(cuota => `
                                <tr>
                                    <td>${cuota.numeroCuota}</td>
                                    <td>${formatDate(cuota.fechaProgramada)}</td>
                                    <td>${formatCurrency(cuota.montoCuota)}</td>
                                    <td>${formatCurrency(cuota.interes)}</td>
                                    <td>${formatCurrency(cuota.comisiones)}</td>
                                    <td>${formatCurrency(cuota.seguros)}</td>
                                    <td><strong>${formatCurrency(cuota.total)}</strong></td>
                                    <td>${formatCurrency(cuota.saldoPendiente)}</td>
                                    <td class="status-${cuota.estado.toLowerCase()}">${cuota.estado}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="totals">
                        <h3>Resumen</h3>
                        <p><strong>Total cuotas:</strong> ${cuotas.length}</p>
                        <p><strong>Cuotas pagadas:</strong> ${cuotas.filter(c => c.estado === 'PAGADO').length}</p>
                        <p><strong>Cuotas pendientes:</strong> ${cuotas.filter(c => c.estado === 'PENDIENTE').length}</p>
                        <p><strong>Total a pagar:</strong> ${formatCurrency(cuotas.reduce((sum, c) => sum + (c.total || 0), 0))}</p>
                        // <p><strong>Saldo pendiente:</strong> ${formatCurrency(cuotas.reduce((sum, c) => sum + (c.saldoPendiente || 0), 0))}</p>
                    </div>

                    <div class="footer">
                        <p>Generado automáticamente por el Sistema de Gestión de Préstamos</p>
                        <p>${new Date().toLocaleString('es-PE')}</p>
                    </div>
                </body>
                </html>
            `;

            ventana.document.write(htmlContent);
            ventana.document.close();

            // Esperar un momento para que se cargue el contenido y luego imprimir
            setTimeout(() => {
                ventana.print();
            }, 500);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title">📄 Reportes PDF</h2>
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
                    <label className="form-label" htmlFor="idClientePDF">
                        ID del Cliente
                    </label>
                    <input
                        id="idClientePDF"
                        type="number"
                        value={idCliente}
                        onChange={(e) => setIdCliente(e.target.value)}
                        placeholder="Ingresa el ID del cliente"
                        className="form-input"
                        disabled={loading}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={obtenerCuotasParaPDF}
                        disabled={loading || !idCliente.trim()}
                        className="btn btn-primary"
                    >
                        {loading ? 'Cargando...' : 'Cargar Cuotas'}
                    </button>

                    <button
                        onClick={generarPDF}
                        disabled={cuotas.length === 0}
                        className="btn btn-danger"
                    >
                        📄 Generar PDF
                    </button>
                </div>

                {cuotas.length > 0 && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                        <h4>Vista previa del reporte:</h4>
                        <p>📊 <strong>{cuotas.length}</strong> cuotas encontradas</p>
                        <p>✅ <strong>{cuotas.filter(c => c.estado === 'PAGADO').length}</strong> pagadas</p>
                        <p>⏳ <strong>{cuotas.filter(c => c.estado === 'PENDIENTE').length}</strong> pendientes</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReportesPDF;
