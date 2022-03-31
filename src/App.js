import './App.css';
import Header from './components/Header'
import React, {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {HashRouter as Router, Routes, Route, useLocation} from "react-router-dom";
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
import {DetallesPaciente} from "./components/ConsultaMedico/DetallesPaciente";
import {RecetasPaciente} from "./components/ConsultaMedico/RecetasPaciente";
import {PruebasMedicasPaciente} from "./components/ConsultaMedico/PruebasMedicasPaciente";
import {NuevaConsulta} from "./components/ConsultaMedico/NuevaConsulta";

//Datos
import {data as dataHistoriaClinica} from './data/historiaClinica';

function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function App() {
  const [datosTodosLosPacientes, setDatosTodosLosPacientes] = useState([]);
  const [datosSiguientesPacientes, setDatosSiguientesPacientes] = useState([]);
  const [datosPacientesNoAtendidos, setPacientesNoAtendidos] = useState([]);
  const [datosHistoriaClinica] = useState(JSON.parse(JSON.stringify(dataHistoriaClinica)));

    const generarIdentificadorUnico = () => {
        const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
            'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        let identificador = "";
        let identificadorRepetido = true;
        while (identificadorRepetido) {
            let random = Math.round(Math.random() * 100);
            let letra = letras[random%letras.length];
            identificador = letra+((random < 10) ? '0'+parseInt(random) : parseInt(random));
            identificadorRepetido = false;
            for (let array of datosSiguientesPacientes) {
                if (array[0] === identificador)
                    identificadorRepetido = true;
            }
        }
        return identificador;
    };

    const cambiarModoPaciente = (modo, idPaciente, desde = undefined) => {
        let nuevoArraySP = JSON.parse(JSON.stringify(datosSiguientesPacientes));
        let nuevoArrayPD = JSON.parse(JSON.stringify(datosPacientesNoAtendidos));
        let idx = -1;
        switch (modo) {
            case "atendido":
                nuevoArraySP.map((array, pos) => {
                    if (parseInt(array[1]) === parseInt(idPaciente))
                        idx = pos;
                    return pos;
                });
                nuevoArraySP.splice(idx, 1);
                setDatosSiguientesPacientes(nuevoArraySP);
                break;
            case "registrado":
                if (desde === "tp" || desde === "pd") {
                    for (let array of nuevoArraySP) {
                        if (parseInt(array[1]) === parseInt(idPaciente))
                            return array;
                    }
                    nuevoArraySP.push([generarIdentificadorUnico(), parseInt(idPaciente)]);
                    setDatosSiguientesPacientes(nuevoArraySP);
                    if (desde === "pd") {
                        nuevoArrayPD.map((idP, pos) => {
                            if (parseInt(idP) === parseInt(idPaciente))
                                idx = pos;
                            return pos;
                        });
                        nuevoArrayPD.splice(idx, 1);
                        setPacientesNoAtendidos(nuevoArrayPD);
                    }
                }
                break;
            case "descartado":
                nuevoArraySP.map((array, pos) => {
                    if (parseInt(array[1]) === parseInt(idPaciente))
                        idx = pos;
                    return pos;
                });
                nuevoArraySP.splice(idx, 1);
                nuevoArrayPD.push(idPaciente);
                setDatosSiguientesPacientes(nuevoArraySP);
                setPacientesNoAtendidos(nuevoArrayPD);
                break;
            default:
                break;
        }
    }

    const ordenarAlfabeticamente = (array, modo = "nombres") => {
        if (modo === "nombres") {
            return array.sort(function(a, b){
                if(a < b) { return -1; }
                if(a > b) { return 1; }
                return 0;
            })
        } else if (modo === "ids") {
            return array.sort(function(a, b){
                if(datosTodosLosPacientes[a] < datosTodosLosPacientes[b]) { return -1; }
                if(datosTodosLosPacientes[a] > datosTodosLosPacientes[b]) { return 1; }
                return 0;
            })
        }
    };

    const getIDSiguientePaciente = (idPacienteActual) => {
        let arraySP = JSON.parse(JSON.stringify(datosSiguientesPacientes));
        let posActual = -1;
        for (let i in arraySP) {
            if (arraySP[i][1] === idPacienteActual) {
                posActual = parseInt(i);
                break;
            }
        }
        if (posActual !== -1) // El siguiente paciente no puede ser el mismo
            arraySP.splice(posActual, 1);
        return (arraySP[0] === undefined ? -1 : arraySP[0][1]);
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await (await fetch('http://localhost:8080/consultas')).json();
            return data;
        }

        //Recogemos los datos del BackEnd de MedCon
        fetchData()
            .catch(console.error)
            .then(data => {
                let arraySP = [];
                let arrayPD = [];
                let arrayTLP = [];

                // Clasificamos los pacientes en función de sus atributos
                for (let i in data) {
                    arrayTLP.push(data[i].paciente);
                    if ((data[i].ticketId !== null) && (data[i].ticketId !== undefined) && (data[i].ticketId !== "") && data[i].descartado) {
                        arrayPD.push(i);
                    } else if ((data[i].ticketId !== null) && (data[i].ticketId !== undefined) && (data[i].ticketId !== "")) {
                        arraySP.push([data[i].ticketId, i]);
                    }
                }

                setDatosTodosLosPacientes(arrayTLP);
                setDatosSiguientesPacientes(arraySP);
                setPacientesNoAtendidos(arrayPD);
            });
    }, []);

    return (
      <Router>
        <div className="App">
            <Routes>
                <Route path="/medico/lista_siguientes_pacientes" element={<><Header/><ListaSiguientesPacientesMedico datosTodosLosPacientes={datosTodosLosPacientes} datosSiguientesPacientes={datosSiguientesPacientes} setDatosSiguientesPacientes={setDatosSiguientesPacientes} cambiarModoPaciente={cambiarModoPaciente}/><Footer/></>} />
                <Route path="/medico/lista_completa_pacientes" element={<><Header/><ListaCompletaPacientesMedico datosTodosLosPacientes={datosTodosLosPacientes} ordenarAlfabeticamente={ordenarAlfabeticamente} cambiarModoPaciente={cambiarModoPaciente}/><Footer/></>} />
                <Route path="/medico/lista_pacientes_descartados" element={<><Header/><ListaPacientesNoAtendidosMedico datosTodosLosPacientes={datosTodosLosPacientes} datosPacientesNoAtendidos={datosPacientesNoAtendidos} ordenarAlfabeticamente={ordenarAlfabeticamente} cambiarModoPaciente={cambiarModoPaciente}/><Footer/></>} />
                <Route path="/medico/login" element={<><Header/><LoginMedico /><Footer/></>} />

                <Route path="/medico/detalles_paciente/:id" element={<><Header/><DetallesPaciente useQuery={useQuery} datosHistoriaClinica={datosHistoriaClinica} datosTodosLosPacientes={datosTodosLosPacientes} datosSiguientesPacientes={datosSiguientesPacientes} cambiarModoPaciente={cambiarModoPaciente} getIDSiguientePaciente={getIDSiguientePaciente}/><Footer/></>} />
                <Route path="/medico/nueva_consulta_paciente/:id" element={<><Header/><NuevaConsulta useQuery={useQuery} datosTodosLosPacientes={datosTodosLosPacientes}/><Footer/></>} />
                <Route path="/medico/recetas_paciente/:id" element={<><Header/><RecetasPaciente useQuery={useQuery} datosTodosLosPacientes={datosTodosLosPacientes}/><Footer/></>} />
                <Route path="/medico/pruebas_paciente/:id" element={<><Header/><PruebasMedicasPaciente useQuery={useQuery} datosTodosLosPacientes={datosTodosLosPacientes}/><Footer/></>} />

                <Route path="/paciente/login" element={<LoginKiosko />} />
                <Route path="/paciente/ticket" element={<PacienteRegistradoKiosko identificador={generarIdentificadorUnico()}/>} />

                <Route path="/sala_de_espera" element={<ListaSalaDeEspera />} />

                <Route path="/contacto" element={<><Header/><Contacto /><Footer/></>} />
                <Route path="/" element={<><Header/><Home /><Footer/></>} />
            </Routes>
        </div>
      </Router>
  );
}

export default App;
