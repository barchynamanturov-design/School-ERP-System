import AppRouter from "./App/router/AppRouter";
import AppProviders from "./App/providers/AppProviders";

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;