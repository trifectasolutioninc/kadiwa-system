

import RouteLink  from './Routes/routeLink'
import StoreLink from './Routes/StoreLink'
import POSLink from './Routes/POSLink';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestLink from './Routes/TestLink';
import InfoRoute from './services/routes/information.route';
import AuthRoute from './services/routes/auth.route';
import MainRoute from './services/routes/main.route';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main/*" element={<MainRoute />} />
        <Route path="/route/*" element={<RouteLink  />} />
        <Route path="/partner/*" element={<StoreLink  />} />
        <Route path="/pos/*" element={<POSLink  />} />
        <Route path="/test/*" element={<TestLink  />} />
        <Route path="/info/*" element={<InfoRoute  />} />
        <Route path='/*' element={<AuthRoute/>}/>
      </Routes>
    </Router>
  );
}

export default App;
