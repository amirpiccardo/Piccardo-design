import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn, sendPasswordReset, setNewPassword, isAdmin, signOut } from "./api";
import { Field, PasswordInput } from "./ui";
import { isSupabaseConfigured } from "../lib/supabase";
import { supabase } from "./client";

export default function Login({ session }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(() => (typeof window !== "undefined" && /reset=1|invito=1|type=recovery|type=invite/.test(window.location.href) ? "newpw" : "login"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  // Link scaduto o già usato: lo dico chiaramente e propongo di riceverne uno nuovo
  useEffect(() => {
    const h = new URLSearchParams(window.location.hash.slice(1));
    if (h.get("error_description")) {
      setMode("forgot");
      setMsg({ type: "err", text: "Il link non è più valido (scaduto o già usato). Scrivi la tua email e te ne mandiamo uno nuovo." });
      window.history.replaceState(null, "", "/login");
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((event) => { if (event === "PASSWORD_RECOVERY") setMode("newpw"); });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session && mode === "login") navigate("/admin/", { replace: true });
  }, [session, mode, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
        if (!(await isAdmin())) {
          await signOut();
          throw new Error("Questo account non è tra gli amministratori del sito.");
        }
        navigate("/admin/", { replace: true });
      } else if (mode === "forgot") {
        await sendPasswordReset(email);
        setMsg({ type: "ok", text: "Se l'email ha accesso all'area riservata, riceverai un link per scegliere la password. Controlla anche la posta indesiderata." });
      } else {
        if (password.length < 10) throw new Error("La password deve avere almeno 10 caratteri.");
        await setNewPassword(password);
        window.history.replaceState(null, "", "/login");
        if (await isAdmin()) {
          navigate("/admin/", { replace: true });
          return;
        }
        await signOut();
        setMsg({ type: "ok", text: "Password salvata, ma questo account non ha accesso all'area riservata." });
        setMode("login");
        setPassword("");
      }
    } catch (err) {
      setMsg({ type: "err", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const titles = { login: "Area riservata", forgot: "Primo accesso o password dimenticata", newpw: "Scegli la tua password" };

  return (
    <div className="adm login">
      <div className="login__photo"><img src="/img/foto/living-1600.webp" alt="" /></div>
      <div className="login__panel">
        <img className="login__logo" src="/img/logo-navy.webp" alt="Liguria Design Group" width="640" height="270" />
        <form className="login__card" onSubmit={submit}>
          <div>
            <h1>{titles[mode]}</h1>
            <p className="sub">{mode === "login" ? "Gestisci marchi, foto, testi e messaggi del sito." : mode === "forgot" ? "Scrivi la tua email: ti mandiamo un link per scegliere la password." : "Almeno 10 caratteri. Da ora entrerai con la tua email e questa password."}</p>
          </div>
          {!isSupabaseConfigured && <p className="msg msg--warn">Supabase non è ancora collegato: l'accesso non è disponibile.</p>}
          {msg && <p className={`msg msg--${msg.type}`} role={msg.type === "err" ? "alert" : "status"}>{msg.text}</p>}
          {mode !== "newpw" && <Field id="lg-email" label="Email" type="email" autoComplete="username" inputMode="email" value={email} onChange={setEmail} />}
          {mode !== "forgot" && (
            <PasswordInput id="lg-pw" label={mode === "newpw" ? "Nuova password" : "Password"} autoComplete={mode === "newpw" ? "new-password" : "current-password"} value={password} onChange={setPassword} />
          )}
          <button className="b" type="submit" disabled={busy || !isSupabaseConfigured}>{busy && <span className="spin" />}{mode === "login" ? "Entra" : mode === "forgot" ? "Inviami il link" : "Salva la password ed entra"}</button>
          <div className="row" style={{ justifyContent: "space-between" }}>
            {mode === "login"
              ? <button type="button" className="linkbtn" onClick={() => { setMode("forgot"); setMsg(null); }}>Primo accesso o password dimenticata?</button>
              : <button type="button" className="linkbtn" onClick={() => { setMode("login"); setMsg(null); }}>Torna all'accesso</button>}
            <Link to="/">Vai al sito</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
