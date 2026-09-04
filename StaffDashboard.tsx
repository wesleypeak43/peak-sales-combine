// StaffDashboard — generated from the Peak Sales Combine prototype template. Plain React; edit freely.
// V is the view-model returned by PeakCombine.renderVals(): values, lists, and event handlers.
import React from 'react';


export function StaffDashboard({ V }: { V: any }) {
  return V.isStaff ? (<>
    <main style={{flex: "1", width: "100%", maxWidth: "1280px", margin: "0 auto", padding: "32px 28px 80px", boxSizing: "border-box"}}>
      {V.vFunnel ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 24px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Recruiting funnel</h1>
          <div style={{display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "20px", alignItems: "start"}}>
            <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "24px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "18px"}}>All active campaigns · last 60 days</div>
              <div style={{display: "flex", flexDirection: "column", gap: "14px"}}>
                {(V.funnelRows ?? []).map((f: any, $index: number) => (<React.Fragment key={$index}>
                  <div>
                    <div style={{display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px"}}>
                      <span style={{fontWeight: "700"}}>{f?.label}</span>
                      <span style={{fontFamily: "'JetBrains Mono',monospace", color: "#8FA396"}}>{f?.n}{" · "}{f?.conv}</span>
                    </div>
                    <div style={{height: "22px", background: "#0B120E", borderRadius: "7px", overflow: "hidden"}}>
                      <div style={{height: "100%", width: f?.pct, background: "linear-gradient(90deg,rgba(16,185,129,.4),#10B981)", borderRadius: "7px"}} />
                    </div>
                  </div>
                </React.Fragment>))}
              </div>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "14px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186"}}>{"Open roles & campaigns"}</div>
              {(V.roleCards ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}>
                <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "20px 22px"}}>
                  <div style={{fontSize: "15px", fontWeight: "800"}}>{r?.title}</div>
                  <div style={{fontSize: "12.5px", color: "#8FA396", margin: "4px 0 12px"}}>{r?.prop}</div>
                  <div style={{display: "flex", gap: "16px", fontFamily: "'JetBrains Mono',monospace", fontSize: "11.5px", color: "#A7B5AB"}}>
                    <span>
                      <b style={{color: "#34D399"}}>{r?.open}</b>
                      {" open"}
                    </span>
                    <span>
                      <b style={{color: "#E9F0EA"}}>{r?.apps}</b>
                      {" applicants"}
                    </span>
                    <span style={{color: "#7E9186"}}>{r?.stage}</span>
                  </div>
                </div>
              </React.Fragment>))}
            </div>
          </div>
        </div>
      </>) : null}
      {V.vPipe ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <div style={{display: "flex", alignItems: "center", gap: "18px", marginBottom: "20px", flexWrap: "wrap"}}>
            <h1 style={{margin: "0", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Candidate pipeline</h1>
            <label style={{display: "flex", alignItems: "center", gap: "9px", marginLeft: "auto", cursor: "pointer", background: "#0F1611", border: "1px solid rgba(160,190,170,.15)", borderRadius: "99px", padding: "8px 16px"}}>
              <input type="checkbox" checked={!!(V.blind)} onChange={V.toggleBlind} style={{accentColor: "#10B981", width: "15px", height: "15px"}} />
              <span style={{fontSize: "12.5px", fontWeight: "700", color: V.blindColor}}>{"Blind review "}{V.blindState}</span>
            </label>
          </div>
          <p style={{margin: "0 0 18px", fontSize: "12.5px", color: "#8FA396", maxWidth: "720px", lineHeight: "1.55"}}>Blind review hides names, photos, and school names during early screening. Candidates are compared against the role standard — never ranked by prestige, polish, or similarity to current leaders.</p>
          <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", overflow: "hidden"}}>
            <div style={{display: "grid", gridTemplateColumns: "2fr 1.6fr 1.8fr .8fr .9fr auto", gap: "12px", padding: "12px 22px", borderBottom: "1px solid rgba(160,190,170,.12)", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".12em", textTransform: "uppercase", color: "#7E9186"}}>
              <div>Candidate</div>
              <div>Role</div>
              <div>Stage</div>
              <div>Readiness</div>
              <div>Agreement</div>
              <div>Actions</div>
            </div>
            {(V.pipeRows ?? []).map((p: any, $index: number) => (<React.Fragment key={$index}>
              <div style={{display: "grid", gridTemplateColumns: "2fr 1.6fr 1.8fr .8fr .9fr auto", gap: "12px", padding: "15px 22px", borderBottom: "1px solid rgba(160,190,170,.07)", alignItems: "center"}} className="ps6">
                <div>
                  <div style={{fontSize: "14.5px", fontWeight: "700"}}>{p?.dName}</div>
                  <div style={{fontSize: "11.5px", color: "#5C6B61"}}>{p?.dSub}</div>
                </div>
                <div style={{fontSize: "12.5px", color: "#A7B5AB"}}>{p?.role}</div>
                <div style={{fontSize: "12px", color: p?.stageColor, fontWeight: "600"}}>{p?.stageLabel}</div>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "15px", fontWeight: "700", color: p?.readColor}}>{p?.readiness}</div>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", fontWeight: "700", color: p?.agreeColor}}>{p?.agree}</div>
                <div style={{display: "flex", gap: "6px", flexWrap: "wrap"}}>
                  <button onClick={p?.openProfile} style={{background: "transparent", color: "#34D399", border: "1px solid rgba(16,185,129,.35)", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer"}}>Profile</button>
                  {p?.canReview ? (<>
                    <button onClick={p?.review} style={{background: "#10B981", color: "#04120B", border: "none", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "800", cursor: "pointer"}}>Review application</button>
                  </>) : null}
                  <button onClick={p?.pickCmp} disabled={!!(p?.noCmp)} style={{background: p?.cmpBg, color: p?.cmpFg, border: "1px solid rgba(160,190,170,.2)", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer"}}>{p?.cmpTxt}</button>
                  {V.canViewAs ? (<>
                    <button onClick={p?.viewAs} title="Open this candidate's portal read-only (logged)" style={{background: "transparent", color: "#5B9BFF", border: "1px solid rgba(91,155,255,.35)", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer"}}>View as</button>
                  </>) : null}
                </div>
              </div>
            </React.Fragment>))}
          </div>
          {V.canCompare ? (<>
            <div style={{display: "flex", alignItems: "center", gap: "14px", marginTop: "14px", background: "rgba(16,185,129,.07)", border: "1px solid rgba(16,185,129,.3)", borderRadius: "12px", padding: "14px 20px"}}>
              <span style={{fontSize: "13.5px", fontWeight: "700"}}>{V.cmpBarTxt}</span>
              <button onClick={V.goCompare} style={{background: "#10B981", color: "#04120B", border: "none", borderRadius: "9px", padding: "9px 18px", fontSize: "13px", fontWeight: "800", cursor: "pointer", marginLeft: "auto"}}>Compare side-by-side</button>
              <button onClick={V.clearCmp} style={{background: "none", border: "none", color: "#8FA396", fontSize: "12.5px", cursor: "pointer"}}>Clear</button>
            </div>
          </>) : null}
        </div>
      </>) : null}
      {V.vProfile ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <button onClick={V.goPipe} style={{background: "none", border: "none", color: "#8FA396", fontSize: "13px", cursor: "pointer", padding: "0", marginBottom: "16px"}} className="ps2">← Pipeline</button>
          <div style={{display: "flex", alignItems: "center", gap: "20px", marginBottom: "22px", flexWrap: "wrap"}}>
            <div>
              <h1 style={{margin: "0", fontSize: "28px", fontWeight: "900", letterSpacing: "-.015em"}}>{V.pName}</h1>
              <div style={{fontSize: "13px", color: "#8FA396", marginTop: "4px"}}>{V.pSub}</div>
            </div>
            <div style={{marginLeft: "auto", display: "flex", alignItems: "center", gap: "20px"}}>
              {V.canViewAs ? (<>
                <button onClick={V.pViewAs} style={{background: "transparent", color: "#5B9BFF", border: "1px solid rgba(91,155,255,.35)", borderRadius: "9px", padding: "9px 14px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer"}}>View as candidate</button>
              </>) : null}
              <div style={{textAlign: "right"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".16em", textTransform: "uppercase", color: "#7E9186"}}>Peak Sales Readiness</div>
                <div style={{fontFamily: "'Barlow Condensed',sans-serif", fontSize: "60px", fontWeight: "800", color: "#34D399", lineHeight: "1"}}>
                  {V.pReadiness}
                  <span style={{fontSize: "18px", color: "#5C6B61"}}>{" / 5"}</span>
                </div>
              </div>
            </div>
          </div>
          {V.pHasReport ? (<>
            <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "24px 26px", marginBottom: "20px"}}>
              <div style={{display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap"}}>
                <div style={{minWidth: "200px", maxWidth: "280px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186"}}>Sales decisions · scouting report</div>
                  <div style={{display: "flex", alignItems: "baseline", gap: "8px", marginTop: "8px"}}>
                    <span style={{fontFamily: "'Barlow Condensed',sans-serif", fontSize: "84px", fontWeight: "800", lineHeight: ".85", color: V.rpColor}}>{V.rpOverall}</span>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", color: "#5C6B61"}}>/ 100</span>
                  </div>
                  <div style={{marginTop: "12px"}}>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "#04120B", padding: "4px 10px", borderRadius: "99px", background: V.rpColor}}>{V.rpBand}</span>
                  </div>
                  <p style={{margin: "10px 0 0", fontSize: "12.5px", color: "#A7B5AB", lineHeight: "1.55"}}>{V.rpNote}</p>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase", color: "#5C6B61", marginTop: "12px", lineHeight: "1.5"}}>{V.rpProfile}</div>
                  <div style={{fontSize: "11.5px", color: "#5C6B61", marginTop: "4px"}}>{V.rpScen}</div>
                </div>
                <div style={{flex: "1", minWidth: "320px"}}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px", gap: "12px", flexWrap: "wrap"}}>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186"}}>Competencies · ▏ floor · ★ critical</div>
                    <div style={{fontSize: "11px", color: "#5C6B61"}}>self-report + scenarios, 0–100</div>
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                    {(V.rpComps ?? []).map((c: any, $index: number) => (<React.Fragment key={$index}>
                      <div>
                        <div style={{display: "flex", justifyContent: "space-between", fontSize: "12.5px", marginBottom: "4px", gap: "10px"}}>
                          <span style={{fontWeight: "600"}}>
                            {c?.name}{" "}
                            <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: "#5C6B61", marginLeft: "4px"}}>{c?.meta}</span>
                          </span>
                          <span style={{fontFamily: "'JetBrains Mono',monospace", fontWeight: "700", color: c?.color}}>{c?.scoreTxt}</span>
                        </div>
                        <div style={{position: "relative", height: "8px", background: "#0B120E", borderRadius: "99px"}}>
                          <div style={{position: "absolute", left: "0", top: "0", height: "100%", width: c?.pct, background: c?.color, borderRadius: "99px"}} />
                          <div style={{position: "absolute", left: c?.floorPct, top: "-3px", width: "2px", height: "14px", background: "rgba(233,240,234,.5)"}} />
                        </div>
                      </div>
                    </React.Fragment>))}
                  </div>
                </div>
              </div>
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "14px", marginTop: "22px"}}>
                <div style={{background: "#0B120E", borderRadius: "12px", padding: "16px 18px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#F87171", marginBottom: "10px"}}>{"Red flags · "}{V.rpFlagCount}</div>
                  {V.rpNoFlags ? (<>
                    <div style={{fontSize: "12.5px", color: "#8FA396", lineHeight: "1.5"}}>None — no chosen option carried a red-flag label.</div>
                  </>) : null}
                  <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                    {(V.rpFlags ?? []).map((f: any, $index: number) => (<React.Fragment key={$index}>
                      <div>
                        <div style={{display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap"}}>
                          <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: f?.fg, padding: "3px 7px", borderRadius: "99px", background: f?.bg}}>{f?.sev}</span>
                          <span style={{fontSize: "13px", fontWeight: "700"}}>{f?.label}</span>
                        </div>
                        <div style={{fontSize: "12px", color: "#8FA396", lineHeight: "1.5", marginTop: "4px"}}>{f?.context}</div>
                      </div>
                    </React.Fragment>))}
                  </div>
                </div>
                <div style={{background: "#0B120E", borderRadius: "12px", padding: "16px 18px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#34D399", marginBottom: "10px"}}>{"Positive signals · "}{V.rpPosCount}</div>
                  <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                    {(V.rpPositives ?? []).map((s: any, $index: number) => (<React.Fragment key={$index}>
                      <div style={{fontSize: "12.5px", color: "#D5DED7", lineHeight: "1.5"}}>
                        {"· "}{s?.label}{" "}
                        <span style={{color: "#5C6B61"}}>{"— "}{s?.comp}</span>
                      </div>
                    </React.Fragment>))}
                  </div>
                </div>
                <div style={{background: "#0B120E", borderRadius: "12px", padding: "16px 18px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#F5B84A", marginBottom: "10px"}}>Read with care</div>
                  {V.rpNoConsistency ? (<>
                    <div style={{fontSize: "12.5px", color: "#8FA396", lineHeight: "1.5"}}>Self-ratings and scenario choices are consistent.</div>
                  </>) : null}
                  <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                    {(V.rpConsistency ?? []).map((s: any, $index: number) => (<React.Fragment key={$index}>
                      <div style={{fontSize: "12.5px", color: "#D5DED7", lineHeight: "1.55"}}>{s?.t}</div>
                    </React.Fragment>))}
                  </div>
                </div>
              </div>
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "14px", marginTop: "14px"}}>
                <div style={{background: "#0B120E", borderRadius: "12px", padding: "16px 18px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "10px"}}>Suggested interview follow-ups</div>
                  <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                    {(V.rpFollowUps ?? []).map((f: any, $index: number) => (<React.Fragment key={$index}>
                      <div>
                        <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", letterSpacing: ".06em", color: "#34D399"}}>{f?.comp}{" · "}{f?.why}</div>
                        <div style={{fontSize: "13px", color: "#D5DED7", lineHeight: "1.55", marginTop: "3px"}}>{f?.q}</div>
                      </div>
                    </React.Fragment>))}
                  </div>
                </div>
                <div style={{background: "#0B120E", borderRadius: "12px", padding: "16px 18px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "10px"}}>Reference-call prompts</div>
                  <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                    {(V.rpRefs ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}>
                      <div>
                        <div style={{fontSize: "13px", color: "#D5DED7", lineHeight: "1.55"}}>{r?.text}</div>
                        <div style={{fontSize: "11.5px", color: "#5C6B61", marginTop: "2px"}}>{r?.hint}</div>
                      </div>
                    </React.Fragment>))}
                  </div>
                </div>
              </div>
              <p style={{margin: "16px 0 0", fontSize: "11px", color: "#5C6B61", lineHeight: "1.5"}}>{"Signal from the candidate’s own decisions, scored against the "}{V.rpProfName}{" profile’s floors and weights (Weights tab). It sharpens the interview and the combine; it does not make the decision, and the candidate never sees it."}</p>
            </div>
          </>) : null}
          {V.pHasData ? (<>
            <div style={{display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "20px", alignItems: "start"}}>
              <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px"}}>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186"}}>Eight competencies</div>
                    <div style={{fontSize: "11px", color: "#5C6B61"}}>▏ tick = role standard (3.5)</div>
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                    {(V.pBars ?? []).map((b: any, $index: number) => (<React.Fragment key={$index}>
                      <div>
                        <div style={{display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "5px"}}>
                          <span style={{fontWeight: "600"}}>{b?.name}</span>
                          <span style={{fontFamily: "'JetBrains Mono',monospace", color: b?.valColor, fontWeight: "700"}}>{b?.valTxt}</span>
                        </div>
                        <div style={{position: "relative", height: "9px", background: "#0B120E", borderRadius: "99px"}}>
                          <div style={{position: "absolute", left: "0", top: "0", height: "100%", width: b?.pct, background: b?.fill, borderRadius: "99px"}} />
                          <div style={{position: "absolute", left: "70%", top: "-3px", width: "2px", height: "15px", background: "rgba(233,240,234,.45)"}} />
                        </div>
                      </div>
                    </React.Fragment>))}
                  </div>
                </div>
                <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "14px"}}>Structured evidence — Application Q1 (SAR-L)</div>
                  <div style={{display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", lineHeight: "1.6"}}>
                    <div>
                      <b style={{color: "#34D399"}}>Situation</b>
                      {" · "}
                      <span style={{color: "#D5DED7"}}>{V.pSarS}</span>
                    </div>
                    <div>
                      <b style={{color: "#34D399"}}>Action</b>
                      {" · "}
                      <span style={{color: "#D5DED7"}}>{V.pSarA}</span>
                    </div>
                    <div>
                      <b style={{color: "#34D399"}}>Result</b>
                      {" · "}
                      <span style={{color: "#D5DED7"}}>{V.pSarR}</span>
                    </div>
                    <div>
                      <b style={{color: "#34D399"}}>Learning</b>
                      {" · "}
                      <span style={{color: "#D5DED7"}}>{V.pSarL}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "20px 22px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "12px"}}>Evidence strength by source</div>
                  <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                    {(V.pStrength ?? []).map((s: any, $index: number) => (<React.Fragment key={$index}>
                      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12.5px"}}>
                        <span style={{color: "#A7B5AB"}}>{s?.src}</span>
                        <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "700", letterSpacing: ".08em", textTransform: "uppercase", color: s?.color, background: s?.bg, padding: "3px 9px", borderRadius: "99px"}}>{s?.level}</span>
                      </div>
                    </React.Fragment>))}
                  </div>
                </div>
                <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "20px 22px"}}>
                  <div style={{display: "flex", gap: "18px", alignItems: "center", marginBottom: "6px"}}>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186"}}>R1 → coached re-pitch</div>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", fontWeight: "700", color: V.pAgreeColor}}>{V.pAgreeTxt}</div>
                  </div>
                  <div style={{display: "flex", alignItems: "baseline", gap: "12px"}}>
                    <span style={{fontSize: "26px", fontWeight: "900"}}>{V.pR1}</span>
                    <span style={{color: "#5C6B61"}}>→</span>
                    <span style={{fontSize: "26px", fontWeight: "900"}}>{V.pR2}</span>
                    <span style={{fontSize: "15px", fontWeight: "800", color: V.pDeltaColor}}>{V.pDelta}</span>
                  </div>
                </div>
                <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "20px 22px", display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px", lineHeight: "1.6"}}>
                  <div>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#34D399", marginBottom: "5px"}}>Strongest evidence</div>
                    <span style={{color: "#D5DED7"}}>{V.pStrongest}</span>
                  </div>
                  <div>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#F87171", marginBottom: "5px"}}>Material concerns</div>
                    <span style={{color: "#D5DED7"}}>{V.pConcerns}</span>
                  </div>
                  <div>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#F5B84A", marginBottom: "5px"}}>Unanswered questions</div>
                    <span style={{color: "#D5DED7"}}>{V.pOpen}</span>
                  </div>
                </div>
                <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "20px 22px"}}>
                  <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px"}}>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", flex: "1"}}>Hiring decision</div>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "#7E9186", border: "1px solid rgba(160,190,170,.2)", padding: "3px 8px", borderRadius: "99px"}}>{V.decRoleTag}</span>
                  </div>
                  {V.decRecorded ? (<>
                    <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap"}}>
                      <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "#04120B", padding: "4px 10px", borderRadius: "99px", background: V.decColor}}>{V.decLabel}</span>
                      <span style={{fontSize: "12px", color: "#8FA396"}}>{V.decMeta}</span>
                    </div>
                    <p style={{margin: "0", fontSize: "13px", color: "#D5DED7", lineHeight: "1.6"}}>{V.decRationale}</p>
                  </>) : null}
                  {V.decEditable ? (<>
                    <div style={{display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px"}}>
                      {(V.pRecBtns ?? []).map((b: any, $index: number) => (<React.Fragment key={$index}>
                        <button onClick={b?.on} style={{background: b?.bg, color: b?.fg, border: `1px solid ${b?.border}`, borderRadius: "10px", padding: "10px 16px", fontSize: "12.5px", fontWeight: "800", cursor: "pointer"}}>{b?.label}</button>
                      </React.Fragment>))}
                    </div>
                    <textarea value={(V.decNote) ?? ''} onChange={V.setDecNote} rows="3" placeholder="Required — the evidence this decision rests on: exercises, interview answers, evaluator agreement." style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "12px", color: "#E9F0EA", fontSize: "13px", resize: "vertical"}} />
                    <button onClick={V.recordDecision} disabled={!!(V.decBlocked)} style={{background: V.decBtnBg, color: "#04120B", border: "none", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "800", cursor: "pointer", marginTop: "10px"}}>Record decision</button>
                  </>) : null}
                  {V.decReadOnly ? (<>
                    <p style={{margin: "0", fontSize: "12.5px", color: "#8FA396", lineHeight: "1.55"}}>No decision recorded yet. Decisions are recorded by the hiring manager or admin; your role can read the decision log but not change it.</p>
                  </>) : null}
                  <p style={{margin: "12px 0 0", fontSize: "11px", color: "#5C6B61", lineHeight: "1.5"}}>Every decision is logged with who, when, rationale, and the evaluator-agreement snapshot, then emailed to the candidate. No candidate is auto-rejected by the inventory or any generated summary.</p>
                </div>
              </div>
            </div>
          </>) : null}
          {V.pNoData ? (<>
            <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "32px", maxWidth: "560px"}}>
              <div style={{fontSize: "16px", fontWeight: "800", marginBottom: "6px"}}>Insufficient evidence so far</div>
              <p style={{margin: "0", fontSize: "13.5px", color: "#8FA396", lineHeight: "1.6"}}>{V.pStageLabel}. Competency scores appear once the sales decisions and at least one combine exercise are complete — partial data is never extrapolated into a readiness score.</p>
            </div>
          </>) : null}
        </div>
      </>) : null}
      {V.vCompare ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <button onClick={V.goPipe} style={{background: "none", border: "none", color: "#8FA396", fontSize: "13px", cursor: "pointer", padding: "0", marginBottom: "16px"}} className="ps2">← Pipeline</button>
          <h1 style={{margin: "0 0 6px", fontSize: "28px", fontWeight: "900", letterSpacing: "-.015em"}}>Side-by-side comparison</h1>
          <p style={{margin: "0 0 22px", fontSize: "13px", color: "#8FA396", maxWidth: "700px", lineHeight: "1.6"}}>Both candidates are measured against the role standard (3.5) — not against each other’s style, school, or polish.</p>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px"}}>
            <div style={{background: "#0F1611", border: "1px solid rgba(16,185,129,.3)", borderRadius: "14px", padding: "18px 22px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#34D399", marginBottom: "6px"}}>Candidate A</div>
              <div style={{fontSize: "18px", fontWeight: "800"}}>{V.cmpAName}</div>
              <div style={{fontSize: "12.5px", color: "#8FA396", marginTop: "2px"}}>{"Readiness "}{V.cmpARead}{" · "}{V.cmpASub}</div>
            </div>
            <div style={{background: "#0F1611", border: "1px solid rgba(91,155,255,.35)", borderRadius: "14px", padding: "18px 22px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#5B9BFF", marginBottom: "6px"}}>Candidate B</div>
              <div style={{fontSize: "18px", fontWeight: "800"}}>{V.cmpBName}</div>
              <div style={{fontSize: "12.5px", color: "#8FA396", marginTop: "2px"}}>{"Readiness "}{V.cmpBRead}{" · "}{V.cmpBSub}</div>
            </div>
          </div>
          <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "24px"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "14px"}}>
              {(V.cmpRows ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}>
                <div>
                  <div style={{display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "5px"}}>
                    <span style={{fontWeight: "700"}}>{r?.name}</span>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "12px"}}>
                      <span style={{color: "#34D399"}}>{r?.aTxt}</span>
                      {" "}
                      <span style={{color: "#5C6B61"}}>vs</span>
                      {" "}
                      <span style={{color: "#5B9BFF"}}>{r?.bTxt}</span>
                    </span>
                  </div>
                  <div style={{position: "relative", height: "8px", background: "#0B120E", borderRadius: "99px", marginBottom: "4px"}}>
                    <div style={{position: "absolute", height: "100%", width: r?.aPct, background: "#10B981", borderRadius: "99px", opacity: ".9"}} />
                    <div style={{position: "absolute", left: "70%", top: "-3px", width: "2px", height: "14px", background: "rgba(233,240,234,.45)"}} />
                  </div>
                  <div style={{position: "relative", height: "8px", background: "#0B120E", borderRadius: "99px"}}>
                    <div style={{position: "absolute", height: "100%", width: r?.bPct, background: "#5B9BFF", borderRadius: "99px", opacity: ".85"}} />
                    <div style={{position: "absolute", left: "70%", top: "-3px", width: "2px", height: "14px", background: "rgba(233,240,234,.45)"}} />
                  </div>
                </div>
              </React.Fragment>))}
            </div>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px"}}>
            <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "20px 22px", fontSize: "13px", lineHeight: "1.6"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#34D399", marginBottom: "6px"}}>Strongest evidence</div>
              <span style={{color: "#D5DED7"}}>{V.cmpAStrong}</span>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#F87171", margin: "14px 0 6px"}}>Material concerns</div>
              <span style={{color: "#D5DED7"}}>{V.cmpAConcern}</span>
            </div>
            <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "20px 22px", fontSize: "13px", lineHeight: "1.6"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#34D399", marginBottom: "6px"}}>Strongest evidence</div>
              <span style={{color: "#D5DED7"}}>{V.cmpBStrong}</span>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#F87171", margin: "14px 0 6px"}}>Material concerns</div>
              <span style={{color: "#D5DED7"}}>{V.cmpBConcern}</span>
            </div>
          </div>
        </div>
      </>) : null}
      {V.vBank ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>{"Assessment & question bank"}</h1>
          <p style={{margin: "0 0 22px", fontSize: "13px", color: "#8FA396", maxWidth: "700px", lineHeight: "1.6"}}>Every scenario and scoring key is editable and version-controlled. Cohorts are locked to the version they completed — edits create a new version, never rewrite history.</p>
          <div style={{display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center"}}>
            <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginRight: "6px"}}>Profile</span>
            {(V.bkProfChips ?? []).map((c: any, $index: number) => (<React.Fragment key={$index}>
              <button onClick={c?.on} style={{background: c?.bg, color: c?.fg, border: "1px solid rgba(160,190,170,.2)", borderRadius: "99px", padding: "8px 16px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer"}}>{c?.label}</button>
            </React.Fragment>))}
          </div>
          <div style={{display: "grid", gridTemplateColumns: "320px 1fr", gap: "20px", alignItems: "start"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              {(V.bankList ?? []).map((b: any, $index: number) => (<React.Fragment key={$index}>
                <div onClick={b?.pick} role="button" tabIndex="0" style={{display: "flex", alignItems: "center", gap: "12px", background: b?.bg, border: `1px solid ${b?.border}`, borderRadius: "12px", padding: "14px 16px", cursor: "pointer"}}>
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "#7E9186"}}>{b?.num}</span>
                  <span style={{flex: "1", fontSize: "13.5px", fontWeight: "700"}}>{b?.title}</span>
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: "#34D399", background: "rgba(16,185,129,.1)", padding: "3px 8px", borderRadius: "99px"}}>{b?.ver}</span>
                </div>
              </React.Fragment>))}
            </div>
            <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "24px"}}>
              <div style={{display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px"}}>
                <div style={{fontSize: "17px", fontWeight: "800", flex: "1"}}>{V.bankTitle}</div>
                <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "#34D399"}}>{V.bankVerTxt}</span>
              </div>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "7px"}}>Scenario stem</div>
              <textarea value={(V.bankStem) ?? ''} onChange={V.setBankStem} rows="3" style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "12px", color: "#E9F0EA", fontSize: "13.5px", lineHeight: "1.55", resize: "vertical", marginBottom: "16px"}} />
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "7px"}}>{"Response options & scoring key"}</div>
              <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                {(V.bankOpts ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}>
                  <div style={{display: "flex", gap: "10px", alignItems: "flex-start"}}>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", color: "#7E9186", paddingTop: "13px"}}>{o?.letter}</span>
                    <textarea value={(o?.val) ?? ''} onChange={o?.set} rows="2" style={{flex: "1", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "11px", color: "#E9F0EA", fontSize: "13px", lineHeight: "1.5", resize: "vertical"}} />
                    <div style={{display: "flex", flexDirection: "column", gap: "5px", paddingTop: "6px"}}>
                      <button onClick={o?.setBest} style={{background: o?.bestBg, color: o?.bestFg, border: "1px solid rgba(16,185,129,.35)", borderRadius: "7px", padding: "5px 10px", fontSize: "10.5px", fontWeight: "700", cursor: "pointer"}}>Best</button>
                      <button onClick={o?.setWorst} style={{background: o?.worstBg, color: o?.worstFg, border: "1px solid rgba(245,184,74,.35)", borderRadius: "7px", padding: "5px 10px", fontSize: "10.5px", fontWeight: "700", cursor: "pointer"}}>Worst</button>
                    </div>
                  </div>
                </React.Fragment>))}
              </div>
              <div style={{display: "flex", alignItems: "center", gap: "14px", marginTop: "18px"}}>
                <button onClick={V.saveBank} style={{background: "#10B981", color: "#04120B", border: "none", borderRadius: "10px", padding: "12px 22px", fontSize: "13.5px", fontWeight: "800", cursor: "pointer"}}>{"Save as "}{V.bankNextVer}</button>
                <span style={{fontSize: "12.5px", color: "#34D399", fontWeight: "700"}}>{V.bankSavedNote}</span>
                <span style={{fontSize: "11.5px", color: "#5C6B61", marginLeft: "auto"}}>Cohort 2026-B is locked to v1.2</span>
              </div>
            </div>
          </div>
        </div>
      </>) : null}
      {V.vWeights ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>{"Scoring weights & evidence matrix"}</h1>
          <p style={{margin: "0 0 22px", fontSize: "13px", color: "#8FA396", maxWidth: "720px", lineHeight: "1.6"}}>Each evidence source contributes to only the competencies it can legitimately measure — the matrix prevents the same evidence from being counted twice.</p>
          <div style={{display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center"}}>
            <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginRight: "6px"}}>Rubric for</span>
            {(V.wRoleChips ?? []).map((c: any, $index: number) => (<React.Fragment key={$index}>
              <button onClick={c?.on} style={{background: c?.bg, color: c?.fg, border: "1px solid rgba(160,190,170,.2)", borderRadius: "99px", padding: "8px 16px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer"}}>{c?.label}</button>
            </React.Fragment>))}
          </div>
          <div style={{display: "grid", gridTemplateColumns: "420px 1fr", gap: "20px", alignItems: "start"}}>
            <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "24px"}}>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "18px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186"}}>Source weights</div>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", fontWeight: "700", color: V.wSumColor}}>{"Σ "}{V.wSum}%</div>
              </div>
              <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                {(V.wRows ?? []).map((w: any, $index: number) => (<React.Fragment key={$index}>
                  <div>
                    <div style={{display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px"}}>
                      <span style={{fontWeight: "600"}}>{w?.label}</span>
                      <span style={{fontFamily: "'JetBrains Mono',monospace", color: "#34D399", fontWeight: "700"}}>{w?.val}%</span>
                    </div>
                    <input type="range" min="0" max="40" value={(w?.val) ?? ''} onChange={w?.set} style={{width: "100%", accentColor: "#10B981"}} />
                  </div>
                </React.Fragment>))}
              </div>
              <p style={{margin: "16px 0 0", fontSize: "11px", color: "#5C6B61", lineHeight: "1.55"}}>{V.wNote}</p>
            </div>
            <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "24px", overflowX: "auto"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "16px"}}>Source × competency matrix</div>
              <div style={{display: "grid", gridTemplateColumns: "200px repeat(8,1fr)", gap: "6px", alignItems: "center", minWidth: "640px"}}>
                <div />
                {(V.mHead ?? []).map((h: any, $index: number) => (<React.Fragment key={$index}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", letterSpacing: ".05em", textTransform: "uppercase", color: "#7E9186", textAlign: "center"}}>{h}</div>
                </React.Fragment>))}
                {(V.mRows ?? []).map((m: any, $index: number) => (<React.Fragment key={$index}>
                  <div style={{fontSize: "12px", fontWeight: "600", color: "#A7B5AB"}}>{m?.label}</div>
                  {(m?.cells ?? []).map((c: any, $index: number) => (<React.Fragment key={$index}>
                    <div style={{height: "30px", borderRadius: "7px", background: c?.bg, border: `1px solid ${c?.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#34D399"}}>{c?.mark}</div>
                  </React.Fragment>))}
                </React.Fragment>))}
              </div>
              <p style={{margin: "16px 0 0", fontSize: "11px", color: "#5C6B61", lineHeight: "1.55"}}>Sales decisions (self-report + scenarios) count once, as one source. The combine and interview carry the majority of the weight because they are observed, not self-reported.</p>
            </div>
          </div>
          <div style={{marginTop: "20px", background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "24px"}}>
            <div style={{display: "flex", alignItems: "baseline", gap: "14px", flexWrap: "wrap", marginBottom: "6px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186"}}>{"Sales decisions scoring · "}{V.bkProfName}{" profile"}</div>
              <button onClick={V.bkReset} style={{marginLeft: "auto", background: "transparent", color: "#8FA396", border: "1px solid rgba(160,190,170,.22)", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer"}} className="ps2">Reset to defaults</button>
            </div>
            <p style={{margin: "0 0 18px", fontSize: "12.5px", color: "#8FA396", maxWidth: "760px", lineHeight: "1.6"}}>{V.bkProfTag}{" Applies to every role mapped to this profile; changing a floor or threshold re-scores every scouting report instantly and is written to the audit history."}</p>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "12px"}}>
              {(V.bkThresh ?? []).map((t: any, $index: number) => (<React.Fragment key={$index}>
                <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#7E9186"}}>
                  <span>{t?.label}</span>
                  <input type="number" min="0" max="100" value={(t?.val) ?? ''} onChange={t?.set} style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "11px 12px", color: "#E9F0EA", fontSize: "13px"}} />
                </label>
              </React.Fragment>))}
            </div>
            <div style={{display: "grid", gridTemplateColumns: "1.5fr 1.2fr 1.2fr auto auto", gap: "10px 18px", alignItems: "center", marginTop: "20px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186"}}>Competency</div>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186"}}>Weight</div>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186"}}>Floor</div>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186"}}>Critical</div>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186"}}>Scored</div>
              {(V.bkCompRows ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}>
                <div style={{fontSize: "13px", fontWeight: "700"}}>{r?.name}</div>
                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                  <input type="range" min="0" max="30" value={(r?.w) ?? ''} onChange={r?.setW} style={{flex: "1", accentColor: "#10B981"}} />
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "#34D399", width: "34px", textAlign: "right"}}>{r?.w}%</span>
                </div>
                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                  <input type="range" min="20" max="80" value={(r?.floor) ?? ''} onChange={r?.setFloor} style={{flex: "1", accentColor: "#F5B84A"}} />
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "#E9D9B0", width: "34px", textAlign: "right"}}>{r?.floor}</span>
                </div>
                <button onClick={r?.toggleCrit} style={{background: r?.critBg, color: r?.critFg, border: "1px solid rgba(160,190,170,.2)", borderRadius: "8px", padding: "6px 10px", fontSize: "11.5px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap"}}>{r?.critTxt}</button>
                <button onClick={r?.toggleScored} style={{background: r?.scoredBg, color: r?.scoredFg, border: "1px solid rgba(160,190,170,.2)", borderRadius: "8px", padding: "6px 10px", fontSize: "11.5px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap"}}>{r?.scoredTxt}</button>
              </React.Fragment>))}
            </div>
            <p style={{margin: "16px 0 0", fontSize: "11px", color: "#5C6B61", lineHeight: "1.55"}}>{"Weights Σ "}{V.bkWSum}. A candidate below a critical floor is capped at “Validate in interview” whatever the overall score — the average never hides the risk. Bands describe evidence; only the hiring panel decides.</p>
          </div>
        </div>
      </>) : null}
      {V.vCalib ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Evaluator calibration</h1>
          <p style={{margin: "0 0 22px", fontSize: "13px", color: "#8FA396", maxWidth: "700px", lineHeight: "1.6"}}>Any two evaluators differing by more than 1.5 points on a competency triggers a flag. Flags are resolved in a calibration discussion — never averaged away silently.</p>
          <div style={{display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "20px", alignItems: "start"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "14px"}}>
              <div style={{background: "rgba(245,184,74,.05)", border: "1px solid rgba(245,184,74,.35)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px"}}>
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "#04120B", background: "#F5B84A", padding: "4px 10px", borderRadius: "99px"}}>Open flag</span>
                  <span style={{fontSize: "15px", fontWeight: "800"}}>Marcus Reeves — Self-Accountability</span>
                </div>
                <div style={{display: "flex", gap: "24px", marginBottom: "14px"}}>
                  <div>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".12em", textTransform: "uppercase", color: "#7E9186"}}>J. Whitfield</div>
                    <div style={{fontSize: "26px", fontWeight: "900"}}>4.0</div>
                  </div>
                  <div>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".12em", textTransform: "uppercase", color: "#7E9186"}}>R. Delgado</div>
                    <div style={{fontSize: "26px", fontWeight: "900"}}>2.0</div>
                  </div>
                  <div>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".12em", textTransform: "uppercase", color: "#F5B84A"}}>Delta</div>
                    <div style={{fontSize: "26px", fontWeight: "900", color: "#F5B84A"}}>2.0</div>
                  </div>
                </div>
                <p style={{margin: "0 0 14px", fontSize: "12.5px", color: "#A7B5AB", lineHeight: "1.6"}}>Delgado cites the interview: “attributed the missed Q3 target entirely to territory; named no personal change when asked twice.” Whitfield weighted the polished simulation more heavily.</p>
                <button style={{background: "#F5B84A", color: "#04120B", border: "none", borderRadius: "10px", padding: "10px 18px", fontSize: "13px", fontWeight: "800", cursor: "pointer"}}>Schedule calibration discussion</button>
              </div>
              <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "20px 24px"}}>
                <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "#34D399", background: "rgba(16,185,129,.12)", padding: "4px 10px", borderRadius: "99px"}}>Resolved</span>
                  <span style={{fontSize: "14px", fontWeight: "700"}}>Dana Okafor — all competencies within 0.5</span>
                </div>
              </div>
            </div>
            <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "14px"}}>Evaluator tendencies · last 90 days</div>
              <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                {(V.calRows ?? []).map((e: any, $index: number) => (<React.Fragment key={$index}>
                  <div style={{display: "flex", alignItems: "center", gap: "14px", fontSize: "13px"}}>
                    <span style={{flex: "1", fontWeight: "600"}}>{e?.name}</span>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", color: "#8FA396"}}>{"avg "}{e?.avg}</span>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: e?.color}}>{e?.note}</span>
                  </div>
                </React.Fragment>))}
              </div>
              <p style={{margin: "16px 0 0", fontSize: "11px", color: "#5C6B61", lineHeight: "1.55"}}>Tendencies inform training, not score adjustments. Scores are never silently re-weighted by evaluator.</p>
            </div>
          </div>
        </div>
      </>) : null}
      {V.vValid ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Outcome validation</h1>
          <p style={{margin: "0 0 18px", fontSize: "13px", color: "#8FA396", maxWidth: "720px", lineHeight: "1.6"}}>Connecting pre-hire readiness scores to post-hire outcomes at 30 / 60 / 90 / 180 days and one year. Assessment versions are locked by cohort.</p>
          <div style={{background: "rgba(245,184,74,.06)", border: "1px solid rgba(245,184,74,.4)", borderRadius: "12px", padding: "16px 20px", marginBottom: "20px", display: "flex", gap: "12px", alignItems: "baseline"}}>
            <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "#04120B", background: "#F5B84A", padding: "4px 10px", borderRadius: "99px", whiteSpace: "nowrap"}}>Insufficient sample</span>
            <span style={{fontSize: "13px", color: "#E9D9B0", lineHeight: "1.55"}}>Cohort 2026-A has n = 3 hires. No correlation between combine scores and outcomes should be drawn until n ≥ 25. Figures below are individual tracking, not validation evidence.</span>
          </div>
          <div style={{display: "flex", gap: "8px", marginBottom: "16px", alignItems: "center", flexWrap: "wrap"}}>
            {(V.vPeriods ?? []).map((p: any, $index: number) => (<React.Fragment key={$index}>
              <button onClick={p?.on} disabled={!!(p?.off)} style={{background: p?.bg, color: p?.fg, border: "1px solid rgba(160,190,170,.2)", borderRadius: "99px", padding: "8px 16px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer"}}>{p?.label}</button>
            </React.Fragment>))}
            {V.canRecord ? (<>
              <button onClick={V.toggleOutcome} style={{marginLeft: "auto", background: "transparent", color: "#34D399", border: "1px solid rgba(160,190,170,.3)", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer", borderColor: "rgba(16,185,129,.35)"}}>{V.outcomeBtnTxt}</button>
            </>) : null}
          </div>
          {V.outcomeOpen ? (<>
            <div style={{background: "#0F1611", border: "1px solid rgba(16,185,129,.3)", borderRadius: "14px", padding: "22px 24px", marginBottom: "16px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "14px"}}>Record outcomes · entered by the hire’s manager</div>
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "12px"}}>
                <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#7E9186"}}>
                  <span>Hire</span>
                  <select value={(V.ocHire) ?? ''} onChange={V.setOcHire} style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "11px 12px", color: "#E9F0EA", fontSize: "13px"}}>
                    <option>Alexis Grant</option>
                    <option>Jordan Miles</option>
                    <option>Priya Shah</option>
                  </select>
                </label>
                <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#7E9186"}}>
                  <span>Checkpoint</span>
                  <select value={(V.ocPeriod) ?? ''} onChange={V.setOcPeriod} style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "11px 12px", color: "#E9F0EA", fontSize: "13px"}}>
                    <option value="d30">30 days</option>
                    <option value="d60">60 days</option>
                    <option value="d90">90 days</option>
                  </select>
                </label>
                {(V.ocFields ?? []).map((f: any, $index: number) => (<React.Fragment key={$index}>
                  <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#7E9186"}}>
                    <span>{f?.label}</span>
                    <input value={(f?.val) ?? ''} onChange={f?.set} placeholder={f?.ph} style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "11px 12px", color: "#E9F0EA", fontSize: "13px"}} />
                  </label>
                </React.Fragment>))}
              </div>
              <div style={{display: "flex", gap: "12px", alignItems: "center", marginTop: "16px", flexWrap: "wrap"}}>
                <button onClick={V.saveOutcome} style={{background: "#10B981", color: "#04120B", border: "none", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "800", cursor: "pointer"}}>Save checkpoint</button>
                <span style={{fontSize: "12px", color: "#34D399", fontWeight: "700"}}>{V.ocSaved}</span>
                <span style={{fontSize: "11.5px", color: "#5C6B61", marginLeft: "auto"}}>Visible to leadership, admins, and hiring managers — never to evaluators scoring current candidates.</span>
              </div>
            </div>
          </>) : null}
          <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", overflowX: "auto"}}>
            <div style={{display: "grid", gridTemplateColumns: "1.4fr repeat(8,1fr)", gap: "10px", padding: "12px 22px", borderBottom: "1px solid rgba(160,190,170,.12)", fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", letterSpacing: ".08em", textTransform: "uppercase", color: "#7E9186", minWidth: "900px"}}>
              <div>Hire · readiness</div>
              <div>Dials/wk</div>
              <div>Meetings</div>
              <div>Pipeline</div>
              <div>Revenue</div>
              <div>CRM %</div>
              <div>Mgr rating</div>
              <div>Coaching</div>
              <div>Retention</div>
            </div>
            {(V.vRows ?? []).map((h: any, $index: number) => (<React.Fragment key={$index}>
              <div style={{display: "grid", gridTemplateColumns: "1.4fr repeat(8,1fr)", gap: "10px", padding: "14px 22px", borderBottom: "1px solid rgba(160,190,170,.07)", fontSize: "13px", alignItems: "center", minWidth: "900px"}}>
                <div>
                  <b>{h?.name}</b>
                  {" "}
                  <span style={{fontFamily: "'JetBrains Mono',monospace", color: "#34D399", fontSize: "12px"}}>{h?.readiness}</span>
                </div>
                <div style={{fontFamily: "'JetBrains Mono',monospace"}}>{h?.dials}</div>
                <div style={{fontFamily: "'JetBrains Mono',monospace"}}>{h?.mtgs}</div>
                <div style={{fontFamily: "'JetBrains Mono',monospace"}}>{h?.pipe}</div>
                <div style={{fontFamily: "'JetBrains Mono',monospace"}}>{h?.rev}</div>
                <div style={{fontFamily: "'JetBrains Mono',monospace"}}>{h?.crm}</div>
                <div style={{fontFamily: "'JetBrains Mono',monospace"}}>{h?.mgr}</div>
                <div>{h?.coach}</div>
                <div style={{color: "#34D399"}}>{h?.ret}</div>
              </div>
            </React.Fragment>))}
          </div>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px"}}>
            <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "20px 22px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "12px"}}>Version locks by cohort</div>
              <div style={{display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px"}}>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <span>Cohort 2026-A · 3 hires</span>
                  <span style={{fontFamily: "'JetBrains Mono',monospace", color: "#34D399"}}>locked v1.1</span>
                </div>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <span>Cohort 2026-B · in progress</span>
                  <span style={{fontFamily: "'JetBrains Mono',monospace", color: "#34D399"}}>locked v1.2</span>
                </div>
              </div>
            </div>
            <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "20px 22px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "8px"}}>Score ↔ outcome correlation</div>
              <p style={{margin: "0", fontSize: "12.5px", color: "#8FA396", lineHeight: "1.6"}}>Hidden until n ≥ 25 with at least 90-day outcomes. Peak has committed to an I/O-psychologist-led validation study before any predictive claim is made.</p>
            </div>
          </div>
        </div>
      </>) : null}
      {V.vAppReview ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <button onClick={V.goPipe} style={{background: "none", border: "none", color: "#8FA396", fontSize: "13px", cursor: "pointer", padding: "0", marginBottom: "16px"}} className="ps2">← Pipeline</button>
          <div style={{display: "flex", alignItems: "center", gap: "20px", marginBottom: "18px", flexWrap: "wrap"}}>
            <div>
              <h1 style={{margin: "0", fontSize: "28px", fontWeight: "900", letterSpacing: "-.015em"}}>{"Application review — "}{V.arName}</h1>
              <div style={{fontSize: "13px", color: "#8FA396", marginTop: "4px"}}>{V.arSub}</div>
            </div>
            <div style={{marginLeft: "auto", textAlign: "right"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".16em", textTransform: "uppercase", color: "#7E9186"}}>Evidence rating</div>
              <div style={{fontSize: "30px", fontWeight: "900", color: V.arLevelColor, lineHeight: "1.2"}}>{V.arLevel}</div>
            </div>
          </div>
          <p style={{margin: "0 0 22px", fontSize: "13px", color: "#8FA396", maxWidth: "760px", lineHeight: "1.6"}}>Rate each answer on evidence quality only — did the candidate give a starting point, their own actions, and a measurable result? Writing polish, school, and background are not criteria. Blind review hides identifying details.</p>
          <div style={{display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "20px", alignItems: "start"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "14px"}}>
              {(V.arItems ?? []).map((a: any, $index: number) => (<React.Fragment key={$index}>
                <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", letterSpacing: ".08em", color: "#34D399", lineHeight: "1.5", marginBottom: "10px"}}>{a?.num}{" · "}{a?.q}</div>
                  <p style={{margin: "0 0 14px", fontSize: "13.5px", lineHeight: "1.65", color: "#D5DED7"}}>{a?.ans}</p>
                  <div style={{display: "flex", gap: "6px", flexWrap: "wrap"}}>
                    {(a?.btns ?? []).map((b: any, $index: number) => (<React.Fragment key={$index}>
                      <button onClick={b?.on} style={{background: b?.bg, color: b?.fg, border: `1px solid ${b?.border}`, borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer"}}>{b?.label}</button>
                    </React.Fragment>))}
                  </div>
                </div>
              </React.Fragment>))}
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "14px"}}>
              <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "12px"}}>Rating guide</div>
                <div style={{display: "flex", flexDirection: "column", gap: "8px", fontSize: "12.5px", color: "#A7B5AB", lineHeight: "1.6"}}>
                  <div>
                    <b style={{color: "#34D399"}}>{"Specific & quantified"}</b>
                    {" — a starting point, the candidate’s own actions, and a number for the result."}
                  </div>
                  <div>
                    <b style={{color: "#E9D9B0"}}>Partial</b>
                    {" — a real example, but the result or the candidate’s own part is missing."}
                  </div>
                  <div>
                    <b style={{color: "#F5B84A"}}>Vague</b>
                    {" — adjectives, generalities, or no example."}
                  </div>
                </div>
              </div>
              <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "10px"}}>Stage decision</div>
                <p style={{margin: "0 0 14px", fontSize: "12.5px", color: "#8FA396", lineHeight: "1.55"}}>{V.arSummary}</p>
                <div style={{display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px"}}>
                  <button onClick={V.arAdvance} disabled={!!(V.arBlocked)} style={{background: V.arBtnBg, color: "#04120B", border: "none", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "800", cursor: "pointer"}}>Advance to Stage 3</button>
                  <button onClick={V.arHold} disabled={!!(V.arBlocked)} style={{background: "transparent", color: "#F5B84A", border: "1px solid rgba(160,190,170,.3)", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer", borderColor: "rgba(245,184,74,.35)"}}>Not at this time</button>
                </div>
                <div style={{fontSize: "12.5px", color: "#34D399", fontWeight: "700", minHeight: "16px"}}>{V.arSaved}</div>
                <p style={{margin: "10px 0 0", fontSize: "11px", color: "#5C6B61", lineHeight: "1.5"}}>Advancing unlocks Stage 3 and emails the candidate. “Not at this time” is logged with your rating and sends the standard decision message.</p>
              </div>
            </div>
          </div>
        </div>
      </>) : null}
      {V.vSchedule ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Schedule a combine</h1>
          <p style={{margin: "0 0 22px", fontSize: "13px", color: "#8FA396", maxWidth: "760px", lineHeight: "1.6"}}>One session: one candidate, two evaluators, one locked exercise version. Invites go to the candidate’s portal and both evaluators’ calendars; the join link is generated per session.</p>
          <div style={{display: "grid", gridTemplateColumns: "480px 1fr", gap: "20px", alignItems: "start"}}>
            <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "24px"}}>
              <div style={{display: "flex", flexDirection: "column", gap: "14px"}}>
                <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#7E9186"}}>
                  <span>Candidate · SJT complete, no session yet</span>
                  <select value={(V.schCand) ?? ''} onChange={V.setSchCand} style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "11px 12px", color: "#E9F0EA", fontSize: "13px"}}>
                    {(V.schCandOpts ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}>
                      <option value={o?.id}>{o?.label}</option>
                    </React.Fragment>))}
                  </select>
                </label>
                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px"}}>
                  <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#7E9186"}}>
                    <span>Date</span>
                    <input value={(V.schDate) ?? ''} onChange={V.setSchDate} style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "11px 12px", color: "#E9F0EA", fontSize: "13px"}} />
                  </label>
                  <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#7E9186"}}>
                    <span>Time (CT) · 60 min</span>
                    <input value={(V.schTime) ?? ''} onChange={V.setSchTime} style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "11px 12px", color: "#E9F0EA", fontSize: "13px"}} />
                  </label>
                </div>
                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px"}}>
                  <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#7E9186"}}>
                    <span>Evaluator 1 · plays the buyer</span>
                    <select value={(V.schE1) ?? ''} onChange={V.setSchE1} style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "11px 12px", color: "#E9F0EA", fontSize: "13px"}}>
                      {(V.evalOpts ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}>
                        <option value={o?.id}>{o?.label}</option>
                      </React.Fragment>))}
                    </select>
                  </label>
                  <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#7E9186"}}>
                    <span>Evaluator 2 · observes</span>
                    <select value={(V.schE2) ?? ''} onChange={V.setSchE2} style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "11px 12px", color: "#E9F0EA", fontSize: "13px"}}>
                      {(V.evalOpts ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}>
                        <option value={o?.id}>{o?.label}</option>
                      </React.Fragment>))}
                    </select>
                  </label>
                </div>
                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px"}}>
                  <div style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#7E9186"}}>
                    <span>Assessment version</span>
                    <div style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "11px 12px", color: "#A7B5AB", fontSize: "13px"}}>v1.2 · locked for Cohort 2026-B</div>
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#7E9186"}}>
                    <span>Join link</span>
                    <div style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "11px 12px", color: "#34D399", fontSize: "13px", wordBreak: "break-all"}}>{V.schLink}</div>
                  </div>
                </div>
                <div style={{fontSize: "12px", color: V.schWarnColor, minHeight: "16px", lineHeight: "1.5"}}>{V.schWarn}</div>
                <button onClick={V.sendSchedule} disabled={!!(V.schBlocked)} style={{background: V.schBtnBg, color: "#04120B", border: "none", borderRadius: "10px", padding: "13px 24px", fontSize: "14px", fontWeight: "800", cursor: "pointer"}}>Send invites</button>
                <p style={{margin: "0", fontSize: "11px", color: "#5C6B61", lineHeight: "1.5"}}>The candidate sees date, link, and what to expect. Evaluators get a calendar hold, the candidate brief, the case submission, and a conflict-of-interest prompt. Neither evaluator sees the other’s scores before submitting.</p>
              </div>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186"}}>Upcoming sessions</div>
              {(V.schedList ?? []).map((s: any, $index: number) => (<React.Fragment key={$index}>
                <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "18px 22px"}}>
                  <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                    <div style={{fontSize: "15px", fontWeight: "800", flex: "1"}}>{s?.cand}</div>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#34D399"}}>{s?.status}</span>
                  </div>
                  <div style={{fontSize: "12.5px", color: "#8FA396", marginTop: "4px"}}>{s?.when}{" · "}{s?.evals}{" · "}{s?.ver}</div>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "#34D399", marginTop: "6px"}}>{s?.link}</div>
                </div>
              </React.Fragment>))}
            </div>
          </div>
        </div>
      </>) : null}
      {V.vDecisions ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Decision log</h1>
          <p style={{margin: "0 0 22px", fontSize: "13px", color: "#8FA396", maxWidth: "760px", lineHeight: "1.6"}}>Every advance, hold, and decline — who made it, when, on what evidence, and how aligned the evaluators were. This is the record that defends a hiring decision. Entries are never edited; corrections are appended.</p>
          <div style={{display: "flex", flexDirection: "column", gap: "12px", maxWidth: "960px"}}>
            {(V.decisionRows ?? []).map((d: any, $index: number) => (<React.Fragment key={$index}>
              <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "8px"}}>
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "#04120B", padding: "4px 10px", borderRadius: "99px", background: d?.bg}}>{d?.decision}</span>
                  <span style={{fontSize: "15px", fontWeight: "800"}}>{d?.cand}</span>
                  <span style={{fontSize: "12.5px", color: "#8FA396"}}>{d?.role}</span>
                  <span style={{marginLeft: "auto", fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "#5C6B61"}}>{d?.t}{" · "}{d?.by}</span>
                </div>
                <p style={{margin: "0 0 8px", fontSize: "13px", color: "#D5DED7", lineHeight: "1.6"}}>{d?.rationale}</p>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", letterSpacing: ".06em", color: "#7E9186"}}>{"Evaluator agreement at decision · "}{d?.agree}</div>
              </div>
            </React.Fragment>))}
          </div>
        </div>
      </>) : null}
      {V.vUsers ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>{"Staff & permissions"}</h1>
          <p style={{margin: "0 0 22px", fontSize: "13px", color: "#8FA396", maxWidth: "760px", lineHeight: "1.6"}}>Roles decide what a person can see and do; one person can hold several. Candidates are never users — they only ever hold a link to their own assessment.</p>
          <div style={{display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px", alignItems: "start"}}>
            <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", overflow: "hidden"}}>
              <div style={{display: "grid", gridTemplateColumns: "1.6fr 1.4fr 1.6fr .9fr auto", gap: "12px", padding: "12px 22px", borderBottom: "1px solid rgba(160,190,170,.12)", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".12em", textTransform: "uppercase", color: "#7E9186"}}>
                <div>Person</div>
                <div>Title</div>
                <div>Roles</div>
                <div>Status</div>
                <div />
              </div>
              {(V.userRows ?? []).map((u: any, $index: number) => (<React.Fragment key={$index}>
                <div style={{display: "grid", gridTemplateColumns: "1.6fr 1.4fr 1.6fr .9fr auto", gap: "12px", padding: "14px 22px", borderBottom: "1px solid rgba(160,190,170,.07)", alignItems: "center"}}>
                  <div>
                    <div style={{fontSize: "14px", fontWeight: "700"}}>{u?.name}</div>
                    <div style={{fontSize: "11.5px", color: "#5C6B61", wordBreak: "break-all"}}>{u?.email}</div>
                  </div>
                  <div style={{fontSize: "12.5px", color: "#A7B5AB"}}>{u?.title}</div>
                  <div style={{display: "flex", gap: "4px", flexWrap: "wrap"}}>
                    {(u?.roleTags ?? []).map((t: any, $index: number) => (<React.Fragment key={$index}>
                      <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", letterSpacing: ".06em", textTransform: "uppercase", color: "#34D399", background: "rgba(16,185,129,.1)", padding: "3px 8px", borderRadius: "99px"}}>{t}</span>
                    </React.Fragment>))}
                  </div>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", fontWeight: "700", color: u?.statusColor}}>{u?.status}</div>
                  <button onClick={u?.toggle} style={{background: "transparent", color: "#8FA396", border: "1px solid rgba(160,190,170,.22)", borderRadius: "8px", padding: "7px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"}} className="ps2">{u?.action}</button>
                </div>
              </React.Fragment>))}
            </div>
            <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "12px"}}>Invite a staff member</div>
              <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                <input value={(V.invName) ?? ''} onChange={V.setInvName} placeholder="Full name" style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "11px 12px", color: "#E9F0EA", fontSize: "13px"}} />
                <input value={(V.invEmail) ?? ''} onChange={V.setInvEmail} placeholder="Work email" style={{width: "100%", boxSizing: "border-box", background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "10px", padding: "11px 12px", color: "#E9F0EA", fontSize: "13px"}} />
                <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                  {(V.invRoleOpts ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}>
                    <label style={{display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer", background: "#0B120E", border: `1px solid ${r?.border}`, borderRadius: "10px", padding: "10px 12px"}}>
                      <input type="checkbox" checked={!!(r?.on)} onChange={r?.toggle} style={{accentColor: "#10B981", marginTop: "3px", flexShrink: "0"}} />
                      <span>
                        <div style={{fontSize: "13px", fontWeight: "700"}}>{r?.label}</div>
                        <div style={{fontSize: "11.5px", color: "#8FA396", lineHeight: "1.5", marginTop: "2px"}}>{r?.d}</div>
                      </span>
                    </label>
                  </React.Fragment>))}
                </div>
                <button onClick={V.sendInvite} disabled={!!(V.invBlocked)} style={{background: V.invBtnBg, color: "#04120B", border: "none", borderRadius: "10px", padding: "12px", fontSize: "13.5px", fontWeight: "800", cursor: "pointer"}}>Send invite</button>
                <div style={{fontSize: "12px", color: "#34D399", fontWeight: "700", minHeight: "14px"}}>{V.invSaved}</div>
              </div>
              <p style={{margin: "6px 0 0", fontSize: "11px", color: "#5C6B61", lineHeight: "1.5"}}>Invites expire in 7 days. University partners get Evaluator only. Deactivating keeps a person’s past scores and audit entries intact.</p>
            </div>
          </div>
        </div>
      </>) : null}
      {V.vInbox ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Accommodation requests</h1>
          <p style={{margin: "0 0 22px", fontSize: "13px", color: "#8FA396", maxWidth: "760px", lineHeight: "1.6"}}>Handled by the talent team, never by evaluators. Approved accommodations adjust timers and formats automatically; the reason is never shown to evaluators and never affects scoring.</p>
          <div style={{display: "flex", flexDirection: "column", gap: "12px", maxWidth: "900px"}}>
            {(V.inboxRows ?? []).map((a: any, $index: number) => (<React.Fragment key={$index}>
              <div style={{background: "#0F1611", border: `1px solid ${a?.border}`, borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "10px"}}>
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "#04120B", padding: "4px 10px", borderRadius: "99px", background: a?.bg}}>{a?.status}</span>
                  <span style={{fontSize: "15px", fontWeight: "800"}}>{a?.cand}</span>
                  <span style={{marginLeft: "auto", fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "#5C6B61"}}>{a?.t}</span>
                </div>
                <p style={{margin: "0 0 12px", fontSize: "13.5px", color: "#D5DED7", lineHeight: "1.6"}}>“{a?.txt}”</p>
                {a?.open ? (<>
                  <div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
                    <button onClick={a?.approveTime} style={{background: "#10B981", color: "#04120B", border: "none", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "800", cursor: "pointer"}}>Approve · +50% time</button>
                    <button onClick={a?.approveFormat} style={{background: "transparent", color: "#34D399", border: "1px solid rgba(160,190,170,.3)", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer", borderColor: "rgba(16,185,129,.35)"}}>Approve · alternative format</button>
                    <button onClick={a?.needInfo} style={{background: "transparent", color: "#E9F0EA", border: "1px solid rgba(160,190,170,.3)", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer"}}>Ask for more detail</button>
                  </div>
                </>) : null}
                {a?.closed ? (<>
                  <div style={{fontSize: "12.5px", color: "#8FA396", lineHeight: "1.55"}}>{a?.resolution}</div>
                </>) : null}
              </div>
            </React.Fragment>))}
          </div>
        </div>
      </>) : null}
      {V.vRoadmap ? (<>
        <div style={{animation: "fadeUp .35s ease both", maxWidth: "840px"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Implementation roadmap</h1>
          <p style={{margin: "0 0 24px", fontSize: "13px", color: "#8FA396", lineHeight: "1.6"}}>From prototype to production. Sequenced for a pilot with one hiring campaign.</p>
          <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
            {(V.roadmap ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}>
              <div style={{display: "flex", gap: "18px", background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "20px 24px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", fontWeight: "700", color: "#10B981", whiteSpace: "nowrap"}}>{r?.phase}</div>
                <div>
                  <div style={{fontSize: "15px", fontWeight: "800", marginBottom: "6px"}}>{r?.title}</div>
                  <p style={{margin: "0", fontSize: "13px", color: "#A7B5AB", lineHeight: "1.65"}}>{r?.body}</p>
                </div>
              </div>
            </React.Fragment>))}
          </div>
        </div>
      </>) : null}
      {V.vSettings ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 22px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>{"Security, retention & permissions"}</h1>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
              <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "14px"}}>Candidate data</div>
                <div style={{display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px"}}>
                  <span style={{fontSize: "13.5px", flex: "1"}}>Retention period</span>
                  <select value={(V.retention) ?? ''} onChange={V.setRetention} style={{background: "#0B120E", border: "1px solid rgba(160,190,170,.18)", borderRadius: "9px", padding: "9px 12px", color: "#E9F0EA", fontSize: "13px"}}>
                    <option>12 months</option>
                    <option>24 months</option>
                    <option>36 months</option>
                  </select>
                </div>
                <div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
                  <button style={{background: "transparent", color: "#E9F0EA", border: "1px solid rgba(160,190,170,.25)", borderRadius: "9px", padding: "9px 15px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer"}}>Export candidate data</button>
                  <button style={{background: "transparent", color: "#F87171", border: "1px solid rgba(248,113,113,.35)", borderRadius: "9px", padding: "9px 15px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer"}}>Process deletion request</button>
                </div>
                <p style={{margin: "12px 0 0", fontSize: "11px", color: "#5C6B61", lineHeight: "1.55"}}>Optional demographic data is stored separately from hiring reviewers and is never visible in candidate profiles or comparisons.</p>
              </div>
              <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "14px"}}>Role-based permissions</div>
                <div style={{display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px"}}>
                  {(V.roleTable ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}>
                    <div style={{display: "flex", justifyContent: "space-between", gap: "16px"}}>
                      <span style={{fontWeight: "700", whiteSpace: "nowrap"}}>{r?.label}</span>
                      <span style={{color: "#8FA396", textAlign: "right", lineHeight: "1.5"}}>{r?.d}</span>
                    </div>
                  </React.Fragment>))}
                </div>
              </div>
              <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "14px"}}>Audit history</div>
                <div style={{display: "flex", flexDirection: "column", gap: "11px"}}>
                  {(V.auditRows ?? []).map((a: any, $index: number) => (<React.Fragment key={$index}>
                    <div style={{fontSize: "12.5px", lineHeight: "1.5"}}>
                      <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "#5C6B61"}}>{a?.t}</span>
                      {" · "}
                      <b>{a?.who}</b>
                      {" — "}
                      <span style={{color: "#A7B5AB"}}>{a?.what}</span>
                    </div>
                  </React.Fragment>))}
                </div>
              </div>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
              <div style={{background: "#0F1611", border: "1px solid rgba(91,155,255,.3)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#5B9BFF"}}>Fairness audit</div>
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "#04120B", background: "#5B9BFF", padding: "3px 8px", borderRadius: "99px"}}>Leadership / Compliance only</span>
                </div>
                {V.fairLocked ? (<>
                  <p style={{margin: "0 0 14px", fontSize: "13px", color: "#8FA396", lineHeight: "1.6"}}>Selection rates by stage, using optional self-reported demographics stored separately from hiring reviewers. Visible only while signed in with the Leadership / Compliance role — if you hold it, switch roles in the header.</p>
                </>) : null}
                {V.fairOpen ? (<>
                  <div style={{display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: "8px", fontSize: "12.5px", marginBottom: "6px"}}>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "#7E9186"}}>Stage transition</div>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "#7E9186", textAlign: "right"}}>Group A</div>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "#7E9186", textAlign: "right"}}>Group B</div>
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px"}}>
                    {(V.fairRows ?? []).map((f: any, $index: number) => (<React.Fragment key={$index}>
                      <div style={{display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: "8px"}}>
                        <span style={{color: "#A7B5AB"}}>{f?.stage}</span>
                        <span style={{fontFamily: "'JetBrains Mono',monospace", textAlign: "right"}}>{f?.a}</span>
                        <span style={{fontFamily: "'JetBrains Mono',monospace", textAlign: "right"}}>{f?.b}</span>
                      </div>
                    </React.Fragment>))}
                  </div>
                  <p style={{margin: "14px 0 0", fontSize: "11px", color: "#5C6B61", lineHeight: "1.55"}}>Groups are self-reported and optional. Sample sizes are currently too small for adverse-impact analysis (4/5ths rule requires larger n). Shown for monitoring discipline only.</p>
                </>) : null}
              </div>
              <div style={{background: "#0F1611", border: "1px solid rgba(160,190,170,.13)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "#7E9186", marginBottom: "12px"}}>AI decision-support rules</div>
                <div style={{display: "flex", flexDirection: "column", gap: "8px", fontSize: "12.5px", color: "#A7B5AB", lineHeight: "1.55"}}>
                  <div>· Every generated summary cites the specific response, exercise, or evaluator note behind it</div>
                  <div>· Never analyzes face, voice, accent, appearance, or emotion — video is scored by humans only</div>
                  <div>· Never diagnoses personality, health, honesty, or “culture fit”</div>
                  <div>· Never makes the final hiring decision, never invents evidence</div>
                  <div>· All summaries are labeled decision support — this prototype uses deterministic mock summaries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>) : null}
    </main>
  </>) : null;
}
