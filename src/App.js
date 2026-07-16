import React, { useState } from 'react';
import { LayoutDashboard, TrendingUp, TrendingDown, CreditCard, LogOut } from 'lucide-react';

// Importando nossos componentes separados
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import Incomes from './components/Incomes';
import Expenses from './components/Expenses';
import CreditCardSummary from './components/CreditCardSummary';

export default function App() {
  const [user, setUser] = useState(() => { 
    try { return JSON.parse(localStorage.getItem('fincontrol_user')); } 
    catch { return null; } 
  });
  
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
            <button 
              onClick={() => { setUser(null); localStorage.removeItem('fincontrol_user'); }} 
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto p-4 mt-4">
        {renderContent()}
      </main>
      
      <nav className="fixed bottom-0 w-full bg-white border-t border-[#84BFB9] flex justify-around p-3 z-10">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-[#038C8C]' : 'text-[#025E73]'}`}><LayoutDashboard size={24} /><span className="text-xs">Início</span></button>
        <button onClick={() => setActiveTab('incomes')} className={`flex flex-col items-center ${activeTab === 'incomes' ? 'text-[#038C8C]' : 'text-[#025E73]'}`}><TrendingUp size={24} /><span className="text-xs">Entradas</span></button>
        <button onClick={() => setActiveTab('expenses')} className={`flex flex-col items-center ${activeTab === 'expenses' ? 'text-[#038C8C]' : 'text-[#025E73]'}`}><TrendingDown size={24} /><span className="text-xs">Saídas</span></button>
        <button onClick={() => setActiveTab('cards')} className={`flex flex-col items-center ${activeTab === 'cards' ? 'text-[#038C8C]' : 'text-[#025E73]'}`}><CreditCard size={24} /><span className="text-xs">Cartões</span></button>
      </nav>
    </div>
  );
}
