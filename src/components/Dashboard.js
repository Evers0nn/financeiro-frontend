import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit2, Check, X } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { API_URL, CHART_COLORS } from '../utils/constants';

export default function Dashboard({ user }) {
  // Lógica inteligente de ciclo: se dia atual > 15, joga para o próximo mês
  const getInitialDate = () => {
    const today = new Date();
    if (today.getDate() > 15) today.setMonth(today.getMonth() + 1);
    return today;
  };

  const [targetDate, setTargetDate] = useState(getInitialDate());
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [categories, setCategories] = useState([]);

  // Navegação de ciclos
  const prevPeriod = () => setTargetDate(new Date(targetDate.getFullYear(), targetDate.getMonth() - 1, 1));
  const nextPeriod = () => setTargetDate(new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1));

  // Calculando as datas do período (dia 16 do mês anterior até dia 15 do mês alvo)
  const startDate = new Date(targetDate.getFullYear(), targetDate.getMonth() - 1, 16);
  const endDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 15);
  
  // Formatando para YYYY-MM-DD para o backend
  const formatDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const startStr = formatDate(startDate);
  const endStr = formatDate(endDate);

  // Texto visual do mês (ex: Julho a Agosto)
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const periodDisplay = `${monthNames[startDate.getMonth()]} a ${monthNames[endDate.getMonth()]}`;

  const loadData = async () => {
    const resDash = await fetch(`${API_URL}/dashboard?user_id=${user.id}&start_date=${startStr}&end_date=${endStr}`);
    if(resDash.ok) setSummary(await resDash.json());

    const resTx = await fetch(`${API_URL}/transactions?user_id=${user.id}&start_date=${startStr}&end_date=${endStr}`);
    if(resTx.ok) {
      const data = await resTx.json();
      const mapped = data.map(t => {
        const hasDetails = t.description.includes(' - ');
        return {
          ...t,
          name: hasDetails ? t.description.split(' - ')[0] : t.description,
          desc: hasDetails ? t.description.substring(t.description.indexOf(' - ') + 3) : '',
          val: t.type === 'expense' ? -parseFloat(t.amount) : parseFloat(t.amount)
        };
      });
      setTransactions(mapped);
    }

    const resCat = await fetch(`${API_URL}/categories/summary?user_id=${user.id}&start_date=${startStr}&end_date=${endStr}`);
    if(resCat.ok) setChartData(await resCat.json());

    const resAllCat = await fetch(`${API_URL}/config/categories`);
    if(resAllCat.ok) setCategories(await resAllCat.json());
  };

  useEffect(() => { loadData(); }, [targetDate, user.id]);

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
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <button onClick={prevPeriod} className="p-2 text-[#025E73] hover:bg-[#84BFB9] rounded-full transition"><ChevronLeft size={24} /></button>
        <h2 className="text-lg font-bold capitalize text-[#033859] text-center">
          {periodDisplay} <br/> <span className="text-xs font-normal text-gray-500">{startDate.toLocaleDateString('pt-BR')} até {endDate.toLocaleDateString('pt-BR')}</span>
        </h2>
        <button onClick={nextPeriod} className="p-2 text-[#025E73] hover:bg-[#84BFB9] rounded-full transition"><ChevronRight size={24} /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#033859] text-[#F2F2EB] p-5 rounded-xl shadow-md">
          <p className="text-sm opacity-80 mb-1">Saldo do Ciclo</p>
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
        ) : <p className="text-sm text-[#025E73] text-center py-6 border border-dashed border-[#84BFB9] rounded-lg">Nenhum gasto registrado neste ciclo.</p>}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-[#033859]">Transações do Ciclo</h3>
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map(t => (
              <div key={t.id} className="border-b pb-2">
                {editingId === t.id ? (
                  <div className="bg-[#F2F2EB] p-3 rounded-lg border border-[#84BFB9] space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="text-xs text-[#025E73]">Título</label><input className="w-full p-2 rounded border border-gray-300" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></div>
                      <div><label className="text-xs text-[#025E73]">Descrição (Opcional)</label><input className="w-full p-2 rounded border border-gray-300" value={editForm.desc} onChange={e => setEditForm({...editForm, desc: e.target.value})} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="text-xs text-[#025E73]">Valor (R$)</label><input type="number" step="0.01" className="w-full p-2 rounded border border-gray-300" value={editForm.amount} onChange={e => setEditForm({...editForm, amount: e.target.value})} /></div>
                      <div><label className="text-xs text-[#025E73]">Data</label><input type="date" className="w-full p-2 rounded border border-gray-300" value={editForm.transaction_date} onChange={e => setEditForm({...editForm, transaction_date: e.target.value})} /></div>
                    </div>
                    <div>
                      <label className="text-xs text-[#025E73]">Categoria</label>
                      <input list="edit-cats" className="w-full p-2 rounded border border-gray-300" value={editForm.category_id} onChange={e => setEditForm({...editForm, category_id: e.target.value})} />
                      <datalist id="edit-cats">{categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}</datalist>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => setEditingId(null)} className="flex items-center gap-1 bg-gray-400 text-white px-3 py-1 rounded"><X size={16}/> Cancelar</button>
                      <button onClick={() => saveEdit(t.id)} className="flex items-center gap-1 bg-[#038C8C] text-white px-3 py-1 rounded"><Check size={16}/> Salvar</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center hover:bg-gray-50 p-2 rounded transition">
                    <div>
                      <p className="font-semibold text-[#033859]">{t.name}</p>
                      <p className="text-xs text-[#025E73]">{t.category_id} • {t.transaction_date.split('-').reverse().join('/')}</p>
                      {t.desc && <p className="text-xs text-gray-500">{t.desc}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className={`font-bold ${t.val > 0 ? 'text-[#038C8C]' : 'text-red-500'}`}>{t.val > 0 ? '+' : ''} R$ {Math.abs(t.val).toFixed(2)}</p>
                      <button onClick={() => { setEditingId(t.id); setEditForm({name: t.name, desc: t.desc, amount: Math.abs(t.val), category_id: t.category_id, transaction_date: t.transaction_date}); }} className="text-gray-400 hover:text-[#038C8C]"><Edit2 size={16} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-[#025E73] text-center py-6 border border-dashed border-[#84BFB9] rounded-lg">Nenhuma transação registrada neste ciclo.</p>}
      </div>
    </div>
  );
}
