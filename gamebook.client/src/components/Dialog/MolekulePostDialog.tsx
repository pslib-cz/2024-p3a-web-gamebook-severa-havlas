import React, { useState } from 'react';

interface DialogDTO {
    ParentDialogId?: number;
    NPCId?: number;
    Text: string;
}

const PostDialogForm: React.FC = () => {
    const [parentDialogId, setParentDialogId] = useState<number | undefined>(undefined);
    const [npcId, setNpcId] = useState<number | undefined>(undefined);
    const [text, setText] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const dialogData: DialogDTO = {
            ParentDialogId: parentDialogId,
            NPCId: npcId,
            Text: text,
        };

        setIsLoading(true);
        try {
            // Use fetch API to send the POST request
            const response = await fetch('https://localhost:7058/api/Dialogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dialogData),
            });

            if (response.ok) {
                setMessage('Dialog successfully created!');
            } else {
                const errorData = await response.json();
                setMessage('Error creating dialog: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            if (error instanceof Error) {
                setMessage('Error creating dialog: ' + error.message);
            } else {
                setMessage('Error creating dialog: Unknown error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Create New Dialog</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="text">Dialog Text:</label>
                    <textarea
                        id="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="npcId">NPC ID (Optional):</label>
                    <input
                        type="number"
                        id="npcId"
                        value={npcId ?? ''}
                        onChange={(e) => setNpcId(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                </div>

                <div>
                    <label htmlFor="parentDialogId">Parent Dialog ID (Optional):</label>
                    <input
                        type="number"
                        id="parentDialogId"
                        value={parentDialogId ?? ''}
                        onChange={(e) => setParentDialogId(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Dialog'}
                </button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default PostDialogForm;
