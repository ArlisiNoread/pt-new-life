import { IonSelectPopover } from "@ionic/core/components";
import { Matrix } from "ml-matrix";

/**
 * Interface que define los valores mínimos que se deben tener para iniciar el algoritmo
 */
export type Interface_algorithm_status_start = [
  "start",
  Interface_algorithm_status_start_data
];

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

export type Interface_message_finish = ["finish", "data"];

export type Interface_message_update = ["update", number];

export type Interface_message =
  | Interface_message_finish
  | Interface_message_update;

const testAlgoritmo = () => {
  return "exito";
};

var status = "stopped";

onmessage = (message: MessageEvent<Interface_algorithm_status>) => {
  const message_data = message.data;
  if ((message_data as Interface_algorithm_status_start)[0] === "start") {
    //Ejecución de algoritmo
    if (status !== "running") {
      //console.log(algorithmAsync);
      console.log("Botón Presionado");
      status = "running";
      algoritmo(message_data[1] as Interface_algorithm_status_start_data).then(
        () => {
          //MANDAR MENSAJE DE RESULTADO Y REINICIAR HILO
          status = "finished";
        }
      );
    }
    //sendMessageBack(["update", progress]);
  } else if (message_data === "stop") {
  } else if (message_data === "pause") {
  } else if (message_data === "update") {
    sendMessageBack(["update", progress]);
  }
};

const sendMessageBack = (message: Interface_message) => {
  postMessage(message);
};

let algorithm_status: Interface_algorithm_status = "stop";

type Interface_progress = number;

declare global {
  var progress: number;
}
globalThis.progress = 0.0;

const algoritmo = async (data: Interface_algorithm_status_start_data) => {
  const timeOut = (segundos: number) => {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(true);
      }, 1000);
    });
  };

  for (let x = 0; x < 60; x++) {
    const res = await timeOut(x);
    if (res) {
      progress = x / 60.0;
      console.log(`Progress ${progress}`);
    }
  }
};
