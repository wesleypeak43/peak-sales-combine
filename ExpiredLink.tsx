// ExpiredLink — generated from the Peak Sales Combine prototype template. Plain React; edit freely.
// V is the view-model returned by PeakCombine.renderVals(): values, lists, and event handlers.
import React from 'react';


export function ExpiredLink({ V }: { V: any }) {
  return V.inviteExpired ? (<>
    <main style={{flex: "1", width: "100%", maxWidth: "560px", margin: "0 auto", padding: "60px clamp(16px,4vw,24px) 80px", boxSizing: "border-box", containerType: "inline-size"}}>
      <div style={{animation: "fadeUp .4s ease both", background: "#0F1611", border: "1px solid rgba(245,184,74,.35)", borderRadius: "14px", padding: "28px"}}>
        <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#F5B84A", marginBottom: "10px"}}>Link expired</div>
        <h1 style={{margin: "0 0 10px", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", fontSize: "clamp(30px,8cqw,38px)", fontWeight: "700", letterSpacing: ".01em", lineHeight: "1"}}>This invitation link is no longer active.</h1>
        <p style={{margin: "0 0 20px", fontSize: "14px", lineHeight: "1.6", color: "#A7B5AB"}}>Invite links expire after 14 days, or once they have been opened on another device. Your progress is saved — request a fresh link and pick up where you left off.</p>
        {V.notResent ? (<>
          <button onClick={V.resend} style={{background: "#10B981", color: "#04120B", border: "none", borderRadius: "10px", padding: "12px 22px", fontSize: "13.5px", fontWeight: "800", cursor: "pointer"}}>Email me a new link</button>
        </>) : null}
        {V.resent ? (<>
          <div style={{fontSize: "13.5px", fontWeight: "700", color: "#34D399", lineHeight: "1.5"}}>Sent to a•••@gmail.com — check your inbox. The new link works once and expires in 14 days.</div>
        </>) : null}
        <p style={{margin: "18px 0 0", fontSize: "11.5px", color: "#5C6B61", lineHeight: "1.55"}}>Wrong address, or nothing after 10 minutes? Email talent@peaksportsmgmt.com.</p>
      </div>
    </main>
  </>) : null;
}
