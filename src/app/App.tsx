import { QueryProvider } from "./providers";
import { Router } from "./Router";

export const App = () => {
  return (
    <QueryProvider>
      <Router />
    </QueryProvider>
  );
};
