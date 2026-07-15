import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LayoutDashboard, TrendingUp, TrendingDown, CreditCard, LogIn, LogOut } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// ==========================================
// CONFIGURAÇÕES E CONSTANTES
// ==========================================
const COLORS = {
  dark: '#033859',
  deep: '#025E73',
  teal: '#038C8C',
  aqua: '#84BFB9',
  bg: '#F2F2EB'
};
const CHART_COLORS = [COLORS.dark, COLORS.deep, COLORS.teal, COLORS.aqua];

const INCOME_CATEGORIES = ['Salário', 'Freelance', 'Rendimento', 'Vendas', 'Outros'];
const EXPENSE_CATEGORIES = ['Ifood', 'Roupas', 'Mercado', 'Deslocamento', 'Contas', 'Lazer'];
const CREDIT_CARDS = ['Nubank', 'Inter', 'Itaú'];

// ⚠️ IMPORTANTE: Cole aqui a URL gerada pelo Render para o seu backend Python
const API_URL = 'https://financeiro-backend-7pzo.onrender.com'; 

// ==========================================
// COMPONENTE: TELA DE LOGIN
// ==========================================
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  
  const handleLogin = (e) => {
    e.preventDefault();
    // Como o backend usa "user_id" como string, usaremos o email como identificador provisório
    if(email) onLogin({ id: email, name: email.split('@')[0], email });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F2EB] p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md animate-fadeIn">
        <h1 className="text-3xl font-bold text-center text-[#033859] mb-8">FinControl</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">E-mail</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="seu@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Senha</label>
            <input type="password" required className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-[#033859] hover:bg-[#025E73] text-white font-bold py-3 rounded-lg transition mt-4 flex justify-center items-center gap-2">
            <LogIn size={20} /> Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: DASHBOARD
// ==========================================
function Dashboard({ user }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTx, setSelectedTx] = useState(null);
  
  // Estados para armazenar dados reais do banco
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // Busca os dados no Backend Python sempre que o mês muda
  useEffect(() => {
    const fetchData = async () => {
      try {
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        
        // Chamada para a rota /api/dashboard do FastAPI
        const resDash = await fetch(`${API_URL}/dashboard?user_id=${user.id}&month=${month}&year=${year}`);
        if(resDash.ok) {
          const data = await resDash.json();
          setSummary(data);
        }
        
        // Aqui você poderia ter uma rota para listar as transações do mês e atualizar o estado `setTransactions(data)`
        
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, [currentDate, user.id]);

  // Mock provisório para o gráfico até a rota de listar transações estar completa no backend
  const chartData = [
    { name: 'Ifood', value: 250 }, { name: 'Roupas', value: 150 },
    { name: 'Mercado', value: 800 }, { name: 'Deslocamento', value: 350 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <button onClick={prevMonth} className="p-2 text-[#025E73] hover:bg-[#84BFB9] hover:bg-opacity-30 rounded-full transition"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold capitalize text-[#033859]">
          {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className="p-2 text-[#025E73] hover:bg-[#84BFB9] hover:bg-opacity-30 rounded-full transition"><ChevronRight size={24} /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#033859] text-[#F2F2EB] p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-80 mb-1">Saldo Atual</p>
          <p className="text-3xl font-bold">R$ {summary.balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Gráfico Restabelecido */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-[#033859]">Gastos por Categoria</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `R$ ${value}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {chartData.map((entry, index) => (
            <div key={entry.name} className="flex items-center text-sm font-medium text-[#033859]">
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></span>
              {entry.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: ENTRADAS (Integrado com Backend)
// ==========================================
function Incomes({ user }) {
  const [formData, setFormData] = useState({ name: '', desc: '', amount: '', cat: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        user_id: user.id,
        category_id: formData.cat || 'Outros', // No futuro, isso deveria ser um ID UUID real da tabela de categorias
        description: formData.desc ? `${formData.name} - ${formData.desc}` : formData.name,
        amount: parseFloat(formData.amount),
        transaction_date: new Date().toISOString().split('T')[0],
        payment_method: 'money'
      };

      const res = await fetch(`${API_URL}/transactions/income`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Entrada salva no banco de dados!');
        setFormData({ name: '', desc: '', amount: '', cat: '' });
      } else {
        alert('Erro ao salvar entrada.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-[#038C8C]">Nova Entrada</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Título / Nome (Obrigatório)</label>
          <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Descrição (Opcional)</label>
          <input type="text" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Valor (R$)</label>
            <input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Categoria</label>
            <input list="income-cats" value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="Escolha ou digite..." />
            <datalist id="income-cats">{INCOME_CATEGORIES.map(c => <option key={c} value={c} />)}</datalist>
          </div>
        </div>
        <button type="submit" className="w-full bg-[#038C8C] hover:bg-[#025E73] text-white font-bold py-3 rounded-lg transition mt-4">
          Registrar Entrada
        </button>
      </form>
    </div>
  );
}

// ==========================================
// COMPONENTE: SAÍDAS E PARCELAMENTOS (Integrado)
// ==========================================
function Expenses({ user }) {
  const [formData, setFormData] = useState({ name: '', desc: '', amount: '', cat: '', method: '', card: '', inst: 1 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        user_id: user.id,
        category_id: formData.cat || 'Outros', 
        description: formData.desc ? `${formData.name} - ${formData.desc}` : formData.name,
        amount: parseFloat(formData.amount),
        transaction_date: new Date().toISOString().split('T')[0],
        payment_method: formData.method,
        credit_card_id: formData.method === 'credit' ? formData.card : null,
        installments: formData.method === 'credit' ? parseInt(formData.inst) : 1
      };

      const res = await fetch(`${API_URL}/transactions/expense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Saída salva com sucesso no banco de dados!');
        setFormData({ name: '', desc: '', amount: '', cat: '', method: '', card: '', inst: 1 });
      } else {
        alert('Erro ao salvar despesa.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-red-600">Nova Saída</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Nome da Saída (Obrigatório)</label>
          <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Descrição (Opcional)</label>
          <input type="text" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Valor (R$)</label>
            <input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Categoria</label>
            <input list="expense-cats" value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="Escolha ou digite..." />
            <datalist id="expense-cats">{EXPENSE_CATEGORIES.map(c => <option key={c} value={c} />)}</datalist>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Forma de Pagamento</label>
          <select value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" required>
            <option value="">Selecione...</option>
            <option value="pix">Pix</option>
            <option value="debit">Débito</option>
            <option value="money">Dinheiro</option>
            <option value="credit">Cartão de Crédito</option>
          </select>
        </div>

        {/* ⚠️ CAMPO DE CARTÃO ATUALIZADO PARA USAR DATALIST LIVRE */}
        {formData.method === 'credit' && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-[#F2F2EB] rounded-lg border border-[#84BFB9]">
            <div>
              <label className="block text-sm font-medium text-[#025E73] mb-1">Qual Cartão?</label>
              <input list="credit-cards-list" required value={formData.card} onChange={e => setFormData({...formData, card: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="Escolha ou digite..." />
              <datalist id="credit-cards-list">
                {CREDIT_CARDS.map(card => <option key={card} value={card} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#025E73] mb-1">Parcelas</label>
              <input type="number" min="1" required value={formData.inst} onChange={e => setFormData({...formData, inst: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" />
            </div>
          </div>
        )}

        <button type="submit" className="w-full bg-[#033859] hover:bg-[#025E73] text-white font-bold py-3 rounded-lg transition mt-4">
          Registrar Saída
        </button>
      </form>
    </div>
  );
}

// ==========================================
// COMPONENTE: RESUMO DE CARTÕES
// ==========================================
function CreditCardSummary() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <button onClick={prevMonth} className="p-2 text-[#025E73] hover:bg-[#84BFB9] hover:bg-opacity-30 rounded-full transition"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold capitalize text-[#033859]">
          Faturas de {currentMonth.toLocaleString('pt-BR', { month: 'long' })}
        </h2>
        <button onClick={nextMonth} className="p-2 text-[#025E73] hover:bg-[#84BFB9] hover:bg-opacity-30 rounded-full transition"><ChevronRight size={24} /></button>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm text-center text-[#025E73]">
        Integração com backend em andamento...
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL (APP)
// ==========================================
export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) return <LoginScreen onLogin={(userData) => setUser(userData)} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'incomes': return <Incomes user={user} />;
      case 'expenses': return <Expenses user={user} />;
      case 'cards': return <CreditCardSummary user={user} />;
      default: return <Dashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2EB] font-sans pb-20">
      <header className="bg-[#033859] text-[#F2F2EB] p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wider">FinControl</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm capitalize hidden md:block">Olá, {user.name}</span>
            <div className="w-8 h-8 bg-[#038C8C] rounded-full flex items-center justify-center font-bold uppercase text-white shadow-sm">
              {user.name.charAt(0)}
            </div>
            <button onClick={() => setUser(null)} className="text-[#84BFB9] hover:text-white ml-2 transition" title="Sair"><LogOut size={20} /></button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4 mt-4">{renderContent()}</main>
      <nav className="fixed bottom-0 w-full bg-white border-t border-[#84BFB9] flex justify-around p-3 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center p-2 ${activeTab === 'dashboard' ? 'text-[#038C8C]' : 'text-[#025E73]'}`}><LayoutDashboard size={24} /><span className="text-xs mt-1 font-medium">Início</span></button>
        <button onClick={() => setActiveTab('incomes')} className={`flex flex-col items-center p-2 ${activeTab === 'incomes' ? 'text-[#038C8C]' : 'text-[#025E73]'}`}><TrendingUp size={24} /><span className="text-xs mt-1 font-medium">Entradas</span></button>
        <button onClick={() => setActiveTab('expenses')} className={`flex flex-col items-center p-2 ${activeTab === 'expenses' ? 'text-[#038C8C]' : 'text-[#025E73]'}`}><TrendingDown size={24} /><span className="text-xs mt-1 font-medium">Saídas</span></button>
        <button onClick={() => setActiveTab('cards')} className={`flex flex-col items-center p-2 ${activeTab === 'cards' ? 'text-[#038C8C]' : 'text-[#025E73]'}`}><CreditCard size={24} /><span className="text-xs mt-1 font-medium">Cartões</span></button>
      </nav>
    </div>
  );
}
