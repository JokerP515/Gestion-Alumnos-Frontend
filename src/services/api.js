import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// ========== SERVICIOS DE ALUMNOS ==========
export const alumnosService = {
  // Listar todos los alumnos
  getAll: async () => {
    const response = await api.get('/alumnos');
    return response.data;
  },

  // Obtener un alumno por ID
  getById: async (id) => {
    const response = await api.get(`/alumnos/${id}`);
    return response.data;
  },

  // Crear un nuevo alumno
  create: async (alumno) => {
    const response = await api.post('/alumnos', alumno);
    return response.data;
  },

  // Actualizar un alumno
  update: async (id, alumno) => {
    const response = await api.put(`/alumnos/${id}`, alumno);
    return response.data;
  },

  // Eliminar un alumno
  delete: async (id) => {
    const response = await api.delete(`/alumnos/${id}`);
    return response.data;
  },
};

// ========== SERVICIOS DE MATERIAS ==========
export const materiasService = {
  // Listar todas las materias
  getAll: async () => {
    const response = await api.get('/materias');
    return response.data;
  },

  // Obtener una materia por ID
  getById: async (id) => {
    const response = await api.get(`/materias/${id}`);
    return response.data;
  },

  // Crear una nueva materia
  create: async (materia) => {
    const response = await api.post('/materias', materia);
    return response.data;
  },

  // Actualizar una materia
  update: async (id, materia) => {
    const response = await api.put(`/materias/${id}`, materia);
    return response.data;
  },

  // Eliminar una materia
  delete: async (id) => {
    const response = await api.delete(`/materias/${id}`);
    return response.data;
  },
};

// ========== SERVICIOS DE NOTAS ==========
export const notasService = {
  // Registrar una nueva nota
  create: async (nota) => {
    const response = await api.post('/notas', nota);
    return response.data;
  },

  // Listar notas de un alumno
  getByAlumno: async (alumnoId) => {
    const response = await api.get(`/notas/alumno/${alumnoId}`);
    return response.data;
  },

  // Listar notas de un alumno en una materia específica
  getByAlumnoAndMateria: async (alumnoId, materiaId) => {
    const response = await api.get(`/notas/alumno/${alumnoId}/materia/${materiaId}`);
    return response.data;
  },
};

export default api;
