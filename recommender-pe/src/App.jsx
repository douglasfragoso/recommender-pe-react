import { GlobalProvider } from "./context/globalContext";
import RouteService from "./routes/routesService";

function App() {
  return (
    <GlobalProvider>
      <RouteService />
    </GlobalProvider>
  );
}

export default App;