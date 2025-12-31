import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import AddTaskPage from './AddTaskPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddTaskPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;