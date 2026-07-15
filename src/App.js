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

// URL REAL DO SEU BACKEND NO RENDER
const API_URL = 'https://financeiro-backend-7pzo.onrender.com/api'; 

// ==========================================
// COMPONENTE: TELA DE LOGIN
// ==========================================
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  
  const [savedAccounts, setSavedAccounts] = useState(() => {
    try {
      const accounts = localStorage.getItem('fincontrol_accounts');
      return accounts ? JSON.parse(accounts) : [];
    } catch(e) {
      return [];
    }
  });
  
  const handleLogin = (e, quickEmail = null) => {
    if(e) e.preventDefault();
    const finalEmail = quickEmail || email;
    
    if(finalEmail) {
      try {
        const updatedAccounts = [...new Set([...savedAccounts, finalEmail])];
        localStorage.setItem('fincontrol_accounts', JSON.stringify(updatedAccounts));
      } catch(e) {
        console.warn("Modo privado: não salvou na lista de contas.");
      }
      onLogin({ id: finalEmail, name: finalEmail.split('@')[0], email: finalEmail });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2F2EB] p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md animate-fadeIn">
        <h1 className="text-3xl font-bold text-center text-[#033859] mb-8">FinControl</h1>
        
        {savedAccounts.length > 0 && (
          <div className="mb-6 pb-6 border-b border-[#84BFB9]">
            <p className="text-sm text-center text-[#025E73] mb-3">Acessar com conta salva:</p>
            <div className="space-y-2">
              {savedAccounts.map((acc, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleLogin(null, acc)}
                  className="w-full bg-[#F2F2EB] hover:bg-[#84BFB9] hover:text-white text-[#033859] border border-[#84BFB9] p-3 rounded-lg transition flex items-center justify-center gap-2 font-medium"
                >
                  <div className="w-6 h-6 bg-[#038C8C] rounded-full flex items-center justify-center text-xs text-white uppercase">
                    {acc.charAt(0)}
                  </div>
                  {acc}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <p className="text-sm text-center text-[#025E73] font-medium">Ou entre com uma nova conta</p>
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
  
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  
  // Arrays agora iniciam vazios (sem dados de mentirinha)
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        
        const resDash = await fetch(`${API_URL}/dashboard?user_id=${user.id}&month=${month}&year=${year}`);
        if(resDash.ok) {
          const data = await resDash.json();
          setSummary(data);
        }
        
        // No futuro, faremos um fetch real para as transações aqui
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, [currentDate, user.id]);

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

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-[#033859]">Gastos por Categoria</h3>
        {chartData.length > 0 ? (
          <>
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
          </>
        ) : (
          <p className="text-sm text-[#025E73] text-center py-6 border border-dashed border-[#84BFB9] rounded-lg">Nenhum gasto registrado neste mês.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-[#033859]">Transações do Mês</h3>
        
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map(t => (
              <div key={t.id} className="border-b pb-2 cursor-pointer hover:bg-gray-50 rounded p-2 transition" onClick={() => setSelectedTx(selectedTx === t.id ? null : t.id)}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-[#033859]">{t.name}</p>
                    <p className="text-xs text-[#025E73]">{t.cat} • {t.date}</p>
                  </div>
                  <p className={`font-bold ${t.val > 0 ? 'text-[#038C8C]' : 'text-red-500'}`}>
                    {t.val > 0 ? '+' : ''} R$ {Math.abs(t.val).toFixed(2)}
                  </p>
                </div>
                
                {selectedTx === t.id && (
                  <div className="mt-3 p-3 bg-[#F2F2EB] rounded-lg text-sm text-[#025E73] space-y-1 border border-[#84BFB9] animate-fadeIn">
                    {t.desc && <p><span className="font-bold">Descrição:</span> {t.desc}</p>}
                    <p><span className="font-bold">Categoria:</span> {t.cat}</p>
                    {t.isCard ? (
                      <>
                        <p><span className="font-bold">Pagamento:</span> Cartão de Crédito ({t.cardName})</p>
                        <p><span className="font-bold">Parcela:</span> {t.installment}</p>
                      </>
                    ) : (
                      <p><span className="font-bold">Pagamento:</span> À vista</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#025E73] text-center py-6 border border-dashed border-[#84BFB9] rounded-lg">Nenhuma transação registrada neste mês.</p>
        )}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: ENTRADAS
// ==========================================
function Incomes({ user }) {
  const [formData, setFormData] = useState({ name: '', desc: '', amount: '', cat: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        user_id: user.id,
        category_id: formData.cat || 'Outros',
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
          <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="Ex: Salário" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Descrição (Opcional)</label>
          <input type="text" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="Detalhes..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Valor (R$)</label>
            <input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="0,00" />
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
// COMPONENTE: SAÍDAS E PARCELAMENTOS
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
        alert('Saída salva no banco de dados!');
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
          <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="Ex: Mercado" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Descrição (Opcional)</label>
          <input type="text" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="Detalhes adicionais..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Valor (R$)</label>
            <input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="0,00" />
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
  const [expandedCard, setExpandedCard] = useState(null);
  
  // Arrays agora iniciam vazios
  const [cards, setCards] = useState([]);
  
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

      <div className="space-y-4">
        {cards.length > 0 ? (
          cards.map(card => (
            <div key={card.name} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div 
                className={`flex justify-between items-center p-4 border-l-4 ${card.color} cursor-pointer hover:bg-gray-50`}
                onClick={() => setExpandedCard(expandedCard === card.name ? null : card.name)}
              >
                <div>
                  <p className="font-bold text-[#033859]">{card.name}</p>
                  <p className="text-xs text-[#025E73]">Ver compras do mês</p>
                </div>
                <p className="text-xl font-bold text-red-600">R$ {card.total.toFixed(2)}</p>
              </div>
              
              {expandedCard === card.name && (
                <div className="bg-[#F2F2EB] p-4 border-t border-gray-200 animate-fadeIn">
                  <h4 className="text-sm font-bold text-[#033859] mb-2 border-b border-[#84BFB9] pb-1">Detalhes da Fatura</h4>
                  {card.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1">
                      <span className="text-[#025E73]">{item.desc} <span className="text-xs opacity-70">({item.inst})</span></span>
                      <span className="font-semibold text-red-600">R$ {item.val.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-[#025E73] text-center py-6 border border-dashed border-[#84BFB9] rounded-lg">Nenhuma fatura encontrada neste mês.</p>
        )}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL (APP)
// ==========================================
export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('fincontrol_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('fincontrol_user', JSON.stringify(userData));
    } catch (error) {
      console.warn("Modo privado: não foi possível salvar o login no localStorage.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('fincontrol_user');
    } catch (error) {
      console.warn("Modo privado: não foi possível limpar o localStorage.");
    }
  };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

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
            <button onClick={handleLogout} className="text-[#84BFB9] hover:text-white ml-2 transition" title="Sair"><LogOut size={20} /></button>
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
