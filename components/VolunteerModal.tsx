
import React, { useState } from 'react';
import { X, UserPlus, Trash2, Loader2, User } from 'lucide-react';
import { addVolunteerToList, removeVolunteerFromList } from '../firebase';

interface Volunteer {
  id: string;
  name: string;
}

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteers: Volunteer[];
}

const VolunteerModal: React.FC<VolunteerModalProps> = ({ isOpen, onClose, volunteers }) => {
  const [newName, setNewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsAdding(true);
    try {
      await addVolunteerToList(newName.trim());
      setNewName('');
    } catch (error) {
      alert("Erro ao adicionar pessoa.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Deseja remover esta pessoa da lista?")) return;
    try {
      await removeVolunteerFromList(id);
    } catch (error) {
      alert("Erro ao remover pessoa.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-[#4a36d1] p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6" />
            <h2 className="text-xl font-bold">Cadastro de Pessoas</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleAdd} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Nome da pessoa..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
              />
            </div>
            <button
              disabled={isAdding || !newName.trim()}
              className="bg-[#4a36d1] text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-[#3b2ab8] transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2"
            >
              {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
              Add
            </button>
          </form>

          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {volunteers.length === 0 ? (
              <p className="text-center text-slate-400 py-8 italic">Nenhuma pessoa cadastrada.</p>
            ) : (
              volunteers.sort((a,b) => a.name.localeCompare(b.name)).map((v) => (
                <div key={v.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-slate-100 transition-colors">
                  <span className="font-semibold text-slate-700">{v.name}</span>
                  <button
                    onClick={() => handleRemove(v.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerModal;
