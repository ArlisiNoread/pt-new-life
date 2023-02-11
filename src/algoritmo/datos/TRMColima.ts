const TRMColima = [
  [25.35, 27.57, 31.24, 32.72, 26.84, 27.92],
  [25.55, 27.3, 31.48, 32.59, 27.01, 27.75],
  [24.78, 27.39, 30.8, 32.52, 26.43, 27.66],
  [25.16, 27.13, 31.12, 32.32, 26.69, 27.48],
  [25.4, 25.75, 31.31, 32.85, 26.92, 28.05],
  [25.72, 27.55, 31.57, 32.7, 27.09, 27.85],
  [24.86, 27.6, 30.88, 32.65, 26.5, 27.78],
  [25.24, 27.28, 31.21, 32.43, 26.77, 27.58],
  [25.41, 27.69, 31.29, 32.84, 26.89, 28],
  [25.69, 27.47, 31.53, 32.67, 27.05, 27.8],
  [24.88, 27.49, 30.87, 32.62, 27.49, 27.72],
  [25.23, 27.19, 31.18, 32.41, 26.74, 27.53],
  [25.46, 27.83, 31.36, 32.94, 26.96, 28.09],
  [25.76, 27.62, 31.61, 32.77, 27.13, 27.89],
  [24.93, 27.67, 30.94, 32.74, 26.56, 27.84],
  [25.31, 27.34, 31.27, 32.51, 26.82, 17.63],
  [25.02, 27.69, 30.9, 32.83, 29.59, 27.93],
  [25.34, 27.5, 31.18, 32.68, 26.78, 27.76],
  [24.48, 27.66, 30.47, 32.74, 26.19, 27.76],
  [24.87, 27.33, 25.03, 27.88, 26.47, 27.56],
  [25.81, 32.51, 30.94, 32.97, 26.63, 28.05],
  [25.38, 27.65, 31.24, 32.79, 26.34, 27.86],
  [24.5, 27.85, 30.51, 32.88, 24.24, 27.87],
  [24.93, 27.49, 30.88, 32.62, 26.54, 27.66],
  [25.07, 27.78, 30.95, 32.91, 26.63, 27.97],
  [25.38, 27.57, 31.22, 32.75, 26.82, 27.81],
  [24.55, 27.72, 30.53, 32.83, 26.24, 27.81],
  [24.93, 27.4, 25.08, 27.96, 26.52, 27.61],
  [26.87, 32.59, 30.98, 33.05, 26.67, 28.09],
  [25.42, 27.72, 31.27, 32.86, 26.87, 27.89],
  [24.57, 27.91, 30.57, 32.96, 26.29, 27.92],
  [24.99, 27.55, 30.94, 32.69, 26.58, 27.7],
  [25.41, 27.88, 31.42, 32.81, 26.86, 28.14],
  [25.68, 27.63, 31.66, 32.66, 27.01, 27.93],
  [24.73, 27.1, 30.92, 32.53, 26.32, 27.85],
  [25.11, 27.34, 31.24, 32.31, 26.6, 27.62],
  [25.48, 28.09, 31.56, 32.96, 26.97, 28.29],
  [25.79, 27.82, 31.8, 32.78, 27.13, 28.02],
  [24.86, 27.6, 30.88, 32.65, 26.5, 27.78],
  [25.22, 27.52, 31.38, 32.42, 26.72, 27.72],
  [25.46, 28, 31.49, 32.95, 26.92, 28.24],
  [25.74, 27.72, 31.71, 32.75, 27.06, 27.98],
  [24.81, 27.78, 31.15, 32.79, 26.36, 27.91],
  [25.18, 17.41, 31.3, 32.41, 26.66, 27.68],
  [25.54, 28.19, 31.62, 33.06, 27.02, 28.35],
  [25.84, 27.9, 31.87, 32.86, 27.17, 28.09],
  [24.89, 28.01, 31.12, 32.76, 26.48, 28.03],
  [25.29, 27.59, 31.44, 32.51, 26.77, 27.77],
  [25.15, 27.99, 31.07, 33, 26.64, 28.29],
  [25.4, 27.67, 31.35, 32.82, 26.83, 28.05],
  [24.48, 27.94, 30.52, 32.85, 26.09, 28.1],
  [24.9, 27.52, 30.9, 32.57, 26.41, 27.82],
  [25.21, 28.25, 31.18, 33.17, 26.73, 28.45],
  [25.55, 27.94, 31.47, 32.95, 26.92, 28.17],
  [24.54, 28.18, 30.63, 32.99, 26.18, 28.23],
  [24.99, 27.72, 31.02, 32.69, 26.51, 27.93],
  [25.21, 28.09, 31.13, 33.1, 26.69, 28.34],
  [25.52, 27.82, 31.4, 32.9, 26.87, 28.1],
  [24.56, 28.02, 30.6, 32.95, 26.16, 28.16],
  [24.97, 27.6, 30.96, 32.66, 26.67, 27.88],
  [25.26, 28.33, 31.23, 33.26, 26.77, 28.5],
  [25.6, 28.01, 31.51, 33.02, 26.96, 28.21],
  [24.61, 28.26, 30.7, 33.09, 26.24, 28.29],
  [25.05, 27.79, 31.08, 32.77, 26.57, 27.98],
];

export default TRMColima;