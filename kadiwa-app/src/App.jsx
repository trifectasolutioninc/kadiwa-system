import logo from './logo.svg';
import './App.css';
import ConsumerMain from './Routes/Main';
import SignInPages from './pagesAuth/signIn';
import RegistrationPage from './pagesAuth/signUp';
import TermsAndConditions from './pagesAuth/TandC'
import RouteLink  from './Routes/routeLink'
import StoreLink from './Routes/StoreLink'
import POSLink from './Routes/POSLink';
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
        <Route path="/partner/*" element={<StoreLink  />} />
        <Route path="/pos/*" element={<POSLink  />} />
      </Routes>
    </Router>
  );
}

export default App;
