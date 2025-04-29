import React from "react";
import { Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Home from "./page/HomePage.jsx";


const App = () => {
  return (
    <>
        <SnackbarProvider maxSnack={3}>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </SnackbarProvider>
    </>
  );
};

export default App
