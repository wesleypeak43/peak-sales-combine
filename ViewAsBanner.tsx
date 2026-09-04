// ViewAsBanner — generated from the Peak Sales Combine prototype template. Plain React; edit freely.
// V is the view-model returned by PeakCombine.renderVals(): values, lists, and event handlers.
import React from 'react';


export function ViewAsBanner({ V }: { V: any }) {
  return V.viewingAs ? (<>
    <div style={{display: "flex", alignItems: "center", gap: "14px", padding: "10px 28px", background: "rgba(91,155,255,.1)", borderBottom: "1px solid rgba(91,155,255,.35)", fontSize: "12.5px", color: "#D5DED7", flexWrap: "wrap"}}>
      <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "#04120B", background: "#5B9BFF", padding: "3px 9px", borderRadius: "99px"}}>View as candidate</span>
      <span>
        {"Seeing exactly what "}
        <b>{V.viewAsName}</b>
        {" sees. Read-only — nothing can be changed on their behalf, and this view is written to the audit history."}
      </span>
      <button onClick={V.exitViewAs} style={{marginLeft: "auto", background: "transparent", color: "#5B9BFF", border: "1px solid rgba(91,155,255,.45)", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: "700", cursor: "pointer"}}>Exit view</button>
    </div>
  </>) : null;
}
