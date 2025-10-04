import React, { createContext, useState } from "react";
import { runChat } from "../config/gemini.js"; // Import runChat

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]); // CORRECTED: Added this state

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    };
    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        if (prompt !== undefined) {
            response = await runChat(input);
            setRecentPrompt(prompt)
        }
        else {
            setPrevPrompts(prev => [...prev, input]);
            setRecentPrompt(input)
            response = await runChat(input)
        }
        setRecentPrompt(input);




        // const response = await runChat(input);

        let responseArray = response.split("**");
        let newResponse = "";

        for (let i = 0; i < responseArray.length; i++) {
            if (i == 0 || i % 2 === 1) {
                newResponse += "<b>" + responseArray[i] + "</b>";
            } else {
                newResponse += responseArray[i];

            }
        }

        let newResponse2 = newResponse.split("*").join("</br>");
        let newResponseArray = newResponse2.split(" ");

        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord + " ");
        }

        setLoading(false);
        setInput("");
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
        prevPrompts, // CORRECTED: Added to context
        setPrevPrompts, // CORRECTED: Added to context
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;