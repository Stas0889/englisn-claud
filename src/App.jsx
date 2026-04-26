import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './AppContext.jsx';
import AppLayout from './components/AppLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Learn from './pages/Learn.jsx';
import Review from './pages/Review.jsx';
import Dictionary from './pages/Dictionary.jsx';
import Mistakes from './pages/Mistakes.jsx';
import Grammar from './pages/Grammar.jsx';
import Progress from './pages/Progress.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="learn" element={<Learn />} />
            <Route path="review" element={<Review />} />
            <Route path="dictionary" element={<Dictionary />} />
            <Route path="mistakes" element={<Mistakes />} />
            <Route path="grammar" element={<Grammar />} />
            <Route path="progress" element={<Progress />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
