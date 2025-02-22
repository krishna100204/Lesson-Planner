import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { LessonPlanner } from './pages/LessonPlanner';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (email: string, password: string) => {
    if (email === 'demouser' && password === 'demopass') {
      setIsAuthenticated(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <LessonPlanner />
      )}
    </div>
  );
}

export default App;