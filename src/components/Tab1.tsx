import { FormControl, FormHelperText, Grid, Input, InputLabel, OutlinedInput } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { Dispatch, SetStateAction } from 'react';
import Solution from './Solution';


type InputStateCommonData = {
    value: [string, Dispatch<SetStateAction<string>>],
    error: [boolean, Dispatch<SetStateAction<boolean>>],
}

export type InputStateData = {
    TMA: InputStateCommonData,
    PPA: InputStateCommonData
}


const handleInputChange = (newValue: string, dataState: InputStateCommonData) => {
    const re = /^[0-9]*$/;

    if(new RegExp(re).test(newValue)) dataState.value[1](newValue);

}

const Tab1: React.FC<{
    progressAlgorithmText: string,
    remainingTime: string,
    startAlgorithm: Function,
    stopAlgorithm: Function,
    inputStateData: InputStateData
}> = (
    {
        progressAlgorithmText,
        remainingTime,
        startAlgorithm,
        stopAlgorithm,
        inputStateData
    }
) => {

        const test = () => {
            return (
                <Box>
                    <p>{remainingTime}</p>
                    <p>{progressAlgorithmText}</p>
                    <Button
                        variant="contained"
                        onClick={() => { startAlgorithm() }}
                    >Iniciar</Button>
                    <Button
                        variant="contained"
                        onClick={() => { stopAlgorithm() }}
                    >Detener</Button>
                </Box>
            );
        }


        return (
            <Box sx={{ margin: '10px' }}>
                <InputsAlgorithm
                    inputStateData={inputStateData}
                />
                {(true) ? <Solution /> : ''}
            </Box>
        );
    }

export default Tab1;


const InputsAlgorithm: React.FC<{
    inputStateData: InputStateData
}> = ({ inputStateData }) => {

    const texfieldStyle = { style: { fontSize: 10 } };



    return (
        <Box>
            <Paper variant="outlined" sx={{ padding: '10px' }}>
                <Grid container>
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
                        />
                    </Grid>

                </Grid>




            </Paper>
        </Box>
    );
}


