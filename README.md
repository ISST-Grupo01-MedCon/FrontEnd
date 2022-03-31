# MedCon

En este repositorio se desarrolla el código fuente de MedCon, nuestro sistema de gestión de pacientes, consultas y salas de espera de un centro médico.

Por ahora tenemos una versión preliminar con una interfaz muy similar a la interfaz final del prototipo del proyecto.

Esta versión se está desarrollando con la versión LTS de Node (node v16.13.1 (npm v8.1.2)). Se puede utilizar el gestor de versiones de Node para utilizar esta versión:  `nvm use --lts`

## Rutas disponibles
Se han añadido las siguientes rutas desde [localhost:3000](http://localhost:3000):
- De la consulta del médico:
    + [/medico/lista_siguientes_pacientes](http://localhost:3000/medico/lista_siguientes_pacientes) lleva a la lista de siguientes pacientes.
    + [/medico/lista_completa_pacientes](http://localhost:3000/medico/lista_completa_pacientes) lleva a la lista completa de pacientes a los que pasa consulta periódicamente el médico.
    + [/medico/lista_pacientes_descartados](http://localhost:3000/medico/lista_pacientes_descartados) lleva a la lista de pacientes descartados que, por alguna razón, se registraron en el kiosko y finalmente no pudieron atender su cita.
    + [/medico/login](http://localhost:3000/medico/login) lleva a la pantalla de autenticación de los médicos.
- De los servicios externos a los que accede el médico:
    + [/medico/detalles_paciente/:id](http://localhost:3000/medico/detalles_paciente/:id) lleva a una pantalla que muestra la historia clínica del paciente con el id pasado como parámetro y dispone de botones para acceder a otros servicios externos o volver. Soporta los siguientes parámetros:
        * **from** le indica al componente desde dónde se ha accedido a esta página para configurar correctamente a dónde dirige su botón de Volver.
            + Si vale **tp** viene de la lista de todos los pacientes.
            + Si vale **pd** viene de la lista de pacientes descartados.
            + Si vale otra cosa o no se especifica en la URL, por defecto vuelve a la lista de siguientes pacientes.
    + [/medico/nueva_consulta_paciente/:id](http://localhost:3000/medico/nueva_consulta_paciente/:id) lleva a una pantalla que permite la creación de una nueva consulta para el paciente con el id pasado como parámetro y puede volver a la pantalla anterior. Soporta los siguientes parámetros:
        * **from** le indica al componente desde dónde se ha accedido a esta página para configurar correctamente a dónde dirige su botón de Volver.
            + Si vale **tp** viene de la lista de todos los pacientes.
            + Si vale **pd** viene de la lista de pacientes descartados.
            + Si vale otra cosa o no se especifica en la URL, por defecto vuelve a la lista de siguientes pacientes.
        * **from-pd** cuando vale **y** le indica al componente que se ha accedido directamente desde el botón de Citar de la lista de pacientes descartados. Así, al pulsar el botón de Atrás o Volver se retrocederá directamente a la lista de pacientes decartados.
          Si se especifica este parámetro junto con el de **from**, tendrá prioridad el de **from**.
          Por ejemplo, en http://localhost:3000/medico/nueva_consulta_paciente/0?from=tp&from-pd=y al pulsar el botón de Volver o Atrás se volverá a la página de detalles del paciente con id 0 y dándole de nuevo a Volver llevará a la lista completa de pacientes.
          Si **from-pd** tiene un valor **distinto de y**, se ignora.
    + [/medico/recetas_paciente/:id](http://localhost:3000/medico/recetas_paciente/:id) lleva a una pantalla que muestra las recetas del paciente con el id pasado como parámetro que se han recibido del sistema externo de recetas electrónicas. Puede volver a la pantalla anterior con un botón de atrás. Soporta los siguientes parámetros:
        * **from** le indica al componente desde dónde se ha accedido a esta página para configurar correctamente a dónde dirige su botón de Volver.
            + Si vale **tp** viene de la lista de todos los pacientes.
            + Si vale **pd** viene de la lista de pacientes descartados.
            + Si vale otra cosa o no se especifica en la URL, por defecto vuelve a la lista de siguientes pacientes.
    + [/medico/pruebas_paciente/:id](http://localhost:3000/medico/pruebas_paciente/:id) lleva a una pantalla que muestra las pruebas médicas que ha realizado del paciente con el id pasado como parámetro que se han recibido del sistema externo de pruebas médicas. Puede volver a la pantalla anterior con un botón de atrás. Soporta los siguientes parámetros:
        * **from** le indica al componente desde dónde se ha accedido a esta página para configurar correctamente a dónde dirige su botón de Volver.
            + Si vale **tp** viene de la lista de todos los pacientes.
            + Si vale **pd** viene de la lista de pacientes descartados.
            + Si vale otra cosa o no se especifica en la URL, por defecto vuelve a la lista de siguientes pacientes.
- Del kiosko con el que interactúan los pacientes:
    + [/paciente/login](http://localhost:3000/paciente/login) lleva a la pantalla de autenticación o registro de presencia del paciente que tiene una cita.
    + [/paciente/ticket](http://localhost:3000/paciente/ticket) muestra el ticket que contiene el identificador y la sala de espera a la que debe acudir el paciente y que se mostrará e imprimirá en el kiosko. De momento tiene datos estáticos.
- De la sala de espera:
    + [/sala_de_espera](http://localhost:3000/sala_de_espera) lleva a la tabla del orden de atención de la sala de espera que se mostrará en las pantallas de la sala de espera.
- Del sistema en general:
    + [/contacto](http://localhost:3000/contacto) lleva a la página para contactar con el centro médico.
    + [/](http://localhost:3000) es la ruta principal que lleva a la página llamada Home con la barra de navegación y los logotipos del sistema.

# Recursos de React:
## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
