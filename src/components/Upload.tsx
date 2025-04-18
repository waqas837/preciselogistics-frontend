import React from "react";

// Define the types for the props
interface UploadProps {
    accept: string;
    label: string;
    files: { file: File }[];
    setFiles: React.Dispatch<React.SetStateAction<{ file: File }[]>>;
    multiple: boolean;
}

const Upload: React.FC<UploadProps> = ({ accept, label, files, setFiles, multiple }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files).map((file) => ({
                file,
            }));
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    return (
        <div>
            <label>{label}</label>
            <input
                type="file"
                accept={accept}
                onChange={handleFileChange}
                multiple={multiple}
            />
            <ul>
                {files.map((file, index) => (
                    <li key={index}>{file.file.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Upload;
