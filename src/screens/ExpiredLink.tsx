// ExpiredLink — candidate-link states that are not the assessment itself: expired, loading, saved, invalid.
// V is the view-model returned by PeakCombine.renderVals(): values, lists, and event handlers.
import React from 'react';

const card = (border: string) => ({animation: "fadeUp .4s ease both", background: "#0F1611", border: "1px solid " + border, borderRadius: "14px", padding: "28px"} as any);
const kicker = (color: string) => ({fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color, marginBottom: "10px"} as any);
const h1 = {margin: "0 0 10px", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", fontSize: "clamp(30px,8cqw,38px)", fontWeight: "700", letterSpacing: ".01em", lineHeight: "1"} as any;
const body = {margin: "0 0 20px", fontSize: "14px", lineHeight: "1.6", color: "#A7B5AB"} as any;
const primary = {background: "#10B981", color: "#04120B", border: "none", borderRadius: "10px", padding: "12px 22px", fontSize: "13.5px", fontWeight: "800", cursor: "pointer"} as any;

export function ExpiredLink({ V }: { V: any }) {
  const main = (children: any) => (
    <main style={{flex: "1", width: "100%", maxWidth: "560px", margin: "0 auto", padding: "60px clamp(16px,4vw,24px) 80px", boxSizing: "border-box", containerType: "inline-size"} as any}>
      {children}
    </main>
  );
  if (V.inviteExpired) return main(
    <div style={card("rgba(245,184,74,.35)")}>
      <div style={kicker("#F5B84A")}>Link expired</div>
      <h1 style={h1}>This invitation link is no longer active.</h1>
      <p style={body}>Invite links expire after 3 days. Your progress is saved — request a fresh link and pick up where you left off.</p>
      {V.notResent ? (<>
        <button onClick={V.resend} disabled={!!(V.busy)} style={primary}>{V.busy ? 'Sending…' : 'Email me a new link'}</button>
      </>) : null}
      {V.resent ? (<>
        {V.resentErr ? (<>
          <div style={{fontSize: "13.5px", fontWeight: "700", color: "#F5B84A", lineHeight: "1.5"}}>{V.resentErr}</div>
        </>) : (<>
          <div style={{fontSize: "13.5px", fontWeight: "700", color: "#34D399", lineHeight: "1.5"}}>{"Sent to " + (V.resentTo || 'your email') + " — check your inbox. The new link expires in 3 days."}</div>
        </>)}
      </>) : null}
      <p style={{margin: "18px 0 0", fontSize: "11.5px", color: "#5C6B61", lineHeight: "1.55"}}>Wrong address, or nothing after 10 minutes? Reply to your invitation email and the team will help.</p>
    </div>
  );
  if (V.inviteLoading) return main(
    <div style={card("rgba(160,190,170,.13)")}>
      <div style={kicker("#7E9186")}>One moment</div>
      <h1 style={h1}>Loading your assessment…</h1>
    </div>
  );
  if (V.inviteSaved) return main(
    <div style={card("rgba(16,185,129,.35)")}>
      <div style={kicker("#34D399")}>Progress saved</div>
      <h1 style={h1}>You can close this tab.</h1>
      <p style={body}>Everything you entered is saved. Use the same link from your invitation email to pick up where you left off.</p>
      <button onClick={V.reopenLink} style={primary}>Back to my assessment</button>
    </div>
  );
  if (V.combineExpired) return main(
    <div style={card("rgba(245,184,74,.35)")}>
      <div style={kicker("#F5B84A")}>Combine link expired</div>
      <h1 style={h1}>This combine page is no longer active.</h1>
      <p style={body}>Combine links stay open until two weeks after the session. If you still need something from this page, reply to your session email and the team will help.</p>
    </div>
  );
  if (V.inviteInvalid) return main(
    <div style={card("rgba(248,113,113,.35)")}>
      <div style={kicker("#F87171")}>Link not recognized</div>
      <h1 style={h1}>We couldn’t find an assessment for this link.</h1>
      <p style={body}>Open the link exactly as it appears in your invitation email. If it still doesn’t work, reply to that email and the team will send a new one.</p>
      {V.saveErr ? (<><div style={{fontSize: "12px", color: "#5C6B61"}}>{V.saveErr}</div></>) : null}
    </div>
  );
  return null;
}
