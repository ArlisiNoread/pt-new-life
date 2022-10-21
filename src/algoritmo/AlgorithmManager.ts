import { callbackify } from "util";

/**
 *  Interface de comunicación con el worker que realiza el algoritmo.
 *  "stop" detiene el algoritmo por completo.
 *  "pause" pausa el algoritmo.
 *  "update" mensaje para solicitar una actualización del estado actual del algoritmo
 */
export type Interface_algorithm_status =
  | Interface_algorithm_status_start
  | "stop"
  | "pause"
  | "update";

/**
 * Interface que define los valores mínimos que se deben tener para iniciar el algoritmo
 */
export type Interface_algorithm_status_start = [
  "start",
  Interface_algorithm_status_start_data
];

/**
 * Interface que define los datos requeridos para la ejecución del algoritmo
 */
export type Interface_algorithm_status_start_data = {
  pa: number;
  repeticiones: number;
  max_evaluaciones: number;
  fcla: number;
  cfg: number;
  cfi: number;
  mc: number;
  pruebas: number;
  temperatura: number;
  precipitacion: number;
};

export default class AlgorithmManager {
  worker: Worker | null;
  status: "running" | "stopped";
  solution: "data" | null;

  constructor() {
    this.worker = null;
    this.status = "stopped";
    this.solution = null;
  }

  startAlgorithm(onWorkerMessage: Function) {
    console.log("arranque");
    this.status = "running";
    this.worker = new Worker(new URL("./algoritmo.ts", import.meta.url));
    this.worker.onmessage = (message: MessageEvent<any>) => {
      onWorkerMessage(message);
    };
    this.worker.postMessage([
      "start",
      {
        pa: 10.0,
        repeticiones: 10,
        max_evaluaciones: 10,
        fcla: 0.1,
        cfg: 0.1,
        cfi: 0.1,
        mc: 5.0,
        pruebas: 30.0,
        temperatura: 10.0,
        precipitacion: 30.0,
      },
    ]);
  }

  stopAlgorithm(callBack: Function) {
    callBack();
    this.status = "stopped";
    this.worker?.terminate();
  }
}
