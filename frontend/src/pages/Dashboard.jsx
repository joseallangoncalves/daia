import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { FileText, AlertCircle, Calendar, AlertTriangle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const contracts = [
    { id: 'CT-2024-0158', company: 'Construtora Nova Era Ltda.', object: 'Reforma do bloco administrativo', date: '15/12/2026', value: '2.847.500,00', statusIA: 'success', sms: 'success' },
    { id: 'CT-2024-0167', company: 'TechSolutions Serviços Ltda.', object: 'Manutenção de sistemas de climatização', date: '03/03/2027', value: '1.230.000,00', statusIA: 'warning', sms: 'success' },
    { id: 'CT-2024-0182', company: 'Global Transportes e Logística', object: 'Serviços de transporte intermunicipal', date: '28/02/2027', value: '5.620.000,00', statusIA: 'success', sms: 'warning' },
    { id: 'CT-2024-0195', company: 'Alimentação Escolar Brasil Eireli', object: 'Fornecimento de merenda escolar', date: '10/09/2026', value: '980.000,00', statusIA: 'success', sms: 'success' },
    { id: 'CT-2025-0003', company: 'EcoResíduos Ambiental Ltda.', object: 'Coleta e destinação de resíduos sólidos', date: '18/07/2027', value: '3.450.000,00', statusIA: 'default', sms: 'warning' },
    { id: 'CT-2025-0012', company: 'SegVida Patrimonial S.A.', object: 'Vigilância patrimonial armada', date: '22/01/2027', value: '4.180.000,00', statusIA: 'default', sms: 'success' },
  ];

  const [filter, setFilter] = useState('all'); // all, pending, reviewed, alerts

  const filteredContracts = contracts.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'pending') return c.statusIA === 'warning';
    if (filter === 'reviewed') return c.statusIA === 'success';
    if (filter === 'alerts') return c.sms === 'warning' || c.sms === 'danger';
    return true;
  });

  const getFilterClass = (currentFilter) => {
    return filter === currentFilter
      ? "bg-primary text-white px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors"
      : "bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-50 cursor-pointer transition-colors";
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 hidden">Dashboard</h2>
        <div className="ml-auto">
          <Link to="/upload">
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" /> Novo Contrato
            </Button>
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">24</h3>
            <p className="text-sm font-medium text-gray-500">Contratos Ativos</p>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">7</h3>
            <p className="text-sm font-medium text-gray-500">Com Pendência de Revisão</p>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">3</h3>
            <p className="text-sm font-medium text-gray-500">Vencimento Próximo</p>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">2</h3>
            <p className="text-sm font-medium text-gray-500">Alertas de SMS</p>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex space-x-2 mb-4">
        <span className={getFilterClass('all')} onClick={() => setFilter('all')}>Todos os contratos</span>
        <span className={getFilterClass('pending')} onClick={() => setFilter('pending')}>Pendentes de revisão</span>
        <span className={getFilterClass('reviewed')} onClick={() => setFilter('reviewed')}>Revisados</span>
        <span className={getFilterClass('alerts')} onClick={() => setFilter('alerts')}>Com alertas</span>
      </div>

      {/* Tabela */}
      <Card>
        <div className="px-4 py-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Contratos Monitorados</h3>
          <span className="text-sm text-gray-500">{filteredContracts.length} contratos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrato</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objeto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vigência</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor (R$)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status IA</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SMS</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{c.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.company}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{c.object}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge status={c.statusIA}>
                      {c.statusIA === 'success' ? 'Revisado' : c.statusIA === 'warning' ? 'Pendente' : 'Extraído por IA'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge status={c.sms}>
                      {c.sms === 'success' ? 'OK' : 'Alerta'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/contrato/${c.id}`} className="text-primary hover:text-primaryHover">Ver detalhes</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
}
