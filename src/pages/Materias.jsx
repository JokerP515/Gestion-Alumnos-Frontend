import { useState, useEffect } from 'react';
import { materiasService } from '../services/api';
import '../styles/Alumnos.css';

function Materias() {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMateria, setEditingMateria] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    creditos: ''
  });

  useEffect(() => {
    loadMaterias();
  }, []);

  const loadMaterias = async () => {
    try {
      setLoading(true);
      const data = await materiasService.getAll();
      setMaterias(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las materias: ' + err.message);
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
      const dataToSend = {
        ...formData,
        creditos: parseInt(formData.creditos)
      };
      
      if (editingMateria) {
        await materiasService.update(editingMateria.id, dataToSend);
      } else {
        await materiasService.create(dataToSend);
      }
      resetForm();
      loadMaterias();
    } catch (err) {
      setError('Error al guardar la materia: ' + err.message);
    }
  };

  const handleEdit = (materia) => {
    setEditingMateria(materia);
    setFormData({
      nombre: materia.nombre,
      codigo: materia.codigo,
      creditos: materia.creditos.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta materia?')) {
      try {
        await materiasService.delete(id);
        loadMaterias();
      } catch (err) {
        setError('Error al eliminar la materia: ' + err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      codigo: '',
      creditos: ''
    });
    setEditingMateria(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Cargando materias...</div>;
  }

  return (
    <div className="materias-container">
      <div className="header">
        <h2>Gestión de Materias</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Nueva Materia'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h3>{editingMateria ? 'Editar Materia' : 'Crear Nueva Materia'}</h3>
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
              <label htmlFor="codigo">Código:</label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={formData.codigo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="creditos">Créditos:</label>
              <input
                type="number"
                id="creditos"
                name="creditos"
                value={formData.creditos}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingMateria ? 'Actualizar' : 'Crear'}
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
              <th>Código</th>
              <th>Créditos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materias.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No hay materias registradas</td>
              </tr>
            ) : (
              materias.map((materia) => (
                <tr key={materia.id}>
                  <td>{materia.id}</td>
                  <td>{materia.nombre}</td>
                  <td>{materia.codigo}</td>
                  <td>{materia.creditos}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-edit" 
                        onClick={() => handleEdit(materia)}
                        title="Editar"
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-delete" 
                        onClick={() => handleDelete(materia.id)}
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

export default Materias;
