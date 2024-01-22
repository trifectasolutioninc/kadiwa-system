import logo from './logo.svg';
import './App.css';
import ConsumerMain from './pagesConsumer/Main';
import SignInPages from './pagesAuth/signIn';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPages />} />
        <Route path="/main/*" element={<ConsumerMain />} />
      </Routes>
    </Router>
  );
}

export default App;
