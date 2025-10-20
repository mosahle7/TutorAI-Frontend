import { use, useEffect, useState } from "react";
import { ListFiles, SelectFile, ShowFile, ReadFile } from "./Fetcher"
import { OptionsIcon } from "./Icons";
import { Tooltip } from "./Layout";
import styled from "styled-components";

export const ListDocs = ({ docs, loading, open, setOpen, onSelectDoc }) => {
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

    // const handleSelectDoc = async (doc) => {
    //     await SelectFile({collection_name: doc});
    //     console.log("Selected :",doc)
    // }
    const [hoveredIcon, setHoveredIcon] = useState(null);
    const [menuDoc, setMenuDoc] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalFileUrl, setModalFileUrl] = useState("")

    const handleIcon = (e, doc) => {
        e.stopPropagation();
        setMenuDoc(prev => (prev === doc ? null : doc));
    };

    const handleView = (doc) => {
        setModalFileUrl(`https://34.23.99.20:8001/read_docs/${doc}`);
        setModalOpen(true);
        setMenuDoc(null);
    }

    const handleDownload = (doc) => {
        const link = document.createElement('a');
        link.href = `https://34.23.99.20:8001/download_docs/${doc}`;
        link.download = doc;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setMenuDoc(null);
    };


    const closeModal = () => {
        setModalOpen(false)
        setModalFileUrl("");
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if(
                menuDoc &&
                !e.target.closest(".menu") &&
                !e.target.closest(".options-icon")
            ) {
                setMenuDoc(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        }
    }, [menuDoc]);

    if (loading) return <p>Loading documents...</p>

    return(
        <>
     
        <SideBarButton 
            // title = {open ? "Collapse menu" : "Expand menu"} 
            open={open} 
            onClick = {() => setOpen(!open)}>
            &#9776;
            <Tooltip>{open ? "Close menu" : "Expand menu"}</Tooltip>
        </SideBarButton>

        <FileList open={open}>
            {docs && docs.length>0 ? (
                <>
                    <Docs>Documents</Docs>
                    {docs.map((doc, ind) => (
                        <File key={ind} onClick={() => onSelectDoc(doc)}>
                            
                            <OptionsIcon className="options-icon" 
                            onClick= {e => handleIcon(e, doc)}
                            onMouseEnter={() => setHoveredIcon(doc)}
                            onMouseLeave={() => setHoveredIcon(null)}
                            >
                            </OptionsIcon>

                            <Tooltip style={{
                                visibility: hoveredIcon == doc ? 'visible' : 'hidden',
                                opacity: hoveredIcon == doc ? 1 : 0,
                                transition: 'opacity 0.3s',
                                marginLeft: '100px',
                                marginTop: '5px',
                            }}>
                                Options
                            </Tooltip>
                            {doc}
                            {menuDoc === doc && (
                                <Menu className="menu">
                                    <div onClick={() => handleView(doc)}>View</div>
                                    <div onClick={() => handleDownload(doc)}>Download</div>
                                </Menu>
                            )}
                        </File>
                    ))}
                </>
            ):(
                <p>No documents uploaded yet.</p>
               
            )}
        </FileList>

        {modalOpen && (
            <ModalOverlay onClick={closeModal}>
                <ModalContent onClick={e => e.stopPropagation()}>
                    <CloseButton onClick={closeModal}>x</CloseButton>
                    <iframe
                        src={modalFileUrl}
                        title="Document Viewer"
                        width="800"
                        height="500"
                    />
                </ModalContent>
            </ModalOverlay>
            
        )}
        </>
    )
}

export const ShowDoc = ({ collection_name }) => {
    const [displayName, setDisplayName] = useState("");

    useEffect(() => {
        const fetchDoc = async () => {
            const doc = await ShowFile();
            setDisplayName(doc);
        };
        fetchDoc();
    }, [collection_name]);

    return(
        <Show>
            {displayName|| "Loading..."}
        </Show>
    )
}

// export const 
const SideBarButton = styled.div`
    position: fixed;
    top:15px;
    left: ${({ open }) => (open ? "200px" : "20px")};
    font-size: 20px;
    cursor: pointer;
    z-index: 3000;
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
        background-color: #f9f9f9;
        transition: all 0.2s ease;
        border-radius: 50%;
    }
    
    &:hover > div {
        visibility: visible;
        opacity: 1;
        transition: opacity 0.3s;
    }
`
// const IconWrapper = styled.div`
//   position: relative;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 100;
//   &:hover > div {
//     visibility: visible;
//     opacity: 1;
//     transition: opacity 0.3s;
//   }
// `;

const Menu = styled.div`
    position: absolute;
    left: 170px;
    top: 40px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    z-index: 10000;
    min-width: 85px;
    > div {
        padding: 6px 2px;
        font-size: 14px;
        // color: #333;
        cursor: pointer;
        &:hover {background: #f0f0f0; }
}}
`

const Show = styled.div`
    // z-index: 5000;
`
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

const File = styled.div`
    display: flex;
    position: relative;
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

const ModalOverlay = styled.div`
position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
background: #fff;
  padding: 25px;
  border-radius: 10px;
  position: relative;
  min-width: 600px;
  min-height: 400px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;

const CloseButton = styled.div`
  position: absolute;
  top: 2px; 
  right: 6px;
  width: 20px;
  height: 20px;
//   background: #f0f0f0;
  background: transparent;
  border: none;
  border-radius: 50%;
//   font-weight: bold;
  color: #333;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    // color: #e74c3c;
    color: red;
    // color: #fff;
  }
`;