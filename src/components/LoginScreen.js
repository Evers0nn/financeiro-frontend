import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { API_URL } from '../utils/constants';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [savedAccounts, setSavedAccounts] = useState(() => {
    try { const acc = localStorage.getItem('fincontrol_accounts'); return acc ? JSON.parse(acc) : []; } catch(e) { return []; }
  });

  const handleLogin = async (e, quickUser = null) => {
    if(e) e.preventDefault();
    setError('');
    
    const finalUser = quickUser || username;
    const finalPass = quickUser ? '1234' : password;

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: finalUser, password: finalPass })
      });
      
      if (res.ok) {
        const data = await res.json();
        try { const updated = [...new Set([...savedAccounts, finalUser])]; localStorage.setItem('fincontrol_accounts', JSON.stringify(updated)); } catch(e) {}
        
        localStorage.setItem('fincontrol_user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError('Usuário ou senha incorretos.');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2F2EB] p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md animate-fadeIn">
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
        </div>
        
        {savedAccounts.length > 0 && (
          <div className="mb-6 pb-6 border-b border-[#84BFB9]">
            <p className="text-sm text-center text-[#025E73] mb-3">Acessar com conta salva:</p>
            <div className="space-y-2">
              {savedAccounts.map((acc, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleLogin(null, acc)}
                  className="w-full bg-[#F2F2EB] hover:bg-[#84BFB9] hover:text-white text-[#033859] border border-[#84BFB9] p-3 rounded-lg transition flex items-center justify-center gap-2 font-medium"
                >
                  <div className="w-6 h-6 bg-[#038C8C] rounded-full flex items-center justify-center text-xs text-white uppercase">{acc.charAt(0)}</div>
                  {acc}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <p className="text-sm text-center text-[#025E73] font-medium">Ou entre com uma nova conta</p>
          {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Usuário</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="Ex: everson" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#025E73] mb-1">Senha</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-[#84BFB9] rounded-lg outline-none focus:border-[#038C8C]" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-[#033859] hover:bg-[#025E73] text-white font-bold py-3 rounded-lg transition mt-4 flex justify-center items-center gap-2">
            <LogIn size={20} /> Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
