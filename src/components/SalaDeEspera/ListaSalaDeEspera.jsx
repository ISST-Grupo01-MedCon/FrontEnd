import React, {useEffect, useState} from "react";
import {Container, Table} from "react-bootstrap";

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

const useAudio = url => {
    const [audio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);

    const toggle = () => setPlaying(!playing);

    useEffect(() => {
            playing ? audio.play() : audio.pause();
        },
        [playing]
    );

    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, []);

    return [playing, toggle];
};

export const ListaSalaDeEspera = (props) => {
    const [datosPacientesLlamados, setDatosPacientesLlamados] = useState(props.datosPacientesLlamados);
    const [backgroundColor, setbackgroundColor] = useState("#FFFFFF");
    const [color, setColor] = useState("#000000");
    const [fontWeight, setFontWeight] = useState("");
    const [repeticiones, setRepeticiones] = useState(0);
    const [playing, toggle] = useAudio("/windows-notificacion.mp3");

    useEffect(() => {
        const fetchData = async () => {
            const data = await (await fetch('/consultas')).json();
            return data;
        }

        const parpadeo = () => {
            setColor((color === "#000000") ? "#FFFFFF" : "#000000");
            setbackgroundColor((backgroundColor === "#FFFFFF") ? "#6BB549" : "#FFFFFF");
            setFontWeight((fontWeight === "")? "bold" : "");
        }

        const timer = setInterval(() => {
            fetchData()
                .catch(console.error)
                .then(data => {
                    fetchData()
                        .catch(console.error)
                        .then(data => {
                            let arrayPL = [];

                            // Buscamos los pacientes llamados de la lista de consultas descargada del BackEnd
                            for (let i in data) {
                                if ((data[i].ticketId !== null) && (data[i].ticketId !== undefined) && (data[i].ticketId !== "") && data[i].llamado ) {
                                    // Si tiene ticketID y tiene llamado a true, es un paciente llamado desde la sala de espera
                                    arrayPL.push({ticketID: data[i].ticketId , id: parseInt(data[i].id), consulta: "PEDIATRÍA"});
                                }
                            }

                            // Se buscan cambios en la primera fila
                            if (((datosPacientesLlamados.length === 0) && (arrayPL.length > 0))|| ((arrayPL.length > 0) && (datosPacientesLlamados.length > 0) && (arrayPL[0].ticketID !== datosPacientesLlamados[0].ticketID)) || (repeticiones > 0)) {
                                // Repetimos el parpadeo 9 + 1 = 10 veces
                                setRepeticiones(repeticiones === 0? 9 : repeticiones - 1);
                                if (repeticiones === 0)
                                    toggle();
                                parpadeo();
                            }

                            setDatosPacientesLlamados(arrayPL);

                            clearInterval(timer)
                        });
                });
        }, 500);
        return () => clearInterval(timer);
    }, [datosPacientesLlamados, repeticiones, backgroundColor, color, fontWeight]);

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
};