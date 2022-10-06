import AppBarMui from '@mui/material/AppBar';
import { title } from 'process';




const AppBar: React.FC<{titleText: string}> = ({titleText}) => {

    return (
        <AppBarMui position="static" color="primary">
            <p>{titleText}</p>
        </AppBarMui>
    );
}
export default AppBar;