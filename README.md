# Sistema de Gestión de Alumnos - Frontend

Aplicación web desarrollada con React para gestionar alumnos, materias y notas. Consume la API REST del backend desarrollado con Spring Boot ([Gestión de Alumnos - Backend](https://github.com/JokerP515/Gestion-de-Alumnos)).

## Tecnologías

- **React 18.2**
- **Vite 5.1** - Build tool
- **Axios** - Cliente HTTP
- **JavaScript (ES6+)**
- **HTML5 y CSS3**
- **Docker** - Para despliegue

## Requisitos Previos

### Para ejecutar en modo desarrollo:
- **Node.js 18** o superior
- **npm** (incluido con Node.js)
- **Backend API** ejecutándose en `http://localhost:8080`

### Para ejecutar con Docker:
- **Docker**
- **Navegador web** (Chrome, Firefox, Edge, etc.)
- **Backend API** ejecutándose en `http://localhost:8080`

> **Nota**: Si ejecuta con Docker, **NO necesita instalar Node.js ni npm**. Docker maneja todas las dependencias internamente.

## Ejecución Rápida del Proyecto

### Opción 1: Ejecutar en Desarrollo

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno (opcional, ya configurado por defecto)
# Copiar .env.example a .env si desea modificar la URL del backend
copy .env.example .env

# 3. Ejecutar la aplicación
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

### Opción 2: Ejecutar con Docker

```bash
# 1. Construir la imagen Docker
docker build -t gestion-alumnos-frontend .

# 2. Ejecutar el contenedor (primera vez)
docker run -d -p 80:80 --name frontend gestion-alumnos-frontend

# Para ejecuciones posteriores (cuando el contenedor ya existe):
docker start frontend

# Para detener el contenedor:
docker stop frontend
```

La aplicación estará disponible en: `http://localhost`

La API a la que se conecta el frontend estará disponible en: `http://localhost:8080`

## Endpoints Disponibles

### Funcionalidades Implementadas

### Gestión de Alumnos
- **Listar** todos los alumnos registrados
- **Crear** nuevos alumnos con formulario validado
- **Editar** información de alumnos existentes
- **Eliminar** alumnos (con confirmación)

### Gestión de Materias
- **Listar** todas las materias disponibles
- **Crear** nuevas materias con código y créditos
- **Editar** información de materias
- **Eliminar** materias (con confirmación)

### Gestión de Notas
- **Registrar** nuevas notas seleccionando alumno y materia
- **Listar** notas por alumno en cada materia
- **Visualizar** estado (Aprobado/Reprobado)
- **Calcular** promedio automático
- **Estadísticas** por alumno (total, aprobadas, reprobadas)

## Uso de la Aplicación

1. **Inicio**: Abra `http://localhost:3000` en su navegador (o `http://localhost` en caso de haber ejecutado el frontend mediante contenedores)
2. **Navegación**: Use las pestañas superiores para cambiar entre secciones
3. **Crear Datos**: 
   - Primero cree **Alumnos** y **Materias**
   - Luego podrá registrar **Notas**
4. **Operaciones**: 
   - Use el botón "+" para crear nuevos registros
   - Use para editar registros existentes
   - Use para eliminar registros (requiere confirmación)

## Notas Importantes

- **Primer paso**: Crear alumnos y materias antes de registrar notas
- **Validaciones**: Los formularios incluyen validaciones en el frontend
- **Eliminación**: Al eliminar un alumno o materia con notas asociadas, el backend puede rechazar la operación
- **Formato de fecha**: Use formato `YYYY-MM-DD` para fechas de nacimiento
- **Rango de notas**: Las notas deben estar entre 0.0 y 5.0
- **Aprobación**: Nota mínima para aprobar es 3.0

## Desarrollo

Este proyecto fue desarrollado teniendo en cuenta los siguientes puntos:

* React como framework principal  
* JavaScript
* HTML y CSS  
* Axios  
* Gestión completa de Alumnos (CRUD)  
* Gestión completa de Materias (CRUD)  
* Gestión de Notas (Crear y Listar)  
* Conexión con Backend mediante variables de entorno  
* Dockerizado y listo para desplegar  

## Configuración

### Variables de Entorno

La aplicación se conecta al backend mediante variables de entorno. El archivo [.env](.env) contiene:

```env
VITE_API_URL=http://localhost:8080/api
```

**Para modificar la URL del backend:**

1. Copie `.env.example` a `.env`
2. Edite `VITE_API_URL` con la URL de su backend
3. Reinicie el servidor de desarrollo

### Configuración de Docker

El [Dockerfile](Dockerfile) incluye:
- **Build Stage**: Construcción optimizada con Node.js 18
- **Production Stage**: Servidor Nginx Alpine
- **Reverse Proxy**: Configurado en [nginx.conf](nginx.conf) para `/api`

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/         # Componentes reutilizable (futuro)
│   ├── pages/              # Páginas principales
│   │   ├── Alumnos.jsx     # Gestión de alumnos
│   │   ├── Materias.jsx    # Gestión de materias
│   │   └── Notas.jsx       # Gestión de notas
│   ├── services/           # Servicios API
│   │   └── api.js          # Cliente Axios y endpoints
│   ├── styles/             # Estilos CSS
│   │   ├── Alumnos.css     # Estilos compartidos
│   │   └── Notas.css       # Estilos de notas
│   ├── App.jsx             # Componente principal
│   ├── App.css             # Estilos del layout
│   ├── main.jsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── public/                 # Archivos estáticos
├── .env                    # Variables de entorno
├── .env.example            # Ejemplo de variables
├── Dockerfile              # Configuración Docker
├── nginx.conf              # Configuración Nginx
├── vite.config.js          # Configuración Vite
└── package.json            # Dependencia Scripts Disponibles
```

### Docker Compose (Opcional)

Para ejecutar frontend y backend juntos, cree un `compose.yml`:

```yaml
services:
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend
  
  backend:
    image: gestion-alumnos-backend
    ports:
      - "8080:8080"
```