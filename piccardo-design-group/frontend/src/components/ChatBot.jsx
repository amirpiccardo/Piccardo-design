import React, { useEffect } from "react";

const ChatBot = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const iframe = document.querySelector("iframe");
      iframe.onload = () => {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const style = document.createElement("style");
        style.textContent = `
          .df-messenger {
            background-color: #f0f0f0 !important;
            font-family: 'Arial', sans-serif !important;
          }
          .df-messenger-bubble {
            background-color: #007bff !important;
            color: #fff !important;
            border-radius: 15px !important;
            padding: 10px !important;
          }
          .df-messenger-text {
            font-size: 16px !important;
          }
        `;
        iframeDocument.head.appendChild(style);
      };
    };
  }, []);

  const iframeStyle = {
    display: "block",
    margin: "20px auto",
  };

  return (
    <div style={iframeStyle}>
      <df-messenger
        intent="WELCOME"
        chat-title="DesignBot"
        agent-id="0b6a09a6-52ab-43cf-bf4f-e9708e6652bb"
        language-code="it"
      ></df-messenger>
    </div>
  );
};

export default ChatBot;
