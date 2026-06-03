import React, { useEffect } from "react";

const ChatBot = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // pulizia: rimuove lo script se il componente viene smontato
      if (script.parentNode) script.parentNode.removeChild(script);
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
