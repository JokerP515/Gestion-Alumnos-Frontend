import { useState, useEffect } from 'react';
import { notasService, alumnosService, materiasService } from '../services/api';
import '../styles/Alumnos.css';
import '../styles/Notas.css';

function Notas() {
  const [alumnos, setAlumnos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');
  const [formData, setFormData] = useState({
    alumnoId: '',
    materiaId: '',
    valor: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedAlumno) {
      loadNotasByAlumno(selectedAlumno);
    }
  }, [selectedAlumno]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [alumnosData, materiasData] = await Promise.all([
        alumnosService.getAll(),
        materiasService.getAll()
      ]);
      setAlumnos(alumnosData);
      setMaterias(materiasData);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadNotasByAlumno = async (alumnoId) => {
    try {
      const data = await notasService.getByAlumno(alumnoId);
      setNotas(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las notas: ' + err.message);
      setNotas([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        alumnoId: parseInt(formData.alumnoId),
        materiaId: parseInt(formData.materiaId),
        valor: parseFloat(formData.valor)
      };
      
      await notasService.create(dataToSend);
      resetForm();
      if (selectedAlumno) {
        loadNotasByAlumno(selectedAlumno);
      }
    } catch (err) {
      setError('Error al registrar la nota: ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      alumnoId: '',
      materiaId: '',
      valor: ''
    });
    setShowForm(false);
  };

  const getAlumnoNombre = (id) => {
    const alumno = alumnos.find(a => a.id === id);
    return alumno ? `${alumno.nombre} ${alumno.apellido}` : 'N/A';
  };

  const getMateriaNombre = (id) => {
    const materia = materias.find(m => m.id === id);
    return materia ? materia.nombre : 'N/A';
  };

  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  return (
    <div className="notas-container">
      <div className="header">
        <h2>Gestión de Notas</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
          disabled={alumnos.length === 0 || materias.length === 0}
        >
          {showForm ? 'Cancelar' : '+ Registrar Nota'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {(alumnos.length === 0 || materias.length === 0) && (
        <div className="warning-message">
          Debes crear alumnos y materias antes de registrar notas.
        </div>
      )}

      {showForm && (
        <div className="form-card">
          <h3>Registrar Nueva Nota</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="alumnoId">Alumno:</label>
              <select
                id="alumnoId"
                name="alumnoId"
                value={formData.alumnoId}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un alumno</option>
                {alumnos.map((alumno) => (
                  <option key={alumno.id} value={alumno.id}>
                    {alumno.nombre} {alumno.apellido} - {alumno.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="materiaId">Materia:</label>
              <select
                id="materiaId"
                name="materiaId"
                value={formData.materiaId}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione una materia</option>
                {materias.map((materia) => (
                  <option key={materia.id} value={materia.id}>
                    {materia.nombre} ({materia.codigo})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="valor">Nota (0.0 - 5.0):</label>
              <input
                type="number"
                id="valor"
                name="valor"
                value={formData.valor}
                onChange={handleInputChange}
                min="0"
                max="5"
                step="0.1"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                Registrar
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="notas-filter">
        <div className="form-group">
          <label htmlFor="filterAlumno">Filtrar notas por alumno:</label>
          <select
            id="filterAlumno"
            value={selectedAlumno}
            onChange={(e) => setSelectedAlumno(e.target.value)}
          >
            <option value="">Seleccione un alumno</option>
            {alumnos.map((alumno) => (
              <option key={alumno.id} value={alumno.id}>
                {alumno.nombre} {alumno.apellido}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedAlumno && (
        <div className="table-container">
          <h3>Notas de {getAlumnoNombre(parseInt(selectedAlumno))}</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Materia</th>
                <th>Nota</th>
                <th>Fecha de Registro</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {notas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    Este alumno no tiene notas registradas
                  </td>
                </tr>
              ) : (
                notas.map((nota) => (
                  <tr key={nota.id}>
                    <td>{nota.id}</td>
                    <td>{getMateriaNombre(nota.materiaId)}</td>
                    <td>
                      <span className={`nota-badge ${nota.valor >= 3.0 ? 'aprobado' : 'reprobado'}`}>
                        {nota.valor.toFixed(1)}
                      </span>
                    </td>
                    <td>{nota.fechaRegistro}</td>
                    <td>
                      <span className={`estado-badge ${nota.valor >= 3.0 ? 'aprobado' : 'reprobado'}`}>
                        {nota.valor >= 3.0 ? '✓ Aprobado' : '✗ Reprobado'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {notas.length > 0 && (
            <div className="notas-summary">
              <div className="summary-item">
                <strong>Total de notas:</strong> {notas.length}
              </div>
              <div className="summary-item">
                <strong>Promedio:</strong>{' '}
                <span className="promedio">
                  {(notas.reduce((acc, nota) => acc + nota.valor, 0) / notas.length).toFixed(2)}
                </span>
              </div>
              <div className="summary-item">
                <strong>Aprobadas:</strong>{' '}
                {notas.filter(n => n.valor >= 3.0).length}
              </div>
              <div className="summary-item">
                <strong>Reprobadas:</strong>{' '}
                {notas.filter(n => n.valor < 3.0).length}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notas;
