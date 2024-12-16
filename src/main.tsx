import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@Assets/css/index.css";
import "@Assets/css/tailwind.css";
import store from "./store";
import App from "./App";

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false,
//       retry: false,
//       suspense: false,
//       // retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
//     },
//   },
// });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <QueryClientProvider client={queryClient}>
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  // <ReactQueryDevtools initialIsOpen={false} />
  // </QueryClientProvider>
);
