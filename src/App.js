import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LayoutDashboard, TrendingUp, TrendingDown, CreditCard, LogIn, LogOut, Edit2, Check, X } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// ==========================================
// CONFIGURAÇÕES E CONSTANTES
// ==========================================
const COLORS = { dark: '#033859', deep: '#025E73', teal: '#038C8C', aqua: '#84BFB9', bg: '#F2F2EB' };
const CHART_COLORS = [COLORS.dark, COLORS.deep, COLORS.teal, COLORS.aqua];
const INCOME_CATEGORIES = ['Salário', 'Freelance', 'Rendimento', 'Vendas', 'Outros'];
const EXPENSE_CATEGORIES = ['Ifood', 'Roupas', 'Mercado', 'Deslocamento', 'Contas', 'Lazer'];
const CREDIT_CARDS = ['Nubank', 'Inter', 'Itaú'];
const API_URL = 'https://financeiro-backend-7pzo.onrender.com/api'; 

// ==========================================
// COMPONENTE: TELA DE LOGIN
// ==========================================
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [savedAccounts, setSavedAccounts] = useState(() => {
    try { const acc = localStorage.getItem('fincontrol_accounts'); return acc ? JSON.parse(acc) : []; } catch(e) { return []; }
  });
  
  const handleLogin = (e, quickEmail = null) => {
    if(e) e.preventDefault();
    const finalEmail = quickEmail || email;
    if(finalEmail) {
      try { const updated = [...new Set([...savedAccounts, finalEmail])]; localStorage.setItem('fincontrol_accounts', JSON.stringify(updated)); } catch(e) {}
      onLogin({ id: finalEmail, name: finalEmail.split('@')[0], email: finalEmail });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2F2EB] p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-[#033859] mb-8">Controle Financeiro</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-[#84BFB9] rounded-lg" placeholder="E-mail" />
          <button type="submit" className="w-full bg-[#033859] text-white font-bold py-3 rounded-lg">Entrar</button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: DASHBOARD COM EDIÇÃO
// ==========================================
function Dashboard({ user }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const loadData = async () => {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    
    // Buscar Saldo
    const resDash = await fetch(`${API_URL}/dashboard?user_id=${user.id}&month=${month}&year=${year}`);
    if(resDash.ok) setSummary(await resDash.json());

    // Buscar Transações
    const resTx = await fetch(`${API_URL}/transactions?user_id=${user.id}&month=${month}&year=${year}`);
    if(resTx.ok) {
      const data = await resTx.json();
      setTransactions(data.map(t => ({ ...t, val: t.type === 'expense' ? -parseFloat(t.amount) : parseFloat(t.amount) })));
    }
  };

  useEffect(() => { loadData(); }, [currentDate, user.id]);

  const saveEdit = async (id) => {
    await fetch(`${API_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, user_id: user.id, transaction_date: new Date().toISOString().split('T')[0] })
    });
    setEditingId(null);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()-1)))}><ChevronLeft /></button>
        <h2 className="font-bold">{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()+1)))}><ChevronRight /></button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-bold text-[#033859] mb-4">Transações</h3>
        {transactions.map(t => (
          <div key={t.id} className="border-b p-3">
            {editingId === t.id ? (
              <div className="space-y-2">
                <input className="w-full border p-1" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
                <input className="w-full border p-1" type="number" value={editForm.amount} onChange={e => setEditForm({...editForm, amount: e.target.value})} />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(t.id)} className="bg-green-500 text-white p-1 rounded"><Check size={16} /></button>
                  <button onClick={() => setEditingId(null)} className="bg-red-500 text-white p-1 rounded"><X size={16} /></button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{t.description}</p>
                  <p className="text-xs">{t.category_id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={t.val > 0 ? 'text-green-600' : 'text-red-600'}>R$ {Math.abs(t.val).toFixed(2)}</span>
                  <button onClick={() => { setEditingId(t.id); setEditForm({description: t.description, amount: Math.abs(t.val), category_id: t.category_id}); }}><Edit2 size={16} /></button>
                </div>
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
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('fincontrol_user')); } catch { return null; } });
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#F2F2EB] font-sans pb-20">
      <header className="bg-[#033859] p-4 shadow-md flex justify-between items-center">
        <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
        <button onClick={() => { setUser(null); localStorage.removeItem('fincontrol_user'); }} className="text-white"><LogOut /></button>
      </header>
      <main className="max-w-4xl mx-auto p-4">{!user ? <LoginScreen onLogin={setUser} /> : <Dashboard user={user} />}</main>
    </div>
  );
}
