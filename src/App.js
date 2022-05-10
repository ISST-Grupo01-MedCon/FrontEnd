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
import {PaginaDeCarga} from "./components/PaginaDeCarga";
import {PaginaDeError} from "./components/PaginaDeError";

function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const mostrarTrazas = false;

/**
 * Función que imprime logs solo cuando mostrarTrazas está a true.
 * Se debe usar con registros que no sean importantes.
 * @param text el texto que se desea imprimir por consola.
 */
export const log = (text) => {
    if (mostrarTrazas)
        console.log(text);
};

function App() {
  const [datosTodosLosPacientes, setDatosTodosLosPacientes] = useState([]); // Array de datos de todos los pacientes
  const [datosConsultas, setDatosConsultas] = useState([]); // Array de consultas que solo debe contener las del médico actual
  const [datosHistoriaClinica] = useState(JSON.parse(JSON.stringify(dataHistoriaClinica))); // Array con la historia clínica de un paciente
  const [interfazLista, setInterfazLista] = useState(false); // Permite activar o desactivar la pantalla de carga
  const [doc, setDoc] = useState(""); // Permite cambiar el médico que ha iniciado sesión
  const [salaDeEspera, ] = useState("Sala de espera primera planta"); // Permite establecer el nombre de la sala de espera que gestiona nuestro médico
  const [loggedIn, setLoggedIn] = useState(); // Permite saber si se ha iniciado sesión o no para bloquear ciertas funcionaliades
  const [useEffectListo, setUseEffectListo] = useState(false); // Permite bloquear la primera llamada al useEffect cuando se lanza demasiado pronto
  const [loggedInComprobado, setLoggedInComprobado] = useState(false); // Permite saber si ya se ha comprobado si se ha iniciado sesión de forma autónoma para no volverlo a hacer
  const [cookies, setCookie] = useCookies(['medico']); // Permite leer y modificar la cookie del médico, que almacena su nombre de usuario
  const [consultasNuevas, setConsultasNuevas] = useState(); // Array que almacena las nuevas consultas tras un cambio que todavía no se ha procesado
  const [doctorNuevo, setDoctorNuevo] = useState(); // Variable que almacena el nuevo médico tras un cambio que todavía no se ha procesado
  const [fetchsPendientes, setFetchsPendientes] = useState([]); // Array de peticiones fetch que tiene pendiente realizar el useEffect
  const [sincronizarCambios, setSincronizarCambios] = useState(true); // Variable que permite detener la sincronizacion de cambios en determinadas páginas que no lo necesitan

  /**
   * Función que permite solicitar el lanzamiento de un fetch desde el useEffect más tarde
   * @param URL URL destino de la petición
   * @param metodo método de la petición. Por defecto GET
   * @param body el cuerpo de la petición. Por defecto no se define
   */
  const peticionHTMLEnSegundoPlano = (URL, metodo = 'GET', body = undefined) => {
      fetchsPendientes.push({URL: URL, metodo: metodo, body: body});
  };

  /**
   * Función que devuelve una consulta a partir de su id
   * @param idConsulta id de la consulta
   * @returns la consulta con dicho id si se encuentra
   */
  const getConsultaFromId = (idConsulta) => {
      let consultas = getConsultas(datosConsultas);
      for (let consulta of consultas) {
          if (parseInt(consulta.id) === parseInt(idConsulta))
              return consulta;
      }
  };

  /**
   * Función que permite sustituir una consulta en el array de consultas.
   * @param consulta la consulta que se desea sustituir
   * @returns el array de consultas actualizado
   */
  const sustituirConsulta = (consulta) => {
      let consultasAntiguas = getConsultas(datosConsultas);
      let consultasNuevas = JSON.parse(JSON.stringify(getConsultas(datosConsultas)));
      for (let i in consultasAntiguas) {
          if (parseInt(consultasAntiguas[i].id) === parseInt(consulta.id)) {
              consultasNuevas[i] = consulta;
              break;
          }
      }
      return consultasNuevas;
  };

  /**
   * Función que permite cambiar el estado de una consulta
   * @param consulta_o_id la consulta que se desea cambiar o su id
   * @param descartado su valor de descartado
   * @param llamado su valor de llamado
   * @param registrado si debe mostrarse en la lista de siguientes pacientes o no
   */
  const cambiarConsulta = (consulta_o_id, descartado, llamado, registrado) => {
      let consulta;
      if (consulta_o_id.id)
          consulta = consulta_o_id;
      else
          consulta = getConsultaFromId(consulta_o_id);

      if (consulta.descartado !== descartado) {
          peticionHTMLEnSegundoPlano('/consultas/'+consulta.id+"?valor="+descartado, 'PUT');
      }
      consulta.descartado = descartado;

      if (consulta.llamado !== llamado) {
          peticionHTMLEnSegundoPlano("/consultas/llamada/"+consulta.id+"?valor="+llamado, 'PUT');
      }
      consulta.llamado = llamado;

      if (registrado) {
          addConsultaAOrdenMedico(consulta.id);
      } else {
          removeConsultaDeOrdenMedico(consulta.id);
      }

      // A partir de aquí ya está la consulta lista. Copiamos datosConsultas y lo establecemos
      setConsultas(sustituirConsulta(consulta));
  };

    /**
     * Función que permite añadir el id de una consulta al orden de pacientes del médico.
     * @param idConsulta el id de la consulta que se desea añadir al orden de pacientes del médico.
     */
    const addConsultaAOrdenMedico = (idConsulta) => {
        let doctor = doc;
        let ordenPacientes = doctor.ordenPacientes;
        if (ordenPacientes.indexOf(parseInt(idConsulta)) < 0) {
            ordenPacientes.push(parseInt(idConsulta));
            peticionHTMLEnSegundoPlano('/medicos/'+doctor.usuario, 'PUT', ordenPacientes);
            doctor.ordenPacientes = ordenPacientes;
            setDoctor(doctor);
        }
    };

    /**
     * Función que permite eliminar el id de una consulta del orden de pacientes del médico.
     * @param idConsulta el id de la consulta que se desea eliminar del orden de pacientes del médico.
     */
    const removeConsultaDeOrdenMedico = (idConsulta) => {
        let doctor = doc;
        let ordenPacientes = doctor.ordenPacientes;
        if (ordenPacientes.indexOf(parseInt(idConsulta)) >= 0) {
            ordenPacientes.splice(ordenPacientes.indexOf(parseInt(idConsulta)), 1);
            peticionHTMLEnSegundoPlano('/medicos/'+doctor.usuario, 'PUT', ordenPacientes);
            doctor.ordenPacientes = ordenPacientes;
            setDoctor(doctor);
        }
    };

    /**
     * Función que solicita cambiar el médico almacenado al useEffect.
     * Se debe llamar después de hacer los fetchs necesarios para evitar bloqueas comprobando la sincronización con el
     * BackEnd.
     * @param doctorLocal el nuevo médico que se desea establecer.
     */
    const setDoctor = (doctorLocal) => {
        log("Se comienza a cambiar el doctor");
        setDoctorNuevo(doctorLocal);
        log("Se deja de cambiar el doctor");
    };

    /**
     * Función que solicita cambiar las consultas almacenadas al useEffect.
     * Se debe llamar después de hacer los fetchs necesarios para evitar bloqueas comprobando la sincronización con el
     * BackEnd.
     * @param consultasLocales el nuevo array de consultas que se desea establecer.
     */
    const setConsultas = (consultasLocales) => {
        log("Se comienza a cambiar las consultas");
        setConsultasNuevas(consultasLocales);
        log("Se deja de cambiar las consultas");
    };

    /**
     * Función que permite eliminar otros pacientes llamados antes de llamar a uno nuevo por el mismo médico.
     */
    const quitarOtrosLlamados = () => {
        let consultasLlamadas = getConsultas(datosConsultas, "PL");
        for (let consulta of consultasLlamadas) {
            cambiarModoConsultaPaciente("atendido", consulta, "consulta");
        }
    };

    /**
     * Función que permite obtener la consulta de un paciente a partir de su nombre.
     * @param nombrePaciente el nombre del paciente del que se busca su consulta.
     * @returns la consulta del paciente si se ha encontrado.
     */
    const getConsultaFromNombrePaciente = (nombrePaciente) => {
        let consultas = getConsultas(datosConsultas);
        for (let consulta of consultas) {
            if (consulta.paciente === nombrePaciente) {
                return consulta;
            }
        }
        console.log("¡Error! No se ha encontrado la consulta del paciente "+nombrePaciente+" para el médico "+doc.nombre);
    };

    /**
     * Función que permite obtener el array de consultas del médico para cada lista de pacientes.
     * @param lista el nombre de la lista que se desea obtener: "SP" para la lista de siguientes pacientes, "PD" para
     * la lista de pacientes descartados o "PL" para la lista de pacientes llamados. Si no se especifica ninguna lista,
     * por defecto se devuelven todas las consultas.
     * @param datosConsultas el array de todas las consultas que se utilizará para obtener las consultas finales.
     * @returns array de consultas solicitado.
     */
    const getConsultas = (datosConsultas, lista = undefined, doctor = doc) => {
        if (!datosConsultas || (datosConsultas.length === 0) || !doc || !doc.ordenPacientes)
            return [];

        // Devolvemos un array distinto en función de lo que queremos obtener
        switch (lista) {
            case "SP":
                let arraySP = [];
                // Se obtiene el array de consultas de siguientes pacientes a partir del orden del médico
                for (let id of doctor.ordenPacientes) {
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
     * NOTA: por ahora no es necesaria si nunca eliminamos los ticketID obtenidos del BackEnd.
     */
    // eslint-disable-next-line no-unused-vars
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
     * Función que cambia el estado de una consulta cambiándola de lista.
     * @param modo el nuevo modo de la consulta (registrado, descartado, llamado o atendido)
     * @param consulta_o_idConsulta_o_DNI_o_CIPA_paciente
     * @param tipoDeDato
     */
    const cambiarModoConsultaPaciente = (modo, consulta_o_idConsulta_o_DNI_o_CIPA_paciente, tipoDeDato) => {
        // Primero se busca la consulta pedida a partir de los datos de los parámetros.
        let consulta;
        if (tipoDeDato === "consulta") {
            consulta = consulta_o_idConsulta_o_DNI_o_CIPA_paciente;
        } else if (tipoDeDato === "idConsulta") {
            consulta = getConsultaFromId(consulta_o_idConsulta_o_DNI_o_CIPA_paciente);
        } else if ((tipoDeDato === "DNI") || (tipoDeDato === "CIPA")) {
            // Desde un kiosko utilizamos el DNI o el CIPA del paciente para identificarlo
            let DNIoCIPAPaciente = consulta_o_idConsulta_o_DNI_o_CIPA_paciente;
            // Buscamos el paciente en la lista de todos los pacientes para obtener su id
            forGlobal: for (let paciente of datosTodosLosPacientes) {
                if ((paciente.dni === DNIoCIPAPaciente) || (parseInt(paciente.cipa) === parseInt(DNIoCIPAPaciente)))
                    // Buscamos la cita que tiene con el médico actual
                    for (let idConsultaPaciente of paciente.citas) {
                        for (let c of getConsultas(datosConsultas)) {
                            if ((c.medico === doc.usuario) && (parseInt(idConsultaPaciente)) === parseInt(c.id)) {
                                consulta = c;
                                break forGlobal;
                            }
                        }
                    }
            }
        }
        if (!consulta) {
            console.log("¡Error! Se está intentando cambiar el modo de la consulta con el dato "+consulta_o_idConsulta_o_DNI_o_CIPA_paciente+" de tipo "+tipoDeDato+", pero no se ha encontrado su consulta asociada. No se hace nada más.");
            return;
        }
        // A continuación se procede a cambiar el estado de la consulta.
        switch (modo) {
            case "registrado":
                cambiarConsulta(consulta, false, false, true, false);
                break;
            case "descartado":
                cambiarConsulta(consulta, true, false, false, false);
                break;
            case "llamado":
                // Quitamos los otros pacientes llamados por este médico antes de llamar a uno nuevo
                quitarOtrosLlamados(false);
                cambiarConsulta(consulta, false, true, false, false);
                break;
            case "atendido":
                cambiarConsulta(consulta, false, false, false, false);
                break;
            default:
                break;
        }
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
     * Devuelve la siguiente consulta que se deberá atender según el orden de la lista de siguientes pacientes.
     * @param idConsultaActual el ID de la consulta que se está atendiendo actualmente.
     * @returns la consulta del siguiente paciente al que hay que atender.
     */
    const getSiguienteConsulta = (idConsultaActual) => {
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
        return (arraySP[0]? arraySP[0] : undefined);
    };

    /**
     * Actualiza el orden de los pacientes en local y en el BackEnd.
     * @param arraySP el nuevo array de siguientes pacientes reordenado.
     */
    const cambiarOrdenPacientes = (arraySP) => {
        // Generamos un array con los IDs de los pacientes reordenados para subirlo al BackEnd:
        let doctor = doc;
        let ordenPacientes = [];
        for (let paciente of arraySP)
            ordenPacientes.push(paciente.id);

        // Guardamos el orden en local y en el BackEnd
        peticionHTMLEnSegundoPlano('/medicos/'+doctor.usuario, 'PUT', ordenPacientes);
        doctor.ordenPacientes = ordenPacientes;
        setDoctor(doctor);
    };



    useEffect(() => {
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
                .then(respuesta => respuesta.json())
                .then(respuestaEnJSON => {
                    respuestaFetch = respuestaEnJSON;
                })
                .catch(() => console.log("Hubo un fallo al realizar un fetch a "+URL+" con el método "+metodo+(body?" y body"+body:"")));

            if (respuestaFetch)
                return respuestaFetch;
            else
                return await Promise.reject("Hubo un fallo al realizar un fetch a " + URL + " con el método " + metodo + (body ? " y body" + body : ""));
        };

        /**
         * Función que permite lanzar los fetch pendientes de procesarse.
         */
        const lanzarFetchsPendientes = async () => {
            // Se lanzan las peticiones pendientes
            let fetchs = fetchsPendientes;
            for (let i in fetchsPendientes) {
                try {
                    await peticionHTML(fetchs[i].URL, fetchs[i].metodo, fetchs[i].body);
                    fetchs.splice(i, 1);
                } catch (e) {
                    console.log("Hubo un error realizando un fetch pendiente. Se va a reintentar.");
                    try {
                        await peticionHTML(fetchs[i].URL, fetchs[i].metodo, fetchs[i].body);
                        console.log("En el segundo intento sí que se ha conseguido realizar el fetch.");
                    } catch (e) {
                        console.log("Volvió a fallar el fetch. Se descarta.")
                    }
                }
            }
            setFetchsPendientes(fetchs);
        }

        /**
         * Función que descarga la lista de consultas completa y/o establece nuevas consultas y/o médicos.
         */
        const fetchDataConsultas = () => {
            if (sincronizarCambios) {
                if (fetchsPendientes) {
                    lanzarFetchsPendientes()
                        .then(() => {
                            actualizarConsultasLocales();
                            actualizarMedicoLocal();
                        })
                }
                peticionHTML('/consultas')
                    .then(async consultas => {
                        // Guardamos todas las consultas en datosConsultas solo si ha habido cambios:
                        let cambios = (JSON.stringify(consultas) !== JSON.stringify(datosConsultas));
                        if (cambios) {
                            let arrayConsultas;
                            if (loggedIn) {
                                // Queremos solo las consultas del médico actual
                                arrayConsultas = []
                                for (let consulta of consultas) {
                                    if (consulta.medico === doc.usuario) {
                                        arrayConsultas.push(consulta);
                                    }
                                }
                            } else {
                                arrayConsultas = [...consultas];
                            }
                            if (!consultasNuevas) {
                                setDatosConsultas(arrayConsultas);
                                log("Guardando cambios fetch");
                            }
                            setInterfazListaSeguro(true);
                        }

                        // Se comprueba si ha cambiado el array del orden de pacientes del médico
                        if (loggedIn) {
                            await peticionHTML("/medicos")
                                .then(medicos => {
                                    for (let medico of medicos) {
                                        if (medico.usuario === doc.usuario) {
                                            if (JSON.stringify(medico) !== JSON.stringify(doc)) {
                                                if (!doctorNuevo) {
                                                    setDoc(medico);
                                                    log("Guardando cambios fetch");
                                                }
                                                setInterfazListaSeguro(true);
                                            }
                                            break;
                                        }
                                    }
                                })
                        }
                    })
                    .catch(() => {
                        console.log("Hubo un fallo tratando de descargar los datos de los pacientes del BackEnd. Se carga la página igualmente.");
                        // El fetch falló, por lo que no tenemos que cargar nada más
                        setInterfazListaSeguro(true);
                    });
            }
        }

        const actualizarConsultasLocales = () => {
            // Se actualizan las consultas
            if (consultasNuevas) {
                setDatosConsultas(consultasNuevas);
                asegurarSincronizacionConsultas()
                    .then(() => {
                        setConsultasNuevas(undefined);
                        log("Consultas aseguradas :)");
                    });
            }
        };

        const actualizarMedicoLocal = () => {
            // Se actualiza el médico
            if (doctorNuevo) {
                setDoc(doctorNuevo);
                asegurarSincronizacionDoctor()
                    .then(() => {
                        setDoctorNuevo(undefined);
                        log("Médico asegurado :)")
                    });
            }
        };

        /**
         * Función que descarga la lista de pacientes
         * @returns respuesta del fetch de descarga de la lista de pacientes
         */
        const fetchDataPacientes = async () => {
            return await peticionHTML('/paciente');
        }

        /**
         * Función que permite asegurar que se pueden seguir sincronizando las consultas de forma segura.
         */
        const asegurarSincronizacionConsultas = async () => {
            const getConsultasBackEnd = async () => {
                let consultas = await peticionHTML('/consultas');
                // Nos quedamos solo con las consultas de nuestro médico
                let consultasBackEnd = [];
                for (let consulta of consultas) {
                    if (consulta.medico === doc.usuario)
                        consultasBackEnd.push(consulta);
                }
                return consultasBackEnd;
            };

            const arraysDiferentes = (array1, array2) => {
                if (array1.length !== array2.length)
                    return true;
                let esta = false;
                for (let elem1 of array1) {
                    esta = false;
                    for (let elem2 of array2) {
                        if (JSON.stringify(elem1) === JSON.stringify(elem2)) {
                            esta = true;
                            break;
                        }
                    }
                    if (!esta)
                        return true;
                }
                return false;
            };

            // Se obtienen las consultas del BackEnd
            let consultasBackEnd = await getConsultasBackEnd();

            // Si las consultas del BackEnd no son válidas, no se cambia nada
            if (!consultasBackEnd) {
                return;
            }

            // Comprobamos si las consultas ya están actualizadas
            let sin_actualizar = arraysDiferentes(consultasBackEnd, consultasNuevas);

            // Contamos el número de veces que se ha hecho fetch y que las comsultas han diferido respecto a las locales
            let repeticiones = 0;

            // Si no están actualizadas, se espera a que las consultass locales coincidan con las del BackEnd
            while (sin_actualizar) {
                if (repeticiones > 10) {
                    console.log("Se deja de asegurar las consultas al sobrepasar las 10 vueltas.");
                    break;
                }
                consultasBackEnd = await getConsultasBackEnd();
                sin_actualizar = arraysDiferentes(consultasBackEnd, consultasNuevas);
                repeticiones++;
            }
            log("Se han asegurado las consultas tras "+repeticiones+" repeticiones.");
        };

        /**
         * Función que permite asegurar que se pueden seguir sincronizando el médico de forma segura.
         */
        const asegurarSincronizacionDoctor = async () => {
            const getDoctorBackend = async () => {
                let medicos = await peticionHTML('/medicos');
                for (let medico of medicos) {
                    if (medico.usuario === doctorNuevo.usuario) {
                        return medico;
                    }
                }
            };

            // Se busca el médico de los datos del BackEnd
            let doctorBackend = await getDoctorBackend();

            // Si se ha especificado un doctor inválido, no se cambia nada
            if (!doctorBackend) {
                return;
            }

            // Comprobamos si el médico ya está actualizado
            let sin_actualizar = (JSON.stringify(doctorNuevo) !== JSON.stringify(doctorBackend));

            // Contamos el número de veces que se ha hecho fetch y que las comsultas han diferido respecto a las locales
            let repeticiones = 0;

            // Si no esstá actualizado, se espera a que el médico local coincida con el del BackEnd
            while (sin_actualizar) {
                if (repeticiones > 10) {
                    console.log("Se deja de asegurar el médico al sobrepasar las 10 vueltas.");
                    break;
                }
                doctorBackend = await getDoctorBackend();
                sin_actualizar = (JSON.stringify(doctorNuevo) !== JSON.stringify(doctorBackend));
                repeticiones++;
            }
            log("Se ha asegurado el médico tras "+repeticiones+" repeticiones.");
        };

        const setInterfazListaSeguro = (valor) => {
            if (loggedIn !== undefined) {
                setInterfazLista(valor);
            }
        };

        // Según se carga el valor de loggedIn en el useState inicial, se activa esta función.
        // Por ello, descartamos la primera ejecución de este useEffect con la variable de control useEffectListo
        if (!useEffectListo) {
            setUseEffectListo(true);
            return;
        } else if (loggedIn === undefined) {
            return;
        }

        // Recogemos los pacientes del BackEnd
        fetchDataPacientes()
            .then(pacientes => {
                // Guardamos los pacientes en la lista general de pacientes.
                setDatosTodosLosPacientes(pacientes);
            })
            .catch(() => {
                console.log("Hubo un fallo tratando de descargar los datos de los pacientes del BackEnd.");
            });

        // Sincronizamos por primera vez las consultas
        fetchDataConsultas();

        // Buscamos cambios en los datos del BackEnd cada medio segundo para mantener los datos sicronizados
        const timer = setInterval(fetchDataConsultas, 2000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedIn, sincronizarCambios, consultasNuevas, doctorNuevo]);

    useEffect(() => {
        /**
         * Función que permite establecer el valor de loggedIn en función de la respuesta a un fetch a /medicos
         */
        const fetchMedicos = async () => {
            await fetch("/medicos")
                .then(respuesta => respuesta.json())
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
        };
        // Si iniciamos sesión sin recargar la página, no necesitamos actualizar nada aquí
        if (loggedInComprobado) {
            return;
        }

        // Restauramos el valor de la cookie o le asignamos un valor por defecto
        if (!cookies.usuarioMedico)
            setCookie('usuarioMedico', "", { path: '/' });

        fetchMedicos()
            .catch(() => {
                // El fetch falló, por lo que no hemos iniciado sesión o el BackEnd está desconectado
                setLoggedIn(false);
            });
        setLoggedInComprobado(true);
    }, [setCookie, cookies, loggedInComprobado]);

    return (interfazLista? <Router>
              <div className="App">
                <Routes>
                    <Route path="/medico/lista_siguientes_pacientes" element={loggedIn?<><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={loggedIn}/><ListaSiguientesPacientesMedico datosConsultas={datosConsultas} getConsultas={getConsultas} cambiarModoConsultaPaciente={cambiarModoConsultaPaciente} cambiarOrdenPacientes={cambiarOrdenPacientes}/><Footer/></> : <Navigate to="/medico/login" />} />
                    <Route path="/medico/lista_completa_pacientes" element={loggedIn?<><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={loggedIn}/><ListaCompletaPacientesMedico datosTodosLosPacientes={datosTodosLosPacientes} ordenarAlfabeticamente={ordenarAlfabeticamente} cambiarModoConsultaPaciente={cambiarModoConsultaPaciente} getConsultaFromNombrePaciente={getConsultaFromNombrePaciente}/><Footer/></> : <Navigate to="/medico/login" />} />
                    <Route path="/medico/lista_pacientes_descartados" element={loggedIn?<><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={loggedIn}/><ListaPacientesNoAtendidosMedico datosConsultas={datosConsultas}  datosPacientesNoAtendidos={getConsultas(datosConsultas, "PD")} cambiarModoConsultaPaciente={cambiarModoConsultaPaciente}/><Footer/></> : <Navigate to="/medico/login" />} />
                    <Route path="/medico/login" element={<><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={loggedIn}/><LoginMedico setLoggedIn={setLoggedIn} setDoc={setDoctor}/><Footer/></>} />
                    <Route path="/medico/autenticar" element={<Navigate to={"/"}/>}/>

                    <Route path="/medico/detalles_paciente/:id" element={loggedIn?<><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={loggedIn}/><DetallesPaciente useQuery={useQuery} datosHistoriaClinica={datosHistoriaClinica} getConsultaFromId={getConsultaFromId} cambiarModoConsultaPaciente={cambiarModoConsultaPaciente} getSiguienteConsulta={getSiguienteConsulta}/><Footer/></> : <Navigate to="/medico/login" />} />
                    <Route path="/medico/nueva_consulta_paciente/:id" element={loggedIn?<><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={loggedIn}/><NuevaConsulta useQuery={useQuery} getConsultaFromId={getConsultaFromId}/><Footer/></> : <Navigate to="/medico/login" />} />
                    <Route path="/medico/recetas_paciente/:id" element={loggedIn?<><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={loggedIn}/><RecetasPaciente useQuery={useQuery} getConsultaFromId={getConsultaFromId}/><Footer/></> : <Navigate to="/medico/login" />} />
                    <Route path="/medico/pruebas_paciente/:id" element={loggedIn?<><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={loggedIn}/><PruebasMedicasPaciente useQuery={useQuery} getConsultaFromId={getConsultaFromId}/><Footer/></> : <Navigate to="/medico/login" />} />

                    <Route path="/paciente/login" element={<><LoginKiosko /><Footer/></>} />
                    <Route path="/paciente/login/dni" element={<><LoginKioskodni/><Footer/></>} />
                    <Route path="/paciente/login/cipa" element={<><LoginKioskocipa/><Footer/></>}  />
                    <Route path="/paciente/ticket" element={<><PacienteRegistradoKiosko useQuery={useQuery} salaDeEspera={salaDeEspera}/><Footer /></>}  />

                    <Route path="/sala_de_espera" element={<><Header salaDeEspera={true}/><ListaSalaDeEspera salaDeConsulta={doc.salaDeConsulta} setSincronizarCambios={setSincronizarCambios}/><Footer salaDeEspera={true}/></>} />

                    <Route path="/contacto" element={<><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={loggedIn}/><Contacto/><Footer/></>} />
                    <Route path="/" element={loggedIn? <><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={false}/><Home cambiarModoConsultaPaciente={cambiarModoConsultaPaciente} getSiguienteConsulta={getSiguienteConsulta} doc={doc.nombre}/><Footer/></> : <><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={false}/><HomePreLogin /><Footer/></>} />
                    <Route path="*" element={<><Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} mostrarHomeyCola={loggedIn}/><PaginaDeError/><Footer/></>} />
                </Routes>
              </div>
          </Router> : <PaginaDeCarga/>
  );
}

export default App;
