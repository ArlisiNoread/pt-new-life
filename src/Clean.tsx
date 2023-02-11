

const generateRemainingTime = (
  cache: Interface_algorithm_progress_cache
): string => {
  if (cache.length === 0) return "Calculando.";
  if (cache.length === 1) return "Calculando..";
  if (cache.length === 2) return "Calculando...";

  let [progreso0, now0]: Interface_algorithm_progress = cache[0];
  let [progreso1, now1]: Interface_algorithm_progress = cache[1];
  let [progreso2, now2]: Interface_algorithm_progress = cache[2];



  //let diferenciaTiemposPromedio = (Math.abs(cache2.getTime() - cache1.getTime()) + Math.abs(cache1.getTime() - cache0.getTime())) / 2;

  let diferenciaTiemposPromedio = NP.divide(NP.plus(now2 - now1), 1000);
  diferenciaTiemposPromedio = Math.abs(NP.minus(Math.abs(diferenciaTiemposPromedio), now0));
  diferenciaTiemposPromedio = NP.divide(diferenciaTiemposPromedio / 2.0); //Diferencia en milisegundos

  let diferenciaProgresos = Math.abs(NP.minus(progreso2, progreso0));

  let porcentajeRestante = NP.minus(1.0, progreso2);

  let tiempoRestanteMilisegundos = NP.divide(NP.times(porcentajeRestante, diferenciaTiemposPromedio), diferenciaProgresos);
  let tiempoRestanteSegundos = NP.divide(tiempoRestanteMilisegundos, 1000);


  //return `${tiempoRestanteSegundos} segundos`;

  if (tiempoRestanteSegundos < 60) return `${tiempoRestanteSegundos.toFixed(0)} segundos`;

  let tiempoRestanteMinutos = tiempoRestanteSegundos / 60;

  if (tiempoRestanteMinutos < 60) return `${tiempoRestanteMinutos.toFixed(0)} Minutos`;

  let tiempoRestanteHoras = tiempoRestanteMinutos / 60;

  return `${tiempoRestanteHoras} Horas`;
};

const generatePorcentageAlgorithmString = (
  cache: Interface_algorithm_progress_cache
): string => {
  if (cache.length === 0) return "0%";
  let lastProgress = cache[cache.length - 1][0];
  return `${(lastProgress * 100).toFixed(2)}%`;
};

const addAndFixMax3ToProgressCache = (
  newProgress: Interface_algorithm_progress,
  cache: Interface_algorithm_progress_cache
): Interface_algorithm_progress_cache => {
  //console.log(cache);
  if (cache.length >= 3) {
    let ret: Interface_algorithm_progress_cache = [
      cache[1],
      cache[2],
      newProgress,
    ];
    return ret;
  }

  if (cache.length === 0) {
    let ret: Interface_algorithm_progress_cache = [newProgress];
    return ret;
  }

  let ret: Interface_algorithm_progress_cache = [...cache, newProgress];
  return ret;
};



const titleTextNames: [string, string, string] = ["Calculadora", "Historial", "Ayuda"];

