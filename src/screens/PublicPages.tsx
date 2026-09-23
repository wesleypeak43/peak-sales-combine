// PublicPages — the two no-login pages a job can hand out: its application form (?apply=TOKEN) and its read-only
// pipeline board (?board=TOKEN). Plain React; edit freely. V is the view-model from PeakCombine.renderVals().
import React from 'react';

const KICKER = {fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#10B981", marginBottom: "8px"} as any;
const H1 = {margin: "0 0 10px", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", fontSize: "clamp(32px,6vw,44px)", fontWeight: "700", letterSpacing: ".01em", lineHeight: "1"} as any;
const CARD = {background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"} as any;
const INPUT = {width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "12px 14px", color: "#E9F0EA", fontSize: "14px"} as any;
const FIELD = {fontSize: "12.5px", fontWeight: "600", color: "#A7B5AB", marginBottom: "6px"} as any;
const MONO = {fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".12em", textTransform: "uppercase", color: "#7E9186"} as any;

export function PublicPages({ V }: { V: any }) {
  if (!V.isPublic) return null;
  const brand = (
    <div style={{display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px"}}>
      <div style={{width: "34px", height: "34px", borderRadius: "9px", background: "linear-gradient(135deg,#10B981,#0E9F6E)", display: "grid", placeItems: "center", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: "800", color: "#04120B", fontSize: "18px"}}>P</div>
      <div>
        <div style={{fontSize: "14px", fontWeight: "800", letterSpacing: ".01em"}}>Peak Sports MGMT</div>
        <div style={{fontSize: "11px", color: "#7E9186"}}>Peak Sales Combine</div>
      </div>
    </div>
  );
  const status = (title: string, body: string) => (
    <div style={{...CARD, maxWidth: "560px"}}>
      <div style={KICKER}>{title}</div>
      <p style={{margin: "0", fontSize: "14px", lineHeight: "1.65", color: "#A7B5AB"}}>{body}</p>
    </div>
  );
  return (
    <main style={{flex: "1", width: "100%", maxWidth: V.pubKind === 'board' ? "1400px" : "760px", margin: "0 auto", padding: "40px clamp(16px,4vw,28px) 80px", boxSizing: "border-box"}}>
      {brand}
      {V.pubLoading ? status('One moment', 'Loading…') : null}
      {V.pubInvalid ? status('Link not valid', 'This link is not active. Check that you copied the whole address, or ask the person who sent it for a new one.') : null}
      {V.pubClosed ? status('Applications closed', 'Applications for this role (' + [V.pubTitle, V.pubProgram].filter(Boolean).join(' · ') + ') are closed for now. Thanks for your interest.') : null}
      {V.pubKind === 'apply' && V.pubOk ? (<>
        <div style={{animation: "fadeUp .4s ease both"}}>
          <div style={KICKER}>{V.pubTitle}{V.pubProgram ? ' · ' + V.pubProgram : ''}</div>
          <h1 style={H1}>Apply in two minutes.</h1>
          <p style={{margin: "0 0 24px", fontSize: "15px", lineHeight: "1.6", color: "#A7B5AB", maxWidth: "620px"}}>Tell us how to reach you, then you go straight into the Peak Sales Combine — about 20–30 minutes, all multiple choice, and you can save and return. Your résumé is uploaded inside the assessment.</p>
          <div style={{...CARD, marginBottom: "18px"}}>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "14px"}}>
              {(V.pubFields ?? []).map((f: any, $index: number) => (<React.Fragment key={$index}>
                <div>
                  <div style={FIELD}>{f?.label}</div>
                  <input value={(f?.val) ?? ''} onChange={f?.set} placeholder={f?.ph} style={INPUT} />
                </div>
              </React.Fragment>))}
            </div>
          </div>
          <label style={{display: "flex", gap: "12px", alignItems: "flex-start", margin: "0 0 20px", cursor: "pointer"}}>
            <input type="checkbox" checked={!!(V.pubConsent)} onChange={V.togglePubConsent} style={{width: "17px", height: "17px", accentColor: "#10B981", marginTop: "2px"}} />
            <span style={{fontSize: "13px", color: "#A7B5AB", lineHeight: "1.55"}}>I consent to Peak Sports MGMT storing my details for this hiring process. I can request export or deletion of my data at any time.</span>
          </label>
          <div style={{display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap"}}>
            <button onClick={V.pubSubmit} disabled={!!(V.pubBlocked)} style={{background: V.pubBtnBg, color: "#04120B", border: "none", borderRadius: "10px", padding: "13px 26px", fontSize: "14px", fontWeight: "800", cursor: "pointer"}}>{V.pubBusy ? 'Submitting…' : 'Start my assessment'}</button>
            {V.pubMsg ? (<span style={{fontSize: "12.5px", color: "#F5B84A", lineHeight: "1.5"}}>{V.pubMsg}</span>) : null}
          </div>
        </div>
      </>) : null}
      {V.pubKind === 'apply' && V.pubDone ? (<>
        <div style={{...CARD, border: "1px solid rgba(16,185,129,.4)", maxWidth: "620px", animation: "fadeUp .4s ease both"}}>
          <div style={{...KICKER, color: "#34D399"}}>You’re in</div>
          <h1 style={H1}>Taking you to your assessment…</h1>
          <p style={{margin: "0 0 16px", fontSize: "14px", lineHeight: "1.6", color: "#A7B5AB"}}>{V.pubMsg}</p>
          <a href={V.pubLink} style={{display: "inline-block", background: "#10B981", color: "#04120B", borderRadius: "10px", padding: "12px 22px", fontSize: "13.5px", fontWeight: "800", textDecoration: "none"}}>Open my assessment now</a>
        </div>
      </>) : null}
      {V.pubKind === 'board' && V.pubOk ? (<>
        <div style={{animation: "fadeUp .4s ease both"}}>
          <div style={{display: "flex", alignItems: "flex-end", gap: "18px", flexWrap: "wrap", marginBottom: "22px"}}>
            <div style={{flex: "1"}}>
              <div style={KICKER}>Hiring pipeline</div>
              <h1 style={{...H1, margin: "0"}}>{V.pubTitle}</h1>
              <div style={{fontSize: "14px", color: "#A7B5AB", marginTop: "6px"}}>{V.pubProgram}{" · "}{V.pubTotal}{" candidate"}{V.pubTotal === 1 ? "" : "s"}</div>
            </div>
            <div style={{...MONO, textTransform: "none", letterSpacing: "0", fontSize: "11.5px"}}>{V.pubUpdated}</div>
          </div>
          <div style={{display: "grid", gridAutoFlow: "column", gridAutoColumns: "minmax(200px,1fr)", gap: "12px", overflowX: "auto", paddingBottom: "8px", alignItems: "start"}}>
            {(V.pubCols ?? []).map((col: any, $index: number) => (<React.Fragment key={$index}>
              <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "12px", minHeight: "140px"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", padding: "2px 4px 10px"}}>
                  <span style={MONO}>{col?.name}</span>
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "#5C6B61"}}>{col?.n}</span>
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                  {(col?.cards ?? []).map((c: any, $i2: number) => (<React.Fragment key={$i2}>
                    <div style={{background: "#0B120E", border: "1px solid rgba(160,190,170,.12)", borderRadius: "10px", padding: "10px 12px"}}>
                      <div style={{fontSize: "13.5px", fontWeight: "700"}}>{c?.name}</div>
                      {c?.sub ? (<div style={{fontSize: "11px", color: "#7E9186", marginTop: "3px"}}>{c?.sub}</div>) : null}
                      {(c?.chips ?? []).length ? (<div style={{display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "7px"}}>
                        {(c?.chips ?? []).map((ch: any, $i3: number) => (<span key={$i3} style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", letterSpacing: ".06em", textTransform: "uppercase", color: "#34D399", background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.25)", padding: "3px 7px", borderRadius: "99px"}}>{ch}</span>))}
                      </div>) : null}
                    </div>
                  </React.Fragment>))}
                </div>
              </div>
            </React.Fragment>))}
          </div>
          <p style={{margin: "18px 0 0", fontSize: "11.5px", color: "#5C6B61", lineHeight: "1.55"}}>Shared by Peak Sports MGMT. Names and stages only — assessment scores, evaluator notes, and decisions rationale stay inside the hiring team.</p>
        </div>
      </>) : null}
    </main>
  );
}
