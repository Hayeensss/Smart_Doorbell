"use client";

import { useState } from "react";
import { publishMqttMessageAction } from "@/app/actions/mqttActions";

export default function MqttTestPage() {
  const [topic, setTopic] = useState("test/topic/smartdoorbell");
  const [message, setMessage] = useState('{"hello": "world"}');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
    } catch (jsonError) {
      parsedMessage = message;
      console.warn("Message is not valid JSON, sending as string:", message);
    }

    try {
      const actionResult = await publishMqttMessageAction(topic, parsedMessage);
      setResult(actionResult);
    } catch (error) {
      console.error("Error calling publishMqttMessageAction:", error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "An unexpected client-side error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "2rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h1>Test MQTT Publish Action</h1>
      <p>
        This page allows you to test the <code>publishMqttMessageAction</code> server action.
        You need to be signed in to use this action.
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label htmlFor="topic" style={{ display: "block", marginBottom: "0.5rem" }}>Topic:</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
          />
        </div>
        <div>
          <label htmlFor="message" style={{ display: "block", marginBottom: "0.5rem" }}>Message (JSON or String):</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading} 
          style={{ padding: "0.75rem", borderRadius: "4px", border: "none", backgroundColor: isLoading ? "#ccc" : "#0070f3", color: "white", cursor: "pointer" }}
        >
          {isLoading ? "Publishing..." : "Publish Message"}
        </button>
      </form>

      {result && (
        <div 
          style={{ 
            marginTop: "1.5rem", 
            padding: "1rem", 
            borderRadius: "4px", 
            backgroundColor: result.success ? "#e6fffa" : "#ffebe6",
            border: result.success ? "1px solid #38a169" : "1px solid #e53e3e",
            color: result.success ? "#2f855a" : "#c53030"
          }}
        >
          <h3>Action Result:</h3>
          {result.success ? (
            <p>Success: {result.message}</p>
          ) : (
            <p>Error: {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
