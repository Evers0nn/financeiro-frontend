import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, LayoutDashboard, TrendingUp, TrendingDown, CreditCard, LogIn, LogOut, Info } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// ==========================================
// CONFIGURAÇÕES E DADOS MOCKADOS
// ==========================================
const COLORS = {
  dark: '#033859',
  deep: '#025E73',
  teal: '#038C8C',
  aqua: '#84BFB9',
  bg: '#F2F2EB'
};
const CHART_COLORS = [COLORS.dark, COLORS.deep, COLORS.teal, COLORS.aqua];

// Categorias Separadas
const INCOME_CATEGORIES = ['Salário', 'Freelance', 'Rendimento', 'Vendas', 'Outros'];
const EXPENSE_CATEGORIES = ['Ifood', 'Roupas', 'Mercado', 'Deslocamento', 'Contas', 'Lazer'];
const CREDIT_CARDS = ['Nubank', 'Inter', 'Itaú'];

// ==========================================
// COMPONENTE: TELA DE LOGIN
// ==========================================
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  
  const handleLogin = (e) => {
    e.preventDefault();
    // Simulação: Aqui futuramente entra a chamada ao Supabase Auth
    if(email) onLogin({ name: email.split('@')[0], email });
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
function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTx, setSelectedTx] = useState(null); // Estado para transação clicada
  
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const chartData = [
    { name: 'Ifood', value: 250 }, { name: 'Roupas', value: 150 },
    { name: 'Mercado', value: 800 }, { name: 'Deslocamento', value: 350 },
  ];

  // Mock de transações mistas
  const transactions = [
    { id: 1, type: 'expense', name: 'Compra do Mês', desc: 'Arroz, feijão e carnes', cat: 'Mercado', val: -800.00, date: '10/05', isCard: true, cardName: 'Nubank', installment: '1/1' },
    { id: 2, type: 'income', name: 'Salário', desc: '', cat: 'Salário', val: 4000.00, date: '05/05', isCard: false },
    { id: 3, type: 'expense', name: 'Uber para faculdade', desc: '', cat: 'Deslocamento', val: -35.50, date: '02/05', isCard: false },
    { id: 4, type: 'expense', name: 'Tênis Nike', desc: 'Presente de aniversário', cat: 'Roupas', val: -150.00, date: '01/05', isCard: true, cardName: 'Inter', installment: '3/6' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Navegação de Meses */}
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
          <p className="text-3xl font-bold">R$ 3.014,50</p>
        </div>
      </div>

      {/* Lista de Transações (Clicável) */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-[#033859]">Transações do Mês</h3>
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
              
              {/* Detalhes Expandidos */}
              {selectedTx === t.id && (
                <div className="mt-3 p-3 bg-[#F2F2EB] rounded-lg text-sm text-[#025E73] space-y-1 border border-[#84BFB9] animate-fadeIn">
                  {t.desc && <p><span className="font-bold">Descrição:</span> {t.desc}</p>}
                  <p><span className="font-bold">Categoria:</span> {t.cat}</p>
                  {t.isCard && (
                    <>
                      <p><span className="font-bold">Pagamento:</span> Cartão de Crédito ({t.cardName})</p>
                      <p><span className="font-bold">Parcela:</span> {t.installment}</p>
                    </>
                  )}
                  {!t.isCard && <p><span className="font-bold">Pagamento:</span> À vista (Pix/Débito/Dinheiro)</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: ENTRADAS
// ==========================================
function Incomes() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-[#038C8C]">Nova Entrada</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Título / Nome (Obrigatório)</label>
          <input type="text" required className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="Ex: Salário da Empresa" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Descrição (Opcional)</label>
          <input type="text" className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="Detalhes adicionais..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Valor (R$)</label>
            <input type="number" step="0.01" required className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="0,00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Categoria</label>
            <input list="income-cats" className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="Escolha ou digite..." />
            <datalist id="income-cats">
              {INCOME_CATEGORIES.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
        </div>
        <button type="button" className="w-full bg-[#038C8C] hover:bg-[#025E73] text-white font-bold py-3 rounded-lg transition mt-4">
          Registrar Entrada
        </button>
      </form>
    </div>
  );
}

// ==========================================
// COMPONENTE: SAÍDAS E PARCELAMENTOS
// ==========================================
function Expenses() {
  const [paymentMethod, setPaymentMethod] = useState('');

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-red-600">Nova Saída</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Nome da Saída (Obrigatório)</label>
          <input type="text" required className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="Ex: Compra do mês" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Descrição (Opcional)</label>
          <input type="text" className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="Detalhes adicionais..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Valor (R$)</label>
            <input type="number" step="0.01" required className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="0,00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Categoria</label>
            <input list="expense-cats" className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="Escolha ou digite..." />
            <datalist id="expense-cats">
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Forma de Pagamento</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]">
            <option value="">Selecione...</option>
            <option value="pix">Pix</option>
            <option value="debit">Débito</option>
            <option value="money">Dinheiro</option>
            <option value="credit">Cartão de Crédito</option>
          </select>
        </div>

        {paymentMethod === 'credit' && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-[#F2F2EB] rounded-lg border border-[#84BFB9]">
            <div>
              <label className="block text-sm font-medium text-[#025E73] mb-1">Qual Cartão?</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg outline-none">
                {CREDIT_CARDS.map(card => <option key={card} value={card}>{card}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#025E73] mb-1">Parcelas</label>
              <input type="number" min="1" defaultValue="1" className="w-full p-3 border border-gray-300 rounded-lg outline-none" />
            </div>
          </div>
        )}

        <button type="button" className="w-full bg-[#033859] hover:bg-[#025E73] text-white font-bold py-3 rounded-lg transition mt-4">
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
  const [expandedCard, setExpandedCard] = useState(null); // Qual cartão está aberto
  
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  // Mock de faturas
  const cards = [
    { 
      name: 'Nubank', total: 850.50, color: 'border-purple-500', 
      items: [{ desc: 'Mercado', val: 800.00, inst: '1/1' }, { desc: 'Netflix', val: 50.50, inst: '1/1' }]
    },
    { 
      name: 'Inter', total: 150.00, color: 'border-orange-500', 
      items: [{ desc: 'Tênis Nike', val: 150.00, inst: '3/6' }]
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Navegação de Meses dos Cartões */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <button onClick={prevMonth} className="p-2 text-[#025E73] hover:bg-[#84BFB9] hover:bg-opacity-30 rounded-full transition"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold capitalize text-[#033859]">
          Faturas de {currentMonth.toLocaleString('pt-BR', { month: 'long' })}
        </h2>
        <button onClick={nextMonth} className="p-2 text-[#025E73] hover:bg-[#84BFB9] hover:bg-opacity-30 rounded-full transition"><ChevronRight size={24} /></button>
      </div>

      <div className="space-y-4">
        {cards.map(card => (
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
            
            {/* Lista de Compras do Cartão (Expansível) */}
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
        ))}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL (APP)
// ==========================================
export default function App() {
  const [user, setUser] = useState(null); // Controle de Login
  const [activeTab, setActiveTab] = useState('dashboard');

  // Se não tem usuário, mostra a tela de login
  if (!user) {
    return <LoginScreen onLogin={(userData) => setUser(userData)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'incomes': return <Incomes />;
      case 'expenses': return <Expenses />;
      case 'cards': return <CreditCardSummary />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2EB] font-sans pb-20">
      
      {/* Header Fixo com Info do Usuário */}
      <header className="bg-[#033859] text-[#F2F2EB] p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wider">FinControl</h1>
          
          <div className="flex items-center gap-3">
            <span className="text-sm capitalize hidden md:block">Olá, {user.name}</span>
            <div className="w-8 h-8 bg-[#038C8C] rounded-full flex items-center justify-center font-bold uppercase text-white shadow-sm">
              {user.name.charAt(0)}
            </div>
            <button onClick={() => setUser(null)} className="text-[#84BFB9] hover:text-white ml-2 transition" title="Sair">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Área Dinâmica de Conteúdo */}
      <main className="max-w-4xl mx-auto p-4 mt-4">
        {renderContent()}
      </main>

      {/* Menu de Navegação Inferior */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-[#84BFB9] flex justify-around p-3 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center p-2 ${activeTab === 'dashboard' ? 'text-[#038C8C]' : 'text-[#025E73]'}`}>
          <LayoutDashboard size={24} />
          <span className="text-xs mt-1 font-medium">Início</span>
        </button>
        <button onClick={() => setActiveTab('incomes')} className={`flex flex-col items-center p-2 ${activeTab === 'incomes' ? 'text-[#038C8C]' : 'text-[#025E73]'}`}>
          <TrendingUp size={24} />
          <span className="text-xs mt-1 font-medium">Entradas</span>
        </button>
        <button onClick={() => setActiveTab('expenses')} className={`flex flex-col items-center p-2 ${activeTab === 'expenses' ? 'text-[#038C8C]' : 'text-[#025E73]'}`}>
          <TrendingDown size={24} />
          <span className="text-xs mt-1 font-medium">Saídas</span>
        </button>
        <button onClick={() => setActiveTab('cards')} className={`flex flex-col items-center p-2 ${activeTab === 'cards' ? 'text-[#038C8C]' : 'text-[#025E73]'}`}>
          <CreditCard size={24} />
          <span className="text-xs mt-1 font-medium">Cartões</span>
        </button>
      </nav>

    </div>
  );
}
