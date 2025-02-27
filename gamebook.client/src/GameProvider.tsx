import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {ApiBaseUrl} from "./EnvFile";
import { Item} from "./types/types2"

interface Action {
    actionId: number;
    description: string;
    miniGameData: string;
    actionTypeId: number;
}

interface PreparedAction {
    action: Action;
    source: string;
}

interface User {
    role: string;
    email: string;
}

interface GameContextType {
    roomId: string | null;
    previousRoomId: string | null;
    setRoomId: (id: string | null) => void;
    player: { items: Item[] };
    setPlayerItems: (update: (prevItems: Item[]) => Item[]) => void;
    stamina: number;
    date: Date;
    setStamina: (value: number) => void;
    setDate: (value: Date) => void;
    serializeContext: () => string;
    preparedAction: PreparedAction | null;
    setPreparedAction: (action: PreparedAction | null) => void;
    isActionOpen: boolean;
    setIsActionOpen: (open: boolean) => void;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    saveUserData: () => Promise<void>;
    getUserData: (userId: string) => Promise<void>;
    NoteBookValue: string;
    setNoteBookValue: (value: string) => void;
    money: number;
    setMoney: (value: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [roomId, setRoomIdState] = useState<string | null>(null);
    const [previousRoomId, setPreviousRoomId] = useState<string | null>(null);
    const [player, setPlayer] = useState<{ items: Item[] }>({ items: [] });
    const [stamina, setStamina] = useState(100);
    const [date, setDate] = useState(new Date(1849, 1, 3));
    const [preparedAction, setPreparedAction] = useState<PreparedAction | null>(null);
    const [isActionOpen, setIsActionOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [NoteBookValue, setNoteBookValue] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const [money, setMoney] = useState(200);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const pathParts = location.pathname.split("/");
        const newRoomId = pathParts[pathParts.length - 1];

        if (newRoomId !== roomId) {
            setPreviousRoomId(roomId);
            setRoomIdState(newRoomId);
        }
    }, [location.pathname]);

    const updateRoomId = (id: string | null) => {
        if (id !== roomId) {
            setPreviousRoomId(roomId);
            setRoomIdState(id);
            if (id) {
                navigate(`/Page/${id}`, { replace: true });
            }
        }
    };

    const setPlayerItems = (update: (prevItems: Item[]) => Item[]) => {
        setPlayer((prev) => ({ ...prev, items: update(prev.items) }));
    };

    const serializeContext = () => {
        return JSON.stringify({
            roomId,
            previousRoomId,
            player,
            stamina,
            date: date.toISOString(),
            preparedAction,
            isActionOpen,
            NoteBookValue,
            money,
        });
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${ApiBaseUrl}/api/User/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Invalid credentials");
            }

            const data = await response.json();
            const loggedInUser = {
                email,
                role: data.role,
            };

            setUser(loggedInUser);
            localStorage.setItem("user", JSON.stringify(loggedInUser));

            if (loggedInUser.role === "Admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Login failed:", error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("An unknown error occurred");
            }
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/");
    };

    const saveUserData = async () => {
        if (!user) {
            console.error("No user logged in.");
            return;
        }

        const userData = {
            roomId,
            previousRoomId,
            player,
            stamina,
            date,
            preparedAction,
            isActionOpen,
            NoteBookValue,
            money,
        };
        console.log("Saving user data:", userData);
        try {
            const response = await fetch(`${ApiBaseUrl}/api/User/${user.email}/SaveData`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error("Failed to save user data");
            }

            console.log("User data saved successfully.");
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    };

    const getUserData = async (userEmail: string) => {
        try {
            const response = await fetch(`${ApiBaseUrl}/api/User/GetData/${userEmail}`);
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
    
            const data = await response.json(); // This is already a parsed object
            console.log("Fetched user data:", data);
    
            setRoomIdState(data.roomId);
            console.log("data.roomId", data.previousRoomId);
            setPreviousRoomId(data.previousRoomId);
            setPlayer(data.player);
            setStamina(data.stamina);
            setDate(new Date(data.date));
            setPreparedAction(data.preparedAction);
            setIsActionOpen(data.isActionOpen);
            setNoteBookValue(data.NoteBookValue);
            setMoney(data.money);
            navigate(`/Page/${data.previousRoomId}`, { replace: true });
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    return (
        <GameContext.Provider value={{
            roomId,
            previousRoomId,
            setRoomId: updateRoomId,
            player,
            setPlayerItems,
            stamina,
            date,
            setStamina,
            setDate,
            serializeContext,
            preparedAction,
            setPreparedAction,
            isActionOpen,
            setIsActionOpen,
            user,
            login,
            logout,
            saveUserData,
            getUserData,
            NoteBookValue,
            setNoteBookValue,
            money,
            setMoney,
        }}>
            {children}
        </GameContext.Provider>
    );
};


export const useGameContext = (): GameContextType => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGameContext must be used within a GameProvider");
    }
    return context;
};

export default GameProvider;
