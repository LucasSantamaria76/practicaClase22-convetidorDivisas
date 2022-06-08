const tipoMonedaEntrada = document.getElementById('tipoMonedaEntrada');
const tipoMonedaSalida = document.getElementById('tipoMonedaSalida');
const valorEntrada = document.getElementById('inputEntrada');
const valorSalida = document.getElementById('inputSalida');
const botonConvertir = document.getElementById('botonConvertir');
const botonLimpiar = document.getElementById('botonLimpiar');
const form = document.querySelector('form');
const contenedorListadoHistorial = document.querySelector('.historial');
const contenedorHistorial = document.querySelector('.contenedorHistorial');

const host = 'https://api.frankfurter.app';
let listadoHistorial = [];

// Funciones
const obtenerTipoMoneda = async () => {
  const url = `${host}/currencies`;
  const respuesta = await fetch(url);
  const datos = await respuesta.json();
  return datos;
};

const llenarTiposDeMoneda = async () => {
  const tiposMoneda = await obtenerTipoMoneda();
  Object.keys(tiposMoneda).map((key) => {
    const option = document.createElement('option');
    option.value = key;
    option.innerText = `${key} --- ${tiposMoneda[key]}`;
    key === 'USD' && (option.selected = true);
    tipoMonedaEntrada.appendChild(option);
    tipoMonedaSalida.appendChild(option.cloneNode(true));
  });
};

const renderHistorial = () => {
  while (contenedorListadoHistorial.firstChild) contenedorListadoHistorial.removeChild(contenedorListadoHistorial.firstChild);
  listadoHistorial.length ? contenedorHistorial.classList.remove('hidden') : contenedorHistorial.classList.add('hidden');
  listadoHistorial.map((historial) => {
    const item = document.createElement('p');
    item.classList.add('itemHistorial');
    item.textContent = `${historial.valorEntrada} ${historial.tipoMonedaEntrada} equivalen a ${historial.valorSalida} ${historial.tipoMonedaSalida}`;
    contenedorListadoHistorial.appendChild(item);
  });
};

const convertirDivisa = async () => {
  try {
    if (tipoMonedaEntrada.value === tipoMonedaSalida.value || !valorEntrada.value.trim()) {
      let textoError;
      !valorEntrada.value.trim()
        ? (textoError = 'El valor de entrada no puede estar vacio')
        : (textoError = 'Las monedas deben ser diferentes');
      Swal.fire({
        title: 'Error!',
        text: `${textoError}`,
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }
    const url = `${host}/latest?amount=${valorEntrada.value}&from=${tipoMonedaEntrada.value}&to=${tipoMonedaSalida.value}`;
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    valorSalida.value = datos.rates[tipoMonedaSalida.value].toFixed(4);
    Swal.fire({
      title: `${valorEntrada.value} ${tipoMonedaEntrada.value} eqivalen a ${valorSalida.value} ${tipoMonedaSalida.value}`,
      confirmButtonText: 'Aceptar',
    });
    listadoHistorial.unshift({
      valorEntrada: valorEntrada.value,
      tipoMonedaEntrada: tipoMonedaEntrada.value,
      valorSalida: valorSalida.value,
      tipoMonedaSalida: tipoMonedaSalida.value,
    });
    localStorage.setItem('historialConversiones', JSON.stringify(listadoHistorial));
    renderHistorial();
  } catch (error) {
    Swal.fire({
      title: 'Error!',
      text: `${error}`,
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  llenarTiposDeMoneda();
  listadoHistorial.length ? contenedorHistorial.classList.remove('hidden') : contenedorHistorial.classList.add('hidden');
  if (localStorage.getItem('historialConversiones')) {
    listadoHistorial = JSON.parse(localStorage.getItem('historialConversiones'));
    renderHistorial();
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  convertirDivisa();
});

botonLimpiar.addEventListener('click', () => {
  valorEntrada.value = '';
  valorSalida.value = '';
  valorEntrada.focus();
});

tipoMonedaEntrada.addEventListener('change', () => valorEntrada.focus());
tipoMonedaSalida.addEventListener('change', () => valorEntrada.focus());
