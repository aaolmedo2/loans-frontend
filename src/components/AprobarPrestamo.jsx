import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AprobarPrestamo() {
    const [idPrestamo, setIdPrestamo] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const aprobarPrestamo = async () => {
        if (!idPrestamo.trim()) {
            setMessage({ type: 'error', text: 'Por favor ingresa un ID de préstamo válido' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await axios.patch(
                `${API_BASE_URL}/prestamos-clientes/${idPrestamo}/estado?estado=APROBADO`
            );
            setMessage({ type: 'success', text: 'Préstamo aprobado correctamente' });
            setIdPrestamo('');
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Error al aprobar el préstamo'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title">✅ Aprobar Préstamo</h2>
            </div>
            <div className="card-body">
                {message.text && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        {message.text}
                    </div>
                )}

                <div className="form-group">
                    <label className="form-label" htmlFor="idPrestamo">
                        ID del Préstamo
                    </label>
                    <input
                        id="idPrestamo"
                        type="number"
                        value={idPrestamo}
                        onChange={(e) => setIdPrestamo(e.target.value)}
                        placeholder="Ingresa el ID del préstamo"
                        className="form-input"
                        disabled={loading}
                    />
                </div>

                <button
                    onClick={aprobarPrestamo}
                    disabled={loading || !idPrestamo.trim()}
                    className="btn btn-success"
                >
                    {loading ? 'Aprobando...' : 'Aprobar Préstamo'}
                </button>
            </div>
        </div>
    );
}

export default AprobarPrestamo;
