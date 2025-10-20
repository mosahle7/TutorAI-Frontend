import axios from "axios";

export const getResponse = async (query) => {
    try{
        const response = await fetch('http://34.23.99.20:8001/final',{
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: query,
        });

         // For streaming, you need to read chunks manually
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = '';
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += decoder.decode(value);
        }
        
        return result;
    }
    
    catch(error) {
        console.error("Error fetching response:", error)
        throw error;   
    }

}

export const uploadFile = async (file) => {
    try{
        const formdata = new FormData();
        formdata.append('file', file);

        const response = await fetch('http://34.23.99.20:8001/upload', {
            method: 'POST',
            body: formdata,
        });
        console.log("File upload response: ", response);
        return response.json;
    }

    catch(error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}

export const generateQuestions = async ({topic, num_questions}) => {
    try{
        const response = await axios.post('http://34.23.99.20:8001/gen_questions', {
            topic: topic,
            num_questions: Number(num_questions)
        });
        console.log("Questions generated: ", response.data);
        return response.data;
    }

    catch(error){
        console.error("Error generating questions: ", error);
        throw error;
    }
}

export const ListFiles = async () =>{
    try{
        const response = await axios.get('http://34.23.99.20:8001/list_docs');
        return response.data;
    }

    catch(error){
        console.error("Error listing files:", error);
        throw error;
    }
}

export const SelectFile = async ({collection_name}) => {
    try{
        const response = await axios.get('http://34.23.99.20:8001/select_collection', {
            params: {collection_name: collection_name}
        });
        return response.data;
    }
    catch(error){
        console.error("Error selecting collection: ",error);
        throw error;
    }
}

export const ShowFile = async () => {
    try{
        const response = await axios.get('http://34.23.99.20:8001/show_collection');
        return response.data;
    }
    catch(error){
        console.error("Error showing collection: ",error);
        throw error;
    }
}

export const ReadFile = async (filename) => {
    try{
        const response = await axios.get(`http://34.23.99.20:8001/read_docs/${filename}`);
        return response.data;
    }
    catch(error){
        console.error("Error reading file: ",error);
        throw error;
    }
}