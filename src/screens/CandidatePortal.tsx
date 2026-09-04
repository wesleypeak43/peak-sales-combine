// CandidatePortal — generated from the Peak Sales Combine prototype template. Plain React; edit freely.
// V is the view-model returned by PeakCombine.renderVals(): values, lists, and event handlers.
import React from 'react';


export function CandidatePortal({ V }: { V: any }) {
  return V.isCand ? (<>
    <main style={{flex: "1", width: "100%", maxWidth: V.candMax, margin: "0 auto", padding: "36px clamp(16px,4vw,28px) 80px", boxSizing: "border-box", containerType: "inline-size", pointerEvents: V.candPE, borderLeft: V.candFrame, borderRight: V.candFrame}}>
      {V.vDash ? (<>
        <div style={{animation: "fadeUp .4s ease both"}}>
          <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#10B981", marginBottom: "8px"}}>{V.candRoleLine}</div>
          <h1 style={{margin: "0 0 8px", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", fontSize: "clamp(35px,10cqw,46px)", fontWeight: "700", letterSpacing: ".01em", lineHeight: "1"}}>{"Welcome, "}{V.candFirst}.</h1>
          <p style={{margin: "0 0 26px", fontSize: "15px", lineHeight: "1.6", color: "#A7B5AB", maxWidth: "620px"}}>Your assessment measures what actually matters in this job — the drive to hunt, ownership of outcomes, response to coaching, and the ability to find a way. Save and return anytime; your progress is kept.</p>
          <div style={{display: "flex", alignItems: "center", gap: "16px", marginBottom: "26px", flexWrap: "wrap"}}>
            <div style={{flex: "1", minWidth: "220px", height: "8px", background: "#121A15", borderRadius: "99px", overflow: "hidden"}}>
              <div style={{height: "100%", width: V.progressPct, background: "linear-gradient(90deg,#0E9F6E,#10B981)", borderRadius: "99px", transition: "width .4s"}} />
            </div>
            <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", color: "#8FA396"}}>{V.progressTxt}{" · Complete by "}{V.candDue}</div>
          </div>
          <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
            {(V.stages ?? []).map((s: any, $index: number) => (<React.Fragment key={$index}>
              <div style={{display: "flex", alignItems: "center", flexWrap: "wrap", gap: "14px 18px", background: "#0F1611", border: `1px solid ${s?.border}`, borderRadius: "14px", padding: "18px 22px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "15px", fontWeight: "700", color: s?.numColor, width: "30px"}}>{s?.n}</div>
                <div style={{flex: "1", minWidth: "0"}}>
                  <div style={{fontSize: "16px", fontWeight: "700"}}>{s?.title}</div>
                  <div style={{fontSize: "12.5px", color: "#8FA396", marginTop: "3px"}}>{"Estimated "}{s?.time}</div>
                </div>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".1em", textTransform: "uppercase", color: s?.statusColor}}>{s?.status}</div>
                {s?.canGo ? (<>
                  <button onClick={s?.go} style={{background: s?.btnBg, color: s?.btnFg, border: s?.btnBorder, borderRadius: "10px", padding: "10px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap"}}>{s?.btn}</button>
                </>) : null}
              </div>
            </React.Fragment>))}
          </div>
          {V.showStatus ? (<>
            <div style={{marginTop: "20px", background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "20px 24px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "14px"}}>Where your application stands</div>
              <div style={{display: "flex", flexDirection: "column", gap: "11px"}}>
                {(V.statusSteps ?? []).map((t: any, $index: number) => (<React.Fragment key={$index}>
                  <div style={{display: "flex", gap: "12px", alignItems: "flex-start"}}>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", color: t?.color, width: "16px", paddingTop: "1px"}}>{t?.mark}</span>
                    <div style={{flex: "1"}}>
                      <div style={{fontSize: "13.5px", fontWeight: "700", color: t?.color}}>{t?.label}</div>
                      <div style={{fontSize: "12px", color: "#8FA396", marginTop: "2px", lineHeight: "1.5"}}>{t?.sub}</div>
                    </div>
                  </div>
                </React.Fragment>))}
              </div>
            </div>
          </>) : null}
          {V.decisionAdvance ? (<>
            <div style={{marginTop: "16px", background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.4)", borderRadius: "14px", padding: "22px 24px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#34D399", marginBottom: "8px"}}>Decision</div>
              <div style={{fontSize: "18px", fontWeight: "800", marginBottom: "6px"}}>We’d like to move forward with you.</div>
              <p style={{margin: "0 0 14px", fontSize: "13.5px", color: "#A7B5AB", lineHeight: "1.6"}}>{V.decisionAdvanceTxt}</p>
              {V.isDemo ? (<>
              <div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
                <button style={{background: "#10B981", color: "#04120B", border: "none", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "800", cursor: "pointer"}}>Pick a time for the call</button>
                <button style={{background: "transparent", color: "#E9F0EA", border: "1px solid rgba(160,190,170,.3)", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer"}}>Download decision letter</button>
              </div>
              </>) : null}
            </div>
          </>) : null}
          {V.decisionDecline ? (<>
            <div style={{marginTop: "16px", background: "#0F1611", border: "1px solid rgba(160,190,170,.2)", borderRadius: "14px", padding: "22px 24px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "8px"}}>Decision</div>
              <div style={{fontSize: "18px", fontWeight: "800", marginBottom: "6px"}}>We won’t be moving forward for this role.</div>
              <p style={{margin: "0 0 14px", fontSize: "13.5px", color: "#A7B5AB", lineHeight: "1.6"}}>Thank you for the time and honesty you put into this. Two trained evaluators reviewed everything you submitted, and the decision was made by the hiring panel — not by any automated score. Your evidence stays on file for 12 months so we can reach out about future openings, unless you ask us to delete it.</p>
              <div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
                <button style={{background: "transparent", color: "#E9F0EA", border: "1px solid rgba(160,190,170,.3)", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer"}}>Keep me in mind for future roles</button>
                <button style={{background: "transparent", color: "#8FA396", border: "1px solid rgba(160,190,170,.3)", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer", borderColor: "rgba(160,190,170,.2)"}}>Delete my data</button>
              </div>
            </div>
          </>) : null}
        </div>
      </>) : null}
      {V.vS1 ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <button onClick={V.goDash} style={{background: "none", border: "none", color: "#8FA396", fontSize: "13px", cursor: "pointer", padding: "0", marginBottom: "18px"}} className="ps2">← Back to dashboard</button>
          <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#10B981", marginBottom: "8px"}}>Stage 01 · Realistic Job Preview</div>
          <h1 style={{margin: "0 0 10px", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", fontSize: "clamp(32px,8cqw,41px)", fontWeight: "700", letterSpacing: ".01em", lineHeight: "1"}}>This job, honestly.</h1>
          <p style={{margin: "0 0 24px", fontSize: "15px", lineHeight: "1.6", color: "#A7B5AB", maxWidth: "640px"}}>Peak Sports MGMT builds revenue for college athletics departments. It is a demanding, rewarding sales job — and we would rather you know exactly what it looks like before you invest your time.</p>
          <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px", marginBottom: "22px"}}>
            <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "14px"}}>The real nature of the role</div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))", gap: "10px 24px"}}>
              {(V.realities ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}>
                <div style={{display: "flex", gap: "10px", alignItems: "baseline", fontSize: "14px", lineHeight: "1.5", color: "#D5DED7"}}>
                  <span style={{color: "#10B981", fontWeight: "800"}}>/</span>
                  {r}
                </div>
              </React.Fragment>))}
            </div>
          </div>
          <label style={{display: "flex", gap: "12px", alignItems: "flex-start", background: "#0F1611", border: `1px solid ${V.ackBorder}`, borderRadius: "14px", padding: "18px 22px", cursor: "pointer", marginBottom: "22px"}}>
            <input type="checkbox" checked={!!(V.ack)} onChange={V.toggleAck} style={{width: "18px", height: "18px", accentColor: "#10B981", marginTop: "2px"}} />
            <span style={{fontSize: "14.5px", fontWeight: "600", lineHeight: "1.5"}}>I understand what the role requires and want to continue.</span>
          </label>
          <div style={{marginBottom: "8px", fontSize: "15px", fontWeight: "700"}}>Which part of this role will challenge you most, and how would you manage it?</div>
          <p style={{margin: "0 0 10px", fontSize: "12.5px", color: "#8FA396", lineHeight: "1.5"}}>There is no wrong answer here. Naming a real challenge is a sign of self-awareness, not a weakness — it is never scored against you.</p>
          <textarea value={(V.challenge) ?? ''} onChange={V.setChallenge} rows="4" placeholder="e.g. The volume of rejection early on. I'd manage it by…" style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "14px", color: "#E9F0EA", fontSize: "14px", lineHeight: "1.55", resize: "vertical"}} />
          <div style={{display: "flex", gap: "12px", marginTop: "20px", alignItems: "center"}}>
            <button onClick={V.submitS1} disabled={!!(V.s1Blocked)} style={{background: V.s1BtnBg, color: "#04120B", border: "none", borderRadius: "10px", padding: "13px 26px", fontSize: "14px", fontWeight: "800", cursor: "pointer"}}>{"Acknowledge & continue"}</button>
            <span style={{fontSize: "12.5px", color: "#5C6B61"}}>{V.s1Hint}</span>
          </div>
        </div>
      </>) : null}
      {V.vS2 ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <button onClick={V.goDash} style={{background: "none", border: "none", color: "#8FA396", fontSize: "13px", cursor: "pointer", padding: "0", marginBottom: "18px"}} className="ps2">← Back to dashboard</button>
          <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#10B981", marginBottom: "8px"}}>Stage 02 · Evidence-Based Application</div>
          <h1 style={{margin: "0 0 10px", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", fontSize: "clamp(32px,8cqw,41px)", fontWeight: "700", letterSpacing: ".01em", lineHeight: "1"}}>Show us evidence, not adjectives.</h1>
          <p style={{margin: "0 0 24px", fontSize: "15px", lineHeight: "1.6", color: "#A7B5AB", maxWidth: "640px"}}>We care about what you have actually done. Wherever possible, include real numbers — starting points, targets, results.</p>
          <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px", marginBottom: "18px"}}>
            <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "16px"}}>{"Contact & role"}</div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "14px"}}>
              {(V.appFields ?? []).map((f: any, $index: number) => (<React.Fragment key={$index}>
                <div>
                  <div style={{fontSize: "12.5px", fontWeight: "600", color: "#A7B5AB", marginBottom: "6px"}}>{f?.label}</div>
                  <input value={(f?.val) ?? ''} onChange={f?.set} placeholder={f?.ph} style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "12px 14px", color: "#E9F0EA", fontSize: "14px"}} />
                </div>
              </React.Fragment>))}
              <div>
                <div style={{fontSize: "12.5px", fontWeight: "600", color: "#A7B5AB", marginBottom: "6px"}}>Role</div>
                <select value={(V.appRole) ?? ''} onChange={V.setAppRole} style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "12px 14px", color: "#E9F0EA", fontSize: "14px"}}>
                  <option>Sponsorship Sales Consultant</option>
                  <option>Ticket Sales Consultant</option>
                  <option>Partnership Development Manager</option>
                </select>
              </div>
              <div>
                <div style={{fontSize: "12.5px", fontWeight: "600", color: "#A7B5AB", marginBottom: "6px"}}>Are you legally authorized to work in the United States for this role?</div>
                <div style={{display: "flex", gap: "8px"}}>
                  <button onClick={V.authYes} style={{flex: "1", background: V.authYesBg, color: V.authYesFg, border: "1px solid rgba(160,190,170,.2)", borderRadius: "10px", padding: "11px", fontSize: "13.5px", fontWeight: "600", cursor: "pointer"}}>Yes</button>
                  <button onClick={V.authNo} style={{flex: "1", background: V.authNoBg, color: V.authNoFg, border: "1px solid rgba(160,190,170,.2)", borderRadius: "10px", padding: "11px", fontSize: "13.5px", fontWeight: "600", cursor: "pointer"}}>No</button>
                </div>
              </div>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "14px", marginTop: "14px"}}>
              <div role="button" tabIndex="0" onClick={V.toggleResume} style={{border: `1.5px dashed ${V.resumeBorder}`, borderRadius: "10px", padding: "16px", textAlign: "center", cursor: "pointer", background: V.resumeBg}}>
                <div style={{fontSize: "13.5px", fontWeight: "700", color: V.resumeColor}}>{V.resumeTxt}</div>
                <div style={{fontSize: "11.5px", color: "#5C6B61", marginTop: "4px"}}>PDF or DOCX · secure upload · 10 MB max</div>
              </div>
              <div>
                <div style={{fontSize: "12.5px", fontWeight: "600", color: "#A7B5AB", marginBottom: "6px"}}>
                  {"LinkedIn URL "}
                  <span style={{color: "#5C6B61", fontWeight: "400"}}>(optional)</span>
                </div>
                <input value={(V.appLinkedin) ?? ''} onChange={V.setLinkedin} placeholder="linkedin.com/in/…" style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "12px 14px", color: "#E9F0EA", fontSize: "14px"}} />
              </div>
            </div>
          </div>
          <div style={{display: "flex", flexDirection: "column", gap: "14px"}}>
            {(V.evItems ?? []).map((q: any, $index: number) => (<React.Fragment key={$index}>
              <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "20px 24px"}}>
                <div style={{display: "flex", gap: "12px", alignItems: "baseline", marginBottom: "10px"}}>
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", fontWeight: "700", color: "#10B981"}}>{q?.num}</span>
                  <span style={{fontSize: "14.5px", fontWeight: "700", lineHeight: "1.5"}}>{q?.q}</span>
                </div>
                <textarea value={(q?.val) ?? ''} onChange={q?.set} rows="4" placeholder="Include real numbers where they apply — starting point, target, result." style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "13px", color: "#E9F0EA", fontSize: "14px", lineHeight: "1.55", resize: "vertical"}} />
                <div style={{textAlign: "right", fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: q?.countColor, marginTop: "6px"}}>{q?.count}</div>
              </div>
            </React.Fragment>))}
          </div>
          <label style={{display: "flex", gap: "12px", alignItems: "flex-start", margin: "20px 0", cursor: "pointer"}}>
            <input type="checkbox" checked={!!(V.consent)} onChange={V.toggleConsent} style={{width: "17px", height: "17px", accentColor: "#10B981", marginTop: "2px"}} />
            <span style={{fontSize: "13px", color: "#A7B5AB", lineHeight: "1.55"}}>I consent to Peak Sports MGMT storing my application materials for the configured retention period. I can request export or deletion of my data at any time.</span>
          </label>
          <div style={{display: "flex", gap: "12px", alignItems: "center"}}>
            <button onClick={V.submitS2} disabled={!!(V.s2Blocked)} style={{background: V.s2BtnBg, color: "#04120B", border: "none", borderRadius: "10px", padding: "13px 26px", fontSize: "14px", fontWeight: "800", cursor: "pointer"}}>Submit application</button>
            <span style={{fontSize: "12.5px", color: "#5C6B61"}}>{V.s2Hint}</span>
          </div>
        </div>
      </>) : null}
      {V.vS3 ? (<>
        <div style={{animation: "fadeUp .35s ease both", maxWidth: "720px"}}>
          <div style={{display: "flex", alignItems: "center", gap: "18px", marginBottom: "18px", flexWrap: "wrap"}}>
            <button onClick={V.goDash} style={{background: "none", border: "none", color: "#8FA396", fontSize: "13px", cursor: "pointer", padding: "0"}} className="ps2">{"← Save & return later"}</button>
            {V.bkCanBack ? (<>
              <button onClick={V.bkBack} style={{background: "none", border: "none", color: "#8FA396", fontSize: "13px", cursor: "pointer", padding: "0", textDecoration: "underline"}} className="ps2">Change previous answer</button>
            </>) : null}
          </div>
          <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#10B981", marginBottom: "8px"}}>{"Stage 03 · Sales Decisions · "}{V.bkNum}{" of "}{V.bkTotal}</div>
          <h1 style={{margin: "0 0 16px", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", fontSize: "clamp(30px,8cqw,40px)", fontWeight: "700", letterSpacing: ".01em", lineHeight: "1"}}>{V.bkKindLabel}</h1>
          <div style={{display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px"}}>
            <div style={{flex: "1", height: "6px", background: "#121A15", borderRadius: "99px", overflow: "hidden"}}>
              <div style={{height: "100%", width: V.bkPct, background: "#10B981", borderRadius: "99px", transition: "width .3s"}} />
            </div>
            <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", color: "#8FA396"}}>~15 min</div>
          </div>
          {V.bkHasText ? (<>
            <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "24px 26px", marginBottom: "14px"}}>
              <p style={{margin: "0", fontSize: "clamp(16px,4.5cqw,19px)", lineHeight: "1.5", color: "#E9F0EA", fontWeight: "600"}}>{V.bkText}</p>
            </div>
          </>) : null}
          {V.bkIsLikert ? (<>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: "8px"}}>
              {(V.bkScale ?? []).map((b: any, $index: number) => (<React.Fragment key={$index}>
                <button onClick={b?.on} style={{background: b?.bg, border: `1px solid ${b?.border}`, borderRadius: "10px", padding: "16px 8px", color: b?.fg, fontSize: "12.5px", fontWeight: "700", cursor: "pointer", lineHeight: "1.3", minHeight: "56px"}} className="ps3">{b?.label}</button>
              </React.Fragment>))}
            </div>
          </>) : null}
          {V.bkIsPair ? (<>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "12px"}}>
              {(V.bkPair ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}>
                <button onClick={o?.on} style={{background: o?.bg, border: `1px solid ${o?.border}`, borderRadius: "14px", padding: "26px 22px", color: o?.fg, fontSize: "16px", fontWeight: "700", lineHeight: "1.45", textAlign: "left", cursor: "pointer", minHeight: "110px"}} className="ps1">{o?.text}</button>
              </React.Fragment>))}
            </div>
          </>) : null}
          {V.bkIsChoice ? (<>
            <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
              {(V.bkOpts ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}>
                <button onClick={o?.on} style={{display: "flex", gap: "14px", alignItems: "center", background: o?.bg, border: `1px solid ${o?.border}`, borderRadius: "12px", padding: "16px 18px", color: o?.fg, fontSize: "14px", lineHeight: "1.5", textAlign: "left", cursor: "pointer", minHeight: "52px"}} className="ps1">
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", fontWeight: "700", color: "#7E9186"}}>{o?.letter}</span>
                  <span style={{flex: "1"}}>{o?.text}</span>
                </button>
              </React.Fragment>))}
            </div>
          </>) : null}
          <p style={{margin: "18px 0 0", fontSize: "11.5px", color: "#5C6B61", lineHeight: "1.55"}}>One decision per screen, about 15 minutes. There are no trick questions and no single answer decides anything — your choices are read alongside your application, your live combine, and your interview, by people rather than software.</p>
        </div>
      </>) : null}
      {V.vS5 ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <button onClick={V.goDash} style={{background: "none", border: "none", color: "#8FA396", fontSize: "13px", cursor: "pointer", padding: "0", marginBottom: "18px"}} className="ps2">← Back to dashboard</button>
          <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#10B981", marginBottom: "8px"}}>Stage 04 · The Sales Combine</div>
          <h1 style={{margin: "0 0 10px", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", fontSize: "clamp(32px,8cqw,41px)", fontWeight: "700", letterSpacing: ".01em", lineHeight: "1"}}>Two exercises. Real conditions.</h1>
          <p style={{margin: "0 0 24px", fontSize: "15px", lineHeight: "1.6", color: "#A7B5AB", maxWidth: "640px"}}>This is where you show us — not tell us. Both exercises are scored by two independent, trained evaluators using behaviorally anchored scales. Exercise A happens live on a video call; Exercise B is submitted beforehand.</p>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "16px"}}>
            <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "24px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#10B981", marginBottom: "10px"}}>Exercise A · live with evaluators</div>
              <div style={{fontSize: "18px", fontWeight: "800", marginBottom: "8px"}}>Sell the Chicken Sandwich</div>
              <p style={{margin: "0 0 16px", fontSize: "13.5px", lineHeight: "1.6", color: "#8FA396"}}>A live video session with two Peak evaluators. Five minutes to prepare, three minutes to sell to a skeptical buyer — then one piece of coaching and a second attempt.</p>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", letterSpacing: ".08em", textTransform: "uppercase", color: V.s5aStatusColor, marginBottom: "14px"}}>{V.s5aStatus}</div>
              <button onClick={V.goS5a} style={{background: V.s5aBtnBg, color: V.s5aBtnFg, border: V.s5aBtnBorder, borderRadius: "10px", padding: "11px 20px", fontSize: "13.5px", fontWeight: "700", cursor: "pointer"}}>{V.s5aBtnTxt}</button>
            </div>
            <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "24px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#10B981", marginBottom: "10px"}}>Exercise B</div>
              <div style={{fontSize: "18px", fontWeight: "800", marginBottom: "8px"}}>The Resourcefulness Case</div>
              <p style={{margin: "0 0 16px", fontSize: "13.5px", lineHeight: "1.6", color: "#8FA396"}}>A $25K property, no lead flow, incomplete CRM, 30 days to build momentum. Show us your first moves, your math, and your fallback plan. Submit it before your live session — your evaluators read it ahead of time.</p>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", letterSpacing: ".08em", textTransform: "uppercase", color: V.s5bStatusColor, marginBottom: "14px"}}>{V.s5bStatus}</div>
              <button onClick={V.goS5b} style={{background: V.s5bBtnBg, color: V.s5bBtnFg, border: V.s5bBtnBorder, borderRadius: "10px", padding: "11px 20px", fontSize: "13.5px", fontWeight: "700", cursor: "pointer"}}>{V.s5bBtnTxt}</button>
            </div>
          </div>
        </div>
      </>) : null}
      {V.vS5a ? (<>
        <div style={{animation: "fadeUp .35s ease both", maxWidth: "680px"}}>
          <button onClick={V.goS5} style={{background: "none", border: "none", color: "#8FA396", fontSize: "13px", cursor: "pointer", padding: "0", marginBottom: "18px"}} className="ps2">← Back to combine</button>
          <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#10B981", marginBottom: "8px"}}>Exercise A · Live session</div>
          <h1 style={{margin: "0 0 18px", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", fontSize: "clamp(30px,8cqw,38px)", fontWeight: "700", letterSpacing: ".01em", lineHeight: "1"}}>Your live combine.</h1>
          <div style={{background: "#0F1611", border: "1px solid rgba(16,185,129,.3)", borderRadius: "14px", padding: "24px 26px", marginBottom: "16px"}}>
            <div style={{display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "flex-end"}}>
              <div>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "4px"}}>When</div>
                <div style={{fontSize: "clamp(17px,5cqw,20px)", fontWeight: "800"}}>{V.candSession}</div>
              </div>
              <div>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "4px"}}>Where</div>
                <div style={{fontSize: "14px", fontWeight: "700", color: "#34D399", wordBreak: "break-all"}}>{V.candLink}</div>
              </div>
            </div>
            <div style={{display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "18px", alignItems: "center"}}>
              {V.joinHref ? (<>
                <a href={V.joinHref} target="_blank" rel="noreferrer" style={{background: "#10B981", color: "#04120B", border: "none", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "800", cursor: "pointer", textDecoration: "none"}}>Join the session</a>
              </>) : (<>
                <button disabled={!!(V.joinDisabled)} style={{background: "#20302680", color: "#5C6B61", border: "none", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "800", cursor: "not-allowed"}}>{V.isDemo ? 'Join — opens 10 min before' : 'Join link arrives with your session'}</button>
              </>)}
              {V.isDemo ? (<>
              <button style={{background: "transparent", color: "#E9F0EA", border: "1px solid rgba(160,190,170,.3)", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer"}}>Add to calendar</button>
              </>) : null}
              {V.notResched ? (<>
                <button onClick={V.askResched} style={{background: "none", border: "none", color: "#8FA396", fontSize: "13px", cursor: "pointer", padding: "0 6px", textDecoration: "underline"}} className="ps2">Request a different time</button>
              </>) : null}
              {V.resched ? (<>
                <span style={{color: "#34D399", fontSize: "12.5px", fontWeight: "700"}}>Request sent — the talent team will reply within one business day.</span>
              </>) : null}
            </div>
          </div>
          <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px", marginBottom: "16px"}}>
            <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "12px"}}>What happens on the call</div>
            <div style={{display: "flex", flexDirection: "column", gap: "9px", fontSize: "13.5px", color: "#D5DED7", lineHeight: "1.55"}}>
              <div>1 · Two evaluators introduce themselves. One plays a skeptical buyer.</div>
              <div>2 · Five minutes to prepare a three-minute pitch for a chicken sandwich. The product is deliberately simple — we are watching how you discover needs, handle resistance, and ask for a next step.</div>
              <div>3 · You hear the same objections every candidate hears.</div>
              <div>4 · One piece of specific coaching, five minutes to adjust, then a second attempt. Improvement after coaching counts as much as the first try.</div>
              <div>5 · Evaluators score independently against written standards. Nobody is scored on polish, accent, or camera presence.</div>
            </div>
          </div>
          <label style={{display: "flex", gap: "12px", alignItems: "flex-start", background: "#0F1611", border: `1px solid ${V.consentBorder}`, borderRadius: "14px", padding: "18px 20px", cursor: "pointer"}}>
            <input type="checkbox" checked={!!(V.consentRec)} onChange={V.toggleConsentRec} style={{accentColor: "#10B981", width: "16px", height: "16px", marginTop: "2px", flexShrink: "0"}} />
            <span style={{fontSize: "13px", lineHeight: "1.55", color: "#A7B5AB"}}>I understand the session is recorded so evaluators can check their scoring against each other. Recordings are seen only by trained evaluators and the talent team, are never analyzed by software for face, voice, or emotion, and are deleted at the end of the retention period.</span>
          </label>
          <p style={{margin: "14px 0 0", fontSize: "12px", color: "#5C6B61", lineHeight: "1.55"}}>
            {"Need captions, extra preparation time, or a different format? Use "}
            <b>Request an accommodation</b>
            {" below — it is handled by the talent team and never shown to evaluators as part of your score."}
          </p>
        </div>
      </>) : null}
      {V.vS5b ? (<>
        <div style={{animation: "fadeUp .35s ease both", maxWidth: "720px"}}>
          <button onClick={V.goS5} style={{background: "none", border: "none", color: "#8FA396", fontSize: "13px", cursor: "pointer", padding: "0", marginBottom: "18px"}} className="ps2">← Back to combine</button>
          <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#10B981", marginBottom: "8px"}}>Exercise B · The Resourcefulness Case</div>
          <h1 style={{margin: "0 0 18px", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", fontSize: "clamp(30px,8cqw,38px)", fontWeight: "700", letterSpacing: ".01em", lineHeight: "1"}}>Build momentum from almost nothing.</h1>
          <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "24px 26px", marginBottom: "20px"}}>
            <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "10px"}}>Your brief (fictional)</div>
            <p style={{margin: "0", fontSize: "14.5px", lineHeight: "1.7", color: "#D5DED7"}}>
              {"You have joined a university athletics property currently generating approximately "}
              <b>$25,000</b>
              {" in annual sponsorship revenue. There is no meaningful inbound lead flow, the CRM is incomplete, the school has limited brand awareness, and you have "}
              <b>30 days</b>
              {" to build momentum. You have access to a laptop, phone, CRM, university stakeholders, and public market information."}
            </p>
          </div>
          <div style={{display: "flex", gap: "8px", marginBottom: "18px"}}>
            {(V.caseModes ?? []).map((m: any, $index: number) => (<React.Fragment key={$index}>
              <button onClick={m?.on} style={{background: m?.bg, color: m?.fg, border: "1px solid rgba(160,190,170,.2)", borderRadius: "99px", padding: "8px 16px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer"}}>{m?.label}</button>
            </React.Fragment>))}
          </div>
          {V.caseWritten ? (<>
            <div style={{display: "flex", flexDirection: "column", gap: "14px"}}>
              {(V.caseItems ?? []).map((c: any, $index: number) => (<React.Fragment key={$index}>
                <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "18px 22px"}}>
                  <div style={{fontSize: "14px", fontWeight: "700", marginBottom: "8px"}}>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", color: "#10B981", marginRight: "8px"}}>{c?.num}</span>
                    {c?.q}
                  </div>
                  <textarea value={(c?.val) ?? ''} onChange={c?.set} rows="3" placeholder="Be specific — names of channels, numbers, sequence." style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "12px", color: "#E9F0EA", fontSize: "14px", lineHeight: "1.55", resize: "vertical"}} />
                </div>
              </React.Fragment>))}
            </div>
          </>) : null}
          {V.caseUpload ? (<>
            <div role="button" tabIndex="0" onClick={V.toggleRecorded} style={{border: `1.5px dashed ${V.recBorder}`, background: V.recBg, borderRadius: "14px", padding: "44px", textAlign: "center", cursor: "pointer"}}>
              <div style={{fontSize: "15px", fontWeight: "800", color: V.recColor}}>{V.caseUpTxt}</div>
              <div style={{fontSize: "12px", color: "#5C6B61", marginTop: "6px"}}>{V.caseUpSub}</div>
            </div>
          </>) : null}
          <button onClick={V.submitS5b} disabled={!!(V.s5bBlocked)} style={{background: V.s5bSubmitBg, color: "#04120B", border: "none", borderRadius: "10px", padding: "13px 26px", fontSize: "14px", fontWeight: "800", cursor: "pointer", marginTop: "20px"}}>Submit Exercise B</button>
        </div>
      </>) : null}
      <div style={{marginTop: "44px", borderTop: "1px solid rgba(160,190,170,.1)", paddingTop: "18px", display: "flex", gap: "22px", flexWrap: "wrap", alignItems: "center"}}>
        {V.notWithdrawn ? (<>
          <button onClick={V.withdraw} style={{background: "none", border: "none", color: "#5C6B61", fontSize: "13px", cursor: "pointer", padding: "0", textDecoration: "underline"}} className="ps4">Withdraw my application</button>
        </>) : null}
        {V.withdrawn ? (<>
          <span style={{fontSize: "13px", color: "#8FA396", lineHeight: "1.5"}}>
            {"Application withdrawn — your data is deleted in 30 days unless you ask us to keep it on file. "}
            <span onClick={V.undoWithdraw} style={{color: "#34D399", cursor: "pointer", textDecoration: "underline"}}>Undo</span>
          </span>
        </>) : null}
      </div>
      <div style={{marginTop: "16px"}}>
        <button onClick={V.toggleAccom} style={{background: "none", border: "none", color: "#8FA396", fontSize: "13px", fontWeight: "600", cursor: "pointer", padding: "0", textDecoration: "underline"}} className="ps5">Request an accommodation</button>
        {V.accomOpen ? (<>
          <div style={{marginTop: "14px", background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "20px 22px", maxWidth: "640px"}}>
            <p style={{margin: "0 0 12px", fontSize: "13.5px", color: "#A7B5AB", lineHeight: "1.6"}}>Additional time, alternative formats, captions, screen-reader support, or anything else you need — requesting an accommodation never affects your evaluation.</p>
            {V.accomNotSent ? (<>
              <textarea value={(V.accomTxt) ?? ''} onChange={V.setAccomTxt} rows="3" placeholder="Tell us what would help…" style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "12px", color: "#E9F0EA", fontSize: "14px", resize: "vertical"}} />
              <button onClick={V.sendAccom} style={{background: "transparent", color: "#34D399", border: "1px solid rgba(16,185,129,.4)", borderRadius: "10px", padding: "10px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer", marginTop: "10px"}}>Send to the talent team</button>
            </>) : null}
            {V.accomSent ? (<>
              <div style={{fontSize: "13.5px", fontWeight: "700", color: "#34D399"}}>Received — the talent team will respond within one business day.</div>
            </>) : null}
          </div>
        </>) : null}
      </div>
    </main>
  </>) : null;
}
