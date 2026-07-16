import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit2, Check, X } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { API_URL, CHART_COLORS } from '../utils/constants';

export default function Dashboard({ user }) {
  const getInitialCycle = () => {
    const today = new Date();
    let m = today.getMonth() + 1; 
    let y = today.getFullYear();
    if (today.getDate() > 3) {
      m += 1;
      if (m > 12) { m = 1; y += 1; }
    }
    return { month: m, year: y };
  };

  const [cycle, setCycle] = useState(getInitialCycle());
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [categories, setCategories] = useState([]);

  const prevPeriod = () => setCycle(prev => {
    let m = prev.month - 1, y = prev.year;
    if (m < 1) { m = 12; y -= 1; }
    return { month: m, year: y };
  });

  const nextPeriod = () => setCycle(prev => {
    let m = prev.month + 1, y = prev.year;
    if (m > 12) { m = 1; y += 1; }
    return { month: m, year: y };
  });

  let prevMonth = cycle.month - 1;
  let prevYear = cycle.year;
  if (prevMonth < 1) { prevMonth = 12; prevYear -= 1; }

  const startStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-04`;
  const endStr = `${cycle.year}-${String(cycle.month).padStart(2, '0')}-03`;

  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const displayDates = `04/${String(prevMonth).padStart(2, '0')}/${prevYear} até 03/${String(cycle.month).padStart(2, '0')}/${cycle.year}`;

  const loadData = async () => {
    try {
      const [resDash, resTx, resCat, resAllCat] = await Promise.all([
        fetch(`${API_URL}/dashboard?user_id=${user.id}&start_date=${startStr}&end_date=${endStr}`),
        fetch(`${API_URL}/transactions?user_id=${user.id}&start_date=${startStr}&end_date=${endStr}`),
        fetch(`${API_URL}/categories/summary?user_id=${user.id}&start_date=${startStr}&end_date=${endStr}`),
        fetch(`${API_URL}/config/categories`)
      ]);

      if(resDash.ok) setSummary(await resDash.json());
      if(resTx.ok) {
        const data = await resTx.json();
        setTransactions(data.map(t => ({
          ...t, 
          name: t.description.includes(' - ') ? t.description.split(' - ')[0] : t.description,
          desc: t.description.includes(' - ') ? t.description.split(' - ')[1] : '',
          val: t.type === 'expense' ? -parseFloat(t.amount) : parseFloat(t.amount)
        })));
      }
      if(resCat.ok) setChartData(await resCat.json());
      if(resAllCat.ok) setCategories(await resAllCat.json());
    } catch (error) { console.error("Erro:", error); }
  };

  useEffect(() => { loadData(); }, [cycle.month, cycle.year, user.id]);

  const saveEdit = async (id) => {
    const finalDescription = editForm.desc ? `${editForm.name} - ${editForm.desc}` : editForm.name;
    await fetch(`${API_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, description: finalDescription, user_id: user.id })
    });
    setEditingId(null);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <button onClick={prevPeriod} className="p-2"><ChevronLeft /></button>
        <div className="text-center">
            <h2 className="font-bold text-[#033859]">Ciclo Financeiro</h2>
            <p className="text-xs text-gray-500">{displayDates}</p>
        </div>
        <button onClick={nextPeriod} className="p-2"><ChevronRight /></button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#033859] text-white p-5 rounded-xl shadow-md">
            <p className="text-xs opacity-80">Saldo</p>
            <p className="text-2xl font-bold">R$ {summary.balance.toFixed(2)}</p>
        </div>
        <div className="bg-[#038C8C] text-white p-5 rounded-xl shadow-md">
            <p className="text-xs opacity-80">Entradas</p>
            <p className="text-2xl font-bold">R$ {summary.totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border-2 border-[#84BFB9] shadow-md">
            <p className="text-xs text-[#025E73]">Saídas</p>
            <p className="text-2xl font-bold text-red-500">R$ {summary.totalExpense.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-bold mb-4">Gastos por Categoria</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={5}>
                {chartData.map((e, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-bold mb-4">Transações</h3>
        {transactions.map(t => (
          <div key={t.id} className="border-b py-2 flex justify-between items-center">
             {editingId === t.id ? (
                <div className="flex gap-2 w-full">
                    <input className="border p-1 w-1/2" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                    <button onClick={() => saveEdit(t.id)} className="bg-green-500 text-white p-1 rounded"><Check/></button>
                </div>
             ) : (
                <>
                    <div><p className="font-bold">{t.name}</p><p className="text-xs">{t.category_id}</p></div>
                    <div className="flex items-center gap-2">
                        <span className={t.val > 0 ? 'text-green-600' : 'text-red-600'}>R$ {Math.abs(t.val).toFixed(2)}</span>
                        <button onClick={() => { setEditingId(t.id); setEditForm({name: t.name, desc: t.desc, amount: Math.abs(t.val), category_id: t.category_id, transaction_date: t.transaction_date}); }}><Edit2 size={16}/></button>
                    </div>
                </>
             )}
          </div>
        ))}
      </div>
    </div>
  );
}
