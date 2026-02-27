import React, { createContext, useState } from "react";
import { runChat } from "../config/gemini.js"; // Import runChat

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }


    const animateResponse = (wordsArray) => {

        if (wordsArray.length === 0) {
            setLoading(false);
            setInput("");
            return;
        }

        const nextWord = wordsArray[0];


        setTimeout(() => {
            setResultData(prev => prev + nextWord);


            const remainingWords = wordsArray.slice(1);
            animateResponse(remainingWords);

        }, 75);
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);

        const query = prompt !== undefined ? prompt : input;

        if (prompt === undefined) {
            setPrevPrompts(prev => [...prev, query]);
        }

        setRecentPrompt(query);
        const response = await runChat(query);


        let responseArray = response.split("**");
        let newResponse = "";

        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 === 1) {
                newResponse += "<b>" + responseArray[i] + "</b>";
            } else {
                newResponse += responseArray[i];
            }
        }

        let newResponse2 = newResponse.split("*").join("</br>");


        let newResponseArray = newResponse2.split(" ").map(word => word + " ");




        animateResponse(newResponseArray);


    };

    const contextValue = {
        input,
        setInput,
        recentPrompt,
        setRecentPrompt,
        onSent,
        showResult,
        setShowResult,
        loading,
        setLoading,
        resultData,
        setResultData,
        prevPrompts,
        setPrevPrompts,
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;