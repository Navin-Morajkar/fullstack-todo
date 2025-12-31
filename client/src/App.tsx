import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import AddTaskPage from './pages/AddTask';
import NotFound from './pages/NotFound';
import EditTaskPage from './pages/EditTask';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddTaskPage />} />
        <Route path="/edit/:id" element={<EditTaskPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;