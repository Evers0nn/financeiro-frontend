import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LayoutDashboard, TrendingUp, TrendingDown, CreditCard, LogIn, LogOut, Edit2, Check, X } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = { dark: '#033859', deep: '#025E73', teal: '#038C8C', aqua: '#84BFB9', bg: '#F2F2EB' };
const CHART_COLORS = [COLORS.dark, COLORS.deep, COLORS.teal, COLORS.aqua];
const API_URL = 'https://financeiro-backend-7pzo.onrender.com/api'; 

// ==========================================
// COMPONENTE: TELA DE LOGIN (Conectada ao Backend)
// ==========================================
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('fincontrol_user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError('Usuário ou senha incorretos.');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2F2EB] p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md animate-fadeIn">
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <p className="text-sm text-center text-[#025E73] font-medium">Acesse sua conta</p>
          {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Usuário</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="Ex: everson" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Senha</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="••••••••" />
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
// COMPONENTE: DASHBOARD (Com Edição)
// ==========================================
function Dashboard({ user }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  
  // Estados para a edição
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [categories, setCategories] = useState([]);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const loadData = async () => {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    
    const resDash = await fetch(`${API_URL}/dashboard?user_id=${user.id}&month=${month}&year=${year}`);
    if(resDash.ok) setSummary(await resDash.json());

    const resTx = await fetch(`${API_URL}/transactions?user_id=${user.id}&month=${month}&year=${year}`);
    if(resTx.ok) {
      const data = await resTx.json();
      setTransactions(data.map(t => ({ ...t, val: t.type === 'expense' ? -parseFloat(t.amount) : parseFloat(t.amount) })));
    }

    const resCat = await fetch(`${API_URL}/categories/summary?user_id=${user.id}&month=${month}&year=${year}`);
    if(resCat.ok) setChartData(await resCat.json());

    // Carrega categorias para o select de edição
    const resAllCat = await fetch(`${API_URL}/config/categories`);
    if(resAllCat.ok) setCategories(await resAllCat.json());
  };

  useEffect(() => { loadData(); }, [currentDate, user.id]);

  const saveEdit = async (id) => {
    await fetch(`${API_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, user_id: user.id })
    });
    setEditingId(null);
    loadData();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <button onClick={prevMonth} className="p-2 text-[#025E73] hover:bg-[#84BFB9] rounded-full transition"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold capitalize text-[#033859]">
          {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className="p-2 text-[#025E73] hover:bg-[#84BFB9] rounded-full transition"><ChevronRight size={24} /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#033859] text-[#F2F2EB] p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-80 mb-1">Saldo Atual</p>
          <p className="text-3xl font-bold">R$ {summary.balance.toFixed(2)}</p>
        </div>
        <div className="bg-[#038C8C] text-white p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-80 mb-1">Entradas</p>
          <p className="text-3xl font-bold">R$ {summary.totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white border-2 border-[#84BFB9] text-[#033859] p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-80 mb-1 text-[#025E73]">Saídas</p>
          <p className="text-3xl font-bold text-red-500">R$ {summary.totalExpense.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-[#033859]">Gastos por Categoria</h3>
        {chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : <p className="text-sm text-[#025E73] text-center py-6 border border-dashed border-[#84BFB9] rounded-lg">Nenhum gasto registrado neste mês.</p>}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-[#033859]">Transações do Mês</h3>
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map(t => (
              <div key={t.id} className="border-b pb-2">
                {editingId === t.id ? (
                  <div className="bg-[#F2F2EB] p-3 rounded-lg border border-[#84BFB9] space-y-3">
                    <div>
                      <label className="text-xs text-[#025E73]">Descrição</label>
                      <input className="w-full p-2 rounded border border-gray-300" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-[#025E73]">Valor (R$)</label>
                        <input type="number" step="0.01" className="w-full p-2 rounded border border-gray-300" value={editForm.amount} onChange={e => setEditForm({...editForm, amount: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-xs text-[#025E73]">Data</label>
                        <input type="date" className="w-full p-2 rounded border border-gray-300" value={editForm.transaction_date} onChange={e => setEditForm({...editForm, transaction_date: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-[#025E73]">Categoria</label>
                      <select className="w-full p-2 rounded border border-gray-300" value={editForm.category_id} onChange={e => setEditForm({...editForm, category_id: e.target.value})}>
                        {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => setEditingId(null)} className="flex items-center gap-1 bg-gray-400 text-white px-3 py-1 rounded"><X size={16}/> Cancelar</button>
                      <button onClick={() => saveEdit(t.id)} className="flex items-center gap-1 bg-[#038C8C] text-white px-3 py-1 rounded"><Check size={16}/> Salvar</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center hover:bg-gray-50 p-2 rounded transition">
                    <div>
                      <p className="font-semibold text-[#033859]">{t.description}</p>
                      <p className="text-xs text-[#025E73]">{t.category_id} • {t.transaction_date.split('-').reverse().join('/')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className={`font-bold ${t.val > 0 ? 'text-[#038C8C]' : 'text-red-500'}`}>
                        {t.val > 0 ? '+' : ''} R$ {Math.abs(t.val).toFixed(2)}
                      </p>
                      <button onClick={() => { setEditingId(t.id); setEditForm({description: t.description, amount: Math.abs(t.val), category_id: t.category_id, transaction_date: t.transaction_date}); }} className="text-gray-400 hover:text-[#038C8C]">
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-[#025E73] text-center py-6 border border-dashed border-[#84BFB9] rounded-lg">Nenhuma transação registrada neste mês.</p>}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: ENTRADAS (Com Data Escolhível)
// ==========================================
function Incomes({ user }) {
  const [formData, setFormData] = useState({ desc: '', amount: '', cat: '', date: new Date().toISOString().split('T')[0] });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/config/categories?type=income`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/transactions/income`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        category_id: formData.cat || 'Outros',
        description: formData.desc,
        amount: parseFloat(formData.amount),
        transaction_date: formData.date,
        payment_method: 'money'
      })
    });
    alert('Entrada salva!');
    setFormData({ desc: '', amount: '', cat: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-[#038C8C]">Nova Entrada</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Descrição</label>
          <input type="text" required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg" placeholder="Ex: Salário de Dezembro" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Valor (R$)</label>
            <input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Data</label>
            <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Categoria</label>
          <select value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg" required>
            <option value="">Selecione...</option>
            {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <button type="submit" className="w-full bg-[#038C8C] text-white font-bold py-3 rounded-lg mt-4">Registrar Entrada</button>
      </form>
    </div>
  );
}

// ==========================================
// COMPONENTE: SAÍDAS E PARCELAMENTOS (Dinâmico)
// ==========================================
function Expenses({ user }) {
  const [formData, setFormData] = useState({ desc: '', amount: '', cat: '', method: '', card: '', inst: 1, date: new Date().toISOString().split('T')[0] });
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [creditCards, setCreditCards] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/config/categories?type=expense`).then(r => r.json()).then(d => setCategories(d)).catch(()=>{});
    fetch(`${API_URL}/config/payment-methods`).then(r => r.json()).then(d => setPaymentMethods(d)).catch(()=>{});
    fetch(`${API_URL}/config/credit-cards`).then(r => r.json()).then(d => setCreditCards(d)).catch(()=>{});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/transactions/expense`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        category_id: formData.cat, 
        description: formData.desc,
        amount: parseFloat(formData.amount),
        transaction_date: formData.date,
        payment_method: formData.method,
        credit_card_id: formData.method === 'credit' ? formData.card : null,
        installments: formData.method === 'credit' ? parseInt(formData.inst) : 1
      })
    });
    alert('Saída salva!');
    setFormData({ desc: '', amount: '', cat: '', method: '', card: '', inst: 1, date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-red-600">Nova Saída</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Descrição</label>
          <input type="text" required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg" placeholder="Ex: Mercado" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Valor (R$)</label>
            <input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Data</label>
            <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Categoria</label>
            <select value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg" required>
              <option value="">Selecione...</option>
              {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Pagamento</label>
            <select value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg" required>
              <option value="">Selecione...</option>
              {paymentMethods.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>

        {formData.method === 'credit' && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-[#F2F2EB] rounded-lg border border-[#84BFB9]">
            <div>
              <label className="block text-sm font-medium text-[#025E73] mb-1">Cartão</label>
              <select required value={formData.card} onChange={e => setFormData({...formData, card: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg">
                <option value="">Selecione...</option>
                {creditCards.map(card => <option key={card.name} value={card.name}>{card.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#025E73] mb-1">Parcelas</label>
              <input type="number" min="1" required value={formData.inst} onChange={e => setFormData({...formData, inst: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg" />
            </div>
          </div>
        )}

        <button type="submit" className="w-full bg-[#033859] text-white font-bold py-3 rounded-lg mt-4">Registrar Saída</button>
      </form>
    </div>
  );
}

// ==========================================
// COMPONENTE: RESUMO DE CARTÕES
// ==========================================
function CreditCardSummary({ user }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [cards, setCards] = useState([]);
  
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  useEffect(() => {
    const month = currentMonth.getMonth() + 1;
    const year = currentMonth.getFullYear();
    fetch(`${API_URL}/credit-cards/summary?user_id=${user.id}&month=${month}&year=${year}`)
      .then(r => r.json()).then(d => setCards(d)).catch(()=>{});
  }, [currentMonth, user.id]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <button onClick={prevMonth} className="p-2 text-[#025E73]"><ChevronLeft /></button>
        <h2 className="text-xl font-bold capitalize text-[#033859]">Faturas de {currentMonth.toLocaleString('pt-BR', { month: 'long' })}</h2>
        <button onClick={nextMonth} className="p-2 text-[#025E73]"><ChevronRight /></button>
      </div>

      <div className="space-y-4">
        {cards.length > 0 ? (
          cards.map(card => (
            <div key={card.name} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-[#038C8C]">
              <div className="flex justify-between items-center">
                <p className="font-bold text-[#033859]">{card.name}</p>
                <p className="text-xl font-bold text-red-600">R$ {card.total.toFixed(2)}</p>
              </div>
            </div>
          ))
        ) : <p className="text-center py-6">Nenhuma fatura encontrada.</p>}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('fincontrol_user')); } catch { return null; } });
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) return <LoginScreen onLogin={setUser} />;

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
      <header className="bg-[#033859] p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <img src="/logo.png" alt="Controle Financeiro Logo" className="h-8 w-auto" />
          <div className="flex items-center gap-3 text-white">
            <span className="text-sm capitalize hidden md:block">Olá, {user.name}</span>
            <button onClick={() => { setUser(null); localStorage.removeItem('fincontrol_user'); }} title="Sair"><LogOut size={20} /></button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4 mt-4">{renderContent()}</main>
      <nav className="fixed bottom-0 w-full bg-white border-t border-[#84BFB9] flex justify-around p-3 z-10">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-[#038C8C]' : 'text-[#025E73]'}`}><LayoutDashboard size={24} /><span className="text-xs">Início</span></button>
        <button onClick={() => setActiveTab('incomes')} className={`flex flex-col items-center ${activeTab === 'incomes' ? 'text-[#038C8C]' : 'text-[#025E73]'}`}><TrendingUp size={24} /><span className="text-xs">Entradas</span></button>
        <button onClick={() => setActiveTab('expenses')} className={`flex flex-col items-center ${activeTab === 'expenses' ? 'text-[#038C8C]' : 'text-[#025E73]'}`}><TrendingDown size={24} /><span className="text-xs">Saídas</span></button>
        <button onClick={() => setActiveTab('cards')} className={`flex flex-col items-center ${activeTab === 'cards' ? 'text-[#038C8C]' : 'text-[#025E73]'}`}><CreditCard size={24} /><span className="text-xs">Cartões</span></button>
      </nav>
    </div>
  );
}
