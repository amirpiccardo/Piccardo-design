import React from "react";
import Contracts from "../components/Contracts";
import ChatBot from "../components/ChatBot";
import Seo from "../components/Seo";

function ContractsPage() {
  return (
    <div>
      <Seo title="Contract" description="Consulenza contract di Liguria Design Group: arredamento e illuminazione per hotel, B&B, studentati e forniture importanti." />
      <Contracts />
      <ChatBot />
    </div>
  );
}

export default ContractsPage;
