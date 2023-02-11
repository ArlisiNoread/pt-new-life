import { createTheme, FormControl, FormHelperText, Grid, Input, InputLabel, OutlinedInput, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { Dispatch, SetStateAction } from 'react';
import Solution, { SolutionData } from './Solution';
import { purple } from '@mui/material/colors';
import { ThemeProvider } from '@emotion/react';

const theme = createTheme({
    palette: {
        primary: {
            // Purple and green play nicely together.
            main: purple[500],
        },
        secondary: {
            // This is green.A700 as hex.
            main: '#11cb5f',
        },
    },
});

type InputStateCommonData = {
    value: [string, Dispatch<SetStateAction<string>>],
    error: [boolean, Dispatch<SetStateAction<boolean>>],
}

export type InputStateData = {
    TMA: InputStateCommonData,
    PPA: InputStateCommonData
}

const checkIfErrorOnInput = (inputStateData: InputStateData) => {
    const inputStateCommonDataArray: InputStateCommonData[] = Object.values(inputStateData);
    for (let x = 0; x < inputStateCommonDataArray.length; x++) {
        if (inputStateCommonDataArray[x].value[0] === "") return true;
        if (inputStateCommonDataArray[x].error[0]) return true;
    }

    return false;
}

const handleInputChange = (newValue: string, dataState: InputStateCommonData) => {
    const re = /^[0-9]*$/;

    if (new RegExp(re).test(newValue)) dataState.value[1](newValue);

}

const Tab1: React.FC<{
    algorithmRunning: boolean,
    startAlgorithm: Function,
    stopAlgorithm: Function,
    inputStateData: InputStateData
    solutionDataArray: SolutionData[]
}> = (
    {
        algorithmRunning,
        startAlgorithm,
        stopAlgorithm,
        inputStateData,
        solutionDataArray
    }
) => {
        return (
            <Box sx={{ margin: '10px' }}>
                <InputsAlgorithm
                    startAlgorithm={startAlgorithm}
                    stopAlgorithm={stopAlgorithm}
                    algorithmRunning={algorithmRunning}
                    inputStateData={inputStateData}
                />
                {
                    solutionDataArray.map(
                        (value, index) => <Solution
                            key={'solution-' + index}
                            id={index}
                            solutionData={value}
                        />
                    )
                }
            </Box>
        );
    }

export default Tab1;


const InputsAlgorithm: React.FC<{
    algorithmRunning: boolean,
    startAlgorithm: Function,
    stopAlgorithm: Function,
    inputStateData: InputStateData
}> = ({ algorithmRunning, startAlgorithm, stopAlgorithm, inputStateData }) => {

    const texfieldStyle = { style: { fontSize: 10 } };


    return (
        <Box>
            <Paper variant="outlined" sx={{ padding: '10px' }}>
                <Grid container justifyContent={'center'} textAlign={'center'}>
                    <Grid item xs={6}>
                        <TextField
                            id="texFieldTMA"
                            label="Temperatura Media Anual"
                            helperText="Valor entre "
                            value={inputStateData.TMA.value[0]}
                            error={inputStateData.TMA.error[0]}
                            onChange={(MessageEvent) => handleInputChange(MessageEvent.currentTarget.value, inputStateData.TMA)}
                            inputProps={texfieldStyle}
                            InputLabelProps={texfieldStyle}
                            disabled={algorithmRunning}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            id="texFieldPPA"
                            label="Precipitación Pluvial Anual"
                            helperText="Valor entre "
                            value={inputStateData.PPA.value[0]}
                            error={inputStateData.PPA.error[0]}
                            onChange={(MessageEvent) => handleInputChange(MessageEvent.currentTarget.value, inputStateData.PPA)}
                            inputProps={texfieldStyle}
                            InputLabelProps={texfieldStyle}
                            disabled={algorithmRunning}
                        />
                    </Grid>

                    <Grid item xs={12} mt={3}>
                        <ThemeProvider theme={theme}>
                            <Button
                                variant="contained"
                                color={algorithmRunning ? 'secondary' : 'primary'}
                                disabled={
                                    //  true
                                    checkIfErrorOnInput(inputStateData)
                                }
                                onClick={() => {
                                    if (algorithmRunning) stopAlgorithm();
                                    else startAlgorithm();
                                }}
                            >

                                {(algorithmRunning) ? 'Detener' : 'Iniciar Análisis'}
                            </Button>
                        </ThemeProvider>


                    </Grid>

                </Grid>




            </Paper>
        </Box>
    );
}


