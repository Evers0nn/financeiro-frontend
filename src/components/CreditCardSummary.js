import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { API_URL } from '../utils/constants';

export default function CreditCardSummary({ user }) {
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
  const [cards, setCards] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null); 
  
  const prevPeriod = () => {
    setCycle(prev => {
      let m = prev.month - 1;
      let y = prev.year;
      if (m < 1) { m = 12; y -= 1; }
      return { month: m, year: y };
    });
  };

  const nextPeriod = () => {
    setCycle(prev => {
      let m = prev.month + 1;
      let y = prev.year;
      if (m > 12) { m = 1; y += 1; }
      return { month: m, year: y };
    });
  };

  let prevMonth = cycle.month - 1;
  let prevYear = cycle.year;
  if (prevMonth < 1) { prevMonth = 12; prevYear -= 1; }

  const startStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-04`;
  const endStr = `${cycle.year}-${String(cycle.month).padStart(2, '0')}-03`;

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const periodDisplay = `${monthNames[prevMonth - 1]} a ${monthNames[cycle.month - 1]}`;
  const displayDates = `04/${String(prevMonth).padStart(2, '0')}/${prevYear} até 03/${String(cycle.month).padStart(2, '0')}/${cycle.year}`;

  useEffect(() => {
    fetch(`${API_URL}/credit-cards/summary?user_id=${user.id}&start_date=${startStr}&end_date=${endStr}`)
      .then(r => r.json()).then(d => setCards(d)).catch(()=>{});
  }, [cycle.month, cycle.year, user.id]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <button onClick={prevPeriod} className="p-2 text-[#025E73]"><ChevronLeft /></button>
        <h2 className="text-lg font-bold capitalize text-[#033859] text-center">
          Faturas: {periodDisplay} <br/> <span className="text-xs font-normal text-gray-500">{displayDates}</span>
        </h2>
        <button onClick={nextPeriod} className="p-2 text-[#025E73]"><ChevronRight /></button>
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
                  <p className="text-xs text-[#025E73]">Clique para ver compras do ciclo</p>
                </div>
                <p className="text-xl font-bold text-red-600">R$ {card.total.toFixed(2)}</p>
              </div>
              
              {expandedCard === card.name && (
                <div className="bg-[#F2F2EB] p-4 border-t border-gray-200 animate-fadeIn">
                  <h4 className="text-sm font-bold text-[#033859] mb-2 border-b border-[#84BFB9] pb-1">Despesas no Ciclo</h4>
                  {card.items.length > 0 ? card.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1">
                      <span className="text-[#025E73]">{item.desc} <span className="text-xs opacity-70">({item.inst})</span></span>
                      <span className="font-semibold text-red-600">R$ {item.val.toFixed(2)}</span>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-500">Nenhuma compra detalhada encontrada.</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : <p className="text-center py-6 text-[#025E73]">Nenhuma fatura encontrada neste ciclo.</p>}
      </div>
    </div>
  );
}
