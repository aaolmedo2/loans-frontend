import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function GenerarCuotas() {
    const [idCliente, setIdCliente] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const generarCuotas = async () => {
        if (!idCliente.trim()) {
            setMessage({ type: 'error', text: 'Por favor ingresa un ID de cliente válido' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await axios.post(`${API_BASE_URL}/cronogramas-pagos/generar/${idCliente}`);
            setMessage({ type: 'success', text: 'Cuotas generadas correctamente' });
            setIdCliente('');
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Error al generar las cuotas'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title">📑 Generar Cuotas</h2>
            </div>
            <div className="card-body">
                {message.text && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        {message.text}
                    </div>
                )}

                <div className="form-group">
                    <label className="form-label" htmlFor="idCliente">
                        ID del Cliente
                    </label>
                    <input
                        id="idCliente"
                        type="number"
                        value={idCliente}
                        onChange={(e) => setIdCliente(e.target.value)}
                        placeholder="Ingresa el ID del cliente"
                        className="form-input"
                        disabled={loading}
                    />
                </div>

                <button
                    onClick={generarCuotas}
                    disabled={loading || !idCliente.trim()}
                    className="btn btn-primary"
                >
                    {loading ? 'Generando...' : 'Generar Cuotas'}
                </button>
            </div>
        </div>
    );
}

export default GenerarCuotas;
