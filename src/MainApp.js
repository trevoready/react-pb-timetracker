import React from "react";
import Topbar from "./Topbar";
import TimeSheet from "./Timesheet.js";
import Workplaces from "./Workplaces";

import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";

export default function MainApp() {
  return (
    <div>
      <Topbar />
      <Container>
        <Routes>
          <Route path="/timesheet" element={<TimeSheet />} />
          <Route path="/workplaces" element={<Workplaces />} />
        </Routes>
      </Container>
    </div>
  );
}
