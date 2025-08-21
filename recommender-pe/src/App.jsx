import { GlobalProvider } from "./context/GlobalContext";
import RouteService from "./routes/routesService";

function App() {
  return (
    <GlobalProvider>
      <RouteService />
    </GlobalProvider>
  );
}

export default App;