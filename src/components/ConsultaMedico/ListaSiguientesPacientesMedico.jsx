import React, {useState} from "react";
import {Button, Col, Container, OverlayTrigger, Row, Table, Tooltip} from "react-bootstrap";
import {arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {
    closestCenter,
    DndContext, DragOverlay,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {SortableContext} from '@dnd-kit/sortable';
import {useNavigate} from "react-router-dom";
import {
    blueButton,
    headerStyle,
    ladoIconosNormales,
    linkButtonStyle,
    movingRowStyle,
    transparentButtonStyle
} from "../../styles";

/**
 * Devuelve el índice de la fila de siguientes pacientes que contiene el identificador especificado
 * @param array array de siguientes pacientes
 * @param identificador identificador del paciente buscado
 * @returns {number} el índice de la fila que contiene a dicho paciente en la lista de siguientes pacientes
 */
const getIndexFromIdentificador = (array, identificador) => {
    for (let i in array) {
        if (array[i].ticketID === identificador) {
            return i;
        }
    }
    return -1;
};

const Fila = (props) => {
    const navigate = useNavigate();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.identificador});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }
    return (<tr ref={setNodeRef} style={style}>
        <td {...listeners} {...attributes} role="button" tabIndex="0"><OverlayTrigger placement="top" overlay={(props.tooltips === "no") ? <></> : <Tooltip>Arrástrame desde aquí</Tooltip>}><img width={ladoIconosNormales} height={ladoIconosNormales} alt={"Drag"} src="/drag.svg"/></OverlayTrigger></td>
        <td>{props.identificador}</td>
        <td>{props.nombre}</td>
        <td>
            <button style={transparentButtonStyle} onClick={() => props.cambiarModoPaciente("atendido", props.idPaciente)}><OverlayTrigger placement="top" overlay={(props.tooltips === "no") ? <></> : <Tooltip>Marcar como atendido</Tooltip>}><img width={ladoIconosNormales} height={ladoIconosNormales} alt={"Tick"} src="/tick.png"/></OverlayTrigger></button>
            <button style={transparentButtonStyle} onClick={() => props.cambiarModoPaciente("descartado", props.idPaciente)}><OverlayTrigger placement="top" overlay={(props.tooltips === "no") ? <></> : <Tooltip>Descartar</Tooltip>}><img width={ladoIconosNormales} height={ladoIconosNormales} alt={"Cruz"} src="/cruz.png"/></OverlayTrigger></button>
            <button style={transparentButtonStyle} onClick={() => navigate("/medico/detalles_paciente/"+props.idPaciente)}><OverlayTrigger placement="top" overlay={(props.tooltips === "no") ? <></> : <Tooltip>Más opciones</Tooltip>}><img width={ladoIconosNormales} height={ladoIconosNormales} alt={"Ajustes"} src="/options.svg"/></OverlayTrigger></button>
        </td>
    </tr>);
};

const Filas = (props) => {
    return(props.datosSiguientesPacientes.map((paciente, pos) => {
        return(<Fila key={pos} idPaciente={paciente.id} identificador={paciente.ticketID}
                     nombre={props.datosTodosLosPacientes[paciente.id].nombre} cambiarModoPaciente={props.cambiarModoPaciente}/>);
    }));
}

export const ListaSiguientesPacientesMedico = (props) => {
    const navigate = useNavigate();

    /* Variables y funciones para dnd-kit */
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        }),
        useSensor(TouchSensor)
    );

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = getIndexFromIdentificador(props.datosSiguientesPacientes, active.id);
            const newIndex = getIndexFromIdentificador(props.datosSiguientesPacientes, over.id);
            props.setDatosSiguientesPacientes(arrayMove(props.datosSiguientesPacientes, oldIndex, newIndex));
        }
        setActiveId(null);
    };

    const llamarPrimerPaciente = () => {
        if (props.datosSiguientesPacientes.length > 0) {
            let idPaciente = props.datosSiguientesPacientes[0].id;
            navigate("/medico/detalles_paciente/"+idPaciente);
            props.cambiarModoPaciente("atendido", idPaciente);
            props.cambiarModoPaciente("llamado", idPaciente);
        }
    }

    return(
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={props.datosSiguientesPacientes} strategy={verticalListSortingStrategy}>
                <Container>
                    <Row style={{paddingBottom: 30}}>
                        <Col style={headerStyle}><h1>Siguientes pacientes</h1></Col>
                    </Row>
                    <Row style={{paddingBottom: 10}}>
                        <Col xs={{ order: 'last' }}><Button style={linkButtonStyle} onClick={() => navigate("/medico/lista_completa_pacientes")}>Lista completa pacientes</Button></Col>
                        <Col xs><Button onClick={llamarPrimerPaciente} variant={"light"} size="lg" style={blueButton}>Siguiente paciente</Button></Col>
                        <Col xs={{ order: 'first' }}><Button style={linkButtonStyle} onClick={() => navigate("/medico/lista_pacientes_descartados")}>Pacientes descartados</Button></Col>
                    </Row>
                    <Table responsive>
                        <thead>
                        <tr>
                            <th>Mover</th>
                            <th>Identificador</th>
                            <th>Nombre completo</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            <Filas datosSiguientesPacientes={props.datosSiguientesPacientes} datosTodosLosPacientes={props.datosTodosLosPacientes} cambiarModoPaciente={props.cambiarModoPaciente}/>
                        </tbody>
                    </Table>
                    <DragOverlay wrapperElement="div">{activeId ? <Table responsive style={movingRowStyle}><tbody><Fila tooltips="no" idPaciente={0} identificador={activeId} nombre={props.datosTodosLosPacientes[props.datosSiguientesPacientes[getIndexFromIdentificador(props.datosSiguientesPacientes, activeId)].id].nombre}/></tbody></Table> : null}</DragOverlay>
                </Container>
            </SortableContext>
        </DndContext>);
};