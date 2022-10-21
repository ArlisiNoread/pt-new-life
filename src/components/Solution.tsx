import { Box, Paper } from "@mui/material";
import { InputStateData } from "./Tab1";

type SolutionStateFinish = ['finished', {
    solution: string
}];
type SolutionStateInProgress = ['inProgress', {
    progressAlgorithmText: string,
    remainingTime: string
}];

export type SolutionData = {
    state: SolutionStateFinish | SolutionStateInProgress,
    inputStateData: number,

}


const Solution: React.FC<{
    id: number,
    solutionData: SolutionData
}> = ({
    id,
    solutionData
}) => {
        return (
            <Box>
                <Paper>
                    <p>Análisis: {id}</p>
                    <p>{solutionData.state[0] === 'inProgress' ? solutionData.state[1].progressAlgorithmText : ''}</p>
                    <p>{solutionData.state[0] === 'inProgress' ? solutionData.state[1].remainingTime : ''}</p>
                    <p>{solutionData.state[0] === 'finished' ? 'solución adquirida' : ''}</p>
                </Paper>
            </Box>
        );
    }

export default Solution;


const InProgress: React.FC = () => {

    return (
        <Box>

        </Box>
    );

}