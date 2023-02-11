import { IonApp, setupIonicReact } from '@ionic/react';
import { useRef, useCallback } from "react";
import '@ionic/react/css/core.css';
import { ReactNode, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Interface_message, Interface_message_refresh_progress, Interface_message_finish, Interface_message_start } from './algoritmo/algoritmo';
import AppBar from './components/AppBar';
import TabsManager from './components/TabsManager';
import Tab1, { InputStateData } from './components/Tab1';
import Tab2 from './components/Tab2';
import Tab3 from './components/Tab3';
import AlgorithmManager from './algoritmo/AlgorithmManager';
import NP from 'number-precision';
import Solution, { SolutionData } from './components/Solution';


//Inicia proceso de React
setupIonicReact();

//********Segmento de Interfaces necesarias*************
//Quizás convenga meterlas en su propio archivo para que no estorben aquí

type Interface_algorithm_progress = [number, number];
type Interface_algorithm_progress_cache = Interface_algorithm_progress[];


//******************************************************


/**
 * Instanciación del manager del algoritmo.
 */
const algorithmManager: AlgorithmManager = new AlgorithmManager();


/**
 * Definición raíz de la aplicación.
 */
const App: React.FC = () => {

  // Estado de react para definir la Tab seleccionada
  const [tabNumber, setTabNumber] = useState(0);

  const [progressAlgorithmCache, setProgressAlgorithmCache] = useState<Interface_algorithm_progress_cache>([]);

  const progressAlgorithmCacheRef = useRef<Interface_algorithm_progress_cache>([]);

  const [progressString, setProgressString] = useState<string>("0.00%");

  const [remainingTime, setRemainingTime] = useState<string>("");

  const updateAlgorithmStatusTimeOut = useRef<boolean>(false);

  const [algorithmRunning, setAlgorithmRunning] = useState<boolean>(false);

  const [solutionDataArray, setSolutionDataArray] = useState<SolutionData[]>([]);


  const onWorkerMessage = (message: MessageEvent<Interface_message>) => {
    const message_data = message.data;
    if ((message_data as Interface_message_start)[0] === "start") {
      setAlgorithmRunning(true);

      //Agregar nueva solución
      addSolutionInProgressToArray();

    }
    if ((message_data as Interface_message_refresh_progress)[0] === "update") {

      const progress = (message_data as Interface_message_refresh_progress)[1].progress;
      const now = (message_data as Interface_message_refresh_progress)[2];
      console.log(`Progress: ${progress}`);
      let newProgress: Interface_algorithm_progress = [progress, now]
      setProgressAlgorithmCache(addAndFixMax3ToProgressCache(newProgress, progressAlgorithmCacheRef.current));
    }
    if ((message_data as Interface_message_finish)[0] === "finish") {
      algorithmManager.stopAlgorithm(() => { setAlgorithmRunning(false) });
      finishSolutionInArray();


    }
  }

  useEffect(() => {
    console.log(solutionDataArray);
  }, [solutionDataArray])

  const addSolutionInProgressToArray = () => {
    let solutionDataArrayTemp: SolutionData[] = solutionDataArray;
    let solutionProgressTemp: SolutionData = {
      state: ['inProgress', {
        progressAlgorithmText: '',
        remainingTime: ''
      }],
      inputStateData: 9
    }
    setSolutionDataArray([...solutionDataArrayTemp, solutionProgressTemp]);
  }

  const updateSolutionInProgressInArray = (progressAlgorithmText: string, remainingTime: string) => {
    let solutionDataArrayTemp: SolutionData[] = [...solutionDataArray];
    let solutionDataTemp: SolutionData | undefined = solutionDataArrayTemp.pop();
    if (solutionDataTemp) {
      if (solutionDataTemp.state[0] === 'inProgress') {
        solutionDataTemp.state[1].progressAlgorithmText = progressAlgorithmText;
        solutionDataTemp.state[1].remainingTime = remainingTime;
        setSolutionDataArray([...solutionDataArrayTemp, solutionDataTemp]);
      }
    }
  }

  const finishSolutionInArray = () => {
    let solutionDataArrayTemp: SolutionData[] = [...solutionDataArray];
    let solutionDataTemp: SolutionData | undefined = solutionDataArrayTemp.pop();
    console.log(solutionDataArrayTemp);

    if (solutionDataTemp) {
      if (solutionDataTemp.state[0] === 'inProgress') {
        solutionDataTemp.state = ['finished',
          { solution: 'Solución' }
        ];
        setSolutionDataArray([...solutionDataArrayTemp, solutionDataTemp]);
      }
    }
  }


  useEffect(() => {
    progressAlgorithmCacheRef.current = progressAlgorithmCache;
    updateSolutionInProgressInArray(
      generatePorcentageAlgorithmString(progressAlgorithmCache),
      generateRemainingTime(progressAlgorithmCache)
    );

    //setProgressString(generatePorcentageAlgorithmString(progressAlgorithmCache));
    //setRemainingTime(generateRemainingTime(progressAlgorithmCache));

  }, [progressAlgorithmCache]);


  const inputStateData: InputStateData = {
    TMA: {
      value: useState<string>(""),
      error: useState<boolean>(false),
    },
    PPA: {
      value: useState<string>(""),
      error: useState<boolean>(false),
    }
  }


  return (
    <Box style={{ height: "100vh", width: "100%", display: "flex", flexFlow: "column", flexDirection: "column" }}>
      <Box style={{ width: "100%" }}>
        <AppBar titleText={titleTextNames[tabNumber]} />
      </Box>

      <Box style={{ flex: 1, overflow: "auto" }} color={"black"}>
        {
          (tabNumber === 0) ? <Tab1
            algorithmRunning={algorithmRunning}
            startAlgorithm={() => { algorithmManager.startAlgorithm(onWorkerMessage) }}
            stopAlgorithm={() => algorithmManager.stopAlgorithm(() => setAlgorithmRunning(false))}
            inputStateData={inputStateData}
            solutionDataArray={solutionDataArray}

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