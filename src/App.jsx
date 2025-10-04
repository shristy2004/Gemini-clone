import React, { useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';
import ContextProvider from './context/context.jsx';
// import { listModels } from "./config/gemini";

const App = () => {
  // Call listModels once when app starts
  // useEffect(() => {
  //   listModels();
  // }, []);

  return (
    <ContextProvider> {/* Step 2: Wrap your components with the provider */}
      <Sidebar />
      <Main />
    </ContextProvider>
  );
};

export default App;
