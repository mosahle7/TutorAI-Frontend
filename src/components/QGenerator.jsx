import { useState, useEffect, useRef } from "react"
import { generateQuestions } from "./Fetcher";
import styled from "styled-components";
import { ConversationContainer, UserMessage, BotResponse, Tooltip } from "./Layout";

export const QGenerator = ({ open }) => {
    const [topic, setTopic] = useState("");
    const [number, setNumber] = useState("");
    const [questions, setQuestions] = useState("");
    const [introText, setIntroText] = useState('');
    const [conversation, setConversation] = useState([]);
    const numberInputRef = useRef(null);
    const topicInputRef = useRef(null);

    const handleTopicChange = (e) => {
        setTopic(e.target.value);
        console.log("topic: ", topic)
    }

    const handleNumberChange = (e) => {
        setNumber(e.target.value);
        console.log("number: ", number)
    }

    const handleSubmit = async (e) => {
        console.log("Submitted with topic: ", topic, " and number: ", number)

        let content;

        if(number==='1'){
            console.log("I AMM")
            content = number + " question on " + topic
        }
        else{
            content = number + " questions on " + topic

        }

        setConversation(prev => [...prev, {type:'user', content: content}])
        
        const currentTopic = topic;
        const currentNumber = number;

        setTopic("");
        setNumber("");

        try{
            const questions = await generateQuestions({topic: currentTopic, num_questions: Number(currentNumber)});
            console.log("Generated questions: ", questions);
            setConversation(prev => [...prev, {type: 'bot', content: questions}])
            setQuestions(questions);
        }

        catch(error){
            console.error("Error generating questions: ", error);
        }

        
    }

    useEffect(() => {
        const fullText = "Let's generate Questions!";
        let i = 0;
        let current = '';
        setIntroText('');

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
    }, [])

    return (
        <>
        {conversation.length === 0 &&(
        <>
        <SelfIntro $open={open}>Hello, I am TutorAI</SelfIntro>
        <Intro $open={open}>
            {introText}
            {introText.length < "Let's generate Questions!".length && (<BlinkingCursor>|</BlinkingCursor>)}
        </Intro>
        </>
        )}
        
        <InputWrapper 
        $down={conversation.length > 0} 
        $open={open}
        onKeyDown={(e) => {
            if(e.key === 'Enter'){
                if (document.activeElement === numberInputRef.current) {
                    e.preventDefault(); // Prevents the default action of Enter key
                    topicInputRef.current.focus();
                } else if (topic && number){
                    e.preventDefault(); // Prevents the default action of Enter key
                    handleSubmit();
                }
            }
        }}>
         <NumberInput
        ref ={numberInputRef}
        type="number"
        min={1}
        max={20}
        placeholder="#"
        value={number}
        onChange={handleNumberChange}
        />
        <span>Questions on</span>
        <TopicInput
        ref={topicInputRef}
        placeholder="topic"
        value={topic}
        onChange={handleTopicChange}
        />

        <SubmitBtn 
        disabled={!topic || !number}
        onClick={handleSubmit}>
            <Tooltip style={{
                    marginLeft: '3px',
                    marginTop: '10px',
            }}>
                Submit
            </Tooltip>
            ➡️
        </SubmitBtn>
       
        </InputWrapper>

       

        {conversation.length>0 && (
            <>
            <ConversationContainer $open={open}>
            {conversation.map((item, i) =>(
                <div>
                    {item.type === 'user' ? (
                        <UserMessage>{item.content}</UserMessage>
                    ):(
                        <BotResponse>
                            {item.content}
                        </BotResponse>
                    )}
                </div>
            ))}
            </ConversationContainer>
            </>
        )}
        {/* {questions && (
            <div>{questions}</div>
        )} */}
        </>
    )
}

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
const InputWrapper = styled.div`
    position: fixed;
    top: ${props => props.$down ? '500px' : '250px'};;
    left: 50%;
    transform: translateX(-50%);
    padding-left: ${props => props.$open ? '260px' : '8px'};
    display: flex;
    align-items: center;
    gap: 14px;
`
const BaseField = `
  height: 46px;
  padding: 10px 14px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
  font-family: inherit;
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);
  background: #fff;
  box-sizing: border-box;
`;

const TopicInput = styled.textarea`
    ${BaseField}
    width: 200px;
    resize: none;
    line-height: 1.3;
    overflow: hidden;
`

const NumberInput = styled.input`
    ${BaseField}
    width: 90px;
    text-align: center;
`

const SubmitBtn = styled.button`
    position: absolute;
    font-size: 20px;
    font-weight: 600;
    width: 70px;
    margin-top: 4px;
    margin-left: 395px;    
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background: transparent;
    cursor: pointer;
    user-select: none;

    &: hover > div{
      visibility: visible;
      opacity: 1;
      transition: opacity 0.3s;
    }
`