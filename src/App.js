import './App.css';
import Header from './components/Header'
import React, {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {HashRouter as Router, Routes, Route, useLocation, useNavigate} from "react-router-dom";
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
import {LoginKioskocipa} from "./components/Kiosko/LoginKioskocipa";
import {LoginKioskodni} from "./components/Kiosko/LoginKioskodni";

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
  const [pacientes, setPacientes] = useState([]);
  const [dnis, setdnis] = useState([]);


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

    const cambiarModoPaciente = async (modo, idODNIPaciente, desde = undefined) => {
        let nuevoArraySP = JSON.parse(JSON.stringify(datosSiguientesPacientes));
        let nuevoArrayPD = JSON.parse(JSON.stringify(datosPacientesNoAtendidos));
        let idx = -1;
        console.log("modo:"+modo+"idODNIPaciente:"+idODNIPaciente);
        switch (modo) {
            case "atendido":
                nuevoArraySP.map((array, pos) => {
                    if (parseInt(array[1]) === parseInt(idODNIPaciente))
                        idx = pos;
                    return pos;
                });
                nuevoArraySP.splice(idx, 1);
                setDatosSiguientesPacientes(nuevoArraySP);
                break;
            case "registrado":
                if (desde === "tp" || desde === "pd") {
                    for (let array of nuevoArraySP) {
                        if (parseInt(array[1]) === parseInt(idODNIPaciente))
                            return array;
                    }

                    console.log("modo2:"+modo+"idODNIPaciente:"+idODNIPaciente);
                    console.log("array antes de cambiar"+ nuevoArraySP);
                    nuevoArraySP.push([generarIdentificadorUnico(), parseInt(idODNIPaciente)]);
                    setDatosSiguientesPacientes(nuevoArraySP);
                    console.log("array despues de cambiar"+ nuevoArraySP);
                    if (desde === "pd") {
                        nuevoArrayPD.map((idP, pos) => {
                            if (parseInt(idP) === parseInt(idODNIPaciente))
                                idx = pos;
                            return pos;
                        });
                        nuevoArrayPD.splice(idx, 1);
                        setPacientesNoAtendidos(nuevoArrayPD);
                    }
                } else if (desde === "kiosko") {
                    console.log("submit dentro");
                    pacientes.forEach((value, key) =>{
                        console.log("antes del if");
                        if(value[0] === idODNIPaciente){
                            console.log("dentro ya");
                            let ticketID = generarIdentificadorUnico();
                            nuevoArraySP.push([ticketID, parseInt(value[1])]);
                            setDatosSiguientesPacientes(nuevoArraySP);
                            console.log("arraysp:"+nuevoArraySP);
                            console.log("value1:"+value[1]);
                            /*await fetch('/paciente/ticektid'+parseInt(value[1]), {
                                method: 'PUT',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body :{
                                    id: "0",
                                    fecha: "",
                                    medico: "",
                                    paciente: "",
                                    razonConsulta: "",
                                    descartado: false,
                                    ticketId: ticketID
                                }
                            });*/
                            
                        }
                    })
                }
                break;
            case "descartado":
                await fetch('/consultas/'+idODNIPaciente, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                });
            
                nuevoArraySP.map((array, pos) => {
                    if (parseInt(array[1]) === parseInt(idODNIPaciente))
                        idx = pos;
                    return pos;
                });
                nuevoArraySP.splice(idx, 1);
                nuevoArrayPD.push(idODNIPaciente);
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

const getIDPacienteKiosko = (dni) =>{
    pacientes.forEach((value, key) =>{
        console.log("antes del if");
        if(value[0] === dni){
            return parseInt(value[1]);  
        }
    })
}

    useEffect(() => {
        const fetchData = async () => {
            const data = await (await fetch('http://localhost:8080/consultas')).json();
            return data;
        }
        const fetchDatad = async () => {
            const datad = await (await fetch('http://localhost:8080/paciente')).json();
            return datad;
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
                    arrayTLP[parseInt(data[i].id)] = data[i].paciente;
                    if (data[i].descartado) {
                        arrayPD.push(parseInt(data[i].id));
                    } else if ((data[i].ticketId !== null) && (data[i].ticketId !== undefined) && (data[i].ticketId !== "")) {
                        arraySP.push([data[i].ticketId, parseInt(data[i].id)]);
                    }
                }

                setDatosTodosLosPacientes(arrayTLP);
                setDatosSiguientesPacientes(arraySP);
                setPacientesNoAtendidos(arrayPD);
            });
        fetchDatad()
            .catch(console.error)
            .then(datad => {
                let arraydni = [];
                let arraypacientes = [];
                console.log("los dnis del back"+datad);
                // Clasificamos los pacientes en función de sus atributos
                for (let i in datad) {
                    arraypacientes.push([datad[i].dni,datad[i].citas[0]]);
                    arraydni.push(datad[i].dni);
                    console.log("algoooooo  "+  arraydni);
                    console.log("algoooooo  "+  arraypacientes);
                }
                setdnis(arraydni);
                setPacientes(arraypacientes);
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
                <Route path="/paciente/login/dni" element={<LoginKioskodni useQuery={useQuery} pacientes={pacientes} datosTodosLosPacientes={datosTodosLosPacientes} cambiarModoPaciente={cambiarModoPaciente} datosSiguientesPacientes={datosSiguientesPacientes}/>} />
                <Route path="/paciente/login/cipa" element={<LoginKioskocipa useQuery={useQuery}/>}  />
                <Route path="/paciente/ticket/:id" element={<PacienteRegistradoKiosko useQuery={useQuery} datosSiguientesPacientes={datosSiguientesPacientes} getIDPacienteKiosko = {getIDPacienteKiosko}/>}  />

                <Route path="/sala_de_espera" element={<ListaSalaDeEspera />} />

                <Route path="/contacto" element={<><Header/><Contacto /><Footer/></>} />
                <Route path="/" element={<LoginKiosko/>} />
            </Routes>
        </div>
      </Router>
  );
}

export default App;
