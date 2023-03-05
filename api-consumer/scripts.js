const automovelSelect = document.getElementById("automovel");
const marcaSelect = document.getElementById("marca");
const modeloSelect = document.getElementById("modelo");
const anoSelect = document.getElementById("ano");
const inputUsuario = document.getElementById("inputUsuario");
const btnConsultar = document.getElementById("btn_consultar");

automovelSelect.addEventListener("change", (event) => {
  const tipoVeiculo = event.target.value;
  const urlMarcas = `https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas`;

  fetch(urlMarcas)
    .then((response) => response.json())
    .then((marcas) => {
      // Limpa o select de marcas antes de popular novamente
      marcaSelect.innerHTML = "<option selected>Escolha a marca</option>";

      // Popula o select de marcas
      marcas.forEach((marca) => {
        const option = document.createElement("option");
        option.value = marca.codigo;
        option.text = marca.nome;
        marcaSelect.add(option);
      });
    })
    .catch((error) => console.error(error));
});

marcaSelect.addEventListener("change", (event) => {
  const tipoVeiculo = automovelSelect.value;
  const codigoMarca = event.target.value;
  const urlModelos = `https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${codigoMarca}/modelos`;

  fetch(urlModelos)
    .then((response) => response.json())
    .then((modelos) => {
      // Limpa o select de modelos antes de popular novamente
      modeloSelect.innerHTML = "<option selected>Escolha o modelo</option>";

      // Popula o select de modelos
      modelos.modelos.forEach((modelo) => {
        const option = document.createElement("option");
        option.value = modelo.codigo;
        option.text = modelo.nome;
        modeloSelect.add(option);
      });
    })
    .catch((error) => console.error(error));
});

modeloSelect.addEventListener('change', () => {
  const tipoVeiculo = automovelSelect.value;
  const codigoMarca = marcaSelect.value;
  const codigoModelo = modeloSelect.value;

  fetch(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${codigoMarca}/modelos/${codigoModelo}/anos`)
      .then(response => response.json())
      .then(data => {
          anoSelect.innerHTML = '<option selected>Escolha o ano</option>';
          data.forEach(ano => {
              const option = document.createElement('option');
              option.value = ano.codigo;
              option.text = ano.nome;
              anoSelect.appendChild(option);
          });
      });
});

function stringToFloat(valor) {
  // Remove o símbolo de moeda e a vírgula decimal
  const valorNumerico = valor.replace(/[^\d]/g, '').replace(',', '');

  // Adiciona a vírgula decimal duas posições antes do final
  const valorComCentavos = valorNumerico.slice(0, -2) + '.' + valorNumerico.slice(-2);

  // Converte a string resultante para um valor float
  return parseFloat(valorComCentavos);
}



const comparaFIPE = (valorVenda, valorFIPE) => {
  const resultado = ((valorVenda - valorFIPE) / valorFIPE) * 100
  return `${resultado.toFixed(2)}%`
}

btnConsultar.addEventListener('click', () => {
  const tipoVeiculo = automovelSelect.value;
  const codigoMarca = marcaSelect.value;
  const codigoModelo = modeloSelect.value;
  const codigoAno = anoSelect.value;
  const marcaFipe = document.getElementById("marcaFipe");
  const valorDigitado = document.getElementById("valorDigitado");
  const modeloFipe = document.getElementById("modeloFipe");
  const valorFipe = document.getElementById("valorFipe");
  const anoFipe = document.getElementById("anoFipe");
  const codFipe = document.getElementById("codFipe");
  const mesFipe = document.getElementById("mesFipe");
  const resultado = document.getElementById("resultado");

  fetch(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${codigoMarca}/modelos/${codigoModelo}/anos/${codigoAno}`)
      .then(response => response.json())
      .then(data => {
        marcaFipe.innerText = data.Marca;
        valorDigitado.innerText = inputUsuario.value;
        modeloFipe.innerText = data.Modelo;
        valorFipe.innerText = data.Valor.substr(3);
        anoFipe.innerText = data.AnoModelo;
        codFipe.innerText = data.CodigoFipe;
        mesFipe.innerText = data.MesReferencia;
        resultado.innerText = comparaFIPE(+inputUsuario.value, stringToFloat(data.Valor));
      })
      .catch((error) => console.error(error));
});