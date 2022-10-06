import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Interface_algorithm_progress } from '../App';



const Tab1: React.FC<{
    progressAlgorithmText: string,
    startAlgorithm: Function
}> = (
    {
        progressAlgorithmText: progressAlgorithmText,
        startAlgorithm
    }
) => {

        return (
            <Box>
                <p>{progressAlgorithmText}</p>
                <Button
                    variant="contained"
                    onClick={() => { startAlgorithm() }}
                >Iniciar</Button>
            </Box>
        );
    }

export default Tab1;