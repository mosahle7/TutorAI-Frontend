import { useState, useEffect } from "react"
import { generateQuestions } from "./Fetcher";
import styled from "styled-components";

export const QGenerator = ({ open }) => {
    const [topic, setTopic] = useState("");
    const [number, setNumber] = useState("");
    const [questions, setQuestions] = useState("");
    const [introText, setIntroText] = useState('');
    

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
        try{
            const questions = await generateQuestions({topic: topic, num_questions: Number(number)});
            console.log("Generated questions: ", questions);
            setQuestions(questions);
        }

        catch(error){
            console.error("Error generating questions: ", error);
        }

        setTopic("");
        setNumber("");
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
        <SelfIntro $open={open}>Hello, I am TutorAI</SelfIntro>

        <Intro $open={open}>
            {introText}
            {introText.length < "Let's generate Questions!".length && (<BlinkingCursor>|</BlinkingCursor>)}
        </Intro>
        
        <InputWrapper $open={open}>
         <NumberInput
        type="number"
        min={1}
        max={20}
        placeholder="#"
        value={number}
        onChange={handleNumberChange}
        />
        <span>Questions on</span>
        <TopicInput
        placeholder="topic"
        value={topic}
        onChange={handleTopicChange}
        />

       
        </InputWrapper>

        <SubmitBtn onClick={handleSubmit}>
            ➡️
        </SubmitBtn>

        {questions && (
            <div>{questions}</div>
        )}
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
    top: 250px;
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

const SubmitBtn = styled.div`
    position: absolute;
    width: 70px;
    margin-top: 270px;
    margin-left: 550px;    
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
`
