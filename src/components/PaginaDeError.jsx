import React from "react";
import {Container} from "react-bootstrap";
import {errorPageMargins} from "../styles";

export const PaginaDeError = () => {
    return(
        <>
            <Container style={errorPageMargins}/>
            <h1>Error: no se ha podido acceder a la página solicitada</h1>
            <Container style={errorPageMargins}/>
        </>
    );
};