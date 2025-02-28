import React, { useEffect, useState } from 'react';
import { GameBookAction, Dialog } from '../../types/types2';

type ActionComponentProps = {
    action: GameBookAction;
    source: string;
    CloseAction(): void;
};

type DialogOption = {
    id: number;
    text: string;
};

const DialogAction: React.FC<ActionComponentProps> = ({ action, CloseAction }) => {
    const [dialogs, setDialogs] = useState<Dialog[]>(action.dialogs || []);
    const [options, setOptions] = useState<DialogOption[]>([]);
    const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (dialogs.length > 0) {
            setCurrentDialog(dialogs[0]); // Start with the first dialog
        }
    }, [dialogs]);

    const fetchDialogOptions = async (dialogId: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/Dialogs/getOptions/${dialogId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    CloseAction(); // No more dialogs, close the action
                    return;
                }
                throw new Error('Failed to fetch dialog options');
            }
            const data: DialogOption[] = await response.json();
            setOptions(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleDialogClick = (dialog: Dialog) => {
        setCurrentDialog(dialog);
        fetchDialogOptions(dialog.dialogId);
    };

    return (
        <div>
            <h3>Dialog</h3>
            {error && <div className="error">{error}</div>}
            {loading && <div>Loading...</div>}
            {!loading && !error && (
                <>
                    <ul>
                        {dialogs.map(dialog => (
                            <li key={dialog.dialogId}>
                                <button onClick={() => handleDialogClick(dialog)}>{dialog.label}</button>
                            </li>
                        ))}
                    </ul>
                    {currentDialog && (
                        <div>
                            <h4>{currentDialog.label}</h4>
                            <p>{currentDialog.text}</p>
                            <h5>Options</h5>
                            <ul>
                                {options.map(option => (
                                    <li key={option.id}>{option.text}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DialogAction;
