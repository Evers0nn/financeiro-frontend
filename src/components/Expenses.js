import React, { useState, useEffect } from 'react';
import { API_URL } from '../utils/constants';

export default function Expenses({ user }) {
  const [formData, setFormData] = useState({ name: '', desc: '', amount: '', cat: '', method: '', card: '', inst: 1, date: new Date().toISOString().split('T')[0] });
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
        description: formData.desc ? `${formData.name} - ${formData.desc}` : formData.name,
        amount: parseFloat(formData.amount),
        transaction_date: formData.date,
        payment_method: formData.method,
        credit_card_id: formData.method === 'credit' ? formData.card : null,
        installments: formData.method === 'credit' ? parseInt(formData.inst) : 1
      })
    });
    alert('Saída salva!');
    setFormData({ name: '', desc: '', amount: '', cat: '', method: '', card: '', inst: 1, date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-red-600">Nova Saída</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#025E73] mb-1">Título (Obrigatório)</label>
          <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg" placeholder="Ex: Mercado" />
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
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Categoria</label>
            <input list="expense-cats" value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg" placeholder="Escolha ou digite..." required />
            <datalist id="expense-cats">{categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}</datalist>
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
              <input list="credit-cards-list" required value={formData.card} onChange={e => setFormData({...formData, card: e.target.value})} className="w-full p-3 border border-[#84BFB9] rounded-lg" placeholder="Escolha ou digite..." />
              <datalist id="credit-cards-list">
                {creditCards.map(card => <option key={card.name} value={card.name}>{card.name}</option>)}
              </datalist>
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
