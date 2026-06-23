import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { UploadCloud } from 'lucide-react';

export default function Upload() {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Lógica futura de leitura do arquivo
  };

  return (
    <Layout breadcrumbs={<><span className="text-primary cursor-pointer hover:underline">Dashboard</span> / <span className="text-gray-900 font-semibold">Novo Upload</span></>}>
      
      {/* Stepper */}
      <div className="max-w-4xl mx-auto mb-10 mt-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-0.5 bg-gray-200 z-0"></div>
          
          {/* Passo 1 - Ativo */}
          <div className="relative z-10 flex flex-col items-center bg-background px-4">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm">
              1
            </div>
            <span className="mt-2 text-sm font-semibold text-gray-900">Envio</span>
          </div>

          {/* Passo 2 */}
          <div className="relative z-10 flex flex-col items-center bg-background px-4">
            <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 text-gray-500 flex items-center justify-center font-bold">
              2
            </div>
            <span className="mt-2 text-sm font-medium text-gray-500">Processamento</span>
          </div>

          {/* Passo 3 */}
          <div className="relative z-10 flex flex-col items-center bg-background px-4">
            <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 text-gray-500 flex items-center justify-center font-bold">
              3
            </div>
            <span className="mt-2 text-sm font-medium text-gray-500">Revisão</span>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden">
          <div 
            className={`p-16 border-2 border-dashed rounded-lg text-center transition-colors ${dragActive ? 'border-primary bg-green-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-green-50 p-4 rounded-full">
                <UploadCloud className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Arraste o PDF do contrato aqui</h3>
            <p className="text-sm text-gray-500 mb-8">ou clique para selecionar — PDF, máx. 50 MB</p>
            
            <Button variant="primary">
              Selecionar arquivo
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
