import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FileText, LayoutDashboard, LogIn } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 className="app-title">DAIA</h1>
          </Link>
          <nav style={{ display: 'flex', gap: '1rem' }}>
             <Link to="/login" className="btn btn-outline"><LogIn size={18}/> Login</Link>
          </nav>
        </header>

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<DashboardPlaceholder />} />
            <Route path="/login" element={<LoginPlaceholder />} />
            <Route path="/contrato/:id" element={<WorkspacePlaceholder />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function DashboardPlaceholder() {
  return (
    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
      <LayoutDashboard size={48} color="var(--primary)" />
      <h2>Bem-vindo ao DAIA Dashboard</h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: '600px' }}>
        A inteligência artificial automatizada para extração e auditoria de contratos. 
        Selecione uma empresa ou faça o upload de um novo contrato PDF para começar.
      </p>
      <Link to="/contrato/1" className="btn"><FileText size={18}/> Acessar Workspace de Exemplo</Link>
    </div>
  );
}

function LoginPlaceholder() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ textAlign: 'center' }}>Acesso Restrito</h2>
        <input type="text" placeholder="Usuário" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
        <input type="password" placeholder="Senha" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
        <button className="btn" style={{ justifyContent: 'center' }}>Entrar</button>
      </div>
    </div>
  );
}

function WorkspacePlaceholder() {
  return (
    <div className="split-workspace">
      <div className="glass-panel split-pane pdf-pane">
        <h3>📄 Visualizador de PDF (react-pdf)</h3>
        <div style={{ background: '#333', height: '100%', marginTop: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#888' }}>PDF renderizado aqui...</span>
        </div>
      </div>
      <div className="glass-panel split-pane">
        <h3>✨ Dados Extraídos (IA)</h3>
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
             <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Obrigação Principal</h4>
             <p style={{ color: 'var(--text-muted)' }}>A contratada deverá fornecer os EPIs para todos os funcionários no local da obra...</p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
             <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Multa por Atraso</h4>
             <p style={{ color: 'var(--text-muted)' }}>Multa de 2% sobre o valor da medição a cada dia de atraso...</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
