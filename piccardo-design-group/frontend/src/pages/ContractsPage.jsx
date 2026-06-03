import React from "react";
import Contracts from "../components/Contracts";
import ChatBot from "../components/ChatBot";
import Seo from "../components/Seo";

function ContractsPage() {
  return (
    <div>
      <Seo title="Contract" description="Soluzioni contract di Piccardo Design Group per hotel, uffici e spazi commerciali: progetti su misura con i migliori brand di design." />
      <Contracts />
      <ChatBot />
    </div>
  );
}

export default ContractsPage;
