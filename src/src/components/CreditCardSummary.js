import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { API_URL } from '../utils/constants';

export default function CreditCardSummary({ user }) {
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
