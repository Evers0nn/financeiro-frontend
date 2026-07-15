import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LayoutDashboard, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// ==========================================
// PALETA DE CORES E DADOS MOCKADOS
// ==========================================
const COLORS = {
  dark: '#033859',
  deep: '#025E73',
  teal: '#038C8C',
  aqua: '#84BFB9',
  bg: '#F2F2EB'
};

const CHART_COLORS = [COLORS.dark, COLORS.deep, COLORS.teal, COLORS.aqua];

// Simulando categorias existentes
const CATEGORIES = ['Ifood', 'Roupas', 'Mercado', 'Deslocamento', 'Salário', 'Freelance', 'Outros'];
const CREDIT_CARDS = ['Nubank', 'Inter', 'Itaú'];

// ==========================================
// COMPONENTE: DASHBOARD (TELA INICIAL)
// ==========================================
function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // Dados para o gráfico baseados nas suas categorias
  const chartData = [
    { name: 'Ifood', value: 250 },
    { name: 'Roupas', value: 150 },
    { name: 'Mercado', value: 800 },
    { name: 'Deslocamento', value: 350 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Navegação de Meses */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <button onClick={prevMonth} className="p-2 text-[#025E73] hover:bg-[#84BFB9] hover:bg-opacity-30 rounded-full transition">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold capitalize text-[#033859]">
          {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className="p-2 text-[#025E73] hover:bg-[#84BFB9] hover:bg-opacity-30 rounded-full transition">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#033859] text-[#F2F2EB] p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-80 mb-1">Saldo Atual</p>
          <p className="text-3xl font-bold">R$ 2.450,00</p>
        </div>
        <div className="bg-[#038C8C] text-white p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-80 mb-1">Entradas do Mês</p>
          <p className="text-3xl font-bold">R$ 4.000,00</p>
        </div>
        <div className="bg-white border-2 border-[#84BFB9] text-[#033859] p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-80 mb-1 text-[#025E73]">Saídas do Mês</p>
          <p className="text-3xl font-bold">R$ 1.550,00</p>
        </div>
      </div>

      {/* Gráfico */}
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

      {/* Lista de Transações (Descendo a tela) */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-[#033859]">Transações Recentes</h3>
        <div className="space-y-3">
          {[
            { id: 1, desc: 'Mercado Assaí', cat: 'Mercado', val: -450.00, date: '10/05' },
            { id: 2, desc: 'Salário', cat: 'Salário', val: 4000.00, date: '05/05' },
            { id: 3, desc: 'Uber', cat: 'Deslocamento', val: -35.50, date: '02/05' },
          ].map(t => (
            <div key={t.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-semibold text-[#033859]">{t.desc}</p>
                <p className="text-xs text-[#025E73]">{t.cat} • {t.date}</p>
              </div>
              <p className={`font-bold ${t.val > 0 ? 'text-[#038C8C]' : 'text-red-500'}`}>
                {t.val > 0 ? '+' : ''} R$ {Math.abs(t.val).toFixed(2)}
              </p>
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
      <h2 className="text-2xl font-bold mb-6 text-[#033859]">Nova Entrada</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Valor (R$)</label>
          <input type="number" step="0.01" className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="0,00" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Categoria</label>
          <select className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]">
            <option value="">Selecione ou crie uma...</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button type="button" className="w-full bg-[#038C8C] hover:bg-[#025E73] text-white font-bold py-3 rounded-lg transition">
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
      <h2 className="text-2xl font-bold mb-6 text-[#033859]">Nova Saída</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Descrição</label>
          <input type="text" className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="Ex: Compra do mês" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Valor (R$)</label>
            <input type="number" step="0.01" className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="0,00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Categoria</label>
            <select className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Forma de Pagamento</label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]"
          >
            <option value="">Selecione...</option>
            <option value="pix">Pix</option>
            <option value="debit">Débito</option>
            <option value="money">Dinheiro</option>
            <option value="credit">Cartão de Crédito</option>
          </select>
        </div>

        {/* Lógica condicional: Se for crédito, abre seleção de cartão e parcelas */}
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
              <p className="text-xs text-gray-500 mt-1">O valor será adicionado aos meses seguintes.</p>
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
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-[#033859]">Faturas deste mês</h2>
      <div className="space-y-4">
        {[
          { name: 'Nubank', val: 850.50, color: 'border-purple-500' },
          { name: 'Inter', val: 320.00, color: 'border-orange-500' },
          { name: 'Itaú', val: 1200.00, color: 'border-blue-500' },
        ].map(card => (
          <div key={card.name} className={`flex justify-between items-center p-4 border-l-4 ${card.color} bg-[#F2F2EB] rounded-r-lg`}>
            <div>
              <p className="font-bold text-[#033859]">{card.name}</p>
              <p className="text-xs text-[#025E73]">Fechamento dia 05</p>
            </div>
            <p className="text-xl font-bold text-red-600">R$ {card.val.toFixed(2)}</p>
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
  const [activeTab, setActiveTab] = useState('dashboard');

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
      
      {/* Header Fixo */}
      <header className="bg-[#033859] text-[#F2F2EB] p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wider">FinControl</h1>
          <div className="w-8 h-8 bg-[#038C8C] rounded-full flex items-center justify-center font-bold">
            U
          </div>
        </div>
      </header>

      {/* Área Dinâmica de Conteúdo */}
      <main className="max-w-4xl mx-auto p-4 mt-4">
        {renderContent()}
      </main>

      {/* Menu de Navegação Inferior (Mobile Friendly) */}
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
