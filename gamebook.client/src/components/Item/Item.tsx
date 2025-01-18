import ItemsList from "./GetItems";
import { PlayerItems } from "./PlayerItems";
import ItemForm from "./PostItem";

const Item = () => {
    return (
        <>
            <ItemForm />
            <ItemsList />
            <PlayerItems/>   
        </>
    );
}

export default Item;