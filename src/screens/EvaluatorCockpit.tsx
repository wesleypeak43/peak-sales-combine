// EvaluatorCockpit — generated from the Peak Sales Combine prototype template. Plain React; edit freely.
// V is the view-model returned by PeakCombine.renderVals(): values, lists, and event handlers.
import React from 'react';


export function EvaluatorCockpit({ V }: { V: any }) {
  return V.isEval ? (<>
    <main style={{flex: "1", width: "100%", maxWidth: "1240px", margin: "0 auto", padding: "32px 28px 80px", boxSizing: "border-box"}}>
      {V.vRoster ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Combine sessions</h1>
          <p style={{margin: "0 0 24px", fontSize: "14.5px", color: "#A7B5AB", maxWidth: "640px", lineHeight: "1.6"}}>Score independently. You will not see the other evaluator’s ratings until you submit your own. Differences over 1.5 points on any competency are flagged for calibration.</p>
          <div style={{display: "flex", flexDirection: "column", gap: "12px", maxWidth: "860px"}}>
            {(V.sessions ?? []).map((s: any, $index: number) => (<React.Fragment key={$index}>
              <div style={{display: "flex", alignItems: "center", gap: "18px", background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "18px 22px"}}>
                <div style={{width: "44px", height: "44px", borderRadius: "12px", background: "#121A15", border: "1px solid rgba(160,190,170,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px", color: "#34D399"}}>{s?.initials}</div>
                <div style={{flex: "1"}}>
                  <div style={{fontSize: "16px", fontWeight: "700"}}>{s?.name}</div>
                  <div style={{fontSize: "12.5px", color: "#8FA396", marginTop: "2px"}}>{s?.sub}</div>
                </div>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", letterSpacing: ".1em", textTransform: "uppercase", color: s?.statusColor}}>{s?.status}</div>
                {s?.canRun ? (<>
                  <button onClick={s?.go} style={{background: "#10B981", color: "#04120B", border: "none", borderRadius: "10px", padding: "10px 18px", fontSize: "13px", fontWeight: "800", cursor: "pointer"}}>Run live session</button>
                </>) : null}
              </div>
            </React.Fragment>))}
            {V.noSessions ? (<>
              <div style={{background: "#0F1611", border: "1px dashed rgba(160,190,170,.22)", borderRadius: "14px", padding: "22px", fontSize: "13.5px", color: "#8FA396", lineHeight: "1.6"}}>No combine sessions are assigned to you yet. Sessions appear here as soon as a hiring manager schedules one with you as an evaluator.</div>
            </>) : null}
          </div>
        </div>
      </>) : null}
      {V.vLive ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <div style={{display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", flexWrap: "wrap"}}>
            <button onClick={V.goRoster} style={{background: "none", border: "none", color: "#8FA396", fontSize: "13px", cursor: "pointer", padding: "0"}} className="ps2">← Sessions</button>
            <h1 style={{margin: "0", fontSize: "24px", fontWeight: "900"}}>{"Live combine — "}{V.liveCandName}</h1>
            <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "#7E9186"}}>Exercise A · Sell the Chicken Sandwich</div>
            <div style={{marginLeft: "auto", display: "flex", gap: "6px", flexWrap: "wrap"}}>
              {(V.phaseSteps ?? []).map((p: any, $index: number) => (<React.Fragment key={$index}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase", padding: "6px 10px", borderRadius: "99px", background: p?.bg, color: p?.fg, border: "1px solid rgba(160,190,170,.14)"}}>{p?.label}</div>
              </React.Fragment>))}
            </div>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "380px 1fr", gap: "20px", alignItems: "start"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
              <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "20px 22px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "10px"}}>Candidate brief</div>
                <p style={{margin: "0", fontSize: "13px", lineHeight: "1.6", color: "#D5DED7"}}>{V.liveBrief}</p>
                <div style={{display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "12px"}}>
                  {(V.liveFlags ?? []).map((f: any, $index: number) => (<React.Fragment key={$index}>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".06em", textTransform: "uppercase", color: f?.fg, background: f?.bg, border: `1px solid ${f?.border}`, padding: "4px 9px", borderRadius: "99px"}}>{f?.label}</span>
                  </React.Fragment>))}
                </div>
                {V.liveResume || V.liveCaseFile ? (<>
                  <div style={{display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "12px"}}>
                    {V.liveResume ? (<><button onClick={V.openLiveResume} style={{background: "transparent", color: "#34D399", border: "1px solid rgba(16,185,129,.35)", borderRadius: "8px", padding: "6px 11px", fontSize: "11.5px", fontWeight: "700", cursor: "pointer"}}>{"Résumé · " + V.liveResume}</button></>) : null}
                    {V.liveCaseFile ? (<><button onClick={V.openLiveCaseFile} style={{background: "transparent", color: "#34D399", border: "1px solid rgba(16,185,129,.35)", borderRadius: "8px", padding: "6px 11px", fontSize: "11.5px", fontWeight: "700", cursor: "pointer"}}>{"Exercise B file · " + V.liveCaseFile}</button></>) : null}
                  </div>
                </>) : null}
                {(V.liveTranscripts ?? []).length ? (<>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".12em", textTransform: "uppercase", color: "#7E9186", marginTop: "14px", marginBottom: "6px"}}>Transcripts on file</div>
                  <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                    {(V.liveTranscripts ?? []).map((t: any, $index: number) => (<React.Fragment key={$index}>
                      <div style={{background: "#0B120E", borderRadius: "10px", padding: "10px 12px"}}>
                        <div style={{display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap"}}>
                          <div style={{flex: "1", fontSize: "12.5px", fontWeight: "700"}}>{t?.title}<span style={{color: "#5C6B61", fontWeight: "400"}}>{" · "}{t?.meta}</span></div>
                          <button onClick={t?.toggle} style={{background: "transparent", color: "#A7B5AB", border: "1px solid rgba(160,190,170,.2)", borderRadius: "8px", padding: "5px 10px", fontSize: "11px", fontWeight: "700", cursor: "pointer"}}>{t?.toggleTxt}</button>
                        </div>
                        {t?.show ? (<>
                          <pre style={{margin: "8px 0 0", whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "12px", lineHeight: "1.55", color: "#A7B5AB", maxHeight: "300px", overflow: "auto"}}>{t?.txt}</pre>
                        </>) : null}
                      </div>
                    </React.Fragment>))}
                  </div>
                </>) : null}
              </div>
              <div style={{background: "#0F1611", border: "1px solid rgba(16,185,129,.28)", borderRadius: "14px", padding: "22px", textAlign: "center"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".18em", textTransform: "uppercase", color: "#7E9186", marginBottom: "8px"}}>{V.liveTimerLabel}</div>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "48px", fontWeight: "700", color: "#34D399", lineHeight: "1"}}>{V.timerTxt}</div>
                <div style={{height: "5px", background: "#121A15", borderRadius: "99px", overflow: "hidden", marginTop: "16px"}}>
                  <div style={{height: "100%", width: V.timerPct, background: "#10B981", transition: "width 1s linear"}} />
                </div>
                <div style={{display: "flex", gap: "8px", justifyContent: "center", marginTop: "14px"}}>
                  <button onClick={V.liveAdvance} style={{background: "#10B981", color: "#04120B", border: "none", borderRadius: "9px", padding: "9px 16px", fontSize: "12.5px", fontWeight: "800", cursor: "pointer"}}>{V.liveAdvanceTxt}</button>
                </div>
              </div>
              <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "20px 22px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "12px"}}>Standardized objections</div>
                <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                  {(V.objCards ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}>
                    <div style={{display: "flex", alignItems: "center", gap: "10px", background: "#0B120E", border: `1px solid ${o?.border}`, borderRadius: "10px", padding: "11px 14px", cursor: "pointer"}} onClick={o?.toggle} role="button" tabIndex="0">
                      <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: o?.mark}}>{o?.tick}</span>
                      <span style={{fontSize: "13.5px", color: "#D5DED7"}}>{o?.text}</span>
                    </div>
                  </React.Fragment>))}
                </div>
                <p style={{margin: "12px 0 0", fontSize: "11px", color: "#5C6B61", lineHeight: "1.5"}}>Deliver each objection verbatim. Mark it once used — both rounds draw from the same set.</p>
              </div>
              {V.showCoachCard ? (<>
                <div style={{background: "rgba(16,185,129,.06)", border: "1px solid rgba(16,185,129,.35)", borderRadius: "14px", padding: "20px 22px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#34D399", marginBottom: "10px"}}>Coaching instruction — one specific change</div>
                  <textarea value={(V.coach) ?? ''} onChange={V.setCoach} rows="3" placeholder="e.g. Open with two discovery questions before describing the product." style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "12px", color: "#E9F0EA", fontSize: "13.5px", resize: "vertical"}} />
                  <p style={{margin: "10px 0 0", fontSize: "11px", color: "#5C6B61", lineHeight: "1.5"}}>The candidate gets five minutes to prepare a second attempt. Improvement after coaching is a major part of the coachability score.</p>
                </div>
              </>) : null}
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
              {V.coiNeeded ? (<>
                <div style={{background: "#0F1611", border: "1px solid rgba(245,184,74,.4)", borderRadius: "14px", padding: "22px 24px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#F5B84A", marginBottom: "12px"}}>Before you score — conflict-of-interest declaration</div>
                  <label style={{display: "flex", gap: "12px", alignItems: "flex-start", cursor: "pointer"}}>
                    <input type="checkbox" checked={!!(V.coi)} onChange={V.toggleCoi} style={{accentColor: "#10B981", width: "16px", height: "16px", marginTop: "2px", flexShrink: "0"}} />
                    <span style={{fontSize: "13.5px", lineHeight: "1.55", color: "#D5DED7"}}>I have no personal, family, or prior professional relationship with this candidate, and no stake in the outcome beyond my evaluator role.</span>
                  </label>
                  <p style={{margin: "12px 0 0", fontSize: "11.5px", color: "#5C6B61", lineHeight: "1.5"}}>If you do know the candidate, stop here and ask the talent team to reassign the session. Your declaration is stored with your scores.</p>
                </div>
              </>) : null}
              {V.showScoring ? (<>
                <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
                  <div style={{display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "4px"}}>
                    <div style={{fontSize: "17px", fontWeight: "800"}}>{V.scoreTitle}</div>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "#7E9186"}}>Behaviorally anchored · 1–5</div>
                  </div>
                  <p style={{margin: "0 0 18px", fontSize: "12px", color: "#5C6B61"}}>Score independently. The other evaluator’s ratings stay hidden until you submit.</p>
                  <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                    {(V.scoreRows ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}>
                      <div style={{borderTop: "1px solid rgba(160,190,170,.1)", paddingTop: "16px"}}>
                        <div style={{display: "flex", alignItems: "center", gap: "12px", marginBottom: "9px"}}>
                          <div style={{fontSize: "14.5px", fontWeight: "700", flex: "1"}}>{r?.name}</div>
                          <div style={{display: "flex", gap: "6px"}}>
                            {(r?.chips ?? []).map((c: any, $index: number) => (<React.Fragment key={$index}>
                              <button onClick={c?.on} aria-label={c?.aria} style={{width: "38px", height: "38px", borderRadius: "10px", border: `1px solid ${c?.border}`, background: c?.bg, color: c?.fg, fontSize: "14px", fontWeight: "800", cursor: "pointer"}} className="ps1">{c?.n}</button>
                            </React.Fragment>))}
                          </div>
                        </div>
                        <div style={{fontSize: "12.5px", lineHeight: "1.55", color: "#8FA396", background: "#0B120E", borderRadius: "9px", padding: "10px 13px"}}>{r?.anchor}</div>
                      </div>
                    </React.Fragment>))}
                  </div>
                </div>
                <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px"}}>
                  <div>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "8px"}}>Structured notes</div>
                    <textarea value={(V.notes) ?? ''} onChange={V.setNotes} rows="4" placeholder="Observable behavior only — what was said and done." style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "12px", color: "#E9F0EA", fontSize: "13px", resize: "vertical"}} />
                  </div>
                  <div>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "8px"}}>Evidence citation</div>
                    <textarea value={(V.cite) ?? ''} onChange={V.setCite} rows="4" placeholder="Quote or timestamp the moment that supports each rating." style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "12px", color: "#E9F0EA", fontSize: "13px", resize: "vertical"}} />
                  </div>
                </div>
              </>) : null}
              {V.showRec ? (<>
                <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
                  <div style={{display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px"}}>
                    <div>
                      <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "4px"}}>Round 1 avg</div>
                      <div style={{fontSize: "26px", fontWeight: "900"}}>{V.r1Avg}</div>
                    </div>
                    <div style={{fontSize: "22px", color: "#5C6B61"}}>→</div>
                    <div>
                      <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "4px"}}>Round 2 avg</div>
                      <div style={{fontSize: "26px", fontWeight: "900"}}>{V.r2Avg}</div>
                    </div>
                    <div style={{background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.35)", borderRadius: "10px", padding: "8px 14px"}}>
                      <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".12em", textTransform: "uppercase", color: "#7E9186"}}>Coached improvement</div>
                      <div style={{fontSize: "18px", fontWeight: "900", color: "#34D399"}}>{V.deltaTxt}</div>
                    </div>
                  </div>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "10px"}}>Final recommendation</div>
                  <div style={{display: "flex", gap: "8px", marginBottom: "18px", flexWrap: "wrap"}}>
                    {(V.recBtns ?? []).map((b: any, $index: number) => (<React.Fragment key={$index}>
                      <button onClick={b?.on} style={{background: b?.bg, color: b?.fg, border: `1px solid ${b?.border}`, borderRadius: "10px", padding: "11px 20px", fontSize: "13.5px", fontWeight: "800", cursor: "pointer"}}>{b?.label}</button>
                    </React.Fragment>))}
                  </div>
                  <button onClick={V.submitEval} disabled={!!(V.evalBlocked)} style={{background: V.evalSubmitBg, color: "#04120B", border: "none", borderRadius: "10px", padding: "13px 28px", fontSize: "14px", fontWeight: "800", cursor: "pointer"}}>Submit independent scores</button>
                  <p style={{margin: "10px 0 0", fontSize: "11.5px", color: "#5C6B61"}}>Submitting locks your ratings and reveals the other evaluator’s scores.</p>
                </div>
              </>) : null}
              {V.showCompare ? (<>
                <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
                  <div style={{fontSize: "17px", fontWeight: "800", marginBottom: "4px"}}>Evaluator agreement</div>
                  <p style={{margin: "0 0 16px", fontSize: "12.5px", color: "#8FA396"}}>{V.agreeIntro}</p>
                  <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                    {(V.agreeRows ?? []).map((a: any, $index: number) => (<React.Fragment key={$index}>
                      <div style={{display: "flex", alignItems: "center", gap: "14px", background: a?.bg, border: `1px solid ${a?.border}`, borderRadius: "10px", padding: "12px 16px"}}>
                        <div style={{flex: "1", fontSize: "13.5px", fontWeight: "700"}}>{a?.name}</div>
                        <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", color: "#D5DED7"}}>{"You "}{a?.mine}</div>
                        <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", color: "#8FA396"}}>{(V.otherShort || 'Other') + " "}{a?.other}</div>
                        <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", fontWeight: "700", color: a?.flagColor, width: "130px", textAlign: "right"}}>{a?.flagTxt}</div>
                      </div>
                    </React.Fragment>))}
                  </div>
                  <button onClick={V.goRoster} style={{background: "transparent", color: "#E9F0EA", border: "1px solid rgba(160,190,170,.25)", borderRadius: "10px", padding: "11px 20px", fontSize: "13px", fontWeight: "700", cursor: "pointer", marginTop: "16px"}}>Done — back to sessions</button>
                </div>
              </>) : null}
            </div>
          </div>
        </div>
      </>) : null}
      {V.vIvList ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Structured interviews</h1>
          <p style={{margin: "0 0 24px", fontSize: "14.5px", color: "#A7B5AB", maxWidth: "680px", lineHeight: "1.6"}}>Four fixed questions, one competency each, asked in the same order to every candidate. Probe only with the listed follow-ups. Score each answer right after it, independently.</p>
          <div style={{display: "flex", flexDirection: "column", gap: "12px", maxWidth: "860px"}}>
            {(V.ivList ?? []).map((s: any, $index: number) => (<React.Fragment key={$index}>
              <div style={{display: "flex", alignItems: "center", gap: "18px", background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "18px 22px"}}>
                <div style={{width: "44px", height: "44px", borderRadius: "12px", background: "#121A15", border: "1px solid rgba(160,190,170,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px", color: "#34D399"}}>{s?.initials}</div>
                <div style={{flex: "1"}}>
                  <div style={{fontSize: "16px", fontWeight: "700"}}>{s?.name}</div>
                  <div style={{fontSize: "12.5px", color: "#8FA396", marginTop: "2px"}}>{s?.sub}</div>
                </div>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", letterSpacing: ".1em", textTransform: "uppercase", color: s?.statusColor}}>{s?.status}</div>
                {s?.canRun ? (<>
                  <button onClick={s?.go} style={{background: "#10B981", color: "#04120B", border: "none", borderRadius: "10px", padding: "10px 18px", fontSize: "13px", fontWeight: "800", cursor: "pointer"}}>Open scorecard</button>
                </>) : null}
              </div>
            </React.Fragment>))}
          </div>
        </div>
      </>) : null}
      {V.vIvCard ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <div style={{display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", flexWrap: "wrap"}}>
            <button onClick={V.goIvList} style={{background: "none", border: "none", color: "#8FA396", fontSize: "13px", cursor: "pointer", padding: "0"}} className="ps2">← Interviews</button>
            <h1 style={{margin: "0", fontSize: "24px", fontWeight: "900"}}>{V.ivTitle}</h1>
            <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "#7E9186"}}>{V.ivMeta}</div>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "20px", alignItems: "start"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "14px"}}>
              {(V.ivRows ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}>
                <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
                  <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px"}}>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "#7E9186"}}>{r?.num}</span>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#34D399", background: "rgba(16,185,129,.1)", padding: "3px 8px", borderRadius: "99px"}}>{r?.comp}</span>
                  </div>
                  <div style={{fontSize: "15px", fontWeight: "700", lineHeight: "1.5", marginBottom: "8px"}}>{r?.q}</div>
                  <div style={{fontSize: "12.5px", color: "#8FA396", lineHeight: "1.55", marginBottom: "14px"}}>{"Probes · "}{r?.probes}</div>
                  <div style={{display: "flex", gap: "6px", marginBottom: "9px"}}>
                    {(r?.chips ?? []).map((c: any, $index: number) => (<React.Fragment key={$index}>
                      <button onClick={c?.on} aria-label={c?.aria} style={{width: "38px", height: "38px", borderRadius: "10px", border: `1px solid ${c?.border}`, background: c?.bg, color: c?.fg, fontSize: "14px", fontWeight: "800", cursor: "pointer"}} className="ps1">{c?.n}</button>
                    </React.Fragment>))}
                  </div>
                  <div style={{fontSize: "12.5px", lineHeight: "1.55", color: "#8FA396", background: "#0B120E", borderRadius: "9px", padding: "10px 13px"}}>{r?.anchor}</div>
                </div>
              </React.Fragment>))}
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "14px"}}>
              <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "8px"}}>Structured notes</div>
                <textarea value={(V.ivNotes) ?? ''} onChange={V.setIvNotes} rows="6" placeholder="Observable behavior and direct quotes only — no impressions of personality or fit." style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "12px", color: "#E9F0EA", fontSize: "13px", resize: "vertical"}} />
              </div>
              <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "8px"}}>Submit</div>
                <p style={{margin: "0 0 14px", fontSize: "12.5px", color: "#8FA396", lineHeight: "1.55"}}>{V.ivLockNote}{V.ivProgress}</p>
                {V.ivNotSubmitted ? (<>
                  <button onClick={V.submitIv} disabled={!!(V.ivBlocked)} style={{background: V.ivSubmitBg, color: "#04120B", border: "none", borderRadius: "10px", padding: "13px 24px", fontSize: "14px", fontWeight: "800", cursor: "pointer"}}>Submit independent scores</button>
                </>) : null}
                {V.ivSubmitted ? (<>
                  <div style={{fontSize: "13.5px", fontWeight: "700", color: "#34D399"}}>{V.ivSubmittedNote}</div>
                </>) : null}
              </div>
              <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "10px"}}>Rules of the room</div>
                <div style={{display: "flex", flexDirection: "column", gap: "6px", fontSize: "12.5px", color: "#A7B5AB", lineHeight: "1.55"}}>
                  <div>· Same four questions, same order, every candidate</div>
                  <div>· Only the listed probes — no improvised follow-ups</div>
                  <div>· Score each answer before asking the next question</div>
                  <div>· Nothing about family, health, age, religion, or background</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>) : null}
    </main>
  </>) : null;
}
