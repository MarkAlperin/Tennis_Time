import React, { Suspense }  from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TennisTime from "./components/TennisTime";
const ResPage = React.lazy(() => import("./components/ResPage"));

export default function App() {
  return (
  <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <TennisTime />
            </Suspense>
          }
        />
        <Route path="/reservations"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <ResPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
