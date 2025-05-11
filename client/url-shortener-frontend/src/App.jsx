import { useState } from "react";
import ShortenUrl from "./pages/ShortenUrl";
import UrlAnalytics from "./pages/UrlAnalytics";
import { Button } from "@/components/ui/button";

function App() {
  const [view, setView] = useState("shorten");

  return (
    <div>
      <div className="flex justify-center space-x-4 mt-6">
        <Button
          variant={view === "shorten" ? "default" : "outline"}
          onClick={() => setView("shorten")}
        >
          Shorten URL
        </Button>
        <Button
          variant={view === "analytics" ? "default" : "outline"}
          onClick={() => setView("analytics")}
        >
          View Analytics
        </Button>
      </div>

      <div className="mt-4">
        {view === "shorten" ? <ShortenUrl /> : <UrlAnalytics />}
      </div>
    </div>
  );
}

export default App;

