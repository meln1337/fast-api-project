import React, { useState } from "react";

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [responseImage, setResponseImage] = useState(null); // To store the returned image

    // Handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setResponseImage(null)

        // Set up a preview for image files
        const filePreviewUrl = URL.createObjectURL(file);
        setPreview(filePreviewUrl);
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            alert("Please select a file before submitting.");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            // Fetch image from the FastAPI server
            const response = await fetch("http://127.0.0.1:8000/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload image.");
            }

            // Read the response as a blob (binary data)
            const imageBlob = await response.blob();

            // Create a URL for the blob so it can be displayed
            const imageUrl = URL.createObjectURL(imageBlob);
            setResponseImage(imageUrl); // Store the image URL to display it

        } catch (error) {
            console.error("Error uploading image:", error);
            alert("There was an error uploading the image.");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Detect faces</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit" style={{ marginTop: "10px" }}>
                    Submit
                </button>
            </form>

            {selectedFile && (
                <div style={{ marginTop: "20px" }}>
                    {/*<h3>File Details:</h3>*/}
                    {/*<p>Filename: {selectedFile.name}</p>*/}
                    {/*<p>File Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>*/}
                    {/*<p>File Type: {selectedFile.type}</p>*/}

                    {selectedFile.type.startsWith("image/") && (
                        <div style={{ marginTop: "20px" }}>
                            <h3>Image Preview:</h3>
                            <img src={preview} alt="Preview" style={{ maxWidth: "300px", maxHeight: "300px" }} />
                        </div>
                    )}
                </div>
            )}

            {responseImage && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Processed Image from Server:</h3>
                    <img src={responseImage} alt="Processed" style={{ maxWidth: "300px", maxHeight: "300px" }} />
                </div>
            )}
        </div>
    );
};

export default FileUpload;
