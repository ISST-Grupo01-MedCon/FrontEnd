import React, {useEffect, useState} from "react";
import {Container, Table} from "react-bootstrap";
import ReactPlayer from 'react-player';

const Fila = (props) => {
    const style = (props.color) ? {backgroundColor: props.backgroundColor, color: props.color, fontWeight: props.fontWeight} : {};
    return (<tr style={style}>
        <td>{props.iden}</td><td>{props.consulta}</td>
    </tr>);
};

const Filas = (props) => {
    return(props.datosPacientesLlamados.map((paciente, pos) => {
        if (pos === 0) {
            return(<Fila color={props.color} backgroundColor={props.backgroundColor} fontWeight={props.fontWeight} key={pos} iden={paciente.ticketID} consulta={paciente.consulta}/>);
        } else
            return (<Fila key={pos} iden={paciente.ticketID} consulta={paciente.consulta}/>);
    }));
}

// const useAudio = url => {
//     const [audio] = useState(new Audio(url));
//     const [playing, setPlaying] = useState(false);

//     const toggle = () => setPlaying(!playing);

//     useEffect(() => {
//             playing ? audio.play() : audio.pause();
//         },
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//         [playing]
//     );

//     useEffect(() => {
//         audio.addEventListener('ended', () => setPlaying(false));
//         return () => {
//             audio.removeEventListener('ended', () => setPlaying(false));
//         };
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     return [playing, toggle];
// };

export const ListaSalaDeEspera = (props) => {
    const [datosPacientesLlamados, setDatosPacientesLlamados] = useState([]);
    const [backgroundColor, setbackgroundColor] = useState("#FFFFFF");
    const [color, setColor] = useState("#000000");
    const [fontWeight, setFontWeight] = useState("");
    const [repeticiones, setRepeticiones] = useState(0);
    const [mostrarEfectos, setEfectos] = useState(false);
    //const [, toggle] = useAudio("../../audio/windows-notificacion.mp3");
    props.setSincronizarCambios(false);

    useEffect(() => {
        const fetchDataConsultas = async () => {
            return await fetch('/consultas');
        }

        const fetchDataMedicos = async () => {
            return await fetch('/medicos/medico-consulta');
        }

        const parpadeo = () => {
            setColor((color === "#000000") ? "#FFFFFF" : "#000000");
            setbackgroundColor((backgroundColor === "#FFFFFF") ? "#6BB549" : "#FFFFFF");
            setFontWeight((fontWeight === "")? "bold" : "");
        }

        const timer = setInterval(() => {
            fetchDataConsultas()
                .then(respuesta => respuesta.json())
                .then(consultas => {
                    // Obtenemos la lista de médicos
                    fetchDataMedicos()
                        .then(respuesta => respuesta.json())
                        .then(medico_consulta => {
                            let arrayPL = [];

                            // Buscamos los pacientes llamados de la lista de consultas descargada del BackEnd
                            for (let i in consultas) {
                                if ((consultas[i].ticketId !== null) && (consultas[i].ticketId !== undefined) && (consultas[i].ticketId !== "") && consultas[i].llamado) {
                                    let salaDeConsulta = "SALA 2";
                                    // Buscamos de la consulta su sala de consulta:
                                    if (medico_consulta[consultas[i].medico])
                                        salaDeConsulta = medico_consulta[consultas[i].medico];
                                    // Si tiene ticketID y tiene llamado a true, es un paciente llamado desde la sala de espera
                                    arrayPL.push({ticketID: consultas[i].ticketId , id: parseInt(consultas[i].id), consulta: salaDeConsulta});
                                }
                            }

                            // Se buscan diferencias:
                            // Esta función devuelve el elemento pasado como parámetro si no está en el array
                            let elementoEnArray = (elemento, array) => {
                                let encontrado = false;
                                for (let elem of array) {
                                    if (JSON.stringify(elemento) === JSON.stringify(elem)) {
                                        encontrado = true;
                                        return;
                                    }
                                }
                                if (!encontrado) return elemento;
                            }
                            let nuevoArrayPL;
                            setEfectos(false);
                            // Se comprueba elemento a elemento si tienen diferencias, sin importar el orden
                            let cambio = parseInt(datosPacientesLlamados.length) !== parseInt(arrayPL.length);
                            if (!cambio) {
                                for (let consulta of datosPacientesLlamados) {
                                    if (elementoEnArray(consulta, arrayPL)) {
                                        cambio = true;
                                        break;
                                    }
                                }
                                if (cambio) {
                                    // Un médico ha sustituido un paciente llamado por otro
                                    // Ponemos dicho paciente arriba del todo:
                                    let consultaLlamadaAnterior;
                                    for (let consulta of datosPacientesLlamados) {
                                        if (elementoEnArray(consulta, arrayPL)) {
                                            consultaLlamadaAnterior = consulta;
                                            break;
                                        }
                                    }
                                    nuevoArrayPL = JSON.parse(JSON.stringify(datosPacientesLlamados));
                                    nuevoArrayPL.splice(datosPacientesLlamados.indexOf(consultaLlamadaAnterior), 1);
                                    let nuevasConsultasLlamadas = arrayPL.filter(x => elementoEnArray(x, nuevoArrayPL));
                                    // Juntamos
                                    nuevoArrayPL = nuevasConsultasLlamadas.concat(nuevoArrayPL);
                                    // Se muestran los efectos para notificar a los pacientes llamados
                                    setRepeticiones(0);
                                    setEfectos(true);
                                } else {
                                    // No ha cambiado nada
                                    nuevoArrayPL = datosPacientesLlamados;
                                }
                            } else {
                                let elementoEnArray = (elemento, array) => {
                                    let encontrado = false;
                                    for (let elem of array) {
                                        if (JSON.stringify(elemento) === JSON.stringify(elem)) {
                                            encontrado = true;
                                            break;
                                        }
                                    }
                                    if (!encontrado) return elemento;
                                }
                                let quitados = datosPacientesLlamados.filter(x => elementoEnArray(x, arrayPL));
                                let anadidos = arrayPL.filter(x => elementoEnArray(x, datosPacientesLlamados));
                                if (quitados.length > 0) {
                                    // Se han quitado pacientes llamados
                                    nuevoArrayPL = JSON.parse(JSON.stringify(datosPacientesLlamados));
                                    for (let quitado of quitados) {
                                        nuevoArrayPL.splice(datosPacientesLlamados.indexOf(quitado), 1);
                                    }
                                } else if (anadidos.length > 0) {
                                    // Se han añadido pacientes llamados
                                    nuevoArrayPL = anadidos.concat(datosPacientesLlamados);
                                    // Se muestran los efectos para notificar a los pacientes llamados
                                    setRepeticiones(0);
                                    setEfectos(true);
                                }
                            }

                            // Se buscan cambios en la primera fila
                            if (mostrarEfectos || (repeticiones > 0)) {
                                // Repetimos el parpadeo 9 + 1 = 10 veces
                                setRepeticiones(repeticiones === 0? 9 : repeticiones - 1);
                                //toggle();
                                
                                parpadeo();
                            }

                            setDatosPacientesLlamados(nuevoArrayPL? nuevoArrayPL : []);
                        })

                })
                .catch(() => {
                    console.log("Se ha producido un error realizando el fetch de la lista de consultas del BackEnd.");
                });
        }, 500);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [datosPacientesLlamados, repeticiones, backgroundColor, color, fontWeight]);

    if (mostrarEfectos) {
        return (
            <Container>
            <Table responsive>
                <thead>
                <tr>
                    <th>Identificador</th>
                    <th>Sala de consulta</th>
                </tr>
                </thead>
                <tbody>
                <Filas datosPacientesLlamados={datosPacientesLlamados} backgroundColor={backgroundColor} color={color} fontWeight={fontWeight}/>
                </tbody>
            </Table>
            <ReactPlayer 
            url={require('../../audio/windows-notificacion.mp3')}
            width="0%"
            height="0%"
            playing

            />
        </Container>
        )
    } else {
        return(
            <Container>
                <Table responsive>
                    <thead>
                    <tr>
                        <th>Identificador</th>
                        <th>Sala de consulta</th>
                    </tr>
                    </thead>
                    <tbody>
                    <Filas datosPacientesLlamados={datosPacientesLlamados} backgroundColor={backgroundColor} color={color} fontWeight={fontWeight}/>
                    </tbody>
                </Table>
            </Container>);
    }
};