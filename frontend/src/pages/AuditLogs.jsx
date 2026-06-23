import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { History, ArrowRight } from 'lucide-react';

export default function AuditLogs() {
  const logs = [
    { id: 'log-1029', user: 'Carlos Ferreira (Fiscal)', action: 'Edição de Multa', field: 'Multa por Descumprimento', oldVal: '10%', newVal: '20%', date: '23/06/2026 14:32', contract: 'CT-2024-0158' },
    { id: 'log-1028', user: 'Ana Silva (Auditora)', action: 'Revisão', field: 'Status IA', oldVal: 'Pendente', newVal: 'Revisado', date: '22/06/2026 09:15', contract: 'CT-2024-0167' },
    { id: 'log-1027', user: 'Sistema IA', action: 'Extração Concluída', field: 'Todos os campos', oldVal: '-', newVal: 'Dados extraídos', date: '21/06/2026 18:45', contract: 'CT-2025-0012' },
    { id: 'log-1026', user: 'Carlos Ferreira (Fiscal)', action: 'Edição de Vigência', field: 'Data de Início', oldVal: '10/02/2025', newVal: '15/02/2025', date: '20/06/2026 11:10', contract: 'CT-2024-0158' },
    { id: 'log-1025', user: 'Marcos Costa (Gestor)', action: 'Alerta SMS Ignorado', field: 'Item SMS: EPIs', oldVal: 'Alerta', newVal: 'OK (Justificado)', date: '19/06/2026 16:20', contract: 'CT-2024-0182' },
  ];

  return (
    <Layout breadcrumbs={<><span className="text-gray-900 font-semibold">Logs de Auditoria</span></>}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <History className="w-6 h-6 mr-2 text-primary" /> Histórico de Alterações
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Registro inalterável de todas as modificações manuais e ações do sistema
          </p>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data / Hora</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrato</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campo Modificado</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alteração (De -> Para)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{log.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${log.user === 'Sistema IA' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {log.user}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{log.contract}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.field}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 flex items-center space-x-2">
                    <span className="bg-red-50 text-red-700 px-2 py-1 rounded truncate max-w-[150px]" title={log.oldVal}>{log.oldVal}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="bg-green-50 text-green-700 px-2 py-1 rounded truncate max-w-[150px]" title={log.newVal}>{log.newVal}</span>
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
