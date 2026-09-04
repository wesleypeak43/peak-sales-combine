// EntryScreen — generated from the Peak Sales Combine prototype template. Plain React; edit freely.
// V is the view-model returned by PeakCombine.renderVals(): values, lists, and event handlers.
import React from 'react';


export function EntryScreen({ V }: { V: any }) {
  return V.isEntry ? (<>
    <div style={{flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "48px 24px"}}>
      {V.texture ? (<>
        <div style={{position: "absolute", inset: "0", background: "repeating-linear-gradient(115deg, rgba(16,185,129,.035) 0px, rgba(16,185,129,.035) 1px, transparent 1px, transparent 90px), radial-gradient(1200px 500px at 50% -10%, rgba(16,185,129,.09), transparent 65%)", pointerEvents: "none"}} />
      </>) : null}
      <div style={{position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "0", animation: "fadeUp .5s ease both"}}>
        <img src="/assets/peak-logo.png" alt="Peak Sports MGMT" style={{width: "92px", height: "auto", marginBottom: "22px", filter: "drop-shadow(0 8px 30px rgba(16,185,129,.25))"}} />
        <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", fontWeight: "600", letterSpacing: ".32em", textTransform: "uppercase", color: "#7E9186", marginBottom: "12px"}}>Peak Sports MGMT · Internal Talent Platform</div>
        <h1 style={{margin: "0", fontSize: "56px", fontWeight: "900", letterSpacing: "-.02em", lineHeight: "1", textAlign: "center"}}>
          {"PEAK SALES "}
          <span style={{color: "#10B981"}}>COMBINE</span>
        </h1>
        <p style={{margin: "16px 0 0", maxWidth: "520px", textAlign: "center", fontSize: "16px", lineHeight: "1.55", color: "#A7B5AB"}}>Identify the people who hunt, own outcomes, accept coaching, and find a way.</p>
      </div>
      <div style={{position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", marginTop: "40px", animation: "fadeUp .5s .12s ease both"}}>
        <div style={{width: "360px", background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "26px"}}>
          <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#10B981", marginBottom: "10px"}}>{V.pwSetup ? 'Create your password' : 'Staff sign-in · /staff'}</div>
          {V.pwSetup ? (<>
            <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
              <input value={(V.pw1) ?? ''} onChange={V.setPw1} type="password" placeholder="new password (8+ characters)" style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "12px 13px", color: "#E9F0EA", fontSize: "13.5px"}} />
              <input value={(V.pw2) ?? ''} onChange={V.setPw2} type="password" placeholder="repeat password" onKeyDown={(e: any) => { if (e.key === 'Enter' && V.savePw) V.savePw(); }} style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "12px 13px", color: "#E9F0EA", fontSize: "13.5px"}} />
              <button onClick={V.savePw} disabled={!!(V.busy)} style={{background: "#10B981", color: "#04120B", border: "none", borderRadius: "10px", padding: "12px", fontSize: "13px", fontWeight: "800", cursor: "pointer", opacity: V.busy ? .6 : 1}}>{V.busy ? 'Saving…' : 'Save password & continue'}</button>
            </div>
            <div style={{fontSize: "12px", color: "#F87171", minHeight: "16px", marginTop: "8px", lineHeight: "1.4"}}>{V.pwMsg}</div>
            <p style={{margin: "6px 0 0", fontSize: "11.5px", color: "#5C6B61", lineHeight: "1.55"}}>You arrived from a secure link. Choose a password you’ll use to sign in from now on.</p>
          </>) : (<>
            <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
              <input value={(V.loginEmail) ?? ''} onChange={V.setLoginEmail} placeholder="work email" autoComplete="username" style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "12px 13px", color: "#E9F0EA", fontSize: "13.5px"}} />
              <input value={(V.loginPw) ?? ''} onChange={V.setLoginPw} type="password" placeholder="password" autoComplete="current-password" onKeyDown={(e: any) => { if (e.key === 'Enter' && V.signIn) V.signIn(); }} style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "12px 13px", color: "#E9F0EA", fontSize: "13.5px"}} />
              <button onClick={V.signIn} disabled={!!(V.busy)} style={{background: "#10B981", color: "#04120B", border: "none", borderRadius: "10px", padding: "12px", fontSize: "13px", fontWeight: "800", cursor: "pointer", opacity: V.busy ? .6 : 1}}>{V.busy ? 'One moment…' : 'Sign in'}</button>
            </div>
            <div style={{fontSize: "12px", color: "#F87171", minHeight: "16px", marginTop: "8px", lineHeight: "1.4"}}>{V.loginErr}</div>
            {V.loginInfo ? (<>
              <div style={{fontSize: "12px", color: "#34D399", fontWeight: "700", lineHeight: "1.4"}}>{V.loginInfo}</div>
            </>) : null}
            {!V.isDemo ? (<>
              <button onClick={V.forgotPw} style={{background: "none", border: "none", color: "#8FA396", fontSize: "12px", cursor: "pointer", padding: "6px 0 0", textDecoration: "underline"}}>Forgot password?</button>
            </>) : null}
            <p style={{margin: "6px 0 0", fontSize: "11.5px", color: "#5C6B61", lineHeight: "1.55"}}>Staff only. Candidates never sign in here — they receive a personal, expiring link by email and see only their own assessment.</p>
          </>)}
        </div>
        {V.isDemo ? (<>
        <div style={{width: "360px", background: "#0F1611", border: "1px dashed rgba(160,190,170,.22)", borderRadius: "14px", padding: "26px"}}>
          <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "10px"}}>Prototype shortcuts</div>
          <p style={{margin: "0 0 12px", fontSize: "12px", color: "#8FA396", lineHeight: "1.55"}}>Not in production. Any password works for the seeded staff below.</p>
          <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
            {(V.demoUsers ?? []).map((u: any, $index: number) => (<React.Fragment key={$index}>
              <button onClick={u?.go} style={{display: "flex", alignItems: "center", gap: "10px", background: "#0B120E", border: "1px solid rgba(160,190,170,.14)", borderRadius: "10px", padding: "10px 12px", color: "#E9F0EA", fontSize: "12.5px", cursor: "pointer", textAlign: "left"}} className="ps1">
                <span style={{fontWeight: "700", flex: "1"}}>{u?.name}</span>
                <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: "#7E9186", textAlign: "right"}}>{u?.rolesTxt}</span>
              </button>
            </React.Fragment>))}
            <div style={{display: "flex", gap: "8px", marginTop: "4px"}}>
              <button onClick={V.openInvite} style={{flex: "1", background: "transparent", color: "#34D399", border: "1px solid rgba(16,185,129,.35)", borderRadius: "10px", padding: "10px 12px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer"}}>Open candidate invite link</button>
              <button onClick={V.openExpired} style={{flex: "1", background: "transparent", color: "#F5B84A", border: "1px solid rgba(245,184,74,.35)", borderRadius: "10px", padding: "10px 12px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer"}}>Open expired link</button>
            </div>
          </div>
        </div>
        </>) : null}
      </div>
      <p style={{position: "relative", margin: "40px 0 0", fontSize: "12px", color: "#5C6B61", maxWidth: "640px", textAlign: "center", lineHeight: "1.6"}}>Human judgment, structured evidence, fairness, and job relevance drive every decision on this platform. No black-box AI. No automatic rejections.</p>
    </div>
  </>) : null;
}
