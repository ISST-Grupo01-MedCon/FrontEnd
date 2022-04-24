import './App.css';
import Header from './components/Header'
import React, {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
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

    /**
     * Función similar al fetch que simplifica las llamadas al BackEnd
     * @param URL la dirección a la que se hace la petición
     * @param metodo el método HTTP que se usará en la petición. Puede ser POST, PUT o GET. Por defecto es GET
     * @param body parámetro opcional que si está definido lleva el objeto que se enviará a la dirección especificada
     * @returns {object} objeto recibido de la respuesta a la petición HTML efectuada
     */
    const peticionHTML = async (URL, metodo = 'GET', body = undefined) => {
        if ((metodo !== 'POST') && (metodo !== 'PUT') && (metodo !== 'GET')) {
            console.log("ERROR. El método "+metodo+" especificado para hacer una petición a la dirección "+URL+" no es válido.");
            return
        } else if ((URL === undefined) || (URL === null)) {
            console.log("ERROR. La URL especificada para hacer una petición "+metodo+" no puede ser null o undefined.");
            return
        }
        if (body) {
            let respuestaFetch = await fetch(URL, {
                method: metodo,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (respuestaFetch)
                return await respuestaFetch.json();
        } else {
            let respuestaFetch = await fetch(URL, {
                method: metodo,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (respuestaFetch)
                return await respuestaFetch.json();
        }
    };

    /**
     * Función que genera un identificador (ticketID) único teniendo en cuenta los que ya existen
     * @returns {string} el ticketID generado
     */
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

    /**
     * Devuelve el ticketID del paciente cuyo ID coincide con el idPaciente especificado
     * @param idPaciente el ID del paciente buscado
     * @returns {string} el ticketID si se encuentra
     */
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

    /**
     * Cambia a los pacientes de lista y estado en local y en el BackEnd
     * @param modo el nuevo modo del paciente
     * @param id_o_DNI_o_CIPA_paciente el ID del paciente que se quiere modificar, su DNI o su CIPA para identificarlo
     * @param desde parámetro opcional que se usa cuando se registran los pacientes desde una lista concreta y se quiere
     * tratar de forma distinta
     */
    const cambiarModoPaciente = async (modo, id_o_DNI_o_CIPA_paciente, desde = undefined) => {
        let nuevoArraySP = JSON.parse(JSON.stringify(datosSiguientesPacientes));
        let nuevoArrayPD = JSON.parse(JSON.stringify(datosPacientesNoAtendidos));
        let idPaciente = -1;
        switch (modo) {
            /**
             * Se marca un paciente como atendido cuando se ha marcado así manualmente desde la pantalla de siguientes
             * pacientes o si se establece automáticamente con el botón de llamar al siguientes pacientente desde la
             * lista de siguientes pacientes o al darle al botón de siguiente paciente en la pantalla de detalles de un
             * paciente
             */
            case "atendido":
                idPaciente = id_o_DNI_o_CIPA_paciente;
                // Se busca el paciente cuyo ID es el que se ha pasado como parámetro
                for (let pos in datosSiguientesPacientes) {
                    let paciente = datosSiguientesPacientes[pos];
                    if (parseInt(paciente.id) === parseInt(idPaciente)) {
                        // Se quita el paciente de la lista de siguientes pacientes
                        nuevoArraySP.splice(pos, 1);
                        // Se guardan los cambios
                        setDatosSiguientesPacientes(nuevoArraySP);

                        if (desde === "sp") {
                            // Si hemos marcado un paciente como atendido con el botón a la derecha de un paciente
                            // no nos interesa llamarlo, por lo que le quitamos su ticketID para que no aparezca en
                            // ninguna lista de pacientes salvo en la de todos los pacientes
                            // Quitamos el ticketID del paciente en el BackEnd:
                            let consulta = await peticionHTML('/consultas/'+idPaciente);
                            consulta.ticketId = "";
                            await peticionHTML('/paciente/ticketid/'+idPaciente, 'PUT', consulta);
                        }

                        break;
                    }
                }
                break;
            /**
             * Se marca un paciente como registrado cuando se acaba de registrar personalmente en el kiosko o cuando
             * el médico registra su presencia manualmente.
             */
            case "registrado":
                if ((desde === "tp" )|| (desde === "pd") || (desde === "kiosko")) {
                    if (desde === "kiosko") {
                        // Desde un kiosko utilizamos el DNI o el CIPA del paciente para identificarlo
                        let DNIoCIPAPaciente = id_o_DNI_o_CIPA_paciente;
                        // Buscamos el paciente en la lista de todos los pacientes para obtener su idPaciente
                        for (let i in datosTodosLosPacientes)
                            if ((datosTodosLosPacientes[i].dni === DNIoCIPAPaciente) || (parseInt(datosTodosLosPacientes[i].cipa) === parseInt(DNIoCIPAPaciente)))
                                idPaciente = i;
                    } else {
                        // Desde las listas de pacientes del médico utilizamos el ID del paciente para identificarlo
                        idPaciente = id_o_DNI_o_CIPA_paciente;
                    }
                    // Seguimos solo si el idPaciente que tenemos es válido
                    if (parseInt(idPaciente) !== -1) {
                        // Se verifica si el paciente ya estaba registrado comprobando que no esté ya incluido en la
                        // lista de siguientes pacientes.
                        for (let paciente of nuevoArraySP) {
                            // Si el paciente ya está registrado, no se hace nada más
                            if (parseInt(paciente.id) === parseInt(idPaciente))
                                return;
                        }
                        // Si el paciente no tenía un ticketID guardado, se le asigna uno nuevo
                        let ticketID = (desde === 'tp' && !getTicketIDPaciente(idPaciente)) ? generarIdentificadorUnico() : getTicketIDPaciente(idPaciente);
                        // Se guarda el ticketID en el BackEnd
                        let consulta = await peticionHTML('/consultas/'+idPaciente);
                        consulta.ticketId = ticketID;
                        await peticionHTML('/paciente/ticketid/'+idPaciente, 'PUT', consulta);
                        // Se guardan los cambios en local
                        nuevoArraySP.push({ticketID: ticketID, id: idPaciente});
                        setDatosSiguientesPacientes(nuevoArraySP);

                        // Si se ha registrado un paciente descartado, ya no debe estar en la lista de pacientes descartados
                        // Lo buscamos en la lista de pacientes descartados
                        for (let pos in datosPacientesNoAtendidos) {
                            let paciente = datosPacientesNoAtendidos[pos];
                            if (parseInt(paciente.id) === parseInt(idPaciente)) {
                                // Lo quitamos de la lista de pacientes descartados y guardamos los cambios
                                nuevoArrayPD.splice(pos, 1);
                                setPacientesNoAtendidos(nuevoArrayPD);
                                break;
                            }
                        }
                        // Marcamos el paciente como registrado en el BackEnd (ponemos descartado a false)
                        await peticionHTML('/consultas/'+idPaciente+"?valor=false", 'PUT');
                    }
                }
                break;
            /**
             * Se marca un paciente como descartado cuando tiene una cita para el día de hoy, pero todavía no se ha
             * registrado en el kiosko, o cuando un médico descarta manualmente a un paciente ya registrado de la lista
             * de siguientes pacientes por cualquier motivo que haya impedido su cita, pudiendo volver a registrar a
             * dicho paciente desde la lista de pacientes descartados si hiciera falta.
             */
            case "descartado":
                // Registramos el ID del paciente directamente del parámetro recibido en la función
                idPaciente = id_o_DNI_o_CIPA_paciente;
                // Buscamos el paciente en la lista de siguientes pacientes
                for (let pos in nuevoArraySP) {
                    let paciente = nuevoArraySP[pos];
                    if (parseInt(paciente.id) === parseInt(idPaciente)) {
                        // Eliminamos al paciente de la lista de siguientes pacientes
                        nuevoArraySP.splice(pos, 1);
                        // Lo añadimos a la lista de pacientes descartados
                        // Nota: como estaba en la lista de siguientes pacientes, tiene que tener un ticketID
                        nuevoArrayPD.push({ticketID: paciente.ticketID, id: idPaciente});
                        // Guardamos los cambios en local
                        setDatosSiguientesPacientes(nuevoArraySP);
                        setPacientesNoAtendidos(nuevoArrayPD);
                        // Marcamos el paciente como descartado en el BackEnd (ponemos descartado a true)
                        await peticionHTML('/consultas/'+idPaciente+"?valor=true", 'PUT');
                        break;
                    }
                }
                break;
            default:
                break;
        }
    }

    /**
     * Permite establecer el atributo llamado de un paciente dentro de una de sus consultas a un valor concreto
     * @param idPaciente el ID del paciente que se quiere llamar en la pantalla de la sala de espera
     * @param sala_de_consulta la sala de consulta del médico que le ha llamado, para mostrarla en la pantalla de la
     * sala de espera
     * @param llamado el valor de llamado
     */
    const setLlamado = async (idPaciente, llamado, sala_de_consulta) => {
        let nuevoArrayPL = JSON.parse(JSON.stringify(datosPacientesLlamados));

        if (llamado) {
            // No llamamos un paciente si ya está en la lista de pacientes llamados
            for (let pos in nuevoArrayPL) {
                let paciente = nuevoArrayPL[pos];
                if ((parseInt(paciente.id) === parseInt(idPaciente)) && (paciente.consulta === sala_de_consulta))
                    return;
            }
            // Borramos los paciente llamados anteriormente de la misma sala de consulta si lo hay de la lista de
            // pacientes llamados:
            for (let pos in datosPacientesLlamados) {
                let paciente = datosPacientesLlamados[pos];
                if (paciente.consulta === sala_de_consulta) {
                    nuevoArrayPL.splice(pos, 1);

                    // Guardamos el nuevo valor de llamado en el BackEnd
                    await peticionHTML("/consultas/llamada/"+paciente.id+"?valor=false", 'PUT');

                    // Quitamos el ticketID del paciente en el BackEnd para que al volver a hacer un fetch, no se
                    // clasifique como paciente registrado:
                    let consulta = await peticionHTML('/consultas/'+paciente.id);
                    consulta.ticketId = "";
                    await peticionHTML('/paciente/ticketid/'+paciente.id, 'PUT', consulta);

                    break;
                }
            }
            // Buscamos el paciente de la lista de siguientes pacientes para obtener su ticketID
            for (let pos in datosSiguientesPacientes) {
                let paciente = datosSiguientesPacientes[pos];
                if (parseInt(paciente.id) === parseInt(idPaciente)) {
                    // Lo añadimos a la lista de pacientes llamados
                    nuevoArrayPL.unshift({ticketID: paciente.ticketID , id: parseInt(idPaciente), consulta: sala_de_consulta});

                    // Guardamos los cambios
                    setDatosPacientesLlamados(nuevoArrayPL);

                    // Guardamos el nuevo valor de llamado en el BackEnd
                    await peticionHTML("/consultas/llamada/"+idPaciente+"?valor=true", 'PUT');

                    break;
                }
            }
        } else {
            // Buscamos el paciente en la lista de pacientes llamados
            for (let pos in datosPacientesLlamados) {
                let paciente = datosPacientesLlamados[pos];
                if ((parseInt(paciente.id) === parseInt(idPaciente)) && (paciente.consulta === sala_de_consulta)) {
                    // Borramos el paciente de la lista de pacientes llamados
                    nuevoArrayPL.splice(pos, 1);

                    // Guardamos los cambios
                    setDatosPacientesLlamados(nuevoArrayPL);

                    // Guardamos el nuevo valor de llamado en el BackEnd
                    await peticionHTML("/consultas/llamada/"+idPaciente+"?valor=false", 'PUT');

                    // Quitamos el ticketID del paciente en el BackEnd para que al volver a hacer un fetch, no se
                    // clasifique como paciente registrado:
                    let consulta = await peticionHTML('/consultas/'+idPaciente);
                    consulta.ticketId = "";
                    await peticionHTML('/paciente/ticketid/'+idPaciente, 'PUT', consulta);

                    break;
                }
            }
        }
    };

    /**
     * Función para ordenar alfabéticamente los arrays de todos los pacientes o pacientes descartados por nombre
     * @param array array de pacientes que se va a ordenar
     * @param modo si se trabaja directamente con el campo de nombres o con el identificador del paciente
     * @returns {array} array de entrada ordenado alfabéticamente
     */
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

    /**
     * Devuelve el siguiente paciente al que se deberá atender según el orden de la lista de siguientes pacientes
     * @param idPacienteActual el ID del paciente que se está viendo actualmente
     * @returns {number} el ID del siguiente paciente al que hay que atender
     */
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

    /**
     * Devuelve el ID de un paciente a partir de su DNI o CIPA. Se usa en la identificación del kiosko
     * @param dnioCIPA el DNI o el número CIPA del paciente que se acaba de registrar en el kiosko
     * @returns {number} el ID del paciente cuyo DNI o CIPA se corresponde con el introducido en la función
     */
    const getIDPacienteKiosko = (dnioCIPA) =>{
        for (let i in datosTodosLosPacientes) {
            if ((datosTodosLosPacientes[i].dni === dnioCIPA) || (parseInt(datosTodosLosPacientes[i].cipa) === parseInt(dnioCIPA))) {
                return parseInt(i);
            }
        }
    }

    /**
     * Actualiza el orden de los pacientes en local y en el BackEnd.
     * @param arraySP el nuevo array de siguientes pacientes reordenado.
     */
    const cambiarOrdenPacientes = async (arraySP) => {
        // Primero actualizamos el array de siguientes pacientes en local:
        setDatosSiguientesPacientes(arraySP);
        // A continuación generamos un array con los IDs de los pacientes reordenados para subirlo al BackEnd:
        let nuevoOrden = [];
        for (let paciente of arraySP)
            nuevoOrden.push(paciente.id);
        await peticionHTML('/medicos/'+doc.usuario, 'PUT', nuevoOrden);
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await (await fetch('/consultas')).json();
            return data;
        }
        const fetchDatad = async () => {
            const datad = await (await fetch('/paciente')).json();
            return datad;
        }

        const fetchDataDoctor = async () => {
            const dataDoctor = await (await fetch('/medicos')).json();
            return dataDoctor;
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
                        // Si tiene ticketID y tiene descartado a true, es un paciente descartado
                        arrayPD.push({ticketID: data[i].ticketId , id: parseInt(data[i].id)});
                    } else if ((data[i].ticketId !== null) && (data[i].ticketId !== undefined) && (data[i].ticketId !== "") && !data[i].llamado) {
                        // Si tiene ticketID y tiene llamado a false, es un paciente registrado
                        arraySP.push({ticketID: data[i].ticketId , id: parseInt(data[i].id)});
                    } else if ((data[i].ticketId !== null) && (data[i].ticketId !== undefined) && (data[i].ticketId !== "") && data[i].llamado ) {
                        // Si tiene ticketID y tiene llamado a true, es un paciente llamado desde la sala de espera
                        arrayPL.push({ticketID: data[i].ticketId , id: parseInt(data[i].id), consulta: "PEDIATRÍA"});
                    }
                }
                fetchDataDoctor()
                    .catch(console.error)
                    .then(dataDoctor => {
                        setDoc(dataDoctor[0]);
                        // Reordenamos el array de siguientes pacientes según el orden descargado del BackEnd
                        let arraySPOrdenado = [];
                        for (let idPaciente of dataDoctor[0].ordenPacientes) {
                            for (let paciente of arraySP) {
                                if (parseInt(paciente.id) === parseInt(idPaciente)) {
                                    arraySPOrdenado.push(paciente);
                                    break;
                                }
                            }
                        }
                        setDatosSiguientesPacientes(arraySPOrdenado);
                    });
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
                <Route path="/medico/lista_siguientes_pacientes" element={datosDescargados? <><Header/><ListaSiguientesPacientesMedico datosTodosLosPacientes={datosTodosLosPacientes} datosSiguientesPacientes={datosSiguientesPacientes} cambiarModoPaciente={cambiarModoPaciente} setLlamado={setLlamado} cambiarOrdenPacientes={cambiarOrdenPacientes}/><Footer/></> : <></>} />
                <Route path="/medico/lista_completa_pacientes" element={datosDescargados? <><Header/><ListaCompletaPacientesMedico datosTodosLosPacientes={datosTodosLosPacientes} ordenarAlfabeticamente={ordenarAlfabeticamente} cambiarModoPaciente={cambiarModoPaciente}/><Footer/></> : <></>} />
                <Route path="/medico/lista_pacientes_descartados" element={datosDescargados? <><Header/><ListaPacientesNoAtendidosMedico datosTodosLosPacientes={datosTodosLosPacientes} datosPacientesNoAtendidos={datosPacientesNoAtendidos} ordenarAlfabeticamente={ordenarAlfabeticamente} cambiarModoPaciente={cambiarModoPaciente}/><Footer/></> : <></>} />
                <Route path="/medico/login" element={datosDescargados? <><HeaderHomePreLogin/><LoginMedico /><Footer/></> : <></>} />

                <Route path="/medico/detalles_paciente/:id" element={datosDescargados? <><Header/><DetallesPaciente useQuery={useQuery} datosHistoriaClinica={datosHistoriaClinica} datosTodosLosPacientes={datosTodosLosPacientes} cambiarModoPaciente={cambiarModoPaciente} getIDSiguientePaciente={getIDSiguientePaciente} setLlamado={setLlamado}/><Footer/></> : <></>} />
                <Route path="/medico/nueva_consulta_paciente/:id" element={datosDescargados? <><Header/><NuevaConsulta useQuery={useQuery} datosTodosLosPacientes={datosTodosLosPacientes}/><Footer/></> : <></>} />
                <Route path="/medico/recetas_paciente/:id" element={datosDescargados? <><Header/><RecetasPaciente useQuery={useQuery} datosTodosLosPacientes={datosTodosLosPacientes}/><Footer/></> : <></>} />
                <Route path="/medico/pruebas_paciente/:id" element={datosDescargados? <><Header/><PruebasMedicasPaciente useQuery={useQuery} datosTodosLosPacientes={datosTodosLosPacientes}/><Footer/></> : <></>} />

                <Route path="/paciente/login" element={datosDescargados? <><LoginKiosko /><Footer/></> : <></>} />
                <Route path="/paciente/login/dni" element={datosDescargados? <><LoginKioskodni cambiarModoPaciente={cambiarModoPaciente} getIDPacienteKiosko={getIDPacienteKiosko}/><Footer/></> : <></>} />
                <Route path="/paciente/login/cipa" element={datosDescargados? <><LoginKioskocipa cambiarModoPaciente={cambiarModoPaciente} getIDPacienteKiosko={getIDPacienteKiosko}/><Footer/></> : <></>}  />
                <Route path="/paciente/ticket/:id" element={datosDescargados? <><PacienteRegistradoKiosko/><Footer /></> : <></>}  />

                <Route path="/sala_de_espera" element={datosDescargados? <ListaSalaDeEspera datosPacientesLlamados={datosPacientesLlamados}/> : <></>} />

                <Route path="/contacto" element={datosDescargados? <><Header/><Contacto /><Footer/></> : <></>} />
                <Route path="/Home" element={<><HeaderHome/><Home cambiarModoPaciente={cambiarModoPaciente} getIDSiguientePaciente={getIDSiguientePaciente} doc={doc.nombre}/><Footer/></>} ></Route>
                <Route path="/" element={<><HeaderHomePreLogin/><HomePreLogin /><Footer/></>} />
            </Routes>
          </div> : <div></div>}
      </Router>
  );
}

export default App;
