import { IonApp, setupIonicReact } from '@ionic/react';
import { useRef, useCallback } from "react";
import '@ionic/react/css/core.css';
import { ReactNode, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Interface_message, Interface_message_refresh_progress, Interface_message_finish } from './algoritmo/algoritmo';
import AppBar from './components/AppBar';
import TabsManager from './components/TabsManager';
import Tab1 from './components/Tab1';
import Tab2 from './components/Tab2';
import Tab3 from './components/Tab3';
import AlgorithmManager from './algoritmo/AlgorithmManager';
import NP from 'number-precision';


setupIonicReact();

type Interface_algorithm_progress = [number, number];
type Interface_algorithm_progress_cache = Interface_algorithm_progress[];


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


const algorithmManager: AlgorithmManager = new AlgorithmManager();

const titleTextNames = ["Calculadora", "Historial", "Ayuda"];

const App: React.FC = () => {


  const [tabNumber, setTabNumber] = useState(0);

  const [progressAlgorithmCache, setProgressAlgorithmCache] = useState<Interface_algorithm_progress_cache>([]);

  const progressAlgorithmCacheRef = useRef<Interface_algorithm_progress_cache>([]);

  const [progressString, setProgressString] = useState<string>("0.00%");

  const [remainingTime, setRemainingTime] = useState<string>("_");

  const updateAlgorithmStatusTimeOut = useRef<boolean>(false);


  const onWorkerMessage = (message: MessageEvent<Interface_message>) => {
    const message_data = message.data;
    if ((message_data as Interface_message_refresh_progress)[0] === "update") {

      const progress = (message_data as Interface_message_refresh_progress)[1].progress;
      const now = (message_data as Interface_message_refresh_progress)[2];
      console.log(`Progress: ${progress}`);
      let newProgress: Interface_algorithm_progress = [progress, now]
      setProgressAlgorithmCache(addAndFixMax3ToProgressCache(newProgress, progressAlgorithmCacheRef.current));
    }
    if ((message_data as Interface_message_finish)[0] === "finish") {
      algorithmManager.stopAlgorithm();
      setRemainingTime("Completado");
      setProgressString("100%");
    }
  }



  useEffect(() => {
    progressAlgorithmCacheRef.current = progressAlgorithmCache;
    setProgressString(generatePorcentageAlgorithmString(progressAlgorithmCache));
    setRemainingTime(generateRemainingTime(progressAlgorithmCache));

  }, [progressAlgorithmCache]);


  /*
  useCallback(()=>{
    console.log("progress actualizado");

  }, [progressAlgorithmCache]);
  */

  return (
    <Box style={{ height: "100vh", width: "100%", display: "flex", flexFlow: "column", flexDirection: "column" }}>
      <Box style={{ width: "100%" }}>
        <AppBar titleText={titleTextNames[tabNumber]} />
      </Box>

      <Box style={{ flex: 1, overflow: "auto" }} color={"black"}>
        {
          (tabNumber === 0) ? <Tab1
            remainingTime={remainingTime}
            progressAlgorithmText={progressString}
            startAlgorithm={() => { algorithmManager.startAlgorithm(onWorkerMessage) }}
            stopAlgorithm={() => { algorithmManager.stopAlgorithm() }}
          /> :
            (tabNumber === 1) ? <Tab2 /> :
              <Tab3 />
        }
      </Box>
      <Box style={{ width: "100%", }}>
        <TabsManager
          tabNumber={tabNumber}
          setTabNumber={setTabNumber}
        />
      </Box>

    </Box>
  );
}
export default App;