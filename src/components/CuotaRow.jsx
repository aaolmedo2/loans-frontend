import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function CuotaRow({ cuota, onPagoRealizado, getStatusBadge }) {
    const [tipoPago, setTipoPago] = useState('EFECTIVO');
    const [referencia, setReferencia] = useState('');
    const [loading, setLoading] = useState(false);

    const pagarCuota = async () => {
        if (cuota.estado !== 'PENDIENTE') {
            alert('Esta cuota ya fue pagada o no está disponible para pago');
            return;
        }

        if (!referencia.trim()) {
            alert('Por favor ingresa una referencia para el pago');
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                `${API_BASE_URL}/pagos-prestamos/registrar?idCuota=${cuota.id}&tipoPago=${tipoPago}&referencia=${referencia}`
            );

            // Limpiar los campos después del pago exitoso
            setReferencia('');
            setTipoPago('EFECTIVO');

            // Notificar al componente padre
            onPagoRealizado();

            alert('Pago registrado exitosamente');
        } catch (err) {
            alert(err.response?.data?.message || 'Error al procesar el pago');
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <tr>
            <td>{cuota.numeroCuota}</td>
            <td>{formatDate(cuota.fechaProgramada)}</td>
            <td>{formatCurrency(cuota.montoCuota)}</td>
            <td>{formatCurrency(cuota.interes)}</td>
            <td>{formatCurrency(cuota.comisiones)}</td>
            <td>{formatCurrency(cuota.seguros)}</td>
            <td><strong>{formatCurrency(cuota.total)}</strong></td>
            <td>{formatCurrency(cuota.saldoPendiente)}</td>
            <td>{getStatusBadge(cuota.estado)}</td>
            <td>
                {cuota.estado === 'PENDIENTE' ? (
                    <div className="cuota-payment-form">
                        <select
                            value={tipoPago}
                            onChange={(e) => setTipoPago(e.target.value)}
                            className="form-select"
                            disabled={loading}
                        >
                            <option value="EFECTIVO">Efectivo</option>
                            <option value="TRANSFERENCIA">Transferencia</option>
                            <option value="TARJETA">Tarjeta</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Núm. referencia"
                            value={referencia}
                            onChange={(e) => setReferencia(e.target.value)}
                            className="form-input"
                            disabled={loading}
                            style={{ fontSize: '0.8rem' }}
                        />

                        <button
                            onClick={pagarCuota}
                            disabled={loading || !referencia.trim()}
                            className="btn btn-success btn-sm"
                        >
                            {loading ? 'Pagando...' : 'Pagar'}
                        </button>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', color: '#6b7280' }}>
                        {cuota.estado === 'PAGADO' ? '✅ Pagado' : '⏰ No disponible'}
                    </div>
                )}
            </td>
        </tr>
    );
}

export default CuotaRow;
