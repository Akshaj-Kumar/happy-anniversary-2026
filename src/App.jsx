import React, { useState } from 'react';
import PasswordScreen from './components/PasswordScreen';
import Home from './pages/Home';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFF6E9] text-[#2D1810] selection:bg-[#B5122A] selection:text-white">
      {!isUnlocked ? (
        <PasswordScreen onUnlock={() => setIsUnlocked(true)} />
      ) : (
        <Home onLock={() => setIsUnlocked(false)} />
      )}
    </div>
  );
}
