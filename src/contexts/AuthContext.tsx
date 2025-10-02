// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export interface User {
  id: string;
  tipo: 'empleador' | 'trabajador';
  nombre: string;
  apellido: string;
  rut: string;
  direccion: string;
  correo: string;
  contraseña: string;
  foto: string;
  calificaciones: number;
  reseñas: number;
  zona: string;
  biografia?: string;
  // Campos específicos para empleador
  metodoPago?: string;
  // Campos específicos para trabajador
  especialidades?: string[];
  curriculum?: string;
  experiencias?: string[];
  certificados?: string[];
  banco?: string;
  areaTrabajo?: string;
  disponibilidadHoraria?: string;
}

interface AuthContextType {
  user: User | null;
  register: (userData: Omit<User, 'id' | 'calificaciones' | 'reseñas' | 'foto'>) => Promise<User>;
  login: (correo: string, contraseña: string) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Escucha cambios de sesión de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Registro
  const register = async (userData: Omit<User, 'id' | 'calificaciones' | 'reseñas' | 'foto'>): Promise<User> => {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, userData.correo, userData.contraseña);
    const uid = userCredential.user.uid;

    const newUser: User = {
      ...userData,
      id: uid,
      calificaciones: 0,
      reseñas: 0,
      foto: '/placeholder.svg',
      biografia: '',
      especialidades: userData.especialidades ?? [],
      experiencias: userData.experiencias ?? [],
      certificados: userData.certificados ?? [],
    };

    // Guardar en Firestore
    await setDoc(doc(db, "users", uid), newUser);
    setUser(newUser);

    return newUser;
  };

  // Login
  const login = async (correo: string, contraseña: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, correo, contraseña);
    const uid = userCredential.user.uid;

    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) throw new Error("Usuario no encontrado");

    const loggedUser = userDoc.data() as User;
    setUser(loggedUser);
    return loggedUser;
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Actualizar usuario
  const updateUser = async (userId: string, updates: Partial<User>) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, updates);

    if (user && user.id === userId) {
      setUser({ ...user, ...updates });
    }
  };

  const value: AuthContextType = {
    user,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
