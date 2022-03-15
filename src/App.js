import './App.css';
import Header from './components/Header'
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {ListaSiguientesPacientesMedico} from "./components/ConsultaMedico/ListaSiguientesPacientesMedico";
import {ListaCompletaPacientesMedico} from "./components/ConsultaMedico/ListaCompletaPacientesMedico";
import {ListaPacientesNoAtendidosMedico} from "./components/ConsultaMedico/ListaPacientesNoAtendidosMedico";
import {Home} from "./components/Home";
import {Contacto} from "./components/Contacto";
import {Footer} from "./components/Footer";
import {LoginMedico} from "./components/ConsultaMedico/LoginMedico";
import {LoginKiosko} from "./components/Kiosko/LoginKiosko";
import {ListaSalaDeEspera} from "./components/SalaDeEspera/ListaSalaDeEspera";
import {PacienteRegistradoKiosko} from "./components/Kiosko/PacienteRegistradoKiosko";

function App() {
  return (
      <Router>
        <div className="App">
            <Routes>
                <Route path="/medico/lista_siguientes_pacientes" element={<><Header/><ListaSiguientesPacientesMedico /><Footer/></>} />
                <Route path="/medico/lista_completa_pacientes" element={<><Header/><ListaCompletaPacientesMedico /><Footer/></>} />
                <Route path="/medico/lista_pacientes_descartados" element={<><Header/><ListaPacientesNoAtendidosMedico /><Footer/></>} />
                <Route path="/medico/login" element={<><Header/><LoginMedico /><Footer/></>} />

                <Route path="/paciente/login" element={<LoginKiosko />} />
                <Route path="/paciente/ticket" element={<PacienteRegistradoKiosko />} />

                <Route path="/sala_de_espera" element={<ListaSalaDeEspera />} />

                <Route path="/contacto" element={<><Header/><Contacto /><Footer/></>} />
                <Route path="/" element={<><Header/><Home /><Footer/></>} />
            </Routes>
        </div>
      </Router>
  );
}

export default App;
