import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';



const Tab1: React.FC<{
    progressAlgorithmText: string,
    remainingTime: string,
    startAlgorithm: Function,
    stopAlgorithm: Function,
}> = (
    {
        progressAlgorithmText,
        remainingTime,
        startAlgorithm,
        stopAlgorithm,
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
            <Box>
                <InputsAlgorithm />
                {(true) ? <SolutionAlgorithm /> : ''}
            </Box>
        );
    }

export default Tab1;


const InputsAlgorithm: React.FC = () => {
    return (
        <Box>
            <Paper variant="outlined">
                <p>Inputs</p>
            </Paper>
        </Box>
    );
}

const SolutionAlgorithm: React.FC = () => {
    return (
        <Box>
            <Paper>
                <p>Solución algoritmo</p>
            </Paper>

        </Box>
    );
}