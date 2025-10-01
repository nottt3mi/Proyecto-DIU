import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  // Nuevos campos para trabajador
  areaTrabajo?: string; // Jardinería, Reparaciones, Limpieza, etc.
  disponibilidadHoraria?: string; // Texto libre o rango
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (userData: User) => void;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'calificaciones' | 'reseñas' | 'foto'>) => User;
  verifyCredentials: (correo: string, contraseña: string, tipo: 'empleador' | 'trabajador') => User | null;
  updateUser: (userId: string, updates: Partial<User>) => void;
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
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Cargar usuarios desde localStorage
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (error) {
        console.error('Error parsing saved users data:', error);
        localStorage.removeItem('users');
      }
    }

    // Cargar usuario actual desde localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const register = (userData: Omit<User, 'id' | 'calificaciones' | 'reseñas' | 'foto'>): User => {
    const newUser: User = {
      ...userData,
      id: generateId(),
      calificaciones: 0,
      reseñas: 0,
      foto: '/placeholder.svg',
      biografia: '',
      // Defaults para trabajador
      especialidades: userData.especialidades ?? [],
      experiencias: userData.experiencias ?? [],
      certificados: userData.certificados ?? [],
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    return newUser;
  };

  const verifyCredentials = (correo: string, contraseña: string, tipo: 'empleador' | 'trabajador'): User | null => {
    const foundUser = users.find(u => 
      u.correo === correo && 
      u.contraseña === contraseña && 
      u.tipo === tipo
    );
    return foundUser || null;
  };

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, ...updates } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Si es el usuario actual, actualizar también el estado
    if (user && user.id === userId) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    users,
    login,
    logout,
    register,
    verifyCredentials,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};