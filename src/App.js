import './App.css';
import Header from './components/Header'
import React, {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route, useLocation, Navigate} from "react-router-dom";
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
import {HomePreLogin} from "./components/HomePreLogin";
//Datos
import {data as dataHistoriaClinica} from './data/historiaClinica';
import {useCookies} from "react-cookie";

function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function App() {
  const [datosTodosLosPacientes, setDatosTodosLosPacientes] = useState([]);
  const [datosConsultas, setDatosConsultas] = useState([]);
  const [datosHistoriaClinica] = useState(JSON.parse(JSON.stringify(dataHistoriaClinica)));
  const [interfazLista, setinterfazLista] = useState(false);
  const [doc, setDoc] = useState("");
  const [salaDeEspera, ] = useState("Sala de espera primera planta");
  const [loggedIn, setLoggedIn] = useState(undefined);
  const [useEffectListo, setUseEffectListo] = useState(false);
  const [cookies, setCookie] = useCookies(['medico']);

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
        let parametros = {
            method: metodo,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        if (body)
            parametros.body = JSON.stringify(body);

        let respuestaFetch;
        await fetch(URL, parametros)
            .then(respuesta => {
                return respuesta.json();
            })
            .then(respuestaEnJSON => {
                respuestaFetch = respuestaEnJSON;
            })
            .catch(() => console.log("Hubo un fallo al realizar un fetch a "+URL+" con el método "+metodo+(body?" y body"+body:"")));

        if (respuestaFetch)
            return respuestaFetch;
    };

    /**
     * Función que permite obtener el array de consultas para cada lista de pacientes
     * @param lista el nombre de la lista que se desea obtener: "SP" para la lista de siguientes pacientes, "PD" para
     * la lista de pacientes descartados o "PL" para la lista de pacientes llamados. Si no se especifica ninguna lista,
     * por defecto se devuelven todas las consultas.
     * @param datosConsultas el array de consultas que se utilizará para obtener las consultas
     * @returns array de consultas solicitado
     */
    const getConsultas = (datosConsultas, lista = undefined) => {
        if (!datosConsultas || (datosConsultas.length === 0))
            return [];

        // Devolvemos un array distinto en función de lo que queremos obtener
        switch (lista) {
            case "SP":
                let arraySP = [];
                // Se obtiene el array de consultas de siguientes pacientes a partir del orden del médico
                for (let id of doc.ordenPacientes) {
                    for (let consulta of datosConsultas) {
                        if (parseInt(consulta.id) === parseInt(id)) {
                            arraySP.push(consulta);
                            break;
                        }
                    }
                }
                return arraySP;
            case "PD":
                let arrayPD = [];
                // Se obtiene el array de consultas de pacientes descartados a partir del array de datosConsultas
                // Los pacientes descartados serán aquellos que tengan un ticketID válido y que tengan descartado = true
                for (let consulta of datosConsultas) {
                    if ((consulta.medico === doc.usuario) && (consulta.ticketId !== null) && (consulta.ticketId !== undefined) && (consulta.ticketId !== "") && consulta.descartado) {
                        // Si tiene ticketID y tiene descartado a true, es un paciente descartado
                        arrayPD.push(consulta);
                    }
                }
                return ordenarAlfabeticamente(arrayPD, "pacientes");
            case "PL":
                let arrayPL = [];
                // Se obtiene el array de consultas de pacientes llamados a partir del array de datosConsultas
                // Los pacientes descartados serán aquellos que tengan un ticketID válido y que tengan llamado = true
                for (let consulta of datosConsultas) {
                    if ((consulta.medico === doc.usuario) && (consulta.ticketId !== null) && (consulta.ticketId !== undefined) && (consulta.ticketId !== "") && consulta.llamado) {
                        // Si tiene ticketID y tiene descartado a true, es un paciente descartado
                        arrayPL.push(consulta);
                    }
                }
                return arrayPL;
            default:
                return datosConsultas;
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
            for (let paciente of getConsultas(datosConsultas)) {
                if (paciente.ticketId === identificador)
                    identificadorRepetido = true;
            }
        }
        return identificador;
    };

    /**
     * Devuelve el ticketID del paciente cuyo ID coincide con el idPaciente especificado
     * @param idConsulta el ID del paciente buscado
     * @returns {string} el ticketID si se encuentra o un identificador nuevo generado aleatoriamente
     * de generar
     */
    const getTicketIDPaciente = async (idConsulta) => {
        let consultas = getConsultas(datosConsultas);
        for (let consulta of consultas) {
            if (parseInt(consulta.id) === parseInt(idConsulta)) {
                if ((consulta.ticketId !== null) && (consulta.ticketId !== undefined) && (consulta.ticketId !== "")) {
                    // Si se ha encontrado un ticketID válido, se usa ese
                    return consulta.ticketId;
                } else {
                    // No tiene ticketID por lo que se le asigna uno
                    let ticketID = generarIdentificadorUnico();
                    // Se guarda el ticketID en el BackEnd
                    consulta.ticketId = ticketID;
                    let consultas = JSON.parse(JSON.stringify(datosConsultas));
                    setDatosConsultas(consultas);
                    await peticionHTML('/paciente/ticketid/' + idConsulta, 'PUT', consulta);
                    return ticketID;
                }
            }
        }
        console.log("¡Error! No se ha encontrado la consulta con ID "+idConsulta+" por lo que no se devuelve ningún ticketID");
    }

    /**
     * Función para quitar una consulta de la lista de siguientes pacientes
     * @param consulta
     * @returns {Promise<void>}
     */
    const quitarConsultaSiguientesPacientes = async (consulta) => {
        if (!doc || !doc.ordenPacientes)
            return;
        let ordenPacientes = doc.ordenPacientes;
        for (let i in doc.ordenPacientes) {
            if (parseInt(ordenPacientes[i]) === parseInt(consulta.id)) {
                ordenPacientes.splice(i, 1);
                break;
            }
        }
        let docNuevo = JSON.parse(JSON.stringify(doc));
        docNuevo.ordenPacientes = ordenPacientes;
        setDoc(docNuevo);
        await peticionHTML('/medicos/'+doc.usuario, 'PUT', ordenPacientes);
    };

    /**
     * Función para añadir una consulta de la lista de siguientes pacientes
     * @param consulta
     * @returns {Promise<void>}
     */
    const agregarConsultaSiguientesPacientes = async (consulta) => {
        if (!doc || !doc.ordenPacientes)
            return;
        let ordenPacientes = doc.ordenPacientes;
        ordenPacientes.push(consulta.id);
        let docNuevo = JSON.parse(JSON.stringify(doc));
        docNuevo.ordenPacientes = ordenPacientes;
        setDoc(docNuevo);
        await peticionHTML('/medicos/'+doc.usuario, 'PUT', ordenPacientes);
    };

    /**
     * Cambia a los pacientes de lista y estado en local y en el BackEnd
     * @param modo el nuevo modo del paciente
     * @param id_o_DNI_o_CIPA_paciente el ID del paciente que se quiere modificar, su DNI o su CIPA para identificarlo
     * @param desde parámetro opcional que se usa cuando se registran los pacientes desde una lista concreta y se quiere
     * tratar de forma distinta
     */
    const cambiarModoPaciente = async (modo, id_o_DNI_o_CIPA_paciente, desde = undefined) => {
        let idConsulta = -1;
        switch (modo) {
            /**
             * Se marca un paciente como atendido cuando se ha marcado así manualmente desde la pantalla de siguientes
             * pacientes o si se establece automáticamente con el botón de llamar al siguiente paciente desde la
             * lista de siguientes pacientes o al darle al botón de siguiente paciente en la pantalla de detalles de un
             * paciente
             */
            case "atendido":
                idConsulta = id_o_DNI_o_CIPA_paciente;
                // Se busca el paciente cuyo ID es el que se ha pasado como parámetro
                for (let consulta of getConsultas(datosConsultas, "SP")) {
                    if (parseInt(consulta.id) === parseInt(idConsulta)) {
                        consulta.llamado = false;
                        consulta.descartado = false;
                        // Quitamos la consulta de la lista de pacientes del médico
                        await quitarConsultaSiguientesPacientes(consulta);
                        // Forzamos un renderizado de las consultas
                        let consultas = JSON.parse(JSON.stringify(datosConsultas));
                        setDatosConsultas(consultas);
                        break;
                    }
                }
                break;
            /**
             * Se marca un paciente como registrado cuando se acaba de registrar personalmente en el kiosko o cuando
             * el médico registra su presencia manualmente.
             */
            case "registrado":
                let consultaActual;
                if ((desde === "tp" )|| (desde === "pd") || (desde === "kiosko")) {
                    if (desde === "kiosko") {
                        // Desde un kiosko utilizamos el DNI o el CIPA del paciente para identificarlo
                        let DNIoCIPAPaciente = id_o_DNI_o_CIPA_paciente;
                        // Buscamos el paciente en la lista de todos los pacientes para obtener su id
                        forGlobal: for (let paciente of datosTodosLosPacientes)
                            if ((paciente.dni === DNIoCIPAPaciente) || (parseInt(paciente.cipa) === parseInt(DNIoCIPAPaciente)))
                                // Buscamos la cita que tiene con el médico actual
                                for (let idConsultaPaciente of paciente.citas) {
                                    for (let consulta of getConsultas(datosConsultas)) {
                                        if ((consulta.medico === doc.usuario) && (parseInt(idConsultaPaciente)) === parseInt(consulta.id)) {
                                            idConsulta = consulta.id;
                                            consultaActual = consulta
                                            break forGlobal;
                                        }
                                    }
                                }
                    } else {
                        // Desde las listas de pacientes del médico utilizamos el ID de la consulta para identificarla
                        idConsulta = id_o_DNI_o_CIPA_paciente;
                        for (let consulta of getConsultas(datosConsultas)) {
                            if (parseInt(idConsulta) === parseInt(consulta.id)) {
                                consultaActual = consulta;
                                break;
                            }
                        }
                    }
                    // Seguimos solo si el idPaciente que tenemos es válido
                    if (parseInt(idConsulta) !== -1) {
                        // Se verifica si el paciente ya estaba registrado comprobando que no esté ya incluido en la
                        // lista de siguientes pacientes.
                        for (let consulta of getConsultas(datosConsultas, "SP")) {
                            // Si el paciente ya está registrado, no se hace nada más
                            if (parseInt(consulta.id) === parseInt(idConsulta))
                                return;
                        }
                        // Si el paciente no tenía un ticketID guardado, se le asigna uno nuevo
                        let ticketID = getTicketIDPaciente(idConsulta);
                        // Se guardan los cambios en local
                        consultaActual.ticketId = ticketID;
                        consultaActual.descartado = false;
                        consultaActual.llamado = false;
                        // Forzamos un renderizado de las consultas
                        let consultas = JSON.parse(JSON.stringify(datosConsultas));
                        setDatosConsultas(consultas);
                        // Se agrega la consulta a la lista de siguientes pacientes del médico
                        await agregarConsultaSiguientesPacientes(consultaActual);
                        // Marcamos el paciente como registrado en el BackEnd (ponemos descartado a false)
                        await peticionHTML('/consultas/'+idConsulta+"?valor=false", 'PUT');
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
                // Registramos el ID de la consulta del paciente directamente del parámetro recibido en la función
                idConsulta = id_o_DNI_o_CIPA_paciente;
                // Buscamos la consulta con dicho ID
                for (let consulta of getConsultas(datosConsultas)) {
                    if (parseInt(consulta.id) === parseInt(idConsulta)) {
                        consulta.descartado = true;
                        consulta.llamado = false;
                        // Forzamos un renderizado de las consultas
                        let consultas = JSON.parse(JSON.stringify(datosConsultas));
                        setDatosConsultas(consultas);

                        // Quitamos el paciente de la lista de siguientes pacientes del médico
                        await quitarConsultaSiguientesPacientes(consulta);

                        // Marcamos el paciente como descartado en el BackEnd (ponemos descartado a true)
                        await peticionHTML('/consultas/'+idConsulta+"?valor=true", 'PUT');
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
     * @param idConsulta el ID de la consulta del paciente que se quiere llamar en la pantalla de la sala de espera
     * sala de espera
     * @param llamado el valor de llamado
     */
    const setLlamado = async (idConsulta, llamado) => {
        if (llamado) {
            // No llamamos un paciente si ya está en la lista de pacientes llamados
            for (let consulta of getConsultas(datosConsultas, "PL")) {
                if (parseInt(consulta.id) === parseInt(idConsulta))
                    return;
            }
            // Borramos, si lo hay, el paciente llamado anteriormente de la misma sala de consulta de la lista de
            // pacientes llamados:
            for (let consulta in getConsultas(datosConsultas, "PL")) {
                if (consulta.medico === doc.nombre) {
                    consulta.llamado = false;
                    // Guardamos el nuevo valor de llamado en el BackEnd
                    await peticionHTML("/consultas/llamada/"+consulta.id+"?valor=false", 'PUT');
                    break;
                }
            }
            // Buscamos la consulta del paciente para poner llamado a true
            for (let consulta in getConsultas(datosConsultas)) {
                if (parseInt(idConsulta) === parseInt(consulta.id)) {
                    consulta.llamado = true;

                    // Guardamos el nuevo valor de llamado en el BackEnd
                    await peticionHTML("/consultas/llamada/"+idConsulta+"?valor=true", 'PUT');
                    break;
                }
            }
        } else {
            // Buscamos el paciente en la lista de pacientes llamados
            for (let consulta of getConsultas(datosConsultas, "PL")) {
                if (parseInt(idConsulta) === parseInt(consulta.id)) {
                    consulta.llamado = false;
                    // Guardamos el nuevo valor de llamado en el BackEnd
                    await peticionHTML("/consultas/llamada/"+consulta.id+"?valor=false", 'PUT');
                    break;
                }
            }
        }
        // Guardamos los cambios en local
        let consultas = JSON.parse(JSON.stringify(datosConsultas));
        setDatosConsultas(consultas);
    };

    /**
     * Función para ordenar alfabéticamente los arrays de todos los pacientes o pacientes descartados por nombre
     * @param array array de pacientes que se va a ordenar
     * @param modo si se trabaja directamente con el campo de nombres con el identificador del paciente, o con el
     * campo paciente
     * @returns {array} array de entrada ordenado alfabéticamente
     */
    const ordenarAlfabeticamente = (array, modo = "nombres") => {
        if (modo === "nombres") {
            return array.sort(function(a, b) {
                if (a.nombre < b.nombre) { return -1; }
                if (a.nombre > b.nombre) { return 1; }
                return 0;
            })
        } else if (modo === "ticketIDs") {
            return array.sort(function(a, b) {
                if (datosTodosLosPacientes[a.id].nombre < datosTodosLosPacientes[b.id].nombre) { return -1; }
                if (datosTodosLosPacientes[a.id].nombre > datosTodosLosPacientes[b.id].nombre) { return 1; }
                return 0;
            })
        } else if (modo === "pacientes") {
            return array.sort(function(a, b) {
                if (a.paciente < b.paciente) { return -1; }
                if (a.paciente > b.paciente) { return 1; }
                return 0;
            })
        }
    };

    /**
     * Devuelve la siguiente consulta que se deberá atender según el orden de la lista de siguientes pacientes
     * @param idConsultaActual el ID de la consulta que se está atendiendo actualmente
     * @returns {number} el ID de la consulta del siguiente paciente al que hay que atender
     */
    const getIDSiguienteConsulta = (idConsultaActual) => {
        let arraySP = JSON.parse(JSON.stringify(getConsultas(datosConsultas, "SP")));
        let posActual = -1;
        for (let i in arraySP) {
            if (parseInt(arraySP[i].id) === parseInt(idConsultaActual)) {
                posActual = parseInt(i);
                break;
            }
        }
        if (posActual !== -1) // El siguiente paciente no puede ser el mismo
            arraySP.splice(posActual, 1);
        return (arraySP[0]? arraySP[0].id : -1);
    };

    /**
     * Actualiza el orden de los pacientes en local y en el BackEnd.
     * @param arraySP el nuevo array de siguientes pacientes reordenado.
     */
    const cambiarOrdenPacientes = async (arraySP) => {
        // A continuación generamos un array con los IDs de los pacientes reordenados para subirlo al BackEnd:
        let nuevoOrden = [];
        for (let paciente of arraySP)
            nuevoOrden.push(paciente.id);
        // Guardamos los datos en local
        let docNuevo = JSON.parse(JSON.stringify(doc));
        docNuevo.ordenPacientes = nuevoOrden;
        setDoc(docNuevo);
        setDatosConsultas(datosConsultas);
        // Guardamos el orden en el BackEnd
        await peticionHTML('/medicos/'+doc.usuario, 'PUT', nuevoOrden);
    };

    useEffect(() => {
        /**
         * Función que descarga la lista de consultas completa
         * @returns respuesta del fetch de descarga de la lista de consultas completa
         */
        const fetchDataConsultas = async () => {
            try {
                await fetch('/consultas')
                    .then(respuesta => {
                        return respuesta.json()
                    })
                    .then(consultas => {
                        // Guardamos todas las consultas en datosConsultas solo si ha habido cambios:
                        let cambios = (parseInt(datosConsultas.length) !== parseInt(consultas.length));
                        if (!cambios) {
                            for (let i in consultas) {
                                if (JSON.stringify(consultas[i]) !== JSON.stringify(datosConsultas[i])) {
                                    cambios = true;
                                    break;
                                }
                            }
                        }
                        if (cambios)
                            setDatosConsultas(consultas);

                        // Se comprueba si ha cambiado el array del orden de pacientes del médico
                        fetch("/medicos")
                            .then(respuesta => {
                                return respuesta.json()
                            })
                            .then(medicos => {
                                for (let medico of medicos) {
                                    if (medico.usuario === doc.usuario) {
                                        if (JSON.stringify(medico) !== JSON.stringify(doc))
                                            setDoc(medico);
                                        break;
                                    }
                                }
                            })
                        setinterfazLista(true);
                    })
                    .catch(() => {
                        console.log("Hubo un fallo tratando de descargar los datos de los pacientes del BackEnd. Se carga la página igualmente.");
                        // El fetch falló, por lo que no tenemos que cargar nada más
                        setinterfazLista(true);
                    });
            } catch (e) {
                console.log("Hubo un fallo tratando de descargar los datos de los pacientes del BackEnd. Se carga la página igualmente.");
                // El fetch falló, por lo que no tenemos que cargar nada más
                setinterfazLista(true);
            }
        }

        /**
         * Función que descarga la lista de pacientes
         * @returns respuesta del fetch de descarga de la lista de pacientes
         */
        const fetchDataPacientes = async () => {
            return await fetch('/paciente');
        }

        // Según se carga el valor de loggedIn en el useState inicial, se activa esta función.
        // Por ello, descartamos la primera ejecución de este useEffect con la variable de control useEffectListo
        if (!useEffectListo) {
            setUseEffectListo(true);
            return;
        }

        // Recogemos los pacientes del BackEnd
        fetchDataPacientes()
            .then(respuesta => {
                return respuesta.json()
            })
            .then(pacientes => {
                let arrayTLP = [];
                // Guardamos los pacientes en la lista general de pacientes.
                for (let i in pacientes) {
                    arrayTLP.push({cipa: pacientes[i].cipa, dni: pacientes[i].dni, nombre: pacientes[i].nombre, citas: pacientes[i].citas})
                }
                setDatosTodosLosPacientes(arrayTLP);
            })
            .catch(() => {
                console.log("Hubo un fallo tratando de descargar los datos de los pacientes del BackEnd.");
            });

        fetchDataConsultas()
            .catch();

        // Buscamos cambios en los datos del BackEnd cada medio segundo para mantener los datos sicronizados
        const timer = setInterval(fetchDataConsultas, 3000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedIn]);

    useEffect(() => {
        const fetchMedicos = async () => {
            return await fetch("/medicos");
        };
        // Restauramos el valor de la cookie o le asignamos un valor por defecto
        setCookie('usuarioMedico', (cookies.usuarioMedico? cookies.usuarioMedico : ""), { path: '/' });
        fetchMedicos()
            .then(respuesta => {
                return respuesta.json()
            })
            .then(medicos => {
                let medicoNoEncontrado = true;
                for (let medico of medicos) {
                    if (String(medico.usuario) === String(cookies.usuarioMedico)) {
                        setDoc(medico);
                        setLoggedIn(true);
                        medicoNoEncontrado = false;
                        break;
                    }
                }
                if (medicoNoEncontrado)
                    setLoggedIn(false);
            })
            .catch(() => {
                // El fetch falló, por lo que no hemos iniciado sesión o el BackEnd está desconectado
                setLoggedIn(false);
            })
    }, [setCookie, cookies]);

    return (
        interfazLista? <Router>
              <div className="App">
                <Routes>
                    <Route path="/medico/lista_siguientes_pacientes" element={loggedIn?<><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={loggedIn}/><ListaSiguientesPacientesMedico datosConsultas={datosConsultas} getConsultas={getConsultas} cambiarModoPaciente={cambiarModoPaciente} setLlamado={setLlamado} cambiarOrdenPacientes={cambiarOrdenPacientes}/><Footer/></> : <Navigate to="/medico/login" />} />
                    <Route path="/medico/lista_completa_pacientes" element={loggedIn?<><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={loggedIn}/><ListaCompletaPacientesMedico datosTodosLosPacientes={datosTodosLosPacientes} ordenarAlfabeticamente={ordenarAlfabeticamente} cambiarModoPaciente={cambiarModoPaciente}/><Footer/></> : <Navigate to="/medico/login" />} />
                    <Route path="/medico/lista_pacientes_descartados" element={loggedIn?<><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={loggedIn}/><ListaPacientesNoAtendidosMedico datosConsultas={datosConsultas}  datosPacientesNoAtendidos={getConsultas(datosConsultas, "PD")} cambiarModoPaciente={cambiarModoPaciente}/><Footer/></> : <Navigate to="/medico/login" />} />
                    <Route path="/medico/login" element={loggedIn? <Navigate to={"/"}/> : <><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={false}/><LoginMedico setLoggedIn={setLoggedIn} setDoc={setDoc} peticionHTML={peticionHTML}/><Footer/></>} />
                    <Route path="/medico/autenticar" element={<Navigate to={"/"}/>}/>

                    <Route path="/medico/detalles_paciente/:id" element={loggedIn?<><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={loggedIn}/><DetallesPaciente useQuery={useQuery} datosHistoriaClinica={datosHistoriaClinica} datosTodosLosPacientes={datosTodosLosPacientes} cambiarModoPaciente={cambiarModoPaciente} getIDSiguienteConsulta={getIDSiguienteConsulta} setLlamado={setLlamado} salaDeConsulta={doc.salaDeConsulta}/><Footer/></> : <Navigate to="/medico/login" />} />
                    <Route path="/medico/nueva_consulta_paciente/:id" element={loggedIn?<><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={loggedIn}/><NuevaConsulta useQuery={useQuery} datosTodosLosPacientes={datosTodosLosPacientes}/><Footer/></> : <Navigate to="/medico/login" />} />
                    <Route path="/medico/recetas_paciente/:id" element={loggedIn?<><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={loggedIn}/><RecetasPaciente useQuery={useQuery} datosTodosLosPacientes={datosTodosLosPacientes}/><Footer/></> : <Navigate to="/medico/login" />} />
                    <Route path="/medico/pruebas_paciente/:id" element={loggedIn?<><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={loggedIn}/><PruebasMedicasPaciente useQuery={useQuery} datosTodosLosPacientes={datosTodosLosPacientes}/><Footer/></> : <Navigate to="/medico/login" />} />

                    <Route path="/paciente/login" element={<><LoginKiosko /><Footer/></>} />
                    <Route path="/paciente/login/dni" element={<><LoginKioskodni cambiarModoPaciente={cambiarModoPaciente} peticionHTML={peticionHTML}/><Footer/></>} />
                    <Route path="/paciente/login/cipa" element={<><LoginKioskocipa cambiarModoPaciente={cambiarModoPaciente} peticionHTML={peticionHTML}/><Footer/></>}  />
                    <Route path="/paciente/ticket" element={<><PacienteRegistradoKiosko useQuery={useQuery} salaDeEspera={salaDeEspera}/><Footer /></>}  />

                    <Route path="/sala_de_espera" element={<ListaSalaDeEspera salaDeConsulta={doc.salaDeConsulta}/>} />

                    <Route path="/contacto" element={<><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={loggedIn}/><Contacto /><Footer/></>} />
                    <Route path="/" element={loggedIn? <><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={false}/><Home cambiarModoPaciente={cambiarModoPaciente} getIDSiguienteConsulta={getIDSiguienteConsulta} doc={doc.nombre}/><Footer/></> : <><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={false}/><HomePreLogin /><Footer/></>} />
                </Routes>
              </div>
          </Router> : <></>
  );
}

export default App;
