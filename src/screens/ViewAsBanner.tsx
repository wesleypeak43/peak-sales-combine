// ViewAsBanner — generated from the Peak Sales Combine prototype template. Plain React; edit freely.
// V is the view-model returned by PeakCombine.renderVals(): values, lists, and event handlers.
import React from 'react';


export function ViewAsBanner({ V }: { V: any }) {
  return V.viewingAs ? (<>
    <div style={{display: "flex", alignItems: "center", gap: "14px", padding: "10px 28px", background: "var(--c-rgba-91-155-255-1)", borderBottom: "1px solid var(--c-rgba-91-155-255-35)", fontSize: "12.5px", color: "var(--c-hex-d5ded7)", flexWrap: "wrap"}}>
      <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--c-hex-04120b)", background: "var(--c-hex-5b9bff)", padding: "3px 9px", borderRadius: "99px"}}>View as candidate</span>
      <span>
        {"Seeing exactly what "}
        <b>{V.viewAsName}</b>
        {" sees. Read-only — nothing can be changed on their behalf, and this view is written to the audit history."}
      </span>
      <button onClick={V.exitViewAs} style={{marginLeft: "auto", background: "transparent", color: "var(--c-hex-5b9bff)", border: "1px solid var(--c-rgba-91-155-255-45)", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: "700", cursor: "pointer"}}>Exit view</button>
    </div>
  </>) : null;
}
