import React, { useState, useEffect } from 'react';
import { API_URL } from '../utils/constants';

export default function Incomes({ user }) {
  const [formData, setFormData] = useState({ name: '', desc: '', amount: '', cat: '', date: new Date().toISOString().split('T')[0] });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/config/categories?type=income`).then(r => r.json()).then(d => setCategories(d)).catch(()=>{});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/transactions/income`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        category_id: formData.cat || 'Outros',
        description: formData.desc ? `${formData.name} - ${formData.desc}` : formData.name,
        amount: parseFloat(formData.amount),
        transaction_date: formData.date,
        payment_method: 'money'
      })
    });
    alert('Entrada salva!');
    setFormData({ name: '', desc: '', amount: '', cat: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-[#038C8C]">Nova Entrada</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Título (Obrigatório)</label>
          <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg" placeholder="Ex: Salário" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Descrição (Opcional)</label>
          <input type="text" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg" placeholder="Detalhes adicionais..." />
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
          <input list="income-cats" value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg" placeholder="Escolha ou digite..." required />
          <datalist id="income-cats">{categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}</datalist>
        </div>
        <button type="submit" className="w-full bg-[#038C8C] text-white font-bold py-3 rounded-lg mt-4">Registrar Entrada</button>
      </form>
    </div>
  );
}
