
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc, addDoc, collection, deleteDoc } from "firebase/firestore";

// Configuração oficial do Firebase fornecida pelo usuário
const firebaseConfig = {
  apiKey: "AIzaSyAcri6ciVl9KYrRclvEOnaZmClJbM7cMv4",
  authDomain: "escala-2026.firebaseapp.com",
  projectId: "escala-2026",
  storageBucket: "escala-2026.firebasestorage.app",
  messagingSenderId: "847745972912",
  appId: "1:847745972912:web:2e888b8b4478f0ad0e9975"
};

// Singleton para inicialização do Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

export const SLOTS_COLLECTION = "volunteer_slots_2026";
export const VOLUNTEERS_COLLECTION = "volunteers_list";

/**
 * Salva um voluntário em um slot específico.
 */
export const saveSlot = async (slotId: string, data: { volunteerName: string, date: string, shift: string, slotIndex: number }) => {
  try {
    const docRef = doc(db, SLOTS_COLLECTION, slotId);
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error("Erro crítico ao salvar no Firestore:", error);
    throw error;
  }
};

/**
 * Adiciona uma nova pessoa à lista de voluntários disponíveis.
 */
export const addVolunteerToList = async (name: string) => {
  try {
    const colRef = collection(db, VOLUNTEERS_COLLECTION);
    await addDoc(colRef, {
      name,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Erro ao adicionar voluntário:", error);
    throw error;
  }
};

/**
 * Remove uma pessoa da lista de voluntários.
 */
export const removeVolunteerFromList = async (id: string) => {
  try {
    const docRef = doc(db, VOLUNTEERS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Erro ao remover voluntário:", error);
    throw error;
  }
};
