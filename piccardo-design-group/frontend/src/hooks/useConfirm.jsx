import React, { useState, useCallback } from "react";
import ConfirmModal from "../components/ConfirmModal";

// Hook: restituisce [confirm, ui].
// confirm(opts) -> Promise<boolean>. Renderizza <ui> nel componente.
export default function useConfirm() {
  const [state, setState] = useState(null);

  const confirm = useCallback(
    (opts = {}) =>
      new Promise((resolve) => {
        setState({ ...opts, resolve });
      }),
    []
  );

  const close = (val) => {
    if (state) state.resolve(val);
    setState(null);
  };

  const ui = (
    <ConfirmModal
      show={!!state}
      title={state?.title}
      message={state?.message}
      confirmLabel={state?.confirmLabel}
      cancelLabel={state?.cancelLabel}
      danger={state?.danger}
      onConfirm={() => close(true)}
      onCancel={() => close(false)}
    />
  );

  return [confirm, ui];
}
