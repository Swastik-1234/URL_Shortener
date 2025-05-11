import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";


export default function ShortenUrl() {
  const [longUrl, setLongUrl] = useState("");
  const [userId, setUserId] = useState(""); // User ID input state
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    if (!longUrl.trim() || !userId.trim()) return; // Ensure both fields are filled
    setLoading(true);
    setShortUrl("");

    try {
      const response = await fetch("http://localhost:5000/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: longUrl,
          userId: userId, // Include userId in the request body
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortUrl(`http://localhost:5000/api/${data.shortUrl}`);

      } else {
        alert(data.error || "Failed to shorten URL");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error shortening URL");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-xl font-semibold text-center">URL Shortener</h1>
          
          {/* Input for the long URL */}
          <Input
            placeholder="Enter your long URL"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
          />
          
          {/* Input for the user ID */}
          <Input
            placeholder="Enter your user ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          
          {/* Button for shortening URL */}
          <Button onClick={handleShorten} disabled={loading}>
            {loading ? "Shortening..." : "Shorten URL"}
          </Button>
          
          {/* Display shortened URL */}
          {shortUrl && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">Short URL:</p>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-words"
              >
                {shortUrl}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
