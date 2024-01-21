import logo from './logo.svg';
import './App.css';
import NavBttnAppHome from './Components/NavBttnAppHome/NavBttnAppHome';
import HomeConsumer from './pagesConsumer/Home';
import StoreConsumer from './pagesConsumer/Store';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (

      <Router>
        
        <Routes>
          <Route path="/" exact element={<HomeConsumer/>} />
          <Route path="/store" exact element={<StoreConsumer/>} />

        </Routes>
        < NavBttnAppHome />
     
      </Router>


  );
}

export default App;
