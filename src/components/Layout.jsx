import styled from 'styled-components';
import { useState, useRef, useEffect} from 'react';
import { getResponse, SelectFile } from './Fetcher';
import { FileUploader } from './FileUploader';
import ReactMarkdown from 'react-markdown';
import { ListFiles } from './Fetcher';
import { ListDocs, ShowDoc } from './ListDocs';

export const Layout = () => {
    const [query, setQuery] = useState('');
    const chatBoxRef = useRef(null);
    const [shiftEnterPressed, setShiftEnterPressed] = useState(false);
    const isMultiline = query.split('\n').length > 1;
    const [introText, setIntroText] = useState('');
    const [docs, setDocs] = useState([]);
    const [open, setOpen] = useState(false);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [conversation, setConversation] = useState([]);
    const [collection_name, setCollectionName] = useState("");

    const fetchDocs = async () => {
        try {
            setLoadingDocs(true);
            const res = await ListFiles();
            setDocs(res);
        } catch (err) {
            console.error("Error fetching docs:", err);
        } finally {
            setLoadingDocs(false);
        }
        };
    
    const handleSelectDoc = async (doc) => {
        await SelectFile({collection_name: doc});
        setCollectionName(doc);
        console.log("Selected :",doc)
    }

    useEffect(() => {
        fetchDocs();
    }, []);

    useEffect(() => {
    if (conversation.length === 0) {
        const fullText = "Do you have any doubts in your mind?";
        let i = 0;
        let current = '';
        setIntroText(''); // Clear before starting

        const interval = setInterval(() => {
            if (i < fullText.length) {
                current += fullText.charAt(i);
                setIntroText(current);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 40);

        return () => clearInterval(interval);
    } else {
        setIntroText('');
    }
}, [conversation.length]);

    useEffect(() => {
        if (chatBoxRef.current) {
            if (isMultiline) {
            chatBoxRef.current.style.height = 'auto';
            chatBoxRef.current.style.height = chatBoxRef.current.scrollHeight + 'px';
        } else {
            chatBoxRef.current.style.height = '40px';
        }
        
        if (query === '') {
            chatBoxRef.current.style.height = '40px';
            setTimeout(() => {
                if (chatBoxRef.current) {
                    chatBoxRef.current.scrollTop = 0;
                    chatBoxRef.current.focus();
                    chatBoxRef.current.setSelectionRange(0, 0);
                    chatBoxRef.current.style.height = '40px';
                }
            }, 0);
        }
    }
}, [query, isMultiline]);


    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };



    const handleSubmit = async () => {
        console.log('Submitted:', query);
        setConversation(prev => [...prev, {type: 'user', content: query}]);
        
        const currentQuery = query; //  query before clearing
        setQuery('');
        setShiftEnterPressed(false);

        if (chatBoxRef.current) {
            chatBoxRef.current.style.height = '40px';
            chatBoxRef.current.scrollTop = 0;
        }
        // const res = await getResponse(currentQuery);
        // console.log('Response: ', res);

        setConversation(prev => [...prev, {type: 'bot', content: ''}]);
        
        let accumulated_content = '';
        try {
            
            // const response = await getResponse(currentQuery);
            const response = await fetch('http://localhost:8001/agent_stream', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: currentQuery
            });
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const text = decoder.decode(value); // Raw text, no JSON parsing
            console.log('Received chunk:', JSON.stringify(text)); // Add this line
            
            accumulated_content += text;

            // Append text directly to last bot message
            setConversation(prev => {
                const newConv = [...prev];
                newConv[newConv.length - 1].content = accumulated_content;
                return newConv;
            });
        }

        // const cleanText = accumulated_content
        // .replace(/\n{2,}/g, '\n')  // Replace 2+ newlines with single newline
        // .trim();
        // setConversation(prev => {
        //     const newConv = [...prev];
        //     newConv[newConv.length - 1].content = cleanText;
        //     return newConv;
        // });

        function cleanMarkdownText(text) {
  let cleaned = text.trim();
  // Replace 3+ consecutive newlines with exactly 2 (1 blank line)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  // Remove spaces at start/end of lines
  cleaned = cleaned.replace(/[ \t]+\n/g, '\n');
  cleaned = cleaned.replace(/\n[ \t]+/g, '\n');
  return cleaned;
}

const finalClean = cleanMarkdownText(accumulated_content);
setConversation(prev => {
  const newConv = [...prev];
  newConv[newConv.length - 1].content = finalClean;
  return newConv;
});

        }

        catch (error) {
            console.error('Error: ',error);
        }
    }

    // const fetchResponse = async (query) => {
    //     const res = await getResponse(query);
    //     console.log('Response: ',res);
    //     setResponses([...responses, res]);
    // };


    return (
        <>
            {/* <header>
                <h1>My App</h1>
            </header> */}
            <main>
                
            </main>
            <ShowDoc collection_name={collection_name}/>
            <ListDocs docs={docs} loading={loadingDocs} open={open} setOpen={setOpen} onSelectDoc={handleSelectDoc}/>
            {conversation.length === 0 && (
                <>
                <SelfIntro $open={open}>Hello, I am TutorAI</SelfIntro>

                    <Intro $open={open}>
                        {introText}
                        {introText.length < "Do you have any doubts in your mind?".length && (<BlinkingCursor>|</BlinkingCursor>)}
                    </Intro>
                </>
            )}

            <ChatContainer $down={conversation.length > 0} $open={open}>
                <InputWrapper>
                <ChatBox
                 ref={chatBoxRef}
                 value={query} 
                 onChange={handleInputChange} placeholder="Ask a question"
                 onKeyDown={(e) => {
                    if(e.key === 'Enter' && e.shiftKey) {
                        setShiftEnterPressed(true);
                        return;
                    }

                    if (e.key === 'Enter' && /\S/.test(query)) {
                        handleSubmit();
                    }

                }}
                $multiline = {isMultiline}
                />           
                <FileUploader onUpload={fetchDocs}/>

                <SubmitIcon
                disabled={!/\S/.test(query)}
                onClick={handleSubmit}>
                <Tooltip style={{
                    marginLeft: '3px',
                }}>
                    Submit
                </Tooltip>
                    ➡️
                </SubmitIcon>
                </InputWrapper>
            </ChatContainer>

            {conversation.length>0 && (
                <>
                <ConversationContainer $open={open}>
                    {conversation.map((item, i) => (
                        <div key={i} style={{marginBottom: '15px'}}>
                        {item.type === 'user' ? (
                            <UserMessage>{item.content}</UserMessage>
                        ) : (
                            <BotResponse>
                                <ReactMarkdown>{item.content}</ReactMarkdown>
                            </BotResponse>
                        )}
                        </div>
                ))}
                </ConversationContainer>
                </>

            )}

        </>
    )
}

export const Tooltip = styled.div`
    visibility: hidden;
    opacity: 0;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    font-size: 12px;
    padding: 6px 6px;
    margin-left: 25px;
    margin-top: 15px;
    position: absolute;
    display: inline-block;
    white-space: nowrap;
    z-index: 100;
    top: 75%; 
    left: 50%;
    transform: translateX(-50%);
    transition: opacity 0.2s;
    `
const SelfIntro = styled.div`
    font-family: 'Montserrat', 'Nunito', Arial, sans-serif;
    text-align: center;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    padding-left: ${props => props.$open ? '260px' : '0px'};
    // padding-left: -30px;
    color: #3260eaff;
    font-weight: 540;
    margin-top: 100px;
    font-size: 30px;
    transition: padding-left 0.3s ease;
    animation: slideDown 0.8s cubic-bezier(0.23, 1, 0.32, 1);

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-60px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
`
const Intro = styled.div`
    font-family: 'Montserrat', 'Nunito', Arial, sans-serif;
    color: #555;
    position: fixed;
    top: 180px;
    left:50%;
    padding-left: ${props => props.$open ? '260px' : '0px'};
    transform: translateX(-50%);
    text-align: center;
    font-size: 30px;
    font-weight: 400;
    width: 100%;
    transition: padding-left 0.3s ease;
`

const BlinkingCursor = styled.span`
    display: inline-block;
    width: 1ch;
    animation: blink 1s steps(1) infinite;

    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
`;

const ChatContainer = styled.div`
    position: fixed;
    padding-left: ${props => props.$open ? '135px' : '0px'};
    top: ${props => props.$down ? '500px' : '250px'};
    width: 100%;
    display: flex;
    justify-content: center;
    transition: padding-left 0.3s ease, top 0.3s ease;
`
const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ChatBox = styled.textarea`
    padding: ${props => props.$multiline ? '8px 0px 8px 40px' : '12px 0px 10px 40px'};
    width: 60%;
    max-height: 200px;
    margin-right: 70px;
    font-family: inherit;
    font-size: 15px;
    transition: all 0.3s;
    border: 1px solid #ccc;
    border-radius: 20px;
    outline: none;
    box-sizing: border-box;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    resize: none;
    overflow-y:hidden;
    line-height: ${props => props.$multiline ? '1.7' : '1.2'};
`

const SubmitIcon = styled.button`
  position: absolute;
  right: 300px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px; /* adjust size */

  &: hover > div {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.3s;
  }
`;

const ConversationContainer = styled.div`
    position: fixed;
    top: 60px;
    // right: 40px;
    // display: flex;
    // left: 50%;
    // transform: translateX(-50%);
    left: ${props => props.$open ? '150px' : '0px'};
    right: 0;
    width: auto;
    max-height: 400px;
    overflow-y: auto;
    padding: 20px;
    // flex-direction: column;
    // align-items: flex-end;
    z-index: 1000;
    transition: left 0.3s ease;
`

const UserMessage = styled.div`
    text-align: right;
    background: #f1f1f1;
    color: #333;
    padding: 10px 15px 10px 15px;
    margin-left:auto;
    margin-right: 235px;
    border-radius: 16px;
    width: fit-content;
    min-height: 20px;
    min-width: 20px;
    flex-shrink: 0; 
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: pre-wrap;
`

const BotResponse = styled.div`
    text-align: left;
    max-width:60%;
    margin-top: 60px;
    margin-bottom: 70px;
    white-space: pre-wrap;
    margin-right:auto;
    margin-left:280px;
    background: transparent;
    color: #333;

    p {
        margin-top: 0.5em;
        margin-bottom: 0.5em;
    }

    h1, h2, h3, h4, h5, h6 {
        margin-top: 0.5em !important;
        margin-bottom: 0.5em !important;
    }
`

