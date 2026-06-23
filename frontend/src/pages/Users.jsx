import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Users as UsersIcon, Plus, UserPlus, ArrowLeft, Mail, Lock, User, Shield, Edit3 } from 'lucide-react';

export default function Users() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  
  // Lista mockada de usuários
  const [users, setUsers] = useState([
    { id: 1, nome: 'Carlos Ferreira', login: 'carlos.ferreira@daia.com', dataCadastro: '15/01/2026', ativo: true, nivel: 'Fiscal' },
    { id: 2, nome: 'Ana Silva', login: 'ana.silva@daia.com', dataCadastro: '20/02/2026', ativo: true, nivel: 'Auditor' },
    { id: 3, nome: 'Marcos Costa', login: 'marcos.costa@daia.com', dataCadastro: '10/03/2026', ativo: false, nivel: 'Gestor' },
    { id: 4, nome: 'Admin Master', login: 'admin@daia.com', dataCadastro: '01/01/2026', ativo: true, nivel: 'Admin' },
  ]);

  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    login: '',
    password: '',
    nivel: 'Fiscal',
    ativo: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEditClick = (user) => {
    setFormData({
      nome: user.nome,
      login: user.login,
      password: '', // Senha em branco por segurança, preenche se for alterar
      nivel: user.nivel,
      ativo: user.ativo
    });
    setEditingUserId(user.id);
    setIsCreating(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUserId) {
      setUsers(users.map(u => u.id === editingUserId ? { ...u, ...formData, password: formData.password || u.password } : u));
    } else {
      const newUser = {
        id: Date.now(),
        nome: formData.nome,
        login: formData.login,
        dataCadastro: new Date().toLocaleDateString('pt-BR'),
        ativo: formData.ativo,
        nivel: formData.nivel,
        password: formData.password
      };
      setUsers([...users, newUser]);
    }
    
    setIsCreating(false);
    setEditingUserId(null);
    setFormData({ nome: '', login: '', password: '', nivel: 'Fiscal', ativo: true });
  };

  const getRoleBadgeColor = (nivel) => {
    switch (nivel) {
      case 'Admin': return 'bg-purple-100 text-purple-800';
      case 'Gestor': return 'bg-blue-100 text-blue-800';
      case 'Auditor': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800'; // Fiscal
    }
  };

  return (
    <Layout breadcrumbs={<span className="text-gray-900 font-semibold">Gestão de Usuários</span>}>
      
      {!isCreating ? (
        // VISÃO DE LISTAGEM (TABELA)
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <UsersIcon className="w-6 h-6 mr-2 text-primary" /> Usuários Cadastrados
              </h2>
              <p className="text-sm text-gray-500 mt-1">Gerencie os acessos ao sistema de fiscalização</p>
            </div>
            <Button variant="primary" onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" /> Novo Usuário
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login / E-mail</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nível de Acesso</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Cadastro</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{user.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.login}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.nivel)}`}>
                          {user.nivel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.dataCadastro}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge status={user.ativo ? 'success' : 'default'}>
                          {user.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEditClick(user)} className="text-gray-400 hover:text-primary transition-colors" title="Editar Usuário">
                          <Edit3 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        // VISÃO DE CADASTRO/EDIÇÃO (FORMULÁRIO)
        <>
          <div className="flex items-center mb-6">
            <button 
              onClick={() => { setIsCreating(false); setEditingUserId(null); setFormData({ nome: '', login: '', password: '', nivel: 'Fiscal', ativo: true }); }} 
              className="mr-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <UserPlus className="w-6 h-6 mr-2 text-primary" /> {editingUserId ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
              </h2>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Login (E-mail)</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="login"
                      required
                      value={formData.login}
                      onChange={handleInputChange}
                      className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                      placeholder="joao.silva@empresa.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Senha Provisória</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nível de Acesso</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="nivel"
                      value={formData.nivel}
                      onChange={handleInputChange}
                      className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border bg-white"
                    >
                      <option value="Fiscal">Fiscal de Contratos</option>
                      <option value="Auditor">Auditor</option>
                      <option value="Gestor">Gestor / Coordenador</option>
                      <option value="Admin">Administrador do Sistema</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center pt-2">
                  <input
                    id="ativo"
                    name="ativo"
                    type="checkbox"
                    checked={formData.ativo}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                    Usuário Ativo (Pode fazer login imediatamente)
                  </label>
                </div>

                <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200 mt-6">
                  <Button type="button" variant="ghost" onClick={() => { setIsCreating(false); setEditingUserId(null); setFormData({ nome: '', login: '', password: '', nivel: 'Fiscal', ativo: true }); }}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary">
                    {editingUserId ? 'Salvar Alterações' : 'Salvar Usuário'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </>
      )}

    </Layout>
  );
}
