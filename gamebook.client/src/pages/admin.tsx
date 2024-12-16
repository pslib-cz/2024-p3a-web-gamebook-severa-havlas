import { Link } from "react-router-dom";
import Query from '../queries/GetRooms';
import Button from '../components/AtomButton';
import { useState } from "react";
const Admin = () => {
    
    const [mrdka, setMrdka] = useState<boolean>(false);

    const handleClick = () => {
        
        setMrdka(true);
      };

    return (
        <>
            <p>admin tu</p>
            <Link to="/">domastil sem</Link>
            {mrdka ? <Query></Query> : null}
            <Button label="Click Me" onClick={handleClick} color="green" size="large" />
        </>
    );

}

export default Admin;