import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserData {
  name: string;
  education: string;
  skills: string[];
  interests: string[];
  subjects: string[];
  goals: string;
  selectedCareer?: string;
  recommendations?: any[]; 
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  updateUserData: (updates: Partial<UserData>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  // Enhanced setUserData with logging
  const setUserDataWithLog = (data: UserData) => {
    console.log('🔄 UserContext: Setting new data:', data);
    console.log('📊 Recommendations count:', data.recommendations?.length || 0);
    if (data.recommendations && data.recommendations.length > 0) {
      console.log('🎯 Top recommendation:', data.recommendations[0].career_name);
    }
    setUserData(data);
  };

  const updateUserData = (updates: Partial<UserData>) => {
    console.log('🔄 UserContext: Updating data with:', updates);
    setUserData(prev => {
      const newData = prev ? { ...prev, ...updates } : { ...updates } as UserData;
      console.log('📦 UserContext: New state:', newData);
      return newData;
    });
  };

  return (
    <UserContext.Provider value={{ 
      userData, 
      setUserData: setUserDataWithLog, 
      updateUserData 
    }}>
      {children}
    </UserContext.Provider>
  );
};