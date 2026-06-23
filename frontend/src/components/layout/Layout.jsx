import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, FileText, Activity, Users, LogOut } from 'lucide-react';

function Sidebar() {
  const location = useLocation();
  
  const getLinkClass = (path) => {
    const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    if (isActive) {
      return "bg-primaryHover text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md";
    }
    return "text-green-100 hover:bg-green-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors";
  };

  return (
    <div className="w-64 bg-primary text-white flex flex-col h-screen fixed top-0 left-0">
      <div className="p-4 border-b border-green-700">
        <h1 className="text-lg font-bold flex items-center">
          <FileText className="mr-2" /> Fiscalização
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2">
          <span className="text-xs font-semibold text-green-300 uppercase tracking-wider">Principal</span>
        </div>
        <nav className="space-y-1 px-2">
          <Link to="/" className={getLinkClass('/')}>
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link to="/upload" className={getLinkClass('/upload')}>
            <UploadCloud className="mr-3 h-5 w-5" />
            Novo Upload
          </Link>
        </nav>

        <div className="px-4 mt-8 mb-2">
          <span className="text-xs font-semibold text-green-300 uppercase tracking-wider">Contratos</span>
        </div>
        <nav className="space-y-1 px-2">
          <Link to="/contrato/CT-2024-0158" className={getLinkClass('/contrato')}>
            <FileText className="mr-3 h-5 w-5" />
            Detalhe do Contrato
          </Link>
        </nav>
        
        <div className="px-4 mt-8 mb-2">
          <span className="text-xs font-semibold text-green-300 uppercase tracking-wider">Administração</span>
        </div>
        <nav className="space-y-1 px-2">
          <Link to="/usuarios" className={getLinkClass('/usuarios')}>
            <Users className="mr-3 h-5 w-5" />
            Usuários
          </Link>
          <Link to="/logs" className={getLinkClass('/logs')}>
            <Activity className="mr-3 h-5 w-5" />
            Logs de Auditoria
          </Link>
        </nav>
      </div>

      <div className="p-4 bg-green-900 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-green-700 flex items-center justify-center font-bold text-sm">
            CF
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Carlos Ferreira</p>
            <p className="text-xs text-green-300">Fiscal de Contratos</p>
          </div>
        </div>
        <button 
          onClick={() => window.location.href = '/login'}
          className="p-1.5 text-green-300 hover:text-white hover:bg-green-700 rounded-md transition-colors"
          title="Sair do sistema"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function Layout({ children, breadcrumbs = 'Dashboard' }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 flex flex-col h-screen">
        <header className="bg-white shadow-sm border-b border-gray-200 z-10 flex-shrink-0">
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <h1 className="text-lg font-medium text-gray-500">
                {breadcrumbs}
              </h1>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
