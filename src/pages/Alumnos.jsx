import { useState, useEffect } from 'react';
import { alumnosService } from '../services/api';
import '../styles/Alumnos.css';

function Alumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAlumno, setEditingAlumno] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    fechaNacimiento: ''
  });

  useEffect(() => {
    loadAlumnos();
  }, []);

  const loadAlumnos = async () => {
    try {
      setLoading(true);
      const data = await alumnosService.getAll();
      setAlumnos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los alumnos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAlumno) {
        await alumnosService.update(editingAlumno.id, formData);
      } else {
        await alumnosService.create(formData);
      }
      resetForm();
      loadAlumnos();
    } catch (err) {
      setError('Error al guardar el alumno: ' + err.message);
    }
  };

  const handleEdit = (alumno) => {
    setEditingAlumno(alumno);
    setFormData({
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      email: alumno.email,
      fechaNacimiento: alumno.fechaNacimiento
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este alumno?')) {
      try {
        await alumnosService.delete(id);
        loadAlumnos();
      } catch (err) {
        setError('Error al eliminar el alumno: ' + err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      fechaNacimiento: ''
    });
    setEditingAlumno(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Cargando alumnos...</div>;
  }

  return (
    <div className="alumnos-container">
      <div className="header">
        <h2>Gestión de Alumnos</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Nuevo Alumno'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h3>{editingAlumno ? 'Editar Alumno' : 'Crear Nuevo Alumno'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="apellido">Apellido:</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingAlumno ? 'Actualizar' : 'Crear'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Fecha de Nacimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No hay alumnos registrados</td>
              </tr>
            ) : (
              alumnos.map((alumno) => (
                <tr key={alumno.id}>
                  <td>{alumno.id}</td>
                  <td>{alumno.nombre}</td>
                  <td>{alumno.apellido}</td>
                  <td>{alumno.email}</td>
                  <td>{alumno.fechaNacimiento}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-edit" 
                        onClick={() => handleEdit(alumno)}
                        title="Editar"
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-delete" 
                        onClick={() => handleDelete(alumno.id)}
                        title="Eliminar"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Alumnos;
