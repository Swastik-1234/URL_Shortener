import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UrlAnalytics() {
  const [shortId, setShortId] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchAnalytics = async () => {
    if (!shortId.trim()) return;
    setLoading(true);
    setAnalytics(null);

    try {
      const response = await fetch(`http://localhost:5000/api/analytics/${shortId}`);
      const data = await response.json();

      if (response.ok) {
        setAnalytics(data);
      } else {
        alert(data.error || "Failed to fetch analytics");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error fetching analytics");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-xl font-semibold text-center">URL Analytics</h1>

          <Input
            placeholder="Enter short URL ID (e.g., Ul36zq)"
            value={shortId}
            onChange={(e) => setShortId(e.target.value)}
          />

          <Button onClick={handleFetchAnalytics} disabled={loading}>
            {loading ? "Fetching..." : "Get Analytics"}
          </Button>

          {analytics && (
            <div className="mt-6 space-y-4">
              <p><strong>Short URL ID:</strong> {analytics.shortUrl}</p>
              <p><strong>Total Visits:</strong> {analytics.totalVisits}</p>

              <h2 className="font-semibold mt-4">Visit Details:</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {analytics.visits.map((visit, index) => (
                  <div key={visit._id || index} className="border rounded p-3 bg-white shadow-sm">
                    <p className="text-sm text-gray-600">
                      <strong>Timestamp:</strong> {new Date(visit.timestamp).toLocaleString()}
                    </p>
                    <div className="mt-2 text-sm text-gray-700">
                      <strong>User-Agent:</strong><br />
                      <span className="break-all">{visit.headers["user-agent"]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
