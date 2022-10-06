import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';



const TabsManager: React.FC<{ tabNumber: number, setTabNumber: Function }> = ({ tabNumber, setTabNumber }) => {

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabNumber(newValue);
    }

    return (
        <Tabs value={tabNumber} onChange={handleTabChange} aria-label="Tabs Calculadora" variant="fullWidth">
            <Tab icon={<PhoneIcon />} label="Calculadora" />
            <Tab icon={<FavoriteIcon />} label="Historial" />
            <Tab icon={<PersonPinIcon />} label="Ayuda" />
        </Tabs>
    );
}

export default TabsManager;