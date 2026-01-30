
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

// Configuração oficial do Firebase fornecida pelo usuário
const firebaseConfig = {
  apiKey: "AIzaSyAcri6ciVl9KYrRclvEOnaZmClJbM7cMv4",
  authDomain: "escala-2026.firebaseapp.com",
  projectId: "escala-2026",
  storageBucket: "escala-2026.firebasestorage.app",
  messagingSenderId: "847745972912",
  appId: "1:847745972912:web:2e888b8b4478f0ad0e9975"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const SLOTS_COLLECTION = "volunteer_slots_2026";

// Helpers para interações com o Firestore
export const saveSlot = async (slotId: string, data: { volunteerName: string, date: string, shift: string, slotIndex: number }) => {
  const docRef = doc(db, SLOTS_COLLECTION, slotId);
  await setDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  }, { merge: true });
};
