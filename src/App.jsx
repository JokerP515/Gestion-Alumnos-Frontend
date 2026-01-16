import { useState } from 'react'
import './App.css'
import Alumnos from './pages/Alumnos'
import Materias from './pages/Materias'
import Notas from './pages/Notas'

function App() {
  const [activeTab, setActiveTab] = useState('alumnos')

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sistema de Gestión de Alumnos</h1>
        <nav className="nav-tabs">
          <button
            className={activeTab === 'alumnos' ? 'tab-button active' : 'tab-button'}
            onClick={() => setActiveTab('alumnos')}
          >
            Alumnos
          </button>
          <button
            className={activeTab === 'materias' ? 'tab-button active' : 'tab-button'}
            onClick={() => setActiveTab('materias')}
          >
            Materias
          </button>
          <button
            className={activeTab === 'notas' ? 'tab-button active' : 'tab-button'}
            onClick={() => setActiveTab('notas')}
          >
            Notas
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'alumnos' && <Alumnos />}
        {activeTab === 'materias' && <Materias />}
        {activeTab === 'notas' && <Notas />}
      </main>

      <footer className="app-footer">
        <p>Sistema de Gestión de Alumnos - 2026</p>
      </footer>
    </div>
  )
}

export default App
