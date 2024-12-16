import { Link } from "react-router-dom";
import Query from '../queries/GetRooms';
import Button from '../components/AtomButton';
import  AtomForm  from "../components/AtomForm";
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
            <AtomForm
  label="Your Name"
  placeholder="Enter your name"
    validationPattern={/^[a-zA-Z ]+$/}
  errorMessage="Please use only letters and spaces"
  onSubmit={(value) => console.log('Form submitted with value:', value)}
/>
        </>
    );

}

export default Admin;