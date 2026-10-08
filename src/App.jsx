import Routers from "./Routers/Routers";
import { useEffect } from "react";
import { DirectionProvider } from "@mantine/core";
import { useTranslation } from "react-i18next";

function App() {
  return (
    <>
      <Routers />
    </>
  );
}

export default App;
