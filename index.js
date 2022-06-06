const tipoMonedaEntrada = document.getElementById('tipoMonedaEntrada');
const tipoMonedaSalida = document.getElementById('tipoMonedaSalida');
const valorEntrada = document.getElementById('inputEntrada');
const valorSalida = document.getElementById('inputSalida');
const botonConvertir = document.getElementById('botonConvertir');
const botonLimpiar = document.getElementById('botonLimpiar');
const form = document.querySelector('form');

const host = 'https://api.frankfurter.app';

// Funciones
const obtenerTipoMoneda = async () => {
  const url = `${host}/currencies`;
  const respuesta = await fetch(url);
  const datos = await respuesta.json();
  return datos;
};

document.addEventListener('DOMContentLoaded', async () => {
  const tiposMoneda = await obtenerTipoMoneda();
  Object.keys(tiposMoneda).map((key) => {
    const option = document.createElement('option');
    option.value = key;
    option.innerText = `${key} --- ${tiposMoneda[key]}`;
    key === 'USD' && (option.selected = true);
    tipoMonedaEntrada.appendChild(option);
    tipoMonedaSalida.appendChild(option.cloneNode(true));
  });
});

const convertirDivisa = async () => {
  const url = `${host}/latest?amount=${valorEntrada.value}&from${tipoMonedaEntrada.value}&to=${tipoMonedaSalida.value}`;
  const respuesta = await fetch(url);
  const datos = await respuesta.json();
  return datos;
};

tipoMonedaEntrada.addEventListener('change', () => valorEntrada.focus());
tipoMonedaSalida.addEventListener('change', () => valorEntrada.focus());

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const datos = await convertirDivisa();
  valorSalida.value = datos.rates[tipoMonedaSalida.value].toFixed(2);
});

botonLimpiar.addEventListener('click', () => {
  valorEntrada.value = '';
  valorSalida.value = '';
  valorEntrada.focus();
});
