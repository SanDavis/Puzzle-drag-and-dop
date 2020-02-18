window.onload = inicializar;

const VACIA = 16;

const FILAS = 4, COLUMNAS = 4;

var tablero = new Array();

var tableroInicial = new Array();

var celdas = document.getElementsByTagName('td');

var celdaMovida;

var intentos = 0;

var tiempo = 0;

var tInterval = null;

function inicializar() {

    // La celda con el 16 será la libre
    for (let i = 0, k = 0; i < FILAS; i++) {
        tablero[i] = new Array(FILAS);
        tableroInicial[i] = new Array(FILAS);
        for (let j = 0; j < COLUMNAS; j++ , k++) {
            tablero[i][j] = k + 1;
            tableroInicial[i][j] = k + 1;
            if (k < 15) {
                document.getElementById(`celda_${k}`).textContent = k + 1;
            }
        }
    }
    // console.log(tableroInicial);

    document.getElementById('btn').onclick = asignarEventos;
}

function asignarEventos() {

    this.textContent = 'Reiniciar';

    for (let celda of celdas) {
        celda.draggable = true;
        celda.ondragstart = moverFicha;

    }

    desordenar();

    // console.log(tablero, 'Desordenado');

    intentos = -1;
    contarIntentos();

    tiempo = 0;
    clearInterval(tInterval);
    tInterval = setInterval(contarTiempo, 1000);
}

function desordenar() {

    tablero = tablero.join();

    tablero = tablero.split(',');

    tablero = tablero.map((element) => parseInt(element));

    tablero = tablero.sort(() => Math.random() - 0.5);

    tablero = tablero.reduce((rows, key, i) => {

        if (key == 16) {
            celdas[i].className = 'vacia';
        } else {
            celdas[i].textContent = key;
            celdas[i].className = `prueba`;
            celdas[i].classList.add('animated', 'rollIn');//zoomInUp
        }
        celdas[i].classList.add('desordenar');

        return ((i % 4 == 0) ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows;
    }, []);
}

function prevenirDragover() {
    event.preventDefault();
}

function moverFicha() {

    let celdaVacia = document.querySelector('.vacia');

    celdaMovida = this;

    celdaVacia.addEventListener('dragover', prevenirDragover);
    celdaVacia.addEventListener('drop', eventoDrop);

}

function eventoDrop() {

    let x, y; //Pos en el tablero de la celda movida

    for (let i = 0; i < tablero.length; i++) {
        for (let j = 0; j < tablero[i].length; j++) {
            if (tablero[i][j] == celdaMovida.textContent) {
                x = i;
                y = j;
            }
        }
    }

    console.log(x, y, 'Pos x y dentro');

    if (((x - 1) in tablero) && tablero[x - 1][y] == VACIA) {
        console.log(((x - 1) in tablero), 'arriba');

        intercambiar(x, y, (x - 1), y);
    } else if (((y + 1) in tablero) && tablero[x][y + 1] == VACIA) {
        console.log(((y + 1) in tablero), 'derecha');

        intercambiar(x, y, x, (y + 1));
    } else if (((x + 1) in tablero) && tablero[x + 1][y] == VACIA) {
        console.log(((x + 1) in tablero), 'abajo');

        intercambiar(x, y, (x + 1), y);
    } else if (((y - 1) in tablero) && tablero[x][y - 1] == VACIA) {
        console.log(((y - 1) in tablero), 'izquierda');

        intercambiar(x, y, x, (y - 1));
    }

    // this.removeEventListener('drop', eventoDrop, false);
    this.removeEventListener('dragover', prevenirDragover, false);
}

function intercambiar(x, y, x1, y1) {

    document.querySelector('.vacia').removeAttribute('class');

    tablero[x1][y1] = tablero[x][y]; //Asignamos a la nueva posicion el valor de la celda a mover
    tablero[x][y] = VACIA;


    for (let i = 0, k = 0; i < tablero.length; i++) {
        for (let j = 0; j < tablero[i].length; j++ , k++) {
            celdas[k].textContent = tablero[i][j];
            if (tablero[i][j] == VACIA) {
                celdas[k].className = 'vacia';
                celdas[k].draggable = false;
                celdas[k].textContent = '';
            } else {
                celdas[k].draggable = true;
            }
        }
    }
    contarIntentos();

    // RECOMENDACIÓN:  SUSTITUIR esFinal() en el siguiente if 
    // por (intentos > 5) para comprobar la condicion de finalizacion
    if (esFinal()) {
        premiar();
    }
}

function esFinal() {
    return tablero == tableroInicial;
}

function premiar() {
    let tiempo = document.getElementById('tiempo');
    alert(` ¡Felicidades!
    ¡Ha ganado!
    Número de intentos: ${intentos}
    Tiempo: ${tiempo.textContent}
    `);

    intentos = -1;
    contarIntentos();
    clearInterval(tInterval);
    tiempo.textContent = '00:00:00';
}

function contarIntentos() {
    intentos++;
    document.getElementById('intentos').textContent = intentos;
}

function contarTiempo() {

    //La variable tiempo almacena los segundos a traves de los cuales sacaré la hora
    // minutos y segundos
    let hora = Math.floor((tiempo / 60) / 60);
    hora = formatear(hora);

    let minutos = Math.floor(tiempo / 60);
    minutos = formatear(minutos);

    let segundos = tiempo - (60 * minutos);
    segundos = formatear(segundos);

    document.getElementById('tiempo').textContent = `${hora + ':' + minutos + ':' + segundos}`;
    tiempo++;
}

function formatear(num) {
    return (num < 10) ? '0' + num : num;
}