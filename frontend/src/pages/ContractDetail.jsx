import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CheckCircle2, Edit3, Eye } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

export default function ContractDetail() {
  const { id } = useParams();
  const contractId = id || "CT-2024-0158";

  return (
    <Layout breadcrumbs={<><Link to="/" className="text-primary hover:underline">Dashboard</Link> / <span className="text-gray-900 font-semibold">{contractId}</span></>}>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">{contractId}</h2>
          <p className="text-gray-600">Reforma do bloco administrativo — Construtora Nova Era Ltda.</p>
        </div>
        <div className="flex space-x-3">
          <Badge status="success" className="text-sm px-3 py-1.5"><CheckCircle2 className="w-4 h-4 mr-1.5"/> Revisado</Badge>
          <Button variant="outline" className="text-sm"><CheckCircle2 className="w-4 h-4 mr-2"/> Marcar tudo como revisado</Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Dados Gerais */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-bold text-gray-900">Dados Gerais</h3>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></span> Extraído por IA
              </span>
            </div>
            <button className="text-gray-500 hover:text-primary flex items-center text-sm font-medium">
              <Edit3 className="w-4 h-4 mr-1.5" /> Editar seção
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Nº do Contrato</p>
                <p className="text-gray-900 font-medium">{contractId}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">CNPJ Contratada</p>
                <p className="text-gray-900 font-medium">12.345.678/0001-90</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Contratada</p>
                <p className="text-gray-900 font-medium">Construtora Nova Era Ltda.</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Contratante</p>
                <p className="text-gray-900 font-medium">Secretaria Municipal de Administração</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Data de Início</p>
                <p className="text-gray-900 font-medium">15/02/2025</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Vigência Até</p>
                <p className="text-gray-900 font-medium">15/12/2026</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Valor Total (R$)</p>
                <p className="text-primary font-bold flex items-center">
                  2.847.500,00 
                  <span className="ml-2 text-xs font-medium text-green-700 bg-green-100 px-1.5 py-0.5 rounded flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span> Alterado
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Modalidade</p>
                <p className="text-gray-900 font-medium">Concorrência Pública</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Cláusulas Essenciais */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-bold text-gray-900">Cláusulas Essenciais</h3>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-medium flex items-center">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></span> Pendente de revisão
              </span>
            </div>
            <button className="text-gray-500 hover:text-primary flex items-center text-sm font-medium">
              <Edit3 className="w-4 h-4 mr-1.5" /> Editar seção
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Multa por Descumprimento</p>
              <p className="text-gray-900 text-sm">20% sobre o valor da parcela inadimplida, limitado a 10% do valor total do contrato</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Escopo do Contrato</p>
              <p className="text-gray-900 text-sm">Reforma completa do bloco administrativo incluindo instalações elétricas, hidráulicas, piso, forro, pintura e adequações de acessibilidade conforme NBR 9050</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Principais Obrigações da Contratada</p>
              <p className="text-gray-900 text-sm">Fornecimento de materiais e mão de obra; cumprimento do cronograma físico-financeiro; manutenção do canteiro de obras limpo e sinalizado; garantia de 5 anos para serviços de engenharia</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
