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
import {LoginKioskocipa} from "./components/Kiosko/LoginKioskocipa";
import {LoginKioskodni} from "./components/Kiosko/LoginKioskodni";
import {HeaderHome} from "./components/HeaderHome";
import {HomePreLogin} from "./components/HomePreLogin";
import {HeaderHomePreLogin} from "./components/HeaderHomePreLogin";
//Datos
import {data as dataHistoriaClinica} from './data/historiaClinica';

function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function App() {
  const [datosTodosLosPacientes, setDatosTodosLosPacientes] = useState([]);
  const [datosSiguientesPacientes, setDatosSiguientesPacientes] = useState([]);
  const [datosPacientesLlamados, setDatosPacientesLlamados] = useState([]);
  const [datosPacientesNoAtendidos, setPacientesNoAtendidos] = useState([]);
  const [datosHistoriaClinica] = useState(JSON.parse(JSON.stringify(dataHistoriaClinica)));
  const [datosDescargados, setDatosDescargados] = useState(false);
  const [doc, setDoc] = useState("");


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
            for (let paciente of datosSiguientesPacientes) {
                if (paciente.ticketID === identificador)
                    identificadorRepetido = true;
            }
        }
        return identificador;
    };

    const getTicketIDPaciente = (idPaciente) => {
        for (let paciente of datosPacientesNoAtendidos) {
            if (parseInt(paciente.id) === parseInt(idPaciente)) {
                return paciente.ticketID;
            }
        }
        for (let paciente of datosSiguientesPacientes) {
            if (parseInt(paciente.id) === parseInt(idPaciente)) {
                return paciente.ticketID;
            }
        }
    }

    const cambiarModoPaciente = async (modo, id_o_DNI_o_CIPA_paciente, desde = undefined) => {
        let nuevoArraySP = JSON.parse(JSON.stringify(datosSiguientesPacientes));
        let nuevoArrayPL = JSON.parse(JSON.stringify(datosPacientesLlamados));
        let nuevoArrayPD = JSON.parse(JSON.stringify(datosPacientesNoAtendidos));
        let idx = -1;
        let idPaciente = -1;
        switch (modo) {
            case "atendido":
                idPaciente = id_o_DNI_o_CIPA_paciente;
                nuevoArraySP.map((paciente, pos) => {
                    if (parseInt(paciente.id) === parseInt(idPaciente))
                        idx = pos;
                    return pos;
                });
                nuevoArraySP.splice(idx, 1);
                setDatosSiguientesPacientes(nuevoArraySP);
                //Marcamos el paciente como descartado:
                await fetch('/consultas/'+idPaciente, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                //Marcamos el paciente como llamado:
                await fetch('/consultas/llamada/'+ idPaciente, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                });
                //Quitamos el ticketID del paciente:
                let consulta = await (await fetch('/consultas/'+idPaciente)).json();
                consulta.ticketId = "";
                await fetch('/paciente/ticketid/'+idPaciente, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(consulta)
                });
                break;
            case "registrado":
                if (desde === "tp" || desde === "pd") {
                    idPaciente = id_o_DNI_o_CIPA_paciente;
                    for (let paciente of nuevoArraySP) {
                        // Si el paciente ya está registrado, no se hace nada más
                        if (parseInt(paciente.id) === parseInt(idPaciente))
                            return;
                    }
                    // Si el paciente no tenía un ticketID guardado, se le asigna uno nuevo
                    let ticketID = (desde === 'tp' && !getTicketIDPaciente(idPaciente)) ? generarIdentificadorUnico() : getTicketIDPaciente(idPaciente);
                    nuevoArraySP.push({ticketID: ticketID, id: idPaciente});
                    setDatosSiguientesPacientes(nuevoArraySP);
                } else if ((desde === "kioskoDNI") || (desde === "kioskoCIPA")) {
                    let DNIoCIPAPaciente = id_o_DNI_o_CIPA_paciente;
                    for (let i in datosTodosLosPacientes) {
                        if ((datosTodosLosPacientes[i].dni === DNIoCIPAPaciente) || (parseInt(datosTodosLosPacientes[i].cipa) === parseInt(DNIoCIPAPaciente))) {
                            idPaciente = i;
                            for (let paciente of nuevoArraySP) {
                                // Si el paciente ya está registrado, no se hace nada más
                                if (parseInt(paciente.id) === parseInt(idPaciente))
                                    return;
                            }
                            let ticketID
                            if (!getTicketIDPaciente(i)) {
                                // El paciente no tiene ticketID. Se le asigna uno nuevo
                                ticketID = generarIdentificadorUnico();
                                // Subimos el nuevo ticketID al BackEnd
                                let consulta = await (await fetch('/consultas/'+idPaciente)).json();
                                consulta.ticketId = ticketID;
                                await fetch('/paciente/ticketid/'+idPaciente, {
                                    method: 'PUT',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(consulta)
                                });
                            } else {
                                // El paciente ya tenía ticketID. Se usa ese.
                                ticketID = getTicketIDPaciente(idPaciente);
                            }
                            nuevoArraySP.push({ticketID: ticketID, id: idPaciente});
                            setDatosSiguientesPacientes(nuevoArraySP);
                            break;
                        }
                    }
                }
                // Si se ha registrado un paciente descartado, ya no debe estar en la lista de pacientes descartados
                nuevoArrayPD.map((paciente, pos) => {
                    if (parseInt(paciente.id) === parseInt(idPaciente))
                        idx = pos;
                    return pos;
                });
                if (idx !== -1) {
                    nuevoArrayPD.splice(idx, 1);
                    setPacientesNoAtendidos(nuevoArrayPD);

                }
                if (idPaciente !== -1) {
                    // Registramos el paciente en el backend
                    await fetch('/consultas/'+idPaciente, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                }
                break;
            case "descartado":
                idPaciente = id_o_DNI_o_CIPA_paciente;
                let ticketID;
                nuevoArraySP.map((paciente, pos) => {
                    if (parseInt(paciente.id) === parseInt(idPaciente)) {
                        idx = pos;
                        ticketID = paciente.ticketID;
                    }
                    return pos;
                });
                if (idx !== -1) {
                    nuevoArraySP.splice(idx, 1);
                    nuevoArrayPD.push({ticketID: ticketID || generarIdentificadorUnico(), id: idPaciente});
                    setDatosSiguientesPacientes(nuevoArraySP);
                    setPacientesNoAtendidos(nuevoArrayPD);
                    // Descartamos el paciente en el backend
                    await fetch('/consultas/'+idPaciente, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                    });
                }
                break;
            case "llamado":
                idPaciente = id_o_DNI_o_CIPA_paciente;
                let ticketID2;
                nuevoArraySP.map((paciente, pos) => {
                    if (parseInt(paciente.id) === parseInt(idPaciente)) {
                        idx = pos;
                        ticketID2 = paciente.ticketID;
                    }
                    return pos;
                });
                if (idx !== -1) {
                    nuevoArraySP.splice(idx, 1);
                    nuevoArrayPL.push({ticketID: ticketID2 || generarIdentificadorUnico(), id: idPaciente});
                    setDatosSiguientesPacientes(nuevoArraySP);
                    setDatosPacientesLlamados(nuevoArrayPL);
                    console.log(nuevoArrayPL);
                    //Descartamos el paciente en el backend
                    await fetch('/consultas/llamada/'+ idPaciente, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                    });
                }
                break; 
            default:
                break;
        }
    }

    const ordenarAlfabeticamente = (array, modo = "nombres") => {
        if (modo === "nombres") {
            return array.sort(function(a, b){
                if (a.nombre < b.nombre) { return -1; }
                if (a.nombre > b.nombre) { return 1; }
                return 0;
            })
        } else if (modo === "ticketIDs") {
            return array.sort(function(a, b){
                if (datosTodosLosPacientes[a.id].nombre < datosTodosLosPacientes[b.id].nombre) { return -1; }
                if (datosTodosLosPacientes[a.id].nombre > datosTodosLosPacientes[b.id].nombre) { return 1; }
                return 0;
            })
        }
    };

    const getIDSiguientePaciente = (idPacienteActual) => {
        let arraySP = JSON.parse(JSON.stringify(datosSiguientesPacientes));
        let posActual = -1;
        for (let i in arraySP) {
            if (parseInt(arraySP[i].id) === parseInt(idPacienteActual)) {
                posActual = parseInt(i);
                break;
            }
        }
        if (posActual !== -1) // El siguiente paciente no puede ser el mismo
            arraySP.splice(posActual, 1);
        return (arraySP[0]? arraySP[0].id : -1);
    };

    const getIDPacienteKiosko = (dnioCIPA) =>{
        for (let i in datosTodosLosPacientes) {
            if ((datosTodosLosPacientes[i].dni === dnioCIPA) || (parseInt(datosTodosLosPacientes[i].cipa) === parseInt(dnioCIPA))) {
                return parseInt(i);
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await (await fetch('/consultas')).json();
            return data;
        }
        const fetchDatad = async () => {
            const datad = await (await fetch('/paciente')).json();
            return datad;
        }

        //Recogemos los datos del BackEnd de MedCon
        fetchDatad()
            .catch(console.error)
            .then(datad => {
                let arrayTLP = [];
                // Guardamos los pacientes en la lista general de pacientes.
                for (let i in datad) {
                    arrayTLP.push({cipa: datad[i].cipa, dni: datad[i].dni, nombre: datad[i].nombre, citas: datad[i].citas})
                }
                setDatosTodosLosPacientes(arrayTLP);
            });
        fetchData()
            .catch(console.error)
            .then(data => {
                let arraySP = [];
                let arrayPD = [];
                let arrayPL = [];

                // Clasificamos los pacientes en función de sus atributos
                for (let i in data) {
                    if ((data[i].ticketId !== null) && (data[i].ticketId !== undefined) && (data[i].ticketId !== "") && data[i].descartado) {
                        arrayPD.push({ticketID: data[i].ticketId , id: parseInt(data[i].id)});
                    } else if ((data[i].ticketId !== null) && (data[i].ticketId !== undefined) && (data[i].ticketId !== "")) {
                        arraySP.push({ticketID: data[i].ticketId , id: parseInt(data[i].id)});
                    } if (data[i].llamado) {
                        arrayPL.push({ticketID: data[i].ticketId , id: parseInt(data[i].id)});
                    }
                }
                setDoc(data[0].medico);
                setDatosSiguientesPacientes(arraySP);
                setPacientesNoAtendidos(arrayPD);
                setDatosPacientesLlamados(arrayPL);
            });
        setTimeout(() => {
            setDatosDescargados(true);
        }, 100);
    }, []);

    return (
      <Router>
          {datosDescargados ? <div className="App">
            <Routes>
                <Route path="/medico/lista_siguientes_pacientes" element={datosDescargados? <><Header/><ListaSiguientesPacientesMedico datosTodosLosPacientes={datosTodosLosPacientes} datosSiguientesPacientes={datosSiguientesPacientes} setDatosSiguientesPacientes={setDatosSiguientesPacientes} cambiarModoPaciente={cambiarModoPaciente}/><Footer/></> : <></>} />
                <Route path="/medico/lista_completa_pacientes" element={datosDescargados? <><Header/><ListaCompletaPacientesMedico datosTodosLosPacientes={datosTodosLosPacientes} ordenarAlfabeticamente={ordenarAlfabeticamente} cambiarModoPaciente={cambiarModoPaciente}/><Footer/></> : <></>} />
                <Route path="/medico/lista_pacientes_descartados" element={datosDescargados? <><Header/><ListaPacientesNoAtendidosMedico datosTodosLosPacientes={datosTodosLosPacientes} datosPacientesNoAtendidos={datosPacientesNoAtendidos} ordenarAlfabeticamente={ordenarAlfabeticamente} cambiarModoPaciente={cambiarModoPaciente}/><Footer/></> : <></>} />
                <Route path="/medico/login" element={datosDescargados? <><HeaderHomePreLogin/><LoginMedico /><Footer/></> : <></>} />

                <Route path="/medico/detalles_paciente/:id" element={datosDescargados? <><Header/><DetallesPaciente useQuery={useQuery} datosHistoriaClinica={datosHistoriaClinica} datosTodosLosPacientes={datosTodosLosPacientes} cambiarModoPaciente={cambiarModoPaciente} getIDSiguientePaciente={getIDSiguientePaciente}/><Footer/></> : <></>} />
                <Route path="/medico/nueva_consulta_paciente/:id" element={datosDescargados? <><Header/><NuevaConsulta useQuery={useQuery} datosTodosLosPacientes={datosTodosLosPacientes}/><Footer/></> : <></>} />
                <Route path="/medico/recetas_paciente/:id" element={datosDescargados? <><Header/><RecetasPaciente useQuery={useQuery} datosTodosLosPacientes={datosTodosLosPacientes}/><Footer/></> : <></>} />
                <Route path="/medico/pruebas_paciente/:id" element={datosDescargados? <><Header/><PruebasMedicasPaciente useQuery={useQuery} datosTodosLosPacientes={datosTodosLosPacientes}/><Footer/></> : <></>} />

                <Route path="/paciente/login" element={datosDescargados? <><LoginKiosko /><Footer/></> : <></>} />
                <Route path="/paciente/login/dni" element={datosDescargados? <><LoginKioskodni cambiarModoPaciente={cambiarModoPaciente} getIDPacienteKiosko={getIDPacienteKiosko}/><Footer/></> : <></>} />
                <Route path="/paciente/login/cipa" element={datosDescargados? <><LoginKioskocipa cambiarModoPaciente={cambiarModoPaciente} getIDPacienteKiosko={getIDPacienteKiosko}/><Footer/></> : <></>}  />
                <Route path="/paciente/ticket/:id" element={datosDescargados? <><PacienteRegistradoKiosko/><Footer /></> : <></>}  />

                <Route path="/sala_de_espera" element={datosDescargados? <ListaSalaDeEspera datosPacientesLlamados={datosPacientesLlamados}/> : <></>} />

                <Route path="/contacto" element={datosDescargados? <><Header/><Contacto /><Footer/></> : <></>} />
                <Route path="/Home" element={<><HeaderHome/><Home cambiarModoPaciente={cambiarModoPaciente} getIDSiguientePaciente={getIDSiguientePaciente} doc={doc}/><Footer/></>} ></Route>
                <Route path="/" element={<><HeaderHomePreLogin/><HomePreLogin /><Footer/></>} />
            </Routes>
          </div> : <div></div>}
      </Router>
  );
}

export default App;
