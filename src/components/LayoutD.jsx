import styled from 'styled-components';
import { useState, useRef, useEffect} from 'react';
import { getResponse } from './Fetcher';

export const Layout = () => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [responses, setResponses] = useState([]);
    const [shiftEnterPressed, setShiftEnterPressed] = useState(false);
    const chatBoxRef = useRef(null);

    const isMultiline = query.split('\n').length > 1;

    const [conversation, setConversation] = useState([]);

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
        
        // Add user message to conversation
        setConversation([...conversation, { type: 'user', content: query }]);
        
        const currentQuery = query; // Store query before clearing
        setQuery('');
        setShiftEnterPressed(false);

        // Get response and add to conversation
        const res = await getResponse(currentQuery);
        console.log('Response: ', res);
        // Check what the actual response structure is - adjust res.data accordingly
        setConversation(prev => [...prev, { type: 'bot', content: res.data || res }]);
    };

    return (
        <>
            {/* <header>
                <h1>My App</h1>
            </header> */}
            <main>
                
            </main>
            {conversation.length === 0 && (
                <Intro>Do you have any doubts in your mind?</Intro>
            )}

            <ChatContainer $down={conversation.length > 0}>
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
                <SubmitIcon
                disabled={!/\S/.test(query)}
                onClick={handleSubmit}
                > 
                    ➡️
                </SubmitIcon>
                </InputWrapper>
            </ChatContainer>

            {conversation.length > 0 && (
                <ConversationContainer>
                    {conversation.map((item, i) => (
                        <div key={i} style={{marginBottom: '15px'}}>
                            {item.type === 'user' ? (
                                <UserMessage>{item.content}</UserMessage>
                            ) : (
                                <BotResponse>{item.content}</BotResponse>
                            )}
                        </div>
                    ))}
                </ConversationContainer>
            )}

        </>
    )
}
const Intro = styled.div`
    position: fixed;
    top: 180px;
    left:50%;
    transform: translateX(-50%);
    text-align: center;
    font-size: 30px;
    font-weight: 400;

`
const ChatContainer = styled.div`
    position: fixed;
    top: ${props => props.$down ? '500px' : '250px'};
    width: 100%;
    display: flex;
    justify-content: center;
`
const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ChatBox = styled.textarea`
    padding: ${props => props.$multiline ? '8px 0px 8px 40px' : '12px 0px 10px 40px'};
    width: 60%;
    max-height: 200px;
    font-size: 15px;
    transition: all 0.3s;
    border: 1px solid #ccc;
    border-radius: 20px;
    outline: none;
    box-sizing: border-box;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    resize: none;
    overflow-y:auto;
    line-height: ${props => props.$multiline ? '1.7' : '1.2'};
`

const SubmitIcon = styled.button`
  position: absolute;
  right: 280px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px; /* adjust size */
`;

const ConversationContainer = styled.div`
    position: fixed;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-height: 400px;
    overflow-y: auto;
    padding: 20px;
`

const UserMessage = styled.div`
    text-align: right;
    background: #f1f1f1;
    color: #333;
    padding: 10px 15px;
    border-radius: 8px;
    margin-left: auto;
    max-width: 70%;
    margin-bottom: 5px;
`

const BotResponse = styled.div`
    text-align: left;
    color: #333;
    padding: 10px 0px;
    max-width: 100%;
    margin-bottom: 5px;
    background: transparent;
    white-space: pre-wrap;
`


// const MessageBox = styled.div`
//     min-width: 90px;
//     min-height: 20px;
//     border-radius: 8px;
//     background: #f1f1f1;
//     padding: 8px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     margin-bottom: 8px;
//     white-space: pre-wrap;
`

// const ResponsesContainer = styled.div`
//     position: fixed;
//     top: 100px;
//     left: 40px;
//     display: flex;
//     flex-direction: column;
//     align-items: left;
//     z-index: 1000;
// `

// const ResponseBox = styled.div`
//     width: 100%;
//     display: flex;
//     align-items: left;
//     justify-content: left;
//     white-space: pre-warp
// `