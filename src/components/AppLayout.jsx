import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';

export default function AppLayout() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        English Flow · MVP · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
