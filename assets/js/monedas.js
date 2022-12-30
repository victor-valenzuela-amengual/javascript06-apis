const cajaPesos = document.querySelector("#caja-pesos");
const cboMoneda = document.querySelector("#combo-monedas");
const botonFiltro = document.querySelector("#btn-filtro");
const resultado = document.querySelector("#resultado");
const grafico = document.querySelector("#estadistica");

let listaMonedas = [];
let monedas = [];
let RespuestaAPI = null;
let graf = new Chart();

const MostrarGrafico=()=>{
    if(graf){graf.destroy();}
    graf = new Chart(grafico, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "# valor diario",
              data: [],
              borderWidth: 1,
            },
          ],
        },
        options: {
            plugins: {
              title: {
                display: true,
                text: 'Variación moneda',
              }
            }
          }
      });
}
const ObtenerDatosApi = async () => {
  const req = await fetch("https://mindicador.cl/api");
  const resp = await req.json();
  RespuestaAPI = resp;
};
const ListarMonedas = async () => {
  let html = "<option selected>Seleccione moneda</option>";

  const req = await fetch("https://mindicador.cl/api");
  const resp = await req.json();
  listaMonedas = Object.entries(RespuestaAPI);

  listaMonedas.forEach((element) => {
    monedas.push(element[0]);
  });

  monedas.splice(0, 3);
  monedas.splice(5, 6);

  monedas.forEach((moneda) => {
    html += `    
     <option value="${moneda}">${moneda}</option>`;
  });
  cboMoneda.innerHTML = html;
};

const EjecutarConversion = () => {
  let montoPesos = parseFloat(cajaPesos.value);
  let monedaSeleccionada = cboMoneda.value;
  let tipoCambio = parseFloat(RespuestaAPI[monedaSeleccionada].valor);
  
  let total =montoPesos /tipoCambio;  
  resultado.innerHTML = `Resultado: ${new Intl.NumberFormat().format(total.toFixed(2))}`;
  GetSeries();
  MostrarGrafico();
};


const GetSeries = async () => {
  let monedaSeleccionada = cboMoneda.value;
  const req = await fetch(`https://mindicador.cl/api/${monedaSeleccionada}`);
  const resp = await req.json();
  let fechas = resp.serie.splice(0, 10);

  let etiqs = [];
  let valores = [];

  fechas.forEach((element) => {
    let fecha = moment(element.fecha).format("DD/MM/YYYY");
    etiqs.push(fecha);
    valores.push(element.valor);
  });

  etiqs.reverse();
  valores.reverse();
  
  graf.data.labels = etiqs;
  graf.data.datasets[0].data = valores;
  graf.update();
};

const FormatNumber=()=>{  
  let numero=cajaPesos.value;  
  cajaPesos.value = new Intl.NumberFormat('de-DE').format(numero);
}
ObtenerDatosApi();
ListarMonedas();
botonFiltro.addEventListener("click", EjecutarConversion);
//cajaPesos.addEventListener("blur",FormatNumber);