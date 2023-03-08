import { Box } from "@mui/material";

import "./App.css";
import MainLayout from "./components/layout/MainLayout";
import MainLayout2 from "./components/layout/MainLayot2";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Create from "./components/layout/Create";
import Edit from "./components/layout/Edit";
import Record from "./components/layout/Record";
import { useState } from "react";

function App() {
  const [record, setRecord] = useState<any>();

  return (
    <Box>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<MainLayout setSelectedRecord={setRecord} />}
          />
          <Route path="/record/:id" element={<MainLayout2 />} />
          <Route path="/create" element={<Create />} />
          <Route path="/edit" element={<Edit />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
