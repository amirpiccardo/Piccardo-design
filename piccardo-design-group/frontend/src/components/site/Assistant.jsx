import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Assistente con risposte rapide (era il chatbot della home, ora vive nella pagina contatti).
const QUICK = [
  { q: "Cosa fa Liguria Design Group?", a: "Siamo un'agenzia di rappresentanza di arredamento e illuminazione: portiamo i marchi ai rivenditori e li seguiamo con preventivi e assistenza.", to: "/chi-siamo", cta: "Chi siamo" },
  { q: "Quali marchi rappresentate?", a: "Marchi italiani di arredo, bagno, pannelli e sedute. L'elenco completo, con le foto, è nella pagina Marchi.", to: "/marchi", cta: "Vedi i marchi" },
  { q: "Come divento rivenditore?", a: "Scriveteci dal modulo indicando negozio e città: vi ricontattiamo per fissare una visita.", to: "/rivenditori", cta: "Servizi per rivenditori" },
  { q: "Fate forniture contract?", a: "Sì: hotel, B&B, studentati, uffici, ristoranti e bar.", to: "/contract", cta: "Vedi il contract" },
  { q: "In quali zone lavorate?", a: "In Liguria e nel basso Piemonte, con sede a Imperia.", to: "/chi-siamo", cta: "Dove lavoriamo" },
  { q: "Dove siete?", a: "In Via Vittorio Alfieri 18, Imperia. Riceviamo su appuntamento.", to: "/contatti#scrivici", cta: "Scriveteci" },
];

export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ me: false, text: "Buongiorno. Scegliete una domanda qui sotto, oppure scriveteci dal modulo." }]);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, open]);

  const ask = (item) => setMsgs((m) => [...m, { me: true, text: item.q }, { me: false, text: item.a, to: item.to, cta: item.cta }]);

  return (
    <>
      {open && (
        <div className="assist" role="dialog" aria-label="Domande rapide">
          <header>
            <span>Domande rapide</span>
            <button type="button" onClick={() => setOpen(false)}>Chiudi</button>
          </header>
          <div className="assist__body" ref={bodyRef} aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`assist__msg ${m.me ? "assist__msg--me" : "assist__msg--bot"}`}>
                {m.text}
                {m.to && <><br /><Link className="lnk" to={m.to} onClick={() => setOpen(false)}>{m.cta}</Link></>}
              </div>
            ))}
          </div>
          <div className="assist__qs">
            {QUICK.map((item) => (
              <button type="button" key={item.q} onClick={() => ask(item)}>{item.q}</button>
            ))}
          </div>
        </div>
      )}
      <button type="button" className="assist__open" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? "Chiudi" : "Domande rapide"}
      </button>
    </>
  );
}
