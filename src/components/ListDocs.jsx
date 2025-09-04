import { useEffect, useState } from "react";
import { ListFiles, SelectFile } from "./Fetcher"
import styled from "styled-components";

export const ListDocs = ({ docs, loading, open, setOpen }) => {
    // const [docs, setDocs] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [open, setOpen] = useState(false);

    // useEffect(() => {
    //     const fetchDocs = async () => {
    //         try{
    //             const res = await ListFiles();
    //             setDocs(res);
    //         }
    //         catch(err){
    //             console.error("Error Fetching Docs!", err);
    //         }
    //         finally{
    //             setLoading(false);
    //         }
    //     };

    //     fetchDocs();
    // }, []);

    const handleSelectDoc = async (doc) => {
        await SelectFile({collection_name: doc});
        console.log("Selected :",doc)
    }

    if (loading) return <p>Loading documents...</p>
    return(
        <>
        <SideBarButton open={open} onClick = {() => setOpen(!open)}>
            &#9776;
        </SideBarButton>

        <FileList open={open}>
            {docs && docs.length>0 ? (
                <>
                    <Docs>Documents</Docs>
                    {docs.map((doc, ind) => (
                        <File key={ind} onClick={() => handleSelectDoc(doc)}>{doc}</File>
                    ))}
                </>
            ):(
                <p>No documents uploaded yet.</p>
               
            )}
        </FileList>
        </>
    )
}

export const showDoc = () => {
    return(
        <div>
            
        </div>
    )
}

const FileList = styled.div`
    position: fixed;
    display: flex;
    z-index: 2000;
    flex-direction: column;
    padding-top: 30px;
    margin-left: -40px;
    margin-top:-65px;
    width: ${({open}) => (open? "250px" : "0px")}; 
    height: 100vh;
    overflow-x: hidden;
    background-color: #f9f9f9;
    transition: width 0.3s ease, padding 0.3s ease;
    padding-left: ${({ open }) => (open ? "15px" : "0")};

`;

const Docs = styled.div`
    position: relative;
    left: -73px;
    margin-top: 70px;
    margin-bottom: 15px;
    color:#8f8f8f;
`;

const SideBarButton = styled.div`
    position: fixed;
    top:20px;
    left: ${({ open }) => (open ? "200px" : "20px")};
    // left:20px;
    font-size: 24px;
    cursor: pointer;
    z-index: 3000;
`
const File = styled.div`
    display: flex;
    flex-direction: row;
    // margin-bottom: 15px;
    padding-left: 30px;
    padding-top: 10px;
    padding-bottom: 10px;
    cursor: pointer;
    margin-left: -15px;

    &:hover {
        background-color: #f0f0f0;
        border-radius: 10px;
        transition: all 0.2s ease;
    };
`