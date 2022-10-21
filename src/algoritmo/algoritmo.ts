import { IonSelectPopover } from "@ionic/core/components";
import { Matrix } from "ml-matrix";

import Configuracion from "./datos/Configuracion";
import PPDCDMX from "./datos/PPDCDMX";
import PMVCDMX from "./datos/PMVCDMX";
import TRMCDMX from "./datos/TRMCDMX";
import PPDChihuahua from "./datos/PPDChihuahua";
import PMVChihuahua from "./datos/PMVChihuahua";
import TRMChihuahua from "./datos/TRMChihuahua";
import PPDXalapa from "./datos/PPDXalapa";
import PMVXalapa from "./datos/PMVXalapa";
import TRMXalapa from "./datos/TRMXalapa";
import PPDCancun from "./datos/PPDCancun";
import PMVCancun from "./datos/PMVCancun";
import TRMCancun from "./datos/TRMCancun";

import {
  Interface_algorithm_status,
  Interface_algorithm_status_start,
  Interface_algorithm_status_start_data,
} from "./AlgorithmManager";

/**Interface que define los valores que debe tener la respuesta final del algoritmo*/
export type Interface_message_finish = ["finish", "data"];

/**Interface que define el mensaje para regresar un refresh del progreso */
export type Interface_message_refresh_progress = ["update", Algorithm_Info, number];

/**Interface que define los mensajes que pueden ser enviados fuera del worker */
export type Interface_message =
  | Interface_message_finish
  | Interface_message_refresh_progress;

type stateAlgorithm = "working" | "finished";

export type Algorithm_Info = {
  progress: number;
  actual_status: stateAlgorithm;
  
};

let algorithm_Info: Algorithm_Info = {
  progress: 0.0,
  actual_status: "working",
};

onmessage = (message: MessageEvent<Interface_algorithm_status>) => {
  const message_data = message.data;
  //Si el tipo de mensaje es de tipo "start"
  if ((message_data as Interface_algorithm_status_start)[0] === "start") {
    //Ejecución de algoritmo

    start_Promise_Algorithm(
      message_data[1] as Interface_algorithm_status_start_data
    ).then(() => {
      console.log("Algoritmo finalizado");
      //MANDAR MENSAJE DE RESULTADO
      const messageEndWithData: Interface_message_finish = ["finish", "data"];
      sendMessageBack(messageEndWithData);
    });
  }
};

const sendMessageBack = (message: Interface_message) => {
  postMessage(message);
};

const send_update_Algorithm_Info = () => {
  sendMessageBack(["update", algorithm_Info, performance.now()]);
};

/**
 * Estrella del escenario: ¡algoritmo de método musical!
 * ¡Que empiece la música!
 * */
const start_Promise_Algorithm = async (
  data: Interface_algorithm_status_start_data
) => {
  const pa = data.pa;
  const repeticiones = data.repeticiones;
  const max_evaluaciones = data.max_evaluaciones;
  const fcla = data.fcla;
  const cfg = data.cfg;
  const cfi = data.cfi;
  const mc = data.mc;
  const pruebas = data.pruebas;
  const temperatura = data.temperatura;
  const precipitacion = data.precipitacion;

  let sol: Matrix = new Matrix(0, 12 + 4);
  const configuration_size: number = Configuracion.length;

  for (let r = 0; r < repeticiones; r++) {
    //Actualiza progreso
    algorithm_Info.progress = r / repeticiones;

    send_update_Algorithm_Info();

    let ppd = new Matrix([[]]);
    let pmv = new Matrix([[]]);
    let trm = new Matrix([[]]);

    let disTT: number = 0;

    //Reinicio Matrices
    let sol_corrida: Matrix = Matrix.zeros(mc * pa, 12);
    let objetivos: Matrix = Matrix.zeros(mc * pa, 4);

    //Soluciones Iniciales
    for (let i = 0; i < mc * pa; i++) {
      for (let t = 0; t < 6; t = t + 2) {
        const randomNumber = Math.round(Math.random());
        sol_corrida.set(i, t, randomNumber);
        sol_corrida.set(i, t + 1, 1 - randomNumber);
      }

      let distancias = Matrix.zeros(1, configuration_size);
      for (let j = 0; j < configuration_size; j++) {
        let tempSumatoria = 0.0;
        for (let jk = 0; jk < 12; jk++) {
          const tempDiferencia = Configuracion[j][jk] - sol_corrida.get(i, jk);
          const pow2TempDiferencia = Math.pow(tempDiferencia, 2);
          tempSumatoria += pow2TempDiferencia;
        }
        distancias.set(0, j, Math.sqrt(tempSumatoria));
      }

      let posicionDistanciaMinima = distancias.minIndex();

      let [ppd, pmv, trm]: [Matrix, Matrix, Matrix] = funcion_datos(
        pruebas,
        temperatura,
        precipitacion
      );

      disTT = trm.max() - trm.min();

      for (let k = 0; k < 6; k++) {
        if (ppd.get(posicionDistanciaMinima[1], k) > 15.0) {
          objetivos.set(
            i,
            0,
            objetivos.get(i, 0) +
              ((1.0 / 6.0) * ppd.get(posicionDistanciaMinima[1], k)) / -85.0
          );
        }
        if (pmv.get(posicionDistanciaMinima[1], k) !== 0.0) {
          objetivos.set(
            i,
            1,
            objetivos.get(i, 1) + pmv.get(posicionDistanciaMinima[1], k)
          ); //3.0?? Checkar en matlab
        }

        if (
          trm.get(posicionDistanciaMinima[1], k) < 18.0 ||
          trm.get(posicionDistanciaMinima[1], k) > 23.0
        ) {
          let auxTemp = Math.max(
            18.0 - trm.get(posicionDistanciaMinima[1], k),
            23.0 - trm.get(posicionDistanciaMinima[1], k)
          );
          objetivos.set(
            i,
            2,
            objetivos.get(i, 2) +
              ((1.0 / 6.0) * Math.abs(auxTemp)) / (disTT === 0.0 ? 1 : disTT)
          );
        }
        objetivos.set(
          i,
          3,
          Math.max(
            objetivos.get(i, 0),
            objetivos.get(i, 1),
            objetivos.get(i, 2)
          )
        );
      }

      objetivos.mul(1.0 / 5.0);

      for (let v = 0; v < max_evaluaciones; v++) {
        //Creamos los vínculos
        let links = vinculos(pa, fcla, v);
        let contadores: Matrix = Matrix.zeros(pa, 6);
        let sol_corrida1 = sol_corrida.clone();
        let objetivos2 = objetivos.clone();

        for (let i = 0; i < pa; i++) {
          let a = i * mc;
          let b = a + mc - 1;

          let A: Matrix = objetivos.subMatrix(a, b, 0, objetivos.columns - 1);

          contadores.set(i, 0, A.maxColumn(3));
          contadores.set(i, 1, A.maxColumnIndex(3)[1]);
          contadores.set(i, 2, A.minColumn(3));
          contadores.set(i, 3, A.minColumnIndex(3)[1]);

          contadores.set(i, 1, contadores.get(i, 1) + i * mc);
          contadores.set(i, 3, contadores.get(i, 3) + i * mc);
          contadores.set(i, 4, a);
          contadores.set(i, 5, b);
        }

        let MI = new Matrix(0, 12);
        let MIo = new Matrix(0, 4);
        let destino = new Matrix(1, 0);

        for (let i = 0; i < pa; i++) {
          for (let j = 0; j < pa; j++) {
            if (i !== j) {
              if (links.get(j, i) === 1.0) {
                if (contadores.get(j, 0) < contadores.get(i, 0)) {
                  let seleccion = Math.round(
                    Math.random() *
                      (contadores.get(j, 5) - contadores.get(j, 4)) +
                      contadores.get(j, 4)
                  );
                  MI.addRow(MI.rows, sol_corrida.getRowVector(seleccion));
                  MIo.addRow(MIo.rows, objetivos.getRowVector(seleccion));
                  destino.addColumn(destino.columns, [i]);
                }
              }
            }
          }
        }

        let aux3: Matrix;

        for (let i = 0; i < pa; i++) {
          let a = i * mc;
          let b = a + mc - 1;

          let MIndividual = sol_corrida.subMatrix(
            a,
            b,
            0,
            sol_corrida.columns - 1
          );

          let MIIndividualObjetivos = objetivos.subMatrix(
            a,
            b,
            0,
            objetivos.columns - 1
          );

          let IA: Matrix = Matrix.zeros(0, MI.columns);
          let IAo: Matrix = Matrix.zeros(0, MIo.columns);

          for (let k = 0; k < MI.rows; k++) {
            if (destino.get(0, k) === i) {
              IA.addRow(IA.rows, MI.getRowVector(k));
              IAo.addRow(IAo.rows, MIo.getRowVector(k));
            }
          }

          //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          if (Math.random() <= cfg) {
            let MK: Matrix = new Matrix(
              MIndividual.rows + IA.rows,
              MIndividual.columns
            );
            MK.setSubMatrix(MIndividual.clone(), 0, 0);
            MK.setSubMatrix(IA.clone(), MIndividual.rows, 0);

            let MKo: Matrix = new Matrix(
              MIIndividualObjetivos.rows + IAo.rows,
              MIIndividualObjetivos.columns
            );

            MKo.setSubMatrix(MIIndividualObjetivos.clone(), 0, 0);
            MKo.setSubMatrix(IAo.clone(), MIIndividualObjetivos.rows, 0);

            let peor: number = MKo.maxColumn(3);
            let mejor: number = MKo.minColumn(3);
            let diferencia: number = peor - mejor;
            let preponderancia: Matrix = Matrix.zeros(1, MKo.rows);

            if (diferencia === 0.0) {
              preponderancia.add(1.0 / MKo.rows);
            } else {
              let MKoColumn3 = MKo.getColumnVector(3);
              preponderancia.apply((i, j) => {
                preponderancia.set(
                  i,
                  j,
                  0.1 + (peor - MKo.get(j, 3)) / diferencia
                );
              });
            }
            preponderancia.pow(2);

            let maxPreponderanciaRedondeada = Math.round(preponderancia.max());

            let filtrado = MK.getRowVector(maxPreponderanciaRedondeada); //! DUDA CON EL REDONDEO de la preponderancia

            let c1: Matrix = new Matrix(1, 0);

            c1.addColumn(c1.columns, [
              preponderancia.get(0, maxPreponderanciaRedondeada),
            ]);

            preponderancia.set(0, maxPreponderanciaRedondeada, 0.0);

            preponderancia.mul(1.0 / preponderancia.sum());

            let seleccion: number = Math.random();
            let p = 0.0;
            let ps = 0.0;

            while (p < seleccion && ps < MKo.rows) {
              ps = ps + 1;
              p = p + preponderancia.get(0, ps - 1);
            }

            filtrado.addRow(filtrado.rows, MK.getRowVector(ps - 1));

            c1.addColumn(c1.columns, [preponderancia.get(0, ps - 1)]);

            seleccion = Math.round(Math.random() * (MKo.rows - 1));

            filtrado.addRow(filtrado.rows, MK.getRowVector(seleccion));

            c1.addColumn(c1.columns, [preponderancia.get(0, seleccion)]);

            c1.mul(1.0 / c1.sum());

            aux3 = c1.mmul(filtrado);

            for (let iii = 0; iii < MK.columns - 1; iii = iii + 2) {
              if (Math.random() <= cfi) {
                aux3.set(0, iii, Math.pow(1.0 - aux3.get(0, iii), 2));
                aux3.set(0, iii + 1, Math.pow(1.0 - aux3.get(0, iii), 2));
              } else {
                aux3.set(0, iii + 1, Math.pow(1.0 - aux3.get(0, iii), 2));
              }
            }
          } else {
            aux3 = new Matrix(1, 0);
            let j = 0;
            for (let k = 0; k < 6; k++) {
              aux3.addColumn(aux3.columns, [Math.round(Math.random())]);
              aux3.addColumn(aux3.columns, [Math.pow(1 - aux3.get(0, j), 2)]);
              j += 2;
            }
          }

          let distancias: Matrix = Matrix.zeros(1, Configuracion.length);

          for (let j = 0; j < Configuracion.length; j++) {
            let tempMat: Matrix = new Matrix(1, 0);
            for (let xx = 0; xx < Configuracion[0].length; xx++) {
              tempMat.addColumn(tempMat.columns, [
                Math.pow(Configuracion[j][xx] - sol_corrida.get(i, xx), 2),
              ]);
            }
            distancias.set(0, j, Math.sqrt(tempMat.sum()));
          }

          let distanciaMinima = distancias.min();
          let distanciaMinimaCoord = distancias.minIndex()[1]; //solo es una row

          let objetivos1 = Matrix.zeros(1, 4);

          for (let k = 0; k < 6; k++) {
            if (ppd.get(distanciaMinimaCoord, k) > 15) {
              objetivos1.set(
                0,
                0,
                objetivos1.get(0, 0) +
                  (1.0 / 6.0) *
                    ((15.0 - ppd.get(distanciaMinimaCoord, k)) / -85.0)
              );
            }
            if (pmv.get(distanciaMinimaCoord, k) !== 0.0) {
              objetivos1.set(
                0,
                1,
                objetivos1.get(0, 1) +
                  (1.0 / 6.0) *
                    (Math.abs(pmv.get(distanciaMinimaCoord, k)) / 3.0)
              );
            }
            if (
              trm.get(distanciaMinimaCoord, k) < 18 ||
              trm.get(distanciaMinimaCoord, k) > 23
            ) {
              let tempAux = Math.max(
                18 - trm.get(distanciaMinimaCoord, k),
                23 - trm.get(distanciaMinimaCoord, k)
              );
              objetivos1.set(
                0,
                2,
                objetivos1.get(0, 2) + ((1.0 / 6.0) * Math.abs(tempAux)) / disTT
              );
            }
          }

          objetivos1.mul(1.0 / 5.0);

          if (objetivos1.get(0, 3) < contadores.get(i, 0)) {
            for (let xx = 0; xx < aux3.columns; xx++) {
              sol_corrida1.set(
                Math.round(contadores.get(i, 1)),
                xx,
                Math.round(aux3.get(0, xx))
              );
            }
            for (let xx = 0; xx < objetivos1.columns; xx++) {
              objetivos2.set(
                Math.round(contadores.get(i, 1)),
                xx,
                objetivos2.get(0, xx)
              );
            }
          }
        }
        sol_corrida = sol_corrida1.clone();
        objetivos = objetivos2.clone();
      }

      let minObjetivo = objetivos.minColumn(3);
      let minObjetivoCoord = objetivos.minColumnIndex(3)[1];

      let res_sol = Matrix.zeros(1, sol_corrida.columns + objetivos.columns);

      for (let xx = 0; xx < sol_corrida.columns; xx++) {
        res_sol.set(0, xx, sol_corrida.get(minObjetivoCoord, xx));
      }
      for (let xx = 0; xx < objetivos.columns; xx++) {
        res_sol.set(0, xx, objetivos.get(minObjetivoCoord, xx));
      }

      sol.addRow(sol.rows, res_sol);
    }
  }

  //return sol;
};

const funcion_datos = (
  pruebas: number,
  temperatura: number,
  precipitacion: number
): [Matrix, Matrix, Matrix] => {
  let regreso: Matrix = new Matrix(0, 0);

  let datosRowLength: number = TRMCDMX.length;
  let datosColLength: number = TRMCDMX[0].length;

  let distancia = new Matrix(1, 4);
  distancia.set(
    0,
    0,
    Math.sqrt(
      Math.pow(14.6 - temperatura, 2) + Math.pow(275.7 - precipitacion, 2)
    )
  );

  distancia.set(
    0,
    1,
    Math.sqrt(
      Math.pow(18 - temperatura, 2) + Math.pow(1699.3 - precipitacion, 2)
    )
  );

  distancia.set(
    0,
    2,
    Math.sqrt(
      Math.pow(28.5 - temperatura, 2) + Math.pow(385.0 - precipitacion, 2)
    )
  );

  distancia.set(
    0,
    3,
    Math.sqrt(
      Math.pow(27.3 - temperatura, 2) + Math.pow(1300.0 - precipitacion, 2)
    )
  );

  let valMinDistancia = distancia.min();
  let valMaxDistancia = distancia.max();

  let diferencia = valMaxDistancia - valMinDistancia;

  let diferenciaTemp = [];
  for (let zz = 0; zz < distancia.columns; zz++) {
    diferenciaTemp.push(
      (0.01 + valMaxDistancia - distancia.get(0, zz)) / diferencia
    );
  }

  let sumaTemp = diferenciaTemp.reduce((a, b) => a + b, 0);

  for (let zz = 0; zz < diferenciaTemp.length; zz++) {
    if (sumaTemp !== 0) {
      diferenciaTemp[zz] /= sumaTemp;
    }
  }

  let ppd: Matrix = Matrix.zeros(datosRowLength, datosColLength);
  let pmv: Matrix = Matrix.zeros(datosRowLength, datosColLength);
  let trm: Matrix = Matrix.zeros(datosRowLength, datosColLength);

  for (let p = 0; p < pruebas; p++) {
    let diferenciaTemp2 = [];
    for (let q = 0; q < 4; q++) {
      diferenciaTemp2.push(diferenciaTemp[q] + Math.random());
    }

    let min1: number = Math.min(...diferenciaTemp2);

    for (let q = 0; q < diferenciaTemp2.length; q++) {
      diferenciaTemp2[q] += Math.abs(min1) + 1.0 / 10.0; // TENGO DUDA DE ESTE /10
    }
    let sumaTemp = diferenciaTemp2.reduce((a, b) => a + b, 0);
    for (let q = 0; q < diferenciaTemp2.length; q++) {
      if (sumaTemp !== 0) diferenciaTemp2[q] /= sumaTemp;
    }

    for (let x = 0; x < datosRowLength; x++) {
      for (let y = 0; y < datosColLength; y++) {
        let tempPPD = ppd.get(x, y);
        tempPPD += diferenciaTemp2[0] * PPDCDMX[x][y];
        tempPPD += diferenciaTemp2[1] * PPDXalapa[x][y];
        tempPPD += diferenciaTemp2[2] * PPDChihuahua[x][y];
        tempPPD += diferenciaTemp2[3] * PPDCancun[x][y];
        ppd.set(x, y, tempPPD);

        let tempPMV = pmv.get(x, y);
        tempPMV += diferenciaTemp2[0] * PMVCDMX[x][y];
        tempPMV += diferenciaTemp2[1] * PMVXalapa[x][y];
        tempPMV += diferenciaTemp2[2] * PMVChihuahua[x][y];
        tempPMV += diferenciaTemp2[3] * PMVCancun[x][y];
        pmv.set(x, y, tempPMV);

        let tempTRM = trm.get(x, y);
        tempTRM += diferenciaTemp2[0] * TRMCDMX[x][y];
        tempTRM += diferenciaTemp2[1] * TRMXalapa[x][y];
        tempTRM += diferenciaTemp2[2] * TRMChihuahua[x][y];
        tempTRM += diferenciaTemp2[3] * TRMCancun[x][y];
        trm.set(x, y, tempTRM);
      }
    }
  }

  for (let x = 0; x < datosRowLength; x++) {
    for (let y = 0; y < datosColLength; y++) {
      ppd.set(x, y, (1.0 / pruebas) * ppd.get(x, y));
      pmv.set(x, y, (1.0 / pruebas) * pmv.get(x, y));
      trm.set(x, y, (1.0 / pruebas) * trm.get(x, y));
    }
  }

  return [ppd, pmv, trm];
};

const vinculos = (pa: number, fcla: number, evaluacion: number) => {
  let links = Matrix.zeros(pa, pa);

  if (evaluacion === 0) {
    for (let i = 0; i < pa; i++) {
      for (let j = 0; j < pa; j++) {
        if (i === j) {
          links.set(i, j, 1.0);
        } else {
          if (Math.random() <= fcla) {
            links.set(i, j, 1.0);
          } else {
            links.set(i, j, 0.0);
          }
        }
      }
    }
  } else {
    for (let i = 0; i < pa; i++) {
      for (let j = i; j < pa; j++) {
        if (i === j) {
          links.set(i, j, 0.0);
        } else {
          if (Math.random() <= fcla) {
            links.set(i, j, Math.pow(links.get(i, j) - 1, 2));
          }
        }
      }
    }
  }

  for (let i = 0; i < pa; i++) {
    let aux = links.getRowVector(i).sum();
    if (aux === 0.0) {
      let seleccion = Math.round(Math.random() * pa);
      while (seleccion === i) {
        seleccion = Math.round(Math.random() * pa);
      }
      links.set(i, seleccion, 1.0);
    }
  }

  return links;
};
