import { IonApp, setupIonicReact } from '@ionic/react';
import '@ionic/react/css/core.css';
import { ReactNode, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Interface_message, Interface_algorithm_status, Interface_message_update, Interface_message_finish } from './algoritmo/algoritmo';
import AppBar from './components/AppBar';
import TabsManager from './components/TabsManager';
import Tab1 from './components/Tab1';
import Tab2 from './components/Tab2';
import Tab3 from './components/Tab3';

setupIonicReact();

export type Interface_algorithm_progress = [number, Date];
export type Interface_algorithm_progress_cache = Interface_algorithm_progress[];

const algorithmWorker: Worker = new Worker(new URL('./algoritmo/algoritmo.ts', import.meta.url));
const sendMessageStatusToWorker = (message: Interface_algorithm_status) => {
  algorithmWorker.postMessage(message);
}

const startAlgorithm = () => {
  sendMessageStatusToWorker(["start", {
    pa: 0,
    repeticiones: 0,
    max_evaluaciones: 0,
    fcla: 0.0,
    cfg: 0.0,
    cfi: 0.0,
    mc: 0,
    pruebas: 0,
    temperatura: 0.0,
    precipitacion: 0.0
  }]);
}

const generatePorcentageAlgorithm = (cache: Interface_algorithm_progress_cache): string => {
  if (cache.length === 0) return "0%";
  let lastProgress = cache[cache.length - 1][0];
  return `${lastProgress.toFixed(2)}%`;
}

const addAndFixMax3ToProgressCache = (
  newProgress: Interface_algorithm_progress,
  cache: Interface_algorithm_progress_cache
)
  : Interface_algorithm_progress_cache => {
  if (cache.length >= 3) {
    let ret: Interface_algorithm_progress_cache = [cache[1], cache[2], newProgress];
    return ret;
  } else {
    let ret: Interface_algorithm_progress_cache = [...cache, newProgress];
    return ret;
  }

}

const progressCacheToPercentage = (cache: Interface_algorithm_progress_cache) => {
  if(cache.length === 0) return "0.0%";
  return `${(cache[cache.length-1][0]*100.0).toFixed(2)}%`
}

const titleTextNames = ["Calculadora", "Historial", "Ayuda"];


const App: React.FC = () => {

  const [tabNumber, setTabNumber] = useState(0);

  const [progressAlgorithmCache, setProgressAlgorithmCache] = useState<Interface_algorithm_progress_cache>([]);


  //Checkeo del worker cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      sendMessageStatusToWorker('update');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    algorithmWorker.onmessage = (message: MessageEvent<Interface_message>) => {
      const message_data = message.data;

      if ((message_data as Interface_message_update)[0] === "update") {
        const [_, progress] = message_data as Interface_message_update;

        setProgressAlgorithmCache(addAndFixMax3ToProgressCache([progress, new Date()], progressAlgorithmCache));
      }
    }
  }, [algorithmWorker]);




  return (
    <Box style={{ height: "100vh", width: "100%", display: "flex", flexFlow: "column", flexDirection: "column" }}>
      <Box style={{ width: "100%" }}>
        <AppBar titleText={titleTextNames[tabNumber]} />
      </Box>

      <Box style={{ flex: 1, overflow: "auto" }} color={"black"}>
        {
          (tabNumber === 0) ? <Tab1
            progressAlgorithmText={progressCacheToPercentage(progressAlgorithmCache)}
            startAlgorithm={startAlgorithm}
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