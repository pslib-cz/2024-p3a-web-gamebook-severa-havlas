import GameBookActionComponent from "./GetAction";
import CreateGameBookAction from "./PostAction";


const Action = () => {
    return (
        <>
           <GameBookActionComponent id={3} />
            <CreateGameBookAction />
        </>
    );
}

export default Action;