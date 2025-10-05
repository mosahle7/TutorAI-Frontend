import styled from "styled-components";
import { useState, useRef } from "react";
import { uploadFile } from "./Fetcher";
import { Tooltip } from "./Layout";

export const FileUploader = ({onUpload}) => {
    const [uploadedFile, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = async (ev) => {
        let file;

        if(ev.target.files && ev.target.files.length>0){
            file = ev.target.files[0];
        }
        else if(ev.dataTransfer && ev.dataTransfer.files.length>0){
            file = ev.dataTransfer.files[0];
        }
        if(file){
            setFile(file)
            console.log("File uploaded: ",file)
            try{
                await uploadFile(file)
                if (onUpload) onUpload();
            }
            catch(err){
                console.error("Error uploading file: ", err);
            }
            }
        }

    return(
        <>
        <AddButton onClick={() => fileInputRef.current.click()}>
            <Tooltip style={{
                marginLeft: '3px',
            }}>
                Add File
            </Tooltip>
        +
        </AddButton>
        <FileInput 
            ref = {fileInputRef}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
        />
        </>
    )
}

const AddButton = styled.button`
    position: absolute;
    left: 232px;
    top: 8px;
    border: none;
    background-color: transparent;
    color: #007bff;
    font-size: 22px;
    cursor: pointer;

    &:hover > div{
        visibility: visible;
        opacity: 1;
        transition: opacity 0.3s;
    }
    `
const FileInput = styled.input`
    display: none;
`