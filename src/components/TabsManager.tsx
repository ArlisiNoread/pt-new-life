import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import { SxProps, Theme } from '@mui/material';



const TabsManager: React.FC<{ tabNumber: number, setTabNumber: Function }> = ({ tabNumber, setTabNumber }) => {

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabNumber(newValue);
    }

    const estiloBotones: SxProps<Theme> = { fontSize: '10px' };

    return (
        <Tabs value={tabNumber}
            onChange={handleTabChange}
            aria-label="Tabs Calculadora"
            variant="fullWidth"
            sx={{backgroundColor: 'pink'}}
        >
            <Tab icon={<PhoneIcon />} label="Calculadora" sx={estiloBotones} />
            <Tab icon={<FavoriteIcon />} label="Historial" sx={estiloBotones} />
            <Tab icon={<PersonPinIcon />} label="Ayuda" sx={estiloBotones} />
        </Tabs>
    );
}

export default TabsManager;