import React, { useState } from 'react';

const CreateNPCForm: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [target, setTarget] = useState<number | string>('');
    const [actionId, setActionId] = useState<number | string>('');
    const [img, setImg] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !description) {
            setMessage('Name and Description are required.');
            return;
        }

        // Create FormData object to send the form data including file
        const formData = new FormData();
        formData.append('Name', name);
        formData.append('Description', description);
        if (img) {
            formData.append('Img', img);
        }
        if (target) {
            formData.append('Target', target.toString());
        }
        if (actionId) {
            formData.append('ActionId', actionId.toString());
        }

        setIsLoading(true);
        try {
            const response = await fetch('https://localhost:7058/api/NPCs', {
                method: 'POST',
                body: formData, // send the FormData with the file included
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(`NPC created successfully with ID: ${data.npcId}`);
            } else {
                const errorData = await response.json();
                setMessage('Error creating NPC: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            if (error instanceof Error) {
                setMessage('Error: ' + error.message);
            } else {
                setMessage('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Create New NPC</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="target">Target (Optional):</label>
                    <input
                        type="number"
                        id="target"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="actionId">Action ID (Optional):</label>
                    <input
                        type="number"
                        id="actionId"
                        value={actionId}
                        onChange={(e) => setActionId(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="img">Image (Optional):</label>
                    <input
                        type="file"
                        id="img"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files) {
                                setImg(e.target.files[0]);
                            }
                        }}
                    />
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating NPC...' : 'Create NPC'}
                </button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateNPCForm;
