import logo from './logo.svg';
import './App.css';
import ConsumerMain from './pagesConsumer/Main';
import SignInPages from './pagesAuth/signIn';
import RegistrationPage from './pagesAuth/signUp';
import TermsAndConditions from './pagesAuth/TandC'
import RouteLink  from './pagesAuth/routeLink'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPages />} />
        <Route path="/signup" element={<RegistrationPage />} />
        <Route path="/tandc" element={<TermsAndConditions />} />
        <Route path="/main/*" element={<ConsumerMain />} />
        <Route path="/route/*" element={<RouteLink  />} />
      </Routes>
    </Router>
  );
}

export default App;
