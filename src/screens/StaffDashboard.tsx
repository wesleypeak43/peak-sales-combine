// StaffDashboard — generated from the Peak Sales Combine prototype template. Plain React; edit freely.
// V is the view-model returned by PeakCombine.renderVals(): values, lists, and event handlers.
import React from 'react';

const INPUT = {width: "100%", boxSizing: "border-box", background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-160-190-170-18)", borderRadius: "10px", padding: "11px 12px", color: "var(--c-hex-e9f0ea)", fontSize: "13px"} as any;
const MONO_LABEL = {fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"} as any;


const SCARD = {background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "22px 24px"} as any;
const SLBL = {fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "10px"} as any;
const SNOTE = {margin: "0 0 12px", fontSize: "12px", color: "var(--c-hex-8fa396)", lineHeight: "1.55"} as any;
const STA = {width: "100%", boxSizing: "border-box", background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-160-190-170-18)", borderRadius: "10px", padding: "11px", color: "var(--c-hex-e9f0ea)", fontSize: "13px", lineHeight: "1.5", resize: "vertical", fontFamily: "inherit"} as any;
const CHIP_BTN = {background: "transparent", color: "var(--c-hex-34d399)", border: "1px solid var(--c-rgba-16-185-129-35)", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer"} as any;
const GHOST_BTN = {background: "transparent", color: "var(--c-hex-a7b5ab)", border: "1px solid var(--c-rgba-160-190-170-2)", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer"} as any;

export function StaffDashboard({ V }: { V: any }) {
  return V.isStaff ? (<>
    <main style={{flex: "1", width: "100%", maxWidth: "1280px", margin: "0 auto", padding: "32px 28px 80px", boxSizing: "border-box"}}>
      {V.vFunnel ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 24px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Recruiting funnel</h1>
          <div style={{display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "20px", alignItems: "start"}}>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "24px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "18px"}}>All active campaigns · last 60 days</div>
              <div style={{display: "flex", flexDirection: "column", gap: "14px"}}>
                {(V.funnelRows ?? []).map((f: any, $index: number) => (<React.Fragment key={$index}>
                  <div>
                    <div style={{display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px"}}>
                      <span style={{fontWeight: "700"}}>{f?.label}</span>
                      <span style={{fontFamily: "'JetBrains Mono',monospace", color: "var(--c-hex-8fa396)"}}>{f?.n}{" · "}{f?.conv}</span>
                    </div>
                    <div style={{height: "22px", background: "var(--c-hex-0b120e)", borderRadius: "7px", overflow: "hidden"}}>
                      <div style={{height: "100%", width: f?.pct, background: "linear-gradient(90deg,var(--c-rgba-16-185-129-4),var(--c-hex-10b981))", borderRadius: "7px"}} />
                    </div>
                  </div>
                </React.Fragment>))}
              </div>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "14px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>{"Open roles & campaigns"}</div>
              {(V.roleCards ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}>
                <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "20px 22px"}}>
                  <div style={{fontSize: "15px", fontWeight: "800"}}>{r?.title}</div>
                  <div style={{fontSize: "12.5px", color: "var(--c-hex-8fa396)", margin: "4px 0 12px"}}>{r?.prop}</div>
                  <div style={{display: "flex", gap: "16px", fontFamily: "'JetBrains Mono',monospace", fontSize: "11.5px", color: "var(--c-hex-a7b5ab)"}}>
                    {r?.open != null ? (<>
                    <span>
                      <b style={{color: "var(--c-hex-34d399)"}}>{r?.open}</b>
                      {" open"}
                    </span>
                    </>) : null}
                    <span>
                      <b style={{color: "var(--c-hex-e9f0ea)"}}>{r?.apps}</b>
                      {" candidates"}
                    </span>
                    <span style={{color: "var(--c-hex-7e9186)"}}>{r?.stage}</span>
                  </div>
                </div>
              </React.Fragment>))}
            </div>
          </div>
        </div>
        {V.hasSources ? (<>
          <div style={{...SCARD, marginTop: "18px", padding: "18px 22px"}}>
            <div style={SLBL}>Where candidates come from</div>
            <p style={SNOTE}>{V.sourceNote}</p>
            <div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
              {(V.sourceRows ?? []).map((s: any, $index: number) => (<React.Fragment key={$index}>
                <span style={{fontSize: "12.5px", color: "var(--c-hex-d5ded7)", background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-160-190-170-14)", borderRadius: "99px", padding: "6px 12px"}}><b>{s?.n}</b>{" · "}{s?.label}<span style={{color: "var(--c-hex-5c6b61)"}}>{" · "}{s?.pct}</span></span>
              </React.Fragment>))}
            </div>
          </div>
        </>) : null}
      </>) : null}
      {V.vPipe ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <div style={{display: "flex", alignItems: "center", gap: "18px", marginBottom: "20px", flexWrap: "wrap"}}>
            <h1 style={{margin: "0", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Candidate pipeline</h1>
            <label style={{display: "flex", alignItems: "center", gap: "9px", marginLeft: "auto", cursor: "pointer", background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-15)", borderRadius: "99px", padding: "8px 16px"}}>
              <input type="checkbox" checked={!!(V.blind)} onChange={V.toggleBlind} style={{accentColor: "var(--c-hex-10b981)", width: "15px", height: "15px"}} />
              <span style={{fontSize: "12.5px", fontWeight: "700", color: V.blindColor}}>{"Blind review "}{V.blindState}</span>
            </label>
          </div>
          <p style={{margin: "0 0 18px", fontSize: "12.5px", color: "var(--c-hex-8fa396)", maxWidth: "720px", lineHeight: "1.55"}}>Blind review hides names, photos, and school names during early screening. Candidates are compared against the role standard — never ranked by prestige, polish, or similarity to current leaders.</p>
          {V.showInviteForm ? (<>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-16-185-129-25)", borderRadius: "14px", padding: "20px 22px", marginBottom: "18px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-10b981)", marginBottom: "12px"}}>Add a candidate</div>
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "10px"}}>
                <input value={(V.ncName) ?? ''} onChange={V.setNcName} placeholder="Full name" style={INPUT} />
                <input value={(V.ncEmail) ?? ''} onChange={V.setNcEmail} placeholder="Email" style={INPUT} />
                <input value={(V.ncPhone) ?? ''} onChange={V.setNcPhone} placeholder="Phone (optional)" style={INPUT} />
                <select value={(V.ncRole) ?? ''} onChange={V.setNcRole} style={INPUT}>
                  {(V.ncRoles ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}>
                    <option value={r}>{r}</option>
                  </React.Fragment>))}
                </select>
              </div>
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "10px", marginTop: "10px"}}>
                <select value={(V.ncProgramPick) ?? ''} onChange={V.setNcProgramPick} style={INPUT}>
                  {(V.ncProgramOpts ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}>
                    <option value={o?.id}>{o?.label}</option>
                  </React.Fragment>))}
                </select>
                {V.ncCustomOn ? (<>
                  <input value={(V.ncProgram) ?? ''} onChange={V.setNcProgram} placeholder="Type the school / property" style={INPUT} />
                </>) : null}
                <div style={{position: "relative"}}>
                  <input value={(V.ncLoc) ?? ''} onChange={V.setNcLoc} onFocus={V.ncLocFocus} onBlur={V.ncLocBlur} placeholder="Location — city (optional)" title={V.ncLocHint} style={INPUT} />
                  {V.ncLocHas ? (<>
                    <div style={{position: "absolute", top: "calc(100% + 4px)", left: "0", right: "0", background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-22)", borderRadius: "10px", boxShadow: "0 12px 30px var(--c-rgba-0-0-0-4)", zIndex: "15", overflow: "hidden"}}>
                      {(V.ncLocSuggestions ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}>
                        <button onMouseDown={o?.pick} style={{display: "flex", justifyContent: "space-between", gap: "10px", width: "100%", textAlign: "left", background: "transparent", border: "none", padding: "9px 12px", color: "var(--c-hex-e9f0ea)", fontSize: "13px", cursor: "pointer"}} className="ps6"><span>{o?.v}</span>{o?.tag ? (<span style={{fontSize: "10.5px", color: "var(--c-hex-7e9186)"}}>{o?.tag}</span>) : null}</button>
                      </React.Fragment>))}
                    </div>
                  </>) : null}
                </div>
                <input value={(V.ncSchool) ?? ''} onChange={V.setNcSchool} placeholder="Their school / current org (optional)" style={INPUT} />
                <input value={(V.ncLinkedin) ?? ''} onChange={V.setNcLinkedin} placeholder="LinkedIn URL (optional)" style={INPUT} />
              </div>
              {V.ncCheck?.show ? (<>
                <div style={{display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginTop: "10px", fontSize: "12.5px", color: "var(--c-hex-e9d9b0)"}}>
                  <span>{V.ncCheck?.txt}</span>
                  {V.ncCheck?.use ? (<button onClick={V.ncCheck?.use} style={CHIP_BTN}>{V.ncCheck?.useLabel}</button>) : null}
                  {V.ncCheck?.add ? (<button onClick={V.ncCheck?.add} style={GHOST_BTN}>{V.ncCheck?.addLabel}</button>) : null}
                </div>
              </>) : null}
              <div style={{display: "flex", gap: "10px", alignItems: "stretch", marginTop: "12px", flexWrap: "wrap"}}>
                {(V.ncTracks ?? []).map((t: any, $index: number) => (<React.Fragment key={$index}>
                  <button onClick={t?.on} style={{flex: "1 1 220px", textAlign: "left", background: t?.bg, color: t?.fg, border: `1px solid ${t?.border}`, borderRadius: "10px", padding: "10px 14px", cursor: "pointer"}}>
                    <div style={{fontSize: "13px", fontWeight: "800"}}>{t?.label}</div>
                    <div style={{fontSize: "11.5px", color: "var(--c-hex-7e9186)", marginTop: "2px"}}>{t?.d}</div>
                  </button>
                </React.Fragment>))}
                <label style={{flex: "1 1 220px", display: "flex", flexDirection: "column", justifyContent: "center", border: `1.5px dashed ${V.ncFileName ? 'var(--c-rgba-16-185-129-5)' : 'var(--c-rgba-160-190-170-3)'}`, borderRadius: "10px", padding: "10px 14px", cursor: "pointer", background: V.ncFileName ? 'var(--c-rgba-16-185-129-06)' : 'transparent'}}>
                  <input type="file" accept=".pdf,.doc,.docx,.rtf,.txt" onChange={V.pickNcFile} style={{display: "none"}} />
                  <div style={{fontSize: "13px", fontWeight: "800", color: V.ncFileName ? 'var(--c-hex-34d399)' : 'var(--c-hex-a7b5ab)', wordBreak: "break-word"}}>{V.ncFileName || 'Attach résumé (optional)'}</div>
                  <div style={{fontSize: "11.5px", color: "var(--c-hex-7e9186)", marginTop: "2px"}}>{V.ncFileName ? 'Click to replace' : 'PDF or Word · 15 MB max'}</div>
                </label>
              </div>
              <div style={{display: "flex", gap: "8px", alignItems: "center", marginTop: "12px", flexWrap: "wrap"}}>
                <button onClick={V.ncEmailInvite} disabled={!!(V.ncBlocked)} style={{background: V.ncBtnBg, color: "var(--c-hex-04120b)", border: "none", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "800", cursor: "pointer"}}>{V.ncBusy ? 'Working…' : 'Add & email ' + V.ncLinkLabel}</button>
                <button onClick={V.ncCopyInvite} disabled={!!(V.ncBlocked)} style={{background: "transparent", color: V.ncBlocked ? "var(--c-hex-3a453d)" : "var(--c-hex-34d399)", border: "1px solid var(--c-rgba-16-185-129-35)", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer"}}>{"Add & copy " + V.ncLinkLabel}</button>
                <button onClick={V.ncManual} disabled={!!(V.ncBlocked)} style={{background: "transparent", color: V.ncBlocked ? "var(--c-hex-3a453d)" : "var(--c-hex-a7b5ab)", border: "1px solid var(--c-rgba-160-190-170-25)", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer"}}>Add without sending a link</button>
                <span style={{fontSize: "12px", color: "var(--c-hex-5c6b61)"}}>Links are personal and expire 3 days after they are sent; unfinished links get reminders at 48 and 72 hours. The school / property you pick is what the candidate sees, and it decides which job pipeline they land on (Jobs tab). Prefer candidates to fill in their own details? Copy the job’s application link from the Jobs tab.</span>
              </div>
              {V.ncSaved ? (<>
                <div style={{fontSize: "12.5px", color: V.ncSavedColor, fontWeight: "700", marginTop: "10px", wordBreak: "break-all"}}>{V.ncSaved}</div>
              </>) : null}
            </div>
          </>) : null}
          <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", overflow: "hidden"}}>
            <div style={{display: "grid", gridTemplateColumns: "2fr 1.6fr 1.8fr .8fr .9fr auto", gap: "12px", padding: "12px 22px", borderBottom: "1px solid var(--c-rgba-160-190-170-12)", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>
              <div>Candidate</div>
              <div>Role</div>
              <div>Stage</div>
              <div>Readiness</div>
              <div>Agreement</div>
              <div>Actions</div>
            </div>
            {(V.pipeRows ?? []).map((p: any, $index: number) => (<React.Fragment key={$index}>
              <div style={{display: "grid", gridTemplateColumns: "2fr 1.6fr 1.8fr .8fr .9fr auto", gap: "12px", padding: "15px 22px", borderBottom: "1px solid var(--c-rgba-160-190-170-07)", alignItems: "center"}} className="ps6">
                <div>
                  <div style={{fontSize: "14.5px", fontWeight: "700"}}>{p?.dName}</div>
                  <div style={{fontSize: "11.5px", color: "var(--c-hex-5c6b61)"}}>{p?.dSub}</div>
                  {p?.grade ? (<>
                    <div style={{fontSize: "10.5px", marginTop: "3px", fontFamily: "'JetBrains Mono',monospace", letterSpacing: ".04em", color: p?.gradeColor}}>{"First call · "}{p?.grade}{p?.boardStage ? " · " + p.boardStage : ""}</div>
                  </>) : null}
                  {p?.tag || p?.hasResume ? (<>
                    <div style={{fontSize: "10.5px", color: "var(--c-hex-7e9186)", marginTop: "3px", fontFamily: "'JetBrains Mono',monospace", letterSpacing: ".04em"}}>{[p?.tag, p?.hasResume ? 'Résumé on file' : ''].filter(Boolean).join(' · ')}</div>
                  </>) : null}
                  {p?.inviteState ? (<>
                    <div style={{fontSize: "11px", color: p?.inviteColor, marginTop: "3px"}}>{p?.inviteState}</div>
                  </>) : null}
                  {p?.flash ? (<>
                    <div style={{fontSize: "11px", color: "var(--c-hex-34d399)", marginTop: "4px", wordBreak: "break-all"}}>{p?.flash}</div>
                  </>) : null}
                </div>
                <div style={{fontSize: "12.5px", color: "var(--c-hex-a7b5ab)"}}>{p?.role}</div>
                <div style={{fontSize: "12px", color: p?.stageColor, fontWeight: "600"}}>{p?.stageLabel}</div>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "15px", fontWeight: "700", color: p?.readColor}}>{p?.readiness}</div>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", fontWeight: "700", color: p?.agreeColor}}>{p?.agree}</div>
                <div style={{display: "flex", gap: "6px", flexWrap: "wrap"}}>
                  <button onClick={p?.openProfile} style={{background: "transparent", color: "var(--c-hex-34d399)", border: "1px solid var(--c-rgba-16-185-129-35)", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer"}}>Profile</button>
                  {p?.canReview ? (<>
                    <button onClick={p?.review} style={{background: "var(--c-hex-10b981)", color: "var(--c-hex-04120b)", border: "none", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "800", cursor: "pointer"}}>Review application</button>
                  </>) : null}
                  <button onClick={p?.pickCmp} disabled={!!(p?.noCmp)} style={{background: p?.cmpBg, color: p?.cmpFg, border: "1px solid var(--c-rgba-160-190-170-2)", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer"}}>{p?.cmpTxt}</button>
                  {V.canViewAs ? (<>
                    <button onClick={p?.viewAs} title="Open this candidate's portal read-only (logged)" style={{background: "transparent", color: "var(--c-hex-5b9bff)", border: "1px solid var(--c-rgba-91-155-255-35)", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer"}}>View as</button>
                  </>) : null}
                  {p?.showInvite ? (<>
                    <button onClick={p?.resend} style={{background: "transparent", color: "var(--c-hex-e9d9b0)", border: "1px solid var(--c-rgba-245-184-74-35)", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer"}}>{p?.resendTxt}</button>
                    <button onClick={p?.copy} style={{background: "transparent", color: "var(--c-hex-a7b5ab)", border: "1px solid var(--c-rgba-160-190-170-2)", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer"}}>Copy link</button>
                  </>) : null}
                  {p?.showUpgrade ? (<>
                    <button onClick={p?.upgrade} title="Switches this candidate to the full assessment and emails that link" style={{background: "transparent", color: "var(--c-hex-34d399)", border: "1px solid var(--c-rgba-16-185-129-35)", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer"}}>{p?.upgradeTxt}</button>
                  </>) : null}
                </div>
              </div>
            </React.Fragment>))}
            {V.pipeEmpty ? (<>
              <div style={{padding: "26px 22px", fontSize: "13.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.6"}}>No candidates yet. Add the first one above — with a link (full assessment or details only) or manually with a résumé — and they appear here the moment the record is created.</div>
            </>) : null}
          </div>
          {V.canCompare ? (<>
            <div style={{display: "flex", alignItems: "center", gap: "14px", marginTop: "14px", background: "var(--c-rgba-16-185-129-07)", border: "1px solid var(--c-rgba-16-185-129-3)", borderRadius: "12px", padding: "14px 20px"}}>
              <span style={{fontSize: "13.5px", fontWeight: "700"}}>{V.cmpBarTxt}</span>
              <button onClick={V.goCompare} style={{background: "var(--c-hex-10b981)", color: "var(--c-hex-04120b)", border: "none", borderRadius: "9px", padding: "9px 18px", fontSize: "13px", fontWeight: "800", cursor: "pointer", marginLeft: "auto"}}>Compare side-by-side</button>
              <button onClick={V.clearCmp} style={{background: "none", border: "none", color: "var(--c-hex-8fa396)", fontSize: "12.5px", cursor: "pointer"}}>Clear</button>
            </div>
          </>) : null}
        </div>
      </>) : null}
      {V.vBoard ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <div style={{display: "flex", alignItems: "flex-end", gap: "18px", marginBottom: "16px", flexWrap: "wrap"}}>
            <div style={{flex: "1"}}>
              <h1 style={{margin: "0 0 4px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Jobs</h1>
              <p style={{margin: "0", fontSize: "12.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.55"}}>{V.jobCountsText}</p>
            </div>
            {V.boardIsMgr ? (<>
              <button onClick={V.toggleNewJob} style={{...CHIP_BTN, background: V.boardNewOpen ? "transparent" : "var(--c-hex-10b981)", color: V.boardNewOpen ? "var(--c-hex-8fa396)" : "var(--c-hex-04120b)", border: V.boardNewOpen ? "1px solid var(--c-rgba-160-190-170-25)" : "none", padding: "10px 16px", fontWeight: "800"}}>{V.boardNewOpen ? 'Cancel' : '+ New job'}</button>
            </>) : null}
          </div>
          {V.boardNewOpen ? (<>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-16-185-129-25)", borderRadius: "14px", padding: "18px 22px", marginBottom: "16px"}}>
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "10px", alignItems: "center"}}>
                <select value={(V.nbRole) ?? ''} onChange={V.setNbRole} style={INPUT}>
                  {(V.nbRoles ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}><option value={r}>{r}</option></React.Fragment>))}
                </select>
                <select value={(V.nbProgram) ?? ''} onChange={V.setNbProgram} style={INPUT}>
                  {(V.nbProgramOpts ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}><option value={o?.id}>{o?.label}</option></React.Fragment>))}
                </select>
                {V.nbCustomOn ? (<><input value={(V.nbCustom) ?? ''} onChange={V.setNbCustom} placeholder="Type the school / property" style={INPUT} /></>) : null}
                <button onClick={V.createJob} disabled={!!(V.nbBlocked)} style={{background: V.nbBtnBg, color: "var(--c-hex-04120b)", border: "none", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "800", cursor: "pointer"}}>Create job</button>
              </div>
              {V.nbCheck?.show ? (<>
                <div style={{display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginTop: "10px", fontSize: "12.5px", color: "var(--c-hex-e9d9b0)"}}>
                  <span>{V.nbCheck?.txt}</span>
                  {V.nbCheck?.use ? (<button onClick={V.nbCheck?.use} style={CHIP_BTN}>{V.nbCheck?.useLabel}</button>) : null}
                  {V.nbCheck?.add ? (<button onClick={V.nbCheck?.add} style={GHOST_BTN}>{V.nbCheck?.addLabel}</button>) : null}
                </div>
              </>) : null}
            </div>
          </>) : null}
          {V.boardEmpty ? (<>
            <div style={{...SCARD, color: "var(--c-hex-8fa396)", fontSize: "13.5px", lineHeight: "1.6"}}>No jobs yet. Create one above, or add a candidate on the Pipeline tab — their role and school create the job automatically.</div>
          </>) : (<>
            <div style={{...SCARD, padding: "18px 20px", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "14px"}}>
              <div style={{display: "flex", alignItems: "flex-end", gap: "14px", flexWrap: "wrap"}}>
                <div style={{position: "relative", flex: "1 1 380px", maxWidth: "640px"}}>
                  <div style={{...MONO_LABEL, marginBottom: "6px"}}>Job</div>
                  <button onClick={V.toggleJp} aria-haspopup="listbox" aria-expanded={V.jpOpen ? "true" : "false"} style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", width: "100%", textAlign: "left", background: "var(--c-hex-0b120e)", border: "1.5px solid var(--c-rgba-16-185-129-55)", borderRadius: "12px", padding: "12px 16px", minHeight: "64px", color: "var(--c-hex-e9f0ea)", cursor: "pointer"}}>
                    <span style={{display: "flex", flexDirection: "column", gap: "2px", minWidth: "0"}}>
                      <span style={{fontSize: "18px", fontWeight: "800"}}>{V.selRole}</span>
                      <span style={{fontSize: "13px", color: "var(--c-hex-8fa396)"}}>{V.selMeta}</span>
                    </span>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", color: "var(--c-hex-8fa396)", flexShrink: "0"}}>{V.jpOpen ? "▴" : "▾"}</span>
                  </button>
                  {V.jpOpen ? (<>
                    <div onClick={V.closeJp} style={{position: "fixed", inset: "0", zIndex: "19"}} aria-hidden="true"></div>
                    <div style={{position: "absolute", top: "calc(100% + 8px)", left: "0", width: "100%", background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-22)", borderRadius: "14px", boxShadow: "0 18px 40px var(--c-rgba-0-0-0-45)", zIndex: "20", display: "flex", flexDirection: "column", maxHeight: "560px"}}>
                      <div style={{padding: "12px 12px 10px", display: "flex", flexDirection: "column", gap: "8px", borderBottom: "1px solid var(--c-rgba-160-190-170-12)"}}>
                        <input autoFocus value={(V.jpQ) ?? ''} onChange={V.setJpQ} placeholder="Search by school or role" style={INPUT} />
                        <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "var(--c-hex-a7b5ab)", cursor: "pointer", minHeight: "28px"}}>
                          <input type="checkbox" checked={!!(V.jpShowClosed)} onChange={V.toggleJpClosed} style={{width: "16px", height: "16px", accentColor: "var(--c-hex-10b981)"}} />
                          {V.jpClosedTxt}
                        </label>
                      </div>
                      <div role="listbox" aria-label="Jobs" style={{overflowY: "auto", padding: "6px 8px 8px"}}>
                        {(V.jpGroups ?? []).map((g: any, $index: number) => (<React.Fragment key={$index}>
                          <div style={{padding: "12px 8px 4px", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px"}}>
                            <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "700", letterSpacing: ".12em", color: "var(--c-hex-a7b5ab)"}}>{g?.school}</span>
                            <span style={{fontSize: "11.5px", color: "var(--c-hex-7e9186)"}}>{g?.summary}</span>
                          </div>
                          {(g?.jobs ?? []).map((j: any, $i2: number) => (<React.Fragment key={$i2}>
                            <button role="option" aria-selected={j?.selected ? "true" : "false"} onClick={j?.pick} style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", width: "100%", textAlign: "left", border: "none", borderRadius: "10px", padding: "10px 12px", minHeight: "48px", cursor: "pointer", background: j?.rowBg, boxShadow: j?.rowShadow, color: "var(--c-hex-e9f0ea)"}} className="ps6">
                              <span style={{display: "flex", flexDirection: "column", gap: "2px", minWidth: "0"}}>
                                <span style={{fontWeight: "700", fontSize: "13.5px", color: j?.roleColor}}>{j?.role}</span>
                                {j?.dup ? (<span style={{fontSize: "12px", color: "var(--c-hex-e9d9b0)"}}>{j?.dupNote}</span>) : null}
                              </span>
                              <span style={{display: "flex", alignItems: "center", gap: "8px", flexShrink: "0"}}>
                                {j?.inactive ? (<span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", color: "var(--c-hex-8fa396)", border: "1px solid var(--c-rgba-160-190-170-25)", borderRadius: "6px", padding: "2px 6px"}}>{j?.statusText}</span>) : null}
                                <span style={{minWidth: "32px", textAlign: "center", fontWeight: "800", fontSize: "12.5px", borderRadius: "99px", padding: "3px 9px", background: j?.countBg, color: j?.countFg}}>{j?.count}</span>
                              </span>
                            </button>
                          </React.Fragment>))}
                        </React.Fragment>))}
                        {V.jpNoResults ? (<p style={{margin: "0", padding: "22px 12px", color: "var(--c-hex-8fa396)", textAlign: "center", fontSize: "13px"}}>No jobs match that search.</p>) : null}
                      </div>
                      {V.boardIsMgr ? (<>
                        <div style={{borderTop: "1px solid var(--c-rgba-160-190-170-12)", padding: "8px"}}>
                          <button onClick={V.toggleNewJob} style={{width: "100%", textAlign: "left", border: "none", background: "transparent", borderRadius: "10px", padding: "10px 12px", minHeight: "40px", color: "var(--c-hex-34d399)", fontWeight: "800", fontSize: "13px", cursor: "pointer"}} className="ps6">+ New job</button>
                        </div>
                      </>) : null}
                    </div>
                  </>) : null}
                </div>
                {V.boardIsMgr && V.boardLive && V.hasSelJob ? (<>
                  <div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
                    <button onClick={V.copyApply} style={{...CHIP_BTN, padding: "10px 14px", minHeight: "44px"}}>Copy application link</button>
                    <button onClick={V.toggleJs} aria-expanded={V.jsOpen ? "true" : "false"} style={{...GHOST_BTN, padding: "10px 14px", minHeight: "44px", color: V.jsOpen ? "var(--c-hex-e9f0ea)" : "var(--c-hex-a7b5ab)"}}>{V.jsLabel}</button>
                  </div>
                </>) : null}
              </div>
              {V.boardMsg ? (<div style={{fontSize: "12px", color: "var(--c-hex-34d399)", wordBreak: "break-all"}}>{V.boardMsg}</div>) : null}
              {V.jsOpen && V.hasSelJob ? (<>
                <div style={{borderTop: "1px solid var(--c-rgba-160-190-170-12)", paddingTop: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "16px 22px"}}>
                  <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                    <div style={SLBL}>Status</div>
                    <select value={(V.boardStatus) ?? ''} onChange={V.setJobStatus} style={{...INPUT, width: "auto", padding: "8px 10px", fontSize: "12.5px"}}>
                      {(V.jobStatusOpts ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}><option value={o?.id}>{o?.label}</option></React.Fragment>))}
                    </select>
                    <span style={{fontSize: "11.5px", color: "var(--c-hex-5c6b61)", lineHeight: "1.5"}}>Flips to Filled on its own when a hire’s start date is confirmed.</span>
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                    <div style={SLBL}>Links</div>
                    <div style={{display: "flex", flexWrap: "wrap", gap: "6px"}}>
                      <button onClick={V.toggleApply} title="Candidates open the application link, enter their own details, and start the assessment" style={{...GHOST_BTN, color: V.boardApplyOn ? "var(--c-hex-34d399)" : "var(--c-hex-f5b84a)"}}>{V.boardApplyOn ? 'Applications: on' : 'Applications: off'}</button>
                      <button onClick={V.copyShare} style={GHOST_BTN}>Copy board link</button>
                      <button onClick={V.toggleShare} title="A read-only view of this board for people outside the team — names and stages, no scores" style={{...GHOST_BTN, color: V.boardShareOn ? "var(--c-hex-34d399)" : "var(--c-hex-f5b84a)"}}>{V.boardShareOn ? 'Sharing: on' : 'Sharing: off'}</button>
                    </div>
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                    <div style={SLBL}>Careers page posting</div>
                    <div style={{display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px"}}>
                      <span style={{fontSize: "12.5px", color: V.postStatusColor}}>{V.postStatusTxt}</span>
                      <button onClick={V.togglePost} style={GHOST_BTN}>{V.postToggleLabel}</button>
                      <button onClick={V.togglePosted} style={{...CHIP_BTN, color: V.postOn ? "var(--c-hex-f5b84a)" : "var(--c-hex-34d399)", border: V.postOn ? "1px solid var(--c-rgba-245-184-74-35)" : "1px solid var(--c-rgba-16-185-129-35)"}}>{V.postOn ? 'Remove from careers page' : 'Post on careers page'}</button>
                    </div>
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                    <div style={SLBL}>Tracking links</div>
                    <div style={{display: "flex", flexWrap: "wrap", gap: "6px"}}>
                      <button onClick={V.copyCareers} style={GHOST_BTN}>Careers page</button>
                      {(V.channelLinks ?? []).map((l: any, $index: number) => (<React.Fragment key={$index}><button onClick={l?.copy} style={GHOST_BTN}>{l?.label}</button></React.Fragment>))}
                    </div>
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                    <div style={SLBL}>Sources</div>
                    <span style={{fontSize: "12.5px", color: "var(--c-hex-a7b5ab)", lineHeight: "1.5"}}>{V.sourcesText}</span>
                    {(V.boardCampaigns ?? []).map((c: any, $index: number) => (<React.Fragment key={$index}><div style={{fontSize: "12px", color: "var(--c-hex-8fa396)"}}><b style={{color: "var(--c-hex-d5ded7)"}}>{c?.n}</b>{" · "}{c?.label}</div></React.Fragment>))}
                  </div>
                  {V.hasDups ? (<>
                    <div style={{display: "flex", flexDirection: "column", gap: "8px", gridColumn: "1 / -1", background: "var(--c-rgba-245-184-74-07)", border: "1px solid var(--c-rgba-245-184-74-35)", borderRadius: "12px", padding: "12px 14px"}}>
                      <div style={{...SLBL, color: "var(--c-hex-e9d9b0)"}}>Likely duplicates</div>
                      <span style={{fontSize: "12.5px", color: "var(--c-hex-e9d9b0)"}}>{V.dupTitle}</span>
                      {(V.dupList ?? []).map((d: any, $index: number) => (<React.Fragment key={$index}><div style={{fontSize: "12.5px", color: "var(--c-hex-d5ded7)"}}>{"· "}{d?.label}</div></React.Fragment>))}
                      <div><button onClick={V.mergeDups} disabled={!!V.mergeBusy} style={{...CHIP_BTN, color: "var(--c-hex-04120b)", background: "var(--c-hex-f5b84a)", border: "none", fontWeight: "800"}}>{V.mergeBusy ? 'Merging…' : V.mergeLabel}</button><span style={{fontSize: "11.5px", color: "var(--c-hex-8fa396)", marginLeft: "10px"}}>Candidates move to the job you keep; the other links keep working and land here.</span></div>
                    </div>
                  </>) : null}
                </div>
                {V.postOpen ? (<>
                  <div style={{borderTop: "1px solid var(--c-rgba-160-190-170-12)", paddingTop: "14px"}}>
                    <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "10px"}}>
                      {(V.postFields ?? []).map((f: any, $index: number) => (<React.Fragment key={$index}><input value={(f?.val) ?? ''} onChange={f?.set} placeholder={f?.ph} style={INPUT} /></React.Fragment>))}
                      <select value={(V.postType) ?? ''} onChange={V.setPostType} style={INPUT}>
                        {(V.postTypes ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}><option value={o?.id}>{o?.label}</option></React.Fragment>))}
                      </select>
                    </div>
                    <textarea value={(V.postDesc) ?? ''} onChange={V.setPostDesc} rows={6} placeholder="Describe the role the way you would on Teamworks: what the job is, who thrives in it, what a week looks like, comp structure, start date. Plain text; blank lines make paragraphs." style={{...STA, marginTop: "10px"}} />
                    <div style={{display: "flex", gap: "10px", alignItems: "center", marginTop: "10px", flexWrap: "wrap"}}>
                      <button onClick={V.savePosting} disabled={!V.postDirty || V.postBusy} style={{background: V.postDirty ? "var(--c-hex-10b981)" : "var(--c-hex-20302680)", color: "var(--c-hex-04120b)", border: "none", borderRadius: "9px", padding: "9px 16px", fontSize: "12.5px", fontWeight: "800", cursor: "pointer"}}>{V.postBusy ? 'Saving…' : 'Save posting'}</button>
                      {V.postMsg ? (<span style={{fontSize: "12.5px", color: "var(--c-hex-34d399)", fontWeight: "700"}}>{V.postMsg}</span>) : null}
                    </div>
                  </div>
                </>) : null}
              </>) : null}
            </div>
            <div style={{display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "12px"}}>
              <div style={{display: "flex", alignItems: "baseline", gap: "12px", flexWrap: "wrap", flex: "1"}}>
                <h2 style={{margin: "0", fontSize: "20px", fontWeight: "900"}}>Pipeline</h2>
                <span style={{fontSize: "12.5px", color: "var(--c-hex-8fa396)"}}>{V.pipelineSummary}</span>
              </div>
              {V.hasToNotify ? (<span style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--c-rgba-245-184-74-1)", border: "1px solid var(--c-rgba-245-184-74-45)", color: "var(--c-hex-e9d9b0)", borderRadius: "999px", padding: "6px 14px", fontWeight: "700", fontSize: "12.5px"}}>{"☐ "}{V.toNotifyText}</span>) : null}
              {V.allNotified ? (<span style={{display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--c-rgba-16-185-129-1)", border: "1px solid var(--c-rgba-16-185-129-35)", color: "var(--c-hex-34d399)", borderRadius: "999px", padding: "6px 14px", fontWeight: "700", fontSize: "12.5px"}}>{"✓ Everyone with a decision has been told"}</span>) : null}
            </div>
            {V.stranded ? (<>
              <div style={{background: "var(--c-rgba-245-184-74-07)", border: "1px solid var(--c-rgba-245-184-74-4)", borderRadius: "14px", padding: "14px 18px", marginBottom: "12px", display: "flex", flexDirection: "column", gap: "10px"}}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap"}}>
                  <div style={{flex: "1 1 320px"}}>
                    <div style={{fontSize: "13.5px", fontWeight: "800", color: "var(--c-hex-e9d9b0)"}}>{"⚠ "}{V.strandedText}</div>
                    <div style={{fontSize: "12px", color: "var(--c-hex-8fa396)", marginTop: "2px"}}>They don’t show in any column below until they’re moved.</div>
                  </div>
                  {V.boardIsMgr ? (<>
                    <div style={{display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap"}}>
                      <span style={{fontSize: "12.5px", color: "var(--c-hex-e9d9b0)"}}>Move all to</span>
                      <select value={(V.moveTo) ?? ''} onChange={V.setMoveTo} style={{...INPUT, width: "auto", padding: "8px 10px", fontSize: "12.5px"}}>
                        {(V.moveToOpts ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}><option value={o?.id}>{o?.label}</option></React.Fragment>))}
                      </select>
                      <button onClick={V.moveAllStranded} style={{...CHIP_BTN, color: "var(--c-hex-04120b)", background: "var(--c-hex-f5b84a)", border: "none", fontWeight: "800"}}>Move</button>
                      <button onClick={V.toggleStranded} style={{...GHOST_BTN, color: "var(--c-hex-e9d9b0)", border: "1px solid var(--c-rgba-245-184-74-35)"}}>{V.strandedNamesLabel}</button>
                    </div>
                  </>) : null}
                </div>
                {V.strandedOpen ? (<div style={{display: "flex", flexWrap: "wrap", gap: "6px"}}>{(V.strandedNames ?? []).map((n: any, $index: number) => (<span key={$index} style={{background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-245-184-74-3)", borderRadius: "999px", padding: "4px 10px", fontSize: "12.5px"}}>{n}</span>))}</div>) : null}
              </div>
            </>) : null}
            {V.hasUnassigned ? (<>
              <div style={{...SCARD, borderColor: "var(--c-rgba-245-184-74-35)", padding: "14px 22px", marginBottom: "12px"}}>
                <div style={{...SLBL, color: "var(--c-hex-e9d9b0)"}}>Not on any job yet</div>
                <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                  {(V.boardUnassigned ?? []).map((u: any, $index: number) => (<React.Fragment key={$index}>
                    <div style={{display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap"}}>
                      <span style={{fontSize: "13.5px", fontWeight: "700"}}>{u?.name}</span>
                      <span style={{fontSize: "12px", color: "var(--c-hex-8fa396)", flex: "1"}}>{u?.sub}</span>
                      <select value="" onChange={u?.assign} style={{...INPUT, width: "auto", padding: "7px 10px", fontSize: "12px"}}>
                        {(u?.jobOpts ?? []).map((o: any, $i2: number) => (<React.Fragment key={$i2}><option value={o?.id}>{o?.label}</option></React.Fragment>))}
                      </select>
                    </div>
                  </React.Fragment>))}
                </div>
              </div>
            </>) : null}
            <div role="region" aria-label="Pipeline stages, scrolls sideways" tabIndex={0} style={{display: "flex", gap: "12px", alignItems: "flex-start", overflowX: "auto", paddingBottom: "12px"}}>
              {(V.boardCols ?? []).map((col: any, $index: number) => (<React.Fragment key={$index}>
                <div style={{flex: "0 0 232px", boxSizing: "border-box", background: col?.colBg, border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "12px", display: "flex", flexDirection: "column", gap: "10px", minHeight: "300px"}}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", padding: "2px 2px 0", minHeight: "38px"}}>
                    <span style={{display: "flex", flexDirection: "column", gap: "2px", minWidth: "0"}}>
                      <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "700", letterSpacing: ".1em", textTransform: "uppercase", color: col?.headColor}}>{col?.name}</span>
                      {col?.sub ? (<span style={{fontSize: "11px", color: "var(--c-hex-7e9186)", lineHeight: "1.4"}}>{col?.sub}</span>) : null}
                    </span>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "var(--c-hex-5c6b61)"}}>{col?.count}</span>
                  </div>
                  {col?.isEmpty ? (<div style={{flex: "1", border: "1.5px dashed var(--c-rgba-160-190-170-2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", color: "var(--c-hex-5c6b61)", fontSize: "12.5px", textAlign: "center", lineHeight: "1.5"}}>{col?.empty}</div>) : null}
                  {(col?.cards ?? []).map((c: any, $i2: number) => (<React.Fragment key={$i2}>
                    <div style={{background: c?.cardBg, border: c?.cardBorder, borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "10px"}}>
                      <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px"}}>
                        <button onClick={c?.openProfile} style={{background: "none", border: "none", padding: "0", color: c?.nameColor, fontSize: "13.5px", fontWeight: "800", cursor: "pointer", textAlign: "left", flex: "1"}}>{c?.name}</button>
                        {c?.grade ? (<span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", fontWeight: "800", color: c?.gradeColor, border: `1px solid ${c?.gradeColor}`, borderRadius: "6px", padding: "1px 6px"}}>{c?.grade}</span>) : null}
                      </div>
                      {c?.sub || c?.band ? (<div style={{fontSize: "11px", color: "var(--c-hex-7e9186)", lineHeight: "1.45", marginTop: "-6px"}}>{[c?.sub, c?.band].filter(Boolean).join(' · ')}</div>) : null}
                      {c?.needsDecision && c?.canAct ? (<>
                        <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                          <button onClick={c?.fwd} style={{border: "1px solid var(--c-rgba-16-185-129-35)", background: "var(--c-rgba-16-185-129-12)", color: "var(--c-hex-34d399)", borderRadius: "9px", padding: "9px 10px", minHeight: "40px", fontWeight: "700", fontSize: "12.5px", cursor: "pointer", textAlign: "left"}}>{c?.fwdLabel}</button>
                          {c?.canSkip ? (<button onClick={c?.skip} style={{border: "1px dashed var(--c-rgba-16-185-129-4)", background: "transparent", color: "var(--c-hex-34d399)", borderRadius: "9px", padding: "9px 10px", minHeight: "40px", fontWeight: "700", fontSize: "12.5px", cursor: "pointer", textAlign: "left"}}>Skip mock pitch → VP interview</button>) : null}
                          <button onClick={c?.no} style={{border: "1px solid var(--c-rgba-160-190-170-2)", background: "transparent", color: "var(--c-hex-a7b5ab)", borderRadius: "9px", padding: "9px 10px", minHeight: "40px", fontWeight: "700", fontSize: "12.5px", cursor: "pointer", textAlign: "left"}}>{c?.noLabel}</button>
                        </div>
                      </>) : null}
                      {c?.pending ? (<>
                        <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                          <span style={{fontSize: "12.5px", fontWeight: "700", color: c?.tagColor}}>{c?.decisionText}</span>
                          {c?.showStart ? (<input type="date" value={(c?.startDate) ?? ''} onChange={c?.setStart} style={{...INPUT, padding: "8px 10px", fontSize: "12.5px", colorScheme: "var(--scheme)"} as any} />) : null}
                          {c?.canAct ? (<>
                            <label style={{display: "flex", alignItems: "flex-start", gap: "10px", background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-245-184-74-5)", borderRadius: "9px", padding: "10px", minHeight: "44px", boxSizing: "border-box", cursor: "pointer", fontSize: "12.5px", color: "var(--c-hex-e9d9b0)", lineHeight: "1.4"}}>
                              <input type="checkbox" checked={false} onChange={c?.inform} style={{width: "18px", height: "18px", margin: "0", flexShrink: "0", accentColor: "var(--c-hex-10b981)"}} />
                              <span>{c?.informLabel}</span>
                            </label>
                            <button onClick={c?.undo} style={{alignSelf: "flex-start", border: "none", background: "transparent", color: "var(--c-hex-8fa396)", textDecoration: "underline", fontSize: "12px", padding: "2px 0", cursor: "pointer"}}>Change decision</button>
                          </>) : (<span style={{fontSize: "12px", color: "var(--c-hex-e9d9b0)"}}>Waiting to be told</span>)}
                        </div>
                      </>) : null}
                      {c?.done ? (<span style={{fontSize: "12px", color: "var(--c-hex-a7b5ab)"}}>{"✓ "}{c?.doneText}</span>) : null}
                      <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: "var(--c-hex-5c6b61)"}}>{c?.days}{" in stage"}</span>
                    </div>
                  </React.Fragment>))}
                </div>
              </React.Fragment>))}
            </div>
          </>)}
        </div>
      </>) : null}
      {V.vProfile ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <button onClick={V.goPipe} style={{background: "none", border: "none", color: "var(--c-hex-8fa396)", fontSize: "13px", cursor: "pointer", padding: "0", marginBottom: "16px"}} className="ps2">← Pipeline</button>
          <div style={{display: "flex", alignItems: "center", gap: "20px", marginBottom: "22px", flexWrap: "wrap"}}>
            <div>
              <h1 style={{margin: "0", fontSize: "28px", fontWeight: "900", letterSpacing: "-.015em"}}>{V.pName}</h1>
              <div style={{fontSize: "13px", color: "var(--c-hex-8fa396)", marginTop: "4px"}}>{V.pSub}</div>
            </div>
            <div style={{marginLeft: "auto", display: "flex", alignItems: "center", gap: "20px"}}>
              {V.canViewAs ? (<>
                <button onClick={V.pViewAs} style={{background: "transparent", color: "var(--c-hex-5b9bff)", border: "1px solid var(--c-rgba-91-155-255-35)", borderRadius: "9px", padding: "9px 14px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer"}}>View as candidate</button>
              </>) : null}
              <div style={{textAlign: "right"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>Peak Sales Readiness</div>
                <div style={{fontFamily: "'Barlow Condensed',sans-serif", fontSize: "60px", fontWeight: "800", color: "var(--c-hex-34d399)", lineHeight: "1"}}>
                  {V.pReadiness}
                  <span style={{fontSize: "18px", color: "var(--c-hex-5c6b61)"}}>{" / 5"}</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "18px 22px", marginBottom: "20px"}}>
            <div style={{display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "12px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", flex: "1"}}>Candidate details</div>
              {V.pHasResume ? (<>
                <button onClick={V.openResume} style={{background: "transparent", color: "var(--c-hex-34d399)", border: "1px solid var(--c-rgba-16-185-129-35)", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer"}}>{"Open résumé · " + V.pResumeName}</button>
              </>) : (<>
                <span style={{fontSize: "12px", color: "var(--c-hex-5c6b61)"}}>No résumé on file</span>
              </>)}
              {V.pCaseFile ? (<>
                <button onClick={V.openCaseFile} style={{background: "transparent", color: "var(--c-hex-34d399)", border: "1px solid var(--c-rgba-16-185-129-35)", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer"}}>{"Exercise B file · " + V.pCaseFile}</button>
              </>) : null}
              {V.pLinkedinHref ? (<>
                <a href={V.pLinkedinHref} target="_blank" rel="noreferrer" style={{color: "var(--c-hex-5b9bff)", fontSize: "12px", fontWeight: "700", textDecoration: "none", border: "1px solid var(--c-rgba-91-155-255-35)", borderRadius: "8px", padding: "7px 13px"}}>LinkedIn</a>
              </>) : null}
            </div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "10px 18px"}}>
              {(V.pDetails ?? []).map((d: any, $index: number) => (<React.Fragment key={$index}>
                <div>
                  <div style={MONO_LABEL}>{d?.label}</div>
                  <div style={{fontSize: "13px", color: "var(--c-hex-d5ded7)", marginTop: "3px", wordBreak: "break-word"}}>{d?.val}</div>
                </div>
              </React.Fragment>))}
            </div>
            {V.pFileMsg ? (<><div style={{fontSize: "12px", color: "var(--c-hex-f5b84a)", marginTop: "10px"}}>{V.pFileMsg}</div></>) : null}
            {V.pCanEdit ? (<>
              <div style={{marginTop: "14px"}}>
                <div style={MONO_LABEL}>Staff notes · never shown to the candidate or to evaluators</div>
                <textarea value={(V.pNotes) ?? ''} onChange={V.setPNotes} rows={2} placeholder="Phone-screen impressions, referral source, availability…" style={{...INPUT, marginTop: "6px", resize: "vertical", lineHeight: "1.5"}} />
                {V.notesDirty ? (<>
                  <button onClick={V.savePNotes} style={{background: "var(--c-hex-10b981)", color: "var(--c-hex-04120b)", border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", fontWeight: "800", cursor: "pointer", marginTop: "8px"}}>Save notes</button>
                </>) : null}
              </div>
            </>) : null}
          </div>
          {V.pNeedsScore ? (<>
            <div style={{background: "var(--c-rgba-245-184-74-06)", border: "1px solid var(--c-rgba-245-184-74-4)", borderRadius: "12px", padding: "14px 20px", marginBottom: "20px", display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap"}}>
              <span style={{fontSize: "13px", color: "var(--c-hex-e9d9b0)", lineHeight: "1.55", flex: "1"}}>Sales Decisions answers are in, but the report has not been scored yet.</span>
              <button onClick={V.rescore} style={{background: "var(--c-hex-f5b84a)", color: "var(--c-hex-04120b)", border: "none", borderRadius: "9px", padding: "9px 16px", fontSize: "12.5px", fontWeight: "800", cursor: "pointer"}}>Score now</button>
              {V.pScoreMsg ? (<><span style={{fontSize: "12.5px", color: "var(--c-hex-34d399)", fontWeight: "700"}}>{V.pScoreMsg}</span></>) : null}
            </div>
          </>) : null}
          {V.rpNeedsEvidence ? (<>
            <div style={{background: "var(--c-rgba-245-184-74-06)", border: "1px solid var(--c-rgba-245-184-74-4)", borderRadius: "12px", padding: "14px 20px", marginBottom: "20px", display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap"}}>
              <span style={{fontSize: "13px", color: "var(--c-hex-e9d9b0)", lineHeight: "1.55", flex: "1"}}>This report was scored before answer-level evidence was recorded. Re-score to see which questions and answers sit behind each flag and follow-up.</span>
              <button onClick={V.rescore} style={{background: "var(--c-hex-f5b84a)", color: "var(--c-hex-04120b)", border: "none", borderRadius: "9px", padding: "9px 16px", fontSize: "12.5px", fontWeight: "800", cursor: "pointer"}}>Re-score with evidence</button>
              {V.pScoreMsg ? (<><span style={{fontSize: "12.5px", color: "var(--c-hex-34d399)", fontWeight: "700"}}>{V.pScoreMsg}</span></>) : null}
            </div>
          </>) : null}
          {V.pHasReport ? (<>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "24px 26px", marginBottom: "20px"}}>
              <div style={{display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap"}}>
                <div style={{minWidth: "200px", maxWidth: "280px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>Sales decisions · scouting report</div>
                  <div style={{display: "flex", alignItems: "baseline", gap: "8px", marginTop: "8px"}}>
                    <span style={{fontFamily: "'Barlow Condensed',sans-serif", fontSize: "84px", fontWeight: "800", lineHeight: ".85", color: V.rpColor}}>{V.rpOverall}</span>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", color: "var(--c-hex-5c6b61)"}}>/ 100</span>
                  </div>
                  <div style={{marginTop: "12px"}}>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--c-hex-04120b)", padding: "4px 10px", borderRadius: "99px", background: V.rpColor}}>{V.rpBand}</span>
                  </div>
                  <p style={{margin: "10px 0 0", fontSize: "12.5px", color: "var(--c-hex-a7b5ab)", lineHeight: "1.55"}}>{V.rpNote}</p>
                  {V.rpPilot ? (<>
                    <div style={{marginTop: "10px", fontSize: "12px", color: "var(--c-hex-e9d9b0)", lineHeight: "1.55", background: "var(--c-rgba-245-184-74-07)", border: "1px solid var(--c-rgba-245-184-74-3)", borderRadius: "10px", padding: "10px 12px"}}>{V.rpPilotNote}</div>
                  </>) : null}
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--c-hex-5c6b61)", marginTop: "12px", lineHeight: "1.5"}}>{V.rpProfile}</div>
                  <div style={{fontSize: "11.5px", color: "var(--c-hex-5c6b61)", marginTop: "4px"}}>{V.rpScen}{V.rpPace ? " · " + V.rpPace : ""}</div>
                  {V.rpTooFast ? (<>
                    <div style={{marginTop: "10px", fontSize: "12.5px", color: "var(--c-hex-f87171)", lineHeight: "1.55", background: "var(--c-rgba-248-113-113-07)", border: "1px solid var(--c-rgba-248-113-113-35)", borderRadius: "10px", padding: "10px 12px", fontWeight: "700"}}>Answered too quickly to have read the items — treat this report as unreliable, not as a result.</div>
                  </>) : null}
                  {V.rpCanRescore ? (<>
                    <div style={{display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginTop: "14px"}}>
                      <button onClick={V.rescore} style={{background: "transparent", color: "var(--c-hex-34d399)", border: "1px solid var(--c-rgba-16-185-129-35)", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer"}}>Re-score with current rubric</button>
                      <span style={{fontSize: "11.5px", color: V.rpScoredStale ? "var(--c-hex-e9d9b0)" : "var(--c-hex-5c6b61)", lineHeight: "1.5"}}>{V.rpScoredTxt}</span>
                      {V.pScoreMsg ? (<span style={{fontSize: "12px", color: "var(--c-hex-34d399)", fontWeight: "700"}}>{V.pScoreMsg}</span>) : null}
                    </div>
                  </>) : null}
                </div>
                <div style={{flex: "1", minWidth: "320px"}}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px", gap: "12px", flexWrap: "wrap"}}>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>Competencies · ▏ floor · ★ critical</div>
                    <div style={{fontSize: "11px", color: "var(--c-hex-5c6b61)"}}>self-report + scenarios, 0–100</div>
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                    {(V.rpComps ?? []).map((c: any, $index: number) => (<React.Fragment key={$index}>
                      <div>
                        <div style={{display: "flex", justifyContent: "space-between", fontSize: "12.5px", marginBottom: "4px", gap: "10px"}}>
                          <span style={{fontWeight: "600"}}>
                            {c?.name}{" "}
                            <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: "var(--c-hex-5c6b61)", marginLeft: "4px"}}>{c?.meta}</span>
                          </span>
                          <span style={{fontFamily: "'JetBrains Mono',monospace", fontWeight: "700", color: c?.color}}>{c?.scoreTxt}</span>
                        </div>
                        <div style={{position: "relative", height: "8px", background: "var(--c-hex-0b120e)", borderRadius: "99px"}}>
                          <div style={{position: "absolute", left: "0", top: "0", height: "100%", width: c?.pct, background: c?.color, borderRadius: "99px"}} />
                          <div style={{position: "absolute", left: c?.floorPct, top: "-3px", width: "2px", height: "14px", background: "var(--c-rgba-233-240-234-5)"}} />
                        </div>
                      </div>
                    </React.Fragment>))}
                  </div>
                </div>
              </div>
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "14px", marginTop: "22px"}}>
                <div style={{background: "var(--c-hex-0b120e)", borderRadius: "12px", padding: "16px 18px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-f87171)", marginBottom: "10px"}}>{"Red flags · "}{V.rpFlagCount}</div>
                  {V.rpNoFlags ? (<>
                    <div style={{fontSize: "12.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.5"}}>None — no chosen option carried a red-flag label.</div>
                  </>) : null}
                  <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                    {(V.rpFlags ?? []).map((f: any, $index: number) => (<React.Fragment key={$index}>
                      <div style={{borderTop: $index ? "1px solid var(--c-rgba-160-190-170-08)" : "none", paddingTop: $index ? "10px" : "0"}}>
                        <div style={{display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap"}}>
                          <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: f?.fg, padding: "3px 7px", borderRadius: "99px", background: f?.bg}}>{f?.sev}</span>
                          <span style={{fontSize: "13px", fontWeight: "700"}}>{f?.label}</span>
                          <span style={{fontSize: "11px", color: "var(--c-hex-5c6b61)"}}>{f?.comp}</span>
                        </div>
                        <div style={{fontSize: "12px", color: "var(--c-hex-8fa396)", lineHeight: "1.5", marginTop: "6px"}}>
                          <span style={{color: "var(--c-hex-5c6b61)"}}>Question · </span>{f?.context}
                        </div>
                        {f?.chosen ? (<>
                          <div style={{fontSize: "12px", color: "var(--c-hex-f0a070)", lineHeight: "1.5", marginTop: "4px"}}>
                            <span style={{color: "var(--c-hex-5c6b61)"}}>They chose · </span>{f?.chosen}
                          </div>
                        </>) : null}
                        {f?.better ? (<>
                          <div style={{fontSize: "12px", color: "var(--c-hex-34d399)", lineHeight: "1.5", marginTop: "4px"}}>
                            <span style={{color: "var(--c-hex-5c6b61)"}}>Strongest option · </span>{f?.better}
                          </div>
                        </>) : null}
                        {f?.why ? (<>
                          <div style={{fontSize: "11.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.5", marginTop: "6px", paddingLeft: "10px", borderLeft: "2px solid var(--c-rgba-160-190-170-15)"}}>
                            <span style={{color: "var(--c-hex-5c6b61)"}}>Why it scores this way · </span>{f?.why}
                          </div>
                        </>) : null}
                      </div>
                    </React.Fragment>))}
                  </div>
                </div>
                <div style={{background: "var(--c-hex-0b120e)", borderRadius: "12px", padding: "16px 18px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-34d399)", marginBottom: "10px"}}>{"Positive signals · "}{V.rpPosCount}</div>
                  <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                    {(V.rpPositives ?? []).map((s: any, $index: number) => (<React.Fragment key={$index}>
                      <div style={{fontSize: "12.5px", color: "var(--c-hex-d5ded7)", lineHeight: "1.5", borderTop: $index ? "1px solid var(--c-rgba-160-190-170-08)" : "none", paddingTop: $index ? "8px" : "0"}}>
                        <div>
                          {"· "}<b>{s?.label}</b>{" "}
                          <span style={{color: "var(--c-hex-5c6b61)"}}>{"— "}{s?.comp}</span>
                        </div>
                        {s?.context ? (<>
                          <div style={{fontSize: "11.5px", color: "var(--c-hex-8fa396)", marginTop: "3px", lineHeight: "1.5"}}><span style={{color: "var(--c-hex-5c6b61)"}}>Question · </span>{s?.context}</div>
                          <div style={{fontSize: "11.5px", color: "var(--c-hex-34d399)", marginTop: "2px", lineHeight: "1.5"}}><span style={{color: "var(--c-hex-5c6b61)"}}>They chose · </span>{s?.chosen}</div>
                        </>) : null}
                      </div>
                    </React.Fragment>))}
                  </div>
                </div>
                <div style={{background: "var(--c-hex-0b120e)", borderRadius: "12px", padding: "16px 18px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-f5b84a)", marginBottom: "10px"}}>Read with care</div>
                  {V.rpNoConsistency ? (<>
                    <div style={{fontSize: "12.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.5"}}>Self-ratings and scenario choices are consistent.</div>
                  </>) : null}
                  <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                    {(V.rpConsistency ?? []).map((s: any, $index: number) => (<React.Fragment key={$index}>
                      <div>
                        <div style={{fontSize: "12.5px", color: "var(--c-hex-d5ded7)", lineHeight: "1.55"}}>{s?.t}</div>
                        {(s?.evidence ?? []).map((e: any, $i2: number) => (<React.Fragment key={$i2}>
                          <div style={{fontSize: "11.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.5", marginTop: "5px", paddingLeft: "10px", borderLeft: "2px solid var(--c-rgba-160-190-170-15)"}}>
                            <span style={{color: "var(--c-hex-5c6b61)"}}>{e?.kind}{" · "}</span>{e?.q}
                            <div><span style={{color: "var(--c-hex-5c6b61)"}}>Answer · </span><span style={{color: e?.color}}>{e?.answer}</span><span style={{color: "var(--c-hex-5c6b61)"}}>{" · "}{e?.signal}</span></div>
                          </div>
                        </React.Fragment>))}
                      </div>
                    </React.Fragment>))}
                  </div>
                </div>
              </div>
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "14px", marginTop: "14px"}}>
                <div style={{background: "var(--c-hex-0b120e)", borderRadius: "12px", padding: "16px 18px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "10px"}}>Suggested interview follow-ups</div>
                  <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                    {(V.rpFollowUps ?? []).map((f: any, $index: number) => (<React.Fragment key={$index}>
                      <div style={{borderTop: $index ? "1px solid var(--c-rgba-160-190-170-08)" : "none", paddingTop: $index ? "10px" : "0"}}>
                        <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", letterSpacing: ".06em", color: "var(--c-hex-34d399)"}}>{f?.comp}{" · "}{f?.why}</div>
                        <div style={{fontSize: "13px", color: "var(--c-hex-d5ded7)", lineHeight: "1.55", marginTop: "3px"}}>{f?.q}</div>
                        {f?.reasons ? (<>
                          <div style={{fontSize: "11.5px", color: "var(--c-hex-8fa396)", marginTop: "5px", lineHeight: "1.5"}}><span style={{color: "var(--c-hex-5c6b61)"}}>Why it’s here · </span>{f?.reasons}</div>
                        </>) : null}
                        {(f?.evidence ?? []).map((e: any, $i2: number) => (<React.Fragment key={$i2}>
                          <div style={{fontSize: "11.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.5", marginTop: "5px", paddingLeft: "10px", borderLeft: "2px solid var(--c-rgba-160-190-170-15)"}}>
                            <span style={{color: "var(--c-hex-5c6b61)"}}>{e?.kind}{" · "}</span>{e?.q}
                            <div><span style={{color: "var(--c-hex-5c6b61)"}}>Answer · </span><span style={{color: e?.color}}>{e?.answer}</span><span style={{color: "var(--c-hex-5c6b61)"}}>{" · "}{e?.signal}</span></div>
                            {e?.best ? (<div><span style={{color: "var(--c-hex-5c6b61)"}}>Strongest option · </span><span style={{color: "var(--c-hex-34d399)"}}>{e?.best}</span></div>) : null}
                          </div>
                        </React.Fragment>))}
                      </div>
                    </React.Fragment>))}
                  </div>
                </div>
                <div style={{background: "var(--c-hex-0b120e)", borderRadius: "12px", padding: "16px 18px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "10px"}}>Reference-call prompts</div>
                  <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                    {(V.rpRefs ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}>
                      <div>
                        <div style={{fontSize: "13px", color: "var(--c-hex-d5ded7)", lineHeight: "1.55"}}>{r?.text}</div>
                        <div style={{fontSize: "11.5px", color: "var(--c-hex-5c6b61)", marginTop: "2px"}}>{r?.hint}</div>
                      </div>
                    </React.Fragment>))}
                  </div>
                </div>
              </div>
              {V.rpHasEvidence ? (<>
                <div style={{marginTop: "14px", background: "var(--c-hex-0b120e)", borderRadius: "12px", padding: "16px 18px"}}>
                  <div style={{display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap"}}>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", flex: "1"}}>The answer trail · every question, their answer, what it scored</div>
                    <button onClick={V.toggleItems} style={{background: "transparent", color: "var(--c-hex-34d399)", border: "1px solid var(--c-rgba-16-185-129-35)", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer"}}>{V.rpItemsBtn}</button>
                  </div>
                  {V.rpItemsOpen ? (<>
                    <p style={{margin: "12px 0 0", fontSize: "11.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.55"}}>{V.rpScaleNote}{" Every option is listed with its score; the candidate’s pick is marked ▸. Disagree with a score? Change it in the Question bank — the rationale explains the current thinking."}</p>
                    <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "14px", marginTop: "14px"}}>
                      {(V.rpItemGroups ?? []).map((g: any, $index: number) => (<React.Fragment key={$index}>
                        <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-1)", borderRadius: "10px", padding: "14px 16px"}}>
                          <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px", marginBottom: "8px"}}>
                            <span style={{fontSize: "13.5px", fontWeight: "800"}}>{g?.name}</span>
                            <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", fontWeight: "700", color: g?.color}}>{g?.scoreTxt}</span>
                          </div>
                          <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                            {(g?.items ?? []).map((e: any, $i2: number) => (<React.Fragment key={$i2}>
                              <div style={{fontSize: "11.5px", lineHeight: "1.5", paddingLeft: "10px", borderLeft: `2px solid ${e?.color}`}}>
                                <div style={{color: "var(--c-hex-a7b5ab)"}}><span style={{color: "var(--c-hex-5c6b61)"}}>{e?.kind}{" · "}</span>{e?.q}</div>
                                <div><span style={{color: "var(--c-hex-5c6b61)"}}>{e?.least ? "Most likely · " : "Answer · "}</span><span style={{color: e?.color, fontWeight: "700"}}>{e?.answer}</span><span style={{color: "var(--c-hex-5c6b61)"}}>{" · "}{e?.signal}{" · "}{e?.score}</span></div>
                                {e?.least ? (<div><span style={{color: "var(--c-hex-5c6b61)"}}>Least likely · </span><span style={{color: e?.leastColor, fontWeight: "700"}}>{e?.least}</span><span style={{color: "var(--c-hex-5c6b61)"}}>{" · "}{e?.leastSignal}{" · "}{e?.leastScore}</span></div>) : null}
                                {e?.best ? (<div><span style={{color: "var(--c-hex-5c6b61)"}}>Strongest option · </span><span style={{color: "var(--c-hex-8fa396)"}}>{e?.best}</span></div>) : null}
                                {(e?.options ?? []).length ? (<>
                                  <div style={{marginTop: "6px", display: "flex", flexDirection: "column", gap: "2px"}}>
                                    {(e?.options ?? []).map((o: any, $i3: number) => (<React.Fragment key={$i3}>
                                      <div style={{display: "flex", gap: "8px", alignItems: "baseline", color: o?.chosen ? "var(--c-hex-e9f0ea)" : "var(--c-hex-7e9186)", fontWeight: o?.weight}}>
                                        <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", color: o?.color, minWidth: "26px", textAlign: "right"}}>{o?.score}</span>
                                        <div style={{flex: "1"}}>
                                          <div>{o?.chosen ? "▸ " : o?.least ? "▿ " : ""}{o?.text}{o?.least ? <span style={{color: "var(--c-hex-7e9186)", fontWeight: "400"}}>{" · least likely"}</span> : null}{o?.flag ? <span style={{color: "var(--c-hex-f0a070)", fontWeight: "400"}}>{" · " + o.flag}</span> : null}{o?.positive ? <span style={{color: "var(--c-hex-34d399)", fontWeight: "400"}}>{" · " + o.positive}</span> : null}</div>
                                          {o?.reason ? (<div style={{fontSize: "10.5px", color: "var(--c-hex-5c6b61)", fontWeight: "400", lineHeight: "1.45"}}>{o?.signal}{" — "}{o?.reason}</div>) : null}
                                        </div>
                                      </div>
                                    </React.Fragment>))}
                                  </div>
                                </>) : null}
                                {e?.why ? (<div style={{color: "var(--c-hex-8fa396)", marginTop: "6px"}}><span style={{color: "var(--c-hex-5c6b61)"}}>Why · </span>{e?.why}</div>) : null}
                                {e?.miss ? (<div style={{color: "var(--c-hex-8fa396)", marginTop: "4px"}}><span style={{color: "var(--c-hex-5c6b61)"}}>Reading a miss · </span>{e?.miss}</div>) : null}
                                {e?.probe && e?.score < 70 ? (<div style={{color: "var(--c-hex-e9d9b0)", marginTop: "4px"}}><span style={{color: "var(--c-hex-5c6b61)"}}>Ask in interview · </span>{e?.probe}</div>) : null}
                              </div>
                            </React.Fragment>))}
                          </div>
                        </div>
                      </React.Fragment>))}
                    </div>
                  </>) : null}
                </div>
              </>) : null}
              {V.rpHasProbes ? (<>
                <div style={{marginTop: "14px", background: "var(--c-rgba-245-184-74-06)", border: "1px solid var(--c-rgba-245-184-74-35)", borderRadius: "12px", padding: "16px 18px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-e9d9b0)", marginBottom: "10px"}}>Patterns to probe in interview · never change a score</div>
                  <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                    {(V.rpProbes ?? []).map((p: any, $index: number) => (<React.Fragment key={$index}>
                      <div style={{borderTop: $index ? "1px solid var(--c-rgba-245-184-74-15)" : "none", paddingTop: $index ? "10px" : "0"}}>
                        <div style={{fontSize: "13.5px", fontWeight: "800"}}>{p?.profile}</div>
                        <div style={{fontSize: "12px", color: "var(--c-hex-a7b5ab)", lineHeight: "1.5", marginTop: "2px"}}>{p?.desc}</div>
                        <div style={{fontSize: "11.5px", color: "var(--c-hex-8fa396)", marginTop: "4px"}}><span style={{color: "var(--c-hex-5c6b61)"}}>Fired because · </span>{p?.rule}</div>
                        <div style={{fontSize: "13px", color: "var(--c-hex-e9f0ea)", lineHeight: "1.55", marginTop: "6px"}}><span style={{color: "var(--c-hex-e9d9b0)"}}>Ask · </span>{p?.probe}</div>
                        {(p?.evidence ?? []).map((e: any, $i2: number) => (<React.Fragment key={$i2}>
                          <div style={{fontSize: "11.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.5", marginTop: "5px", paddingLeft: "10px", borderLeft: "2px solid var(--c-rgba-245-184-74-3)"}}>{e?.q}<div><span style={{color: "var(--c-hex-5c6b61)"}}>Answer · </span><span style={{color: e?.color}}>{e?.answer}</span></div></div>
                        </React.Fragment>))}
                      </div>
                    </React.Fragment>))}
                  </div>
                </div>
              </>) : null}
              {V.rpHasInsights ? (<>
                <div style={{marginTop: "14px", background: "var(--c-hex-0b120e)", borderRadius: "12px", padding: "16px 18px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "10px"}}>Working style · not scored · for onboarding and management only</div>
                  <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "10px 18px"}}>
                    {(V.rpInsights ?? []).map((x: any, $index: number) => (<React.Fragment key={$index}>
                      <div>
                        <div style={{fontSize: "11.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.45"}}>{x?.q}</div>
                        <div style={{fontSize: "13px", color: "var(--c-hex-e9f0ea)", fontWeight: "700", marginTop: "3px"}}>{x?.answer}</div>
                      </div>
                    </React.Fragment>))}
                  </div>
                </div>
              </>) : null}
              <p style={{margin: "16px 0 0", fontSize: "11px", color: "var(--c-hex-5c6b61)", lineHeight: "1.5"}}>{"Signal from the candidate’s own decisions, scored against the "}{V.rpProfName}{" profile’s floors and weights (Weights tab). It sharpens the interview and the combine; it does not make the decision, and the candidate never sees it."}</p>
            </div>
          </>) : null}
          <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "20px 24px", marginBottom: "20px"}}>
            <div style={{display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "6px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", flex: "1"}}>{"Transcripts · "}{(V.pTranscripts ?? []).length}</div>
              {V.trEnabled ? (<>
                <button onClick={V.toggleTr} style={{background: V.trOpen ? "transparent" : "var(--c-hex-10b981)", color: V.trOpen ? "var(--c-hex-8fa396)" : "var(--c-hex-04120b)", border: V.trOpen ? "1px solid var(--c-rgba-160-190-170-25)" : "none", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", fontWeight: "800", cursor: "pointer"}}>{V.trOpen ? 'Cancel' : 'Submit a transcript for evaluation'}</button>
              </>) : null}
            </div>
            <p style={{margin: "0 0 12px", fontSize: "12px", color: "var(--c-hex-5c6b61)", lineHeight: "1.5"}}>Paste or upload the transcript of the first phone call, a mock pitch, or an interview. A first call produces an executive summary for the next round — what was covered, what to ask next, your own read folded in — and a grade from A+ to F against the role profile. Everything here is advisory; people decide.</p>
            {V.trOpen ? (<>
              <div style={{background: "var(--c-hex-0b120e)", borderRadius: "12px", padding: "16px 18px", marginBottom: "14px"}}>
                <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "10px"}}>
                  <select value={(V.trKind) ?? ''} onChange={V.setTrKind} style={INPUT}>
                    {(V.trKinds ?? []).map((k: any, $index: number) => (<React.Fragment key={$index}>
                      <option value={k?.id}>{k?.label}</option>
                    </React.Fragment>))}
                  </select>
                  <input value={(V.trTitle) ?? ''} onChange={V.setTrTitle} placeholder="Title (e.g. Mock pitch · Sep 12 · with G. Allen)" style={INPUT} />
                  <label style={{...INPUT, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: V.trFileName ? "var(--c-hex-34d399)" : "var(--c-hex-8fa396)"}}>
                    <input type="file" accept=".txt,.vtt,.srt,.md,.text" onChange={V.pickTrFile} style={{display: "none"}} />
                    <span style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{V.trFileName || 'Upload .txt / .vtt / .srt'}</span>
                  </label>
                </div>
                <textarea value={(V.trTxt) ?? ''} onChange={V.setTrTxt} rows={8} placeholder="Paste the transcript here (Zoom, Meet, Teams, Otter…). Timestamps are fine — they are stripped." style={{...INPUT, marginTop: "10px", resize: "vertical", lineHeight: "1.5", fontFamily: "inherit"}} />
                <div style={{...MONO_LABEL, marginTop: "12px", marginBottom: "6px"}}>{V.trNotesLabel}</div>
                <textarea value={(V.trNotes) ?? ''} onChange={V.setTrNotes} rows={3} placeholder="e.g. On time and prepared; asked sharp questions about the comp plan. Vague on why they left the last role — worth pressing." style={{...INPUT, resize: "vertical", lineHeight: "1.5", fontFamily: "inherit"}} />
                {V.trIsCall ? (<>
                  <div style={{marginTop: "12px"}}>
                    <button onClick={V.togglePrompt} style={{background: "none", border: "none", color: "var(--c-hex-8fa396)", fontSize: "12px", cursor: "pointer", padding: "0", textDecoration: "underline"}}>{V.promptBtn}</button>
                    {V.promptOpen ? (<>
                      <p style={{margin: "8px 0 6px", fontSize: "11.5px", color: "var(--c-hex-5c6b61)", lineHeight: "1.5"}}>{"These instructions drive the evaluation of every first call, for every candidate. Write them in plain English; they save automatically and apply to the next transcript you submit."}{V.callPromptIsDefault ? '' : ' Currently customized.'}</p>
                      <textarea value={(V.callPrompt) ?? ''} onChange={V.setCallPrompt} rows={10} style={{...INPUT, resize: "vertical", lineHeight: "1.55", fontFamily: "inherit", fontSize: "12.5px"}} />
                      {!V.callPromptIsDefault ? (<><button onClick={V.resetCallPrompt} style={{background: "none", border: "none", color: "var(--c-hex-f5b84a)", fontSize: "11.5px", cursor: "pointer", padding: "0", marginTop: "6px", textDecoration: "underline"}}>Reset to the default instructions</button></>) : null}
                    </>) : null}
                  </div>
                </>) : null}
                <div style={{display: "flex", gap: "10px", alignItems: "center", marginTop: "10px", flexWrap: "wrap"}}>
                  <button onClick={V.submitTr} disabled={!V.trOk} style={{background: V.trBtnBg, color: "var(--c-hex-04120b)", border: "none", borderRadius: "9px", padding: "10px 16px", fontSize: "12.5px", fontWeight: "800", cursor: "pointer"}}>{V.trBusy ? 'Evaluating…' : (V.trIsCall ? 'Submit & evaluate the call' : 'Submit for evaluation')}</button>
                  <span style={{fontSize: "11.5px", color: "var(--c-hex-5c6b61)"}}>{V.trCount}</span>
                </div>
              </div>
            </>) : null}
            {V.trMsg ? (<><div style={{fontSize: "12.5px", color: V.trMsgColor, fontWeight: "700", marginBottom: "10px", lineHeight: "1.5"}}>{V.trMsg}</div></>) : null}
            <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
              {(V.pTranscripts ?? []).map((t: any, $index: number) => (<React.Fragment key={$index}>
                <div style={{background: "var(--c-hex-0b120e)", borderRadius: "12px", padding: "16px 18px"}}>
                  <div style={{display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap"}}>
                    <div style={{flex: "1"}}>
                      <div style={{fontSize: "14px", fontWeight: "800", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap"}}>{t?.title}{t?.grade ? <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", fontWeight: "800", color: t?.gradeColor, border: `1px solid ${t?.gradeColor}`, borderRadius: "6px", padding: "1px 7px"}}>{t?.grade}</span> : null}</div>
                      <div style={{fontSize: "11.5px", color: "var(--c-hex-5c6b61)", marginTop: "2px"}}>{t?.kind}{" · "}{t?.meta}</div>
                    </div>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".06em", textTransform: "uppercase", color: t?.statusColor}}>{t?.statusTxt}</span>
                    <button onClick={t?.toggle} style={{background: "transparent", color: "var(--c-hex-a7b5ab)", border: "1px solid var(--c-rgba-160-190-170-2)", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer"}}>{t?.toggleTxt}</button>
                    {t?.canRerun ? (<>
                      <button onClick={t?.rerun} disabled={!!t?.rerunBusy} style={{background: "transparent", color: t?.hasReview ? "var(--c-hex-8fa396)" : "var(--c-hex-34d399)", border: t?.hasReview ? "1px solid var(--c-rgba-160-190-170-2)" : "1px solid var(--c-rgba-16-185-129-35)", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer", opacity: t?.rerunBusy ? .6 : 1}}>{t?.rerunTxt}</button>
                    </>) : null}
                  </div>
                  {t?.hasReview && t?.isCall ? (<>
                    <div style={{display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: "16px", marginTop: "14px", alignItems: "start"}}>
                      <div style={{textAlign: "center", background: "var(--c-hex-0f1611)", border: `1px solid ${t?.gradeColor}`, borderRadius: "12px", padding: "14px 18px", minWidth: "72px"}}>
                        <div style={{fontFamily: "'Barlow Condensed',sans-serif", fontSize: "40px", fontWeight: "800", lineHeight: "1", color: t?.gradeColor}}>{t?.grade || "—"}</div>
                        <div style={{...MONO_LABEL, marginTop: "6px", marginBottom: "0"}}>Grade</div>
                      </div>
                      <div>
                        <div style={{...MONO_LABEL, color: "var(--c-hex-34d399)", marginBottom: "4px"}}>Executive summary for the next round</div>
                        <p style={{margin: "0 0 8px", fontSize: "13.5px", color: "var(--c-hex-e9f0ea)", lineHeight: "1.65"}}>{t?.summary}</p>
                        {t?.gradeRationale ? (<div style={{fontSize: "12px", color: "var(--c-hex-a7b5ab)", lineHeight: "1.5"}}><span style={{color: "var(--c-hex-5c6b61)"}}>Grade rationale · </span>{t?.gradeRationale}</div>) : null}
                      </div>
                    </div>
                    <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "12px", marginTop: "14px", fontSize: "12.5px", lineHeight: "1.55"}}>
                      <div><div style={{...MONO_LABEL, marginBottom: "4px"}}>Leadership should know</div>{(t?.bullets ?? []).map((s: any, $i2: number) => (<div key={$i2} style={{color: "var(--c-hex-d5ded7)"}}>{"· "}{s}</div>))}</div>
                      <div><div style={{...MONO_LABEL, color: "var(--c-hex-f5b84a)", marginBottom: "4px"}}>Ask next</div>{(t?.askNext ?? []).map((s: any, $i2: number) => (<div key={$i2} style={{color: "var(--c-hex-d5ded7)"}}>{"· "}{s}</div>))}</div>
                      <div><div style={{...MONO_LABEL, marginBottom: "4px"}}>Already covered — don’t re-ask</div>{(t?.covered ?? []).map((s: any, $i2: number) => (<div key={$i2} style={{color: "var(--c-hex-8fa396)"}}>{"· "}{s}</div>))}</div>
                      <div><div style={{...MONO_LABEL, color: "var(--c-hex-34d399)", marginBottom: "4px"}}>Strengths</div>{(t?.strengths ?? []).map((s: any, $i2: number) => (<div key={$i2} style={{color: "var(--c-hex-d5ded7)"}}>{"· "}{s}</div>))}</div>
                      <div><div style={{...MONO_LABEL, color: "var(--c-hex-f87171)", marginBottom: "4px"}}>Concerns</div>{(t?.concerns ?? []).map((s: any, $i2: number) => (<div key={$i2} style={{color: "var(--c-hex-d5ded7)"}}>{"· "}{s}</div>))}</div>
                    </div>
                    {t?.screenerNotes ? (<div style={{marginTop: "12px", fontSize: "12.5px", color: "var(--c-hex-a7b5ab)", lineHeight: "1.55", paddingLeft: "10px", borderLeft: "2px solid var(--c-rgba-160-190-170-2)"}}><span style={{color: "var(--c-hex-5c6b61)"}}>Screener’s read · </span>{t?.screenerNotes}</div>) : null}
                    {t?.caution ? (<p style={{margin: "10px 0 0", fontSize: "11px", color: "var(--c-hex-5c6b61)", lineHeight: "1.5"}}>{t?.caution}</p>) : null}
                  </>) : null}
                  {!t?.hasReview && t?.screenerNotes ? (<div style={{marginTop: "12px", fontSize: "12.5px", color: "var(--c-hex-a7b5ab)", lineHeight: "1.55", paddingLeft: "10px", borderLeft: "2px solid var(--c-rgba-160-190-170-2)"}}><span style={{color: "var(--c-hex-5c6b61)"}}>Screener’s read · </span>{t?.screenerNotes}</div>) : null}
                  {t?.hasReview && !t?.isCall ? (<>
                    <p style={{margin: "12px 0 10px", fontSize: "13px", color: "var(--c-hex-d5ded7)", lineHeight: "1.6"}}>{t?.summary}</p>
                    <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "10px"}}>
                      {(t?.comps ?? []).map((c: any, $i2: number) => (<React.Fragment key={$i2}>
                        <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-1)", borderRadius: "10px", padding: "10px 12px"}}>
                          <div style={{display: "flex", justifyContent: "space-between", gap: "8px", fontSize: "12.5px"}}>
                            <span style={{fontWeight: "700"}}>{c?.name}</span>
                            <span style={{fontFamily: "'JetBrains Mono',monospace", fontWeight: "700", color: c?.color}}>{c?.rating}</span>
                          </div>
                          {(c?.quotes ?? []).map((q: any, $i3: number) => (<React.Fragment key={$i3}>
                            <div style={{fontSize: "11.5px", color: "var(--c-hex-a7b5ab)", lineHeight: "1.5", marginTop: "6px", paddingLeft: "9px", borderLeft: "2px solid var(--c-rgba-160-190-170-2)"}}>
                              <span style={{fontStyle: "italic"}}>{"“"}{q?.quote}{"”"}</span>
                              {q?.note ? (<span style={{color: "var(--c-hex-5c6b61)"}}>{" — "}{q?.note}</span>) : null}
                            </div>
                          </React.Fragment>))}
                          {c?.note ? (<div style={{fontSize: "11px", color: "var(--c-hex-5c6b61)", marginTop: "6px", lineHeight: "1.45"}}>{c?.note}</div>) : null}
                        </div>
                      </React.Fragment>))}
                    </div>
                    <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "12px", marginTop: "12px", fontSize: "12.5px", lineHeight: "1.55"}}>
                      <div><div style={{...MONO_LABEL, color: "var(--c-hex-34d399)", marginBottom: "4px"}}>Strengths</div>{(t?.strengths ?? []).map((s: any, $i2: number) => (<div key={$i2} style={{color: "var(--c-hex-d5ded7)"}}>{"· "}{s}</div>))}</div>
                      <div><div style={{...MONO_LABEL, color: "var(--c-hex-f87171)", marginBottom: "4px"}}>Concerns</div>{(t?.concerns ?? []).map((s: any, $i2: number) => (<div key={$i2} style={{color: "var(--c-hex-d5ded7)"}}>{"· "}{s}</div>))}</div>
                      <div><div style={{...MONO_LABEL, color: "var(--c-hex-f5b84a)", marginBottom: "4px"}}>Follow-ups this raises</div>{(t?.followUps ?? []).map((s: any, $i2: number) => (<div key={$i2} style={{color: "var(--c-hex-d5ded7)"}}>{"· "}{s}</div>))}</div>
                    </div>
                    {t?.caution ? (<p style={{margin: "10px 0 0", fontSize: "11px", color: "var(--c-hex-5c6b61)", lineHeight: "1.5"}}>{t?.caution}</p>) : null}
                  </>) : null}
                  {t?.show ? (<>
                    <pre style={{margin: "12px 0 0", whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "12.5px", lineHeight: "1.6", color: "var(--c-hex-a7b5ab)", maxHeight: "360px", overflow: "auto", background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-1)", borderRadius: "10px", padding: "14px 16px"}}>{t?.txt}</pre>
                  </>) : null}
                </div>
              </React.Fragment>))}
            </div>
          </div>
          {V.pHasData ? (<>
            <div style={{display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "20px", alignItems: "start"}}>
              <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "22px 24px"}}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px"}}>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>Eight competencies</div>
                    <div style={{fontSize: "11px", color: "var(--c-hex-5c6b61)"}}>▏ tick = role standard (3.5)</div>
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                    {(V.pBars ?? []).map((b: any, $index: number) => (<React.Fragment key={$index}>
                      <div>
                        <div style={{display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "5px"}}>
                          <span style={{fontWeight: "600"}}>{b?.name}</span>
                          <span style={{fontFamily: "'JetBrains Mono',monospace", color: b?.valColor, fontWeight: "700"}}>{b?.valTxt}</span>
                        </div>
                        <div style={{position: "relative", height: "9px", background: "var(--c-hex-0b120e)", borderRadius: "99px"}}>
                          <div style={{position: "absolute", left: "0", top: "0", height: "100%", width: b?.pct, background: b?.fill, borderRadius: "99px"}} />
                          <div style={{position: "absolute", left: "70%", top: "-3px", width: "2px", height: "15px", background: "var(--c-rgba-233-240-234-45)"}} />
                        </div>
                      </div>
                    </React.Fragment>))}
                  </div>
                </div>
                <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "22px 24px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "14px"}}>Structured evidence — Application Q1 (SAR-L)</div>
                  <div style={{display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", lineHeight: "1.6"}}>
                    <div>
                      <b style={{color: "var(--c-hex-34d399)"}}>Situation</b>
                      {" · "}
                      <span style={{color: "var(--c-hex-d5ded7)"}}>{V.pSarS}</span>
                    </div>
                    <div>
                      <b style={{color: "var(--c-hex-34d399)"}}>Action</b>
                      {" · "}
                      <span style={{color: "var(--c-hex-d5ded7)"}}>{V.pSarA}</span>
                    </div>
                    <div>
                      <b style={{color: "var(--c-hex-34d399)"}}>Result</b>
                      {" · "}
                      <span style={{color: "var(--c-hex-d5ded7)"}}>{V.pSarR}</span>
                    </div>
                    <div>
                      <b style={{color: "var(--c-hex-34d399)"}}>Learning</b>
                      {" · "}
                      <span style={{color: "var(--c-hex-d5ded7)"}}>{V.pSarL}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "20px 22px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "12px"}}>Evidence strength by source</div>
                  <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                    {(V.pStrength ?? []).map((s: any, $index: number) => (<React.Fragment key={$index}>
                      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12.5px"}}>
                        <span style={{color: "var(--c-hex-a7b5ab)"}}>{s?.src}</span>
                        <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "700", letterSpacing: ".08em", textTransform: "uppercase", color: s?.color, background: s?.bg, padding: "3px 9px", borderRadius: "99px"}}>{s?.level}</span>
                      </div>
                    </React.Fragment>))}
                  </div>
                </div>
                <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "20px 22px"}}>
                  <div style={{display: "flex", gap: "18px", alignItems: "center", marginBottom: "6px"}}>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>R1 → coached re-pitch</div>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", fontWeight: "700", color: V.pAgreeColor}}>{V.pAgreeTxt}</div>
                  </div>
                  <div style={{display: "flex", alignItems: "baseline", gap: "12px"}}>
                    <span style={{fontSize: "26px", fontWeight: "900"}}>{V.pR1}</span>
                    <span style={{color: "var(--c-hex-5c6b61)"}}>→</span>
                    <span style={{fontSize: "26px", fontWeight: "900"}}>{V.pR2}</span>
                    <span style={{fontSize: "15px", fontWeight: "800", color: V.pDeltaColor}}>{V.pDelta}</span>
                  </div>
                </div>
                <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "20px 22px", display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px", lineHeight: "1.6"}}>
                  <div>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-34d399)", marginBottom: "5px"}}>Strongest evidence</div>
                    <span style={{color: "var(--c-hex-d5ded7)"}}>{V.pStrongest}</span>
                  </div>
                  <div>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-f87171)", marginBottom: "5px"}}>Material concerns</div>
                    <span style={{color: "var(--c-hex-d5ded7)"}}>{V.pConcerns}</span>
                  </div>
                  <div>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-f5b84a)", marginBottom: "5px"}}>Unanswered questions</div>
                    <span style={{color: "var(--c-hex-d5ded7)"}}>{V.pOpen}</span>
                  </div>
                </div>
                <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "20px 22px"}}>
                  <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px"}}>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", flex: "1"}}>Hiring decision</div>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", border: "1px solid var(--c-rgba-160-190-170-2)", padding: "3px 8px", borderRadius: "99px"}}>{V.decRoleTag}</span>
                  </div>
                  {V.decRecorded ? (<>
                    <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap"}}>
                      <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--c-hex-04120b)", padding: "4px 10px", borderRadius: "99px", background: V.decColor}}>{V.decLabel}</span>
                      <span style={{fontSize: "12px", color: "var(--c-hex-8fa396)"}}>{V.decMeta}</span>
                    </div>
                    <p style={{margin: "0", fontSize: "13px", color: "var(--c-hex-d5ded7)", lineHeight: "1.6"}}>{V.decRationale}</p>
                  </>) : null}
                  {V.decEditable ? (<>
                    <div style={{display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px"}}>
                      {(V.pRecBtns ?? []).map((b: any, $index: number) => (<React.Fragment key={$index}>
                        <button onClick={b?.on} style={{background: b?.bg, color: b?.fg, border: `1px solid ${b?.border}`, borderRadius: "10px", padding: "10px 16px", fontSize: "12.5px", fontWeight: "800", cursor: "pointer"}}>{b?.label}</button>
                      </React.Fragment>))}
                    </div>
                    <textarea value={(V.decNote) ?? ''} onChange={V.setDecNote} rows="3" placeholder="Required — the evidence this decision rests on: exercises, interview answers, evaluator agreement." style={{width: "100%", boxSizing: "border-box", background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-160-190-170-18)", borderRadius: "10px", padding: "12px", color: "var(--c-hex-e9f0ea)", fontSize: "13px", resize: "vertical"}} />
                    <button onClick={V.recordDecision} disabled={!!(V.decBlocked)} style={{background: V.decBtnBg, color: "var(--c-hex-04120b)", border: "none", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "800", cursor: "pointer", marginTop: "10px"}}>Record decision</button>
                  </>) : null}
                  {V.decReadOnly ? (<>
                    <p style={{margin: "0", fontSize: "12.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.55"}}>No decision recorded yet. Decisions are recorded by the hiring manager or admin; your role can read the decision log but not change it.</p>
                  </>) : null}
                  <p style={{margin: "12px 0 0", fontSize: "11px", color: "var(--c-hex-5c6b61)", lineHeight: "1.5"}}>Every decision is logged with who, when, rationale, and the evaluator-agreement snapshot, then emailed to the candidate. No candidate is auto-rejected by the inventory or any generated summary.</p>
                </div>
              </div>
            </div>
          </>) : null}
          {V.pNoData ? (<>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "32px", maxWidth: "560px"}}>
              <div style={{fontSize: "16px", fontWeight: "800", marginBottom: "6px"}}>Insufficient evidence so far</div>
              <p style={{margin: "0", fontSize: "13.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.6"}}>{V.pStageLabel}. Competency scores appear once the sales decisions and at least one combine exercise are complete — partial data is never extrapolated into a readiness score.</p>
            </div>
          </>) : null}
        </div>
      </>) : null}
      {V.vCompare ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <button onClick={V.goPipe} style={{background: "none", border: "none", color: "var(--c-hex-8fa396)", fontSize: "13px", cursor: "pointer", padding: "0", marginBottom: "16px"}} className="ps2">← Pipeline</button>
          <h1 style={{margin: "0 0 6px", fontSize: "28px", fontWeight: "900", letterSpacing: "-.015em"}}>Side-by-side comparison</h1>
          <p style={{margin: "0 0 22px", fontSize: "13px", color: "var(--c-hex-8fa396)", maxWidth: "700px", lineHeight: "1.6"}}>Both candidates are measured against the role standard (3.5) — not against each other’s style, school, or polish.</p>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px"}}>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-16-185-129-3)", borderRadius: "14px", padding: "18px 22px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-34d399)", marginBottom: "6px"}}>Candidate A</div>
              <div style={{fontSize: "18px", fontWeight: "800"}}>{V.cmpAName}</div>
              <div style={{fontSize: "12.5px", color: "var(--c-hex-8fa396)", marginTop: "2px"}}>{"Readiness "}{V.cmpARead}{" · "}{V.cmpASub}</div>
            </div>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-91-155-255-35)", borderRadius: "14px", padding: "18px 22px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-5b9bff)", marginBottom: "6px"}}>Candidate B</div>
              <div style={{fontSize: "18px", fontWeight: "800"}}>{V.cmpBName}</div>
              <div style={{fontSize: "12.5px", color: "var(--c-hex-8fa396)", marginTop: "2px"}}>{"Readiness "}{V.cmpBRead}{" · "}{V.cmpBSub}</div>
            </div>
          </div>
          <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "24px"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "14px"}}>
              {(V.cmpRows ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}>
                <div>
                  <div style={{display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "5px"}}>
                    <span style={{fontWeight: "700"}}>{r?.name}</span>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "12px"}}>
                      <span style={{color: "var(--c-hex-34d399)"}}>{r?.aTxt}</span>
                      {" "}
                      <span style={{color: "var(--c-hex-5c6b61)"}}>vs</span>
                      {" "}
                      <span style={{color: "var(--c-hex-5b9bff)"}}>{r?.bTxt}</span>
                    </span>
                  </div>
                  <div style={{position: "relative", height: "8px", background: "var(--c-hex-0b120e)", borderRadius: "99px", marginBottom: "4px"}}>
                    <div style={{position: "absolute", height: "100%", width: r?.aPct, background: "var(--c-hex-10b981)", borderRadius: "99px", opacity: ".9"}} />
                    <div style={{position: "absolute", left: "70%", top: "-3px", width: "2px", height: "14px", background: "var(--c-rgba-233-240-234-45)"}} />
                  </div>
                  <div style={{position: "relative", height: "8px", background: "var(--c-hex-0b120e)", borderRadius: "99px"}}>
                    <div style={{position: "absolute", height: "100%", width: r?.bPct, background: "var(--c-hex-5b9bff)", borderRadius: "99px", opacity: ".85"}} />
                    <div style={{position: "absolute", left: "70%", top: "-3px", width: "2px", height: "14px", background: "var(--c-rgba-233-240-234-45)"}} />
                  </div>
                </div>
              </React.Fragment>))}
            </div>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px"}}>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "20px 22px", fontSize: "13px", lineHeight: "1.6"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-34d399)", marginBottom: "6px"}}>Strongest evidence</div>
              <span style={{color: "var(--c-hex-d5ded7)"}}>{V.cmpAStrong}</span>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-f87171)", margin: "14px 0 6px"}}>Material concerns</div>
              <span style={{color: "var(--c-hex-d5ded7)"}}>{V.cmpAConcern}</span>
            </div>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "20px 22px", fontSize: "13px", lineHeight: "1.6"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-34d399)", marginBottom: "6px"}}>Strongest evidence</div>
              <span style={{color: "var(--c-hex-d5ded7)"}}>{V.cmpBStrong}</span>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-f87171)", margin: "14px 0 6px"}}>Material concerns</div>
              <span style={{color: "var(--c-hex-d5ded7)"}}>{V.cmpBConcern}</span>
            </div>
          </div>
        </div>
      </>) : null}
      {V.vBank ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>{"Assessment & question bank"}</h1>
          <p style={{margin: "0 0 22px", fontSize: "13px", color: "var(--c-hex-8fa396)", maxWidth: "760px", lineHeight: "1.6"}}>Every scenario and worst-move item, with the score behind each option and the reasoning in plain words. Change a score, a flag label, the wording, or the rationale and it applies to everyone scored from then on; reports already on file keep their numbers until you re-score them from the profile.</p>
          <div style={{display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center"}}>
            <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginRight: "6px"}}>Profile</span>
            {(V.bkProfChips ?? []).map((c: any, $index: number) => (<React.Fragment key={$index}>
              <button onClick={c?.on} style={{background: c?.bg, color: c?.fg, border: "1px solid var(--c-rgba-160-190-170-2)", borderRadius: "99px", padding: "8px 16px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer"}}>{c?.label}</button>
            </React.Fragment>))}
          </div>
          <div style={{display: "grid", gridTemplateColumns: "320px 1fr", gap: "20px", alignItems: "start"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              {(V.bankList ?? []).map((b: any, $index: number) => (<React.Fragment key={$index}>
                <div onClick={b?.pick} role="button" tabIndex="0" style={{display: "flex", alignItems: "center", gap: "12px", background: b?.bg, border: `1px solid ${b?.border}`, borderRadius: "12px", padding: "14px 16px", cursor: "pointer"}}>
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "var(--c-hex-7e9186)"}}>{b?.num}</span>
                  <span style={{flex: "1", fontSize: "13.5px", fontWeight: "700"}}>{b?.title}</span>
                  {b?.edited ? (<span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: "var(--c-hex-f5b84a)", background: "var(--c-rgba-245-184-74-12)", padding: "3px 8px", borderRadius: "99px"}}>edited</span>) : null}
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: "var(--c-hex-34d399)", background: "var(--c-rgba-16-185-129-1)", padding: "3px 8px", borderRadius: "99px"}}>{b?.ver}</span>
                </div>
              </React.Fragment>))}
            </div>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "24px"}}>
              <div style={{display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px", flexWrap: "wrap"}}>
                <div style={{fontSize: "17px", fontWeight: "800", flex: "1"}}>{V.bankTitle}</div>
                {V.bankEdited ? (<span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--c-hex-f5b84a)", background: "var(--c-rgba-245-184-74-12)", padding: "3px 8px", borderRadius: "99px"}}>edited</span>) : null}
              </div>
              <p style={{margin: "0 0 16px", fontSize: "12px", color: "var(--c-hex-8fa396)", lineHeight: "1.55"}}>{V.bankKind}{V.bankMeta ? " " + V.bankMeta : ""}</p>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "7px"}}>Question</div>
              <textarea value={(V.bankStem) ?? ''} onChange={V.setBankStem} rows={3} disabled={!V.bankCanEdit} style={{...STA, marginBottom: "16px"}} />
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "7px"}}>{"Options · score 0–100 · flag / positive label"}</div>
              <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                {(V.bankOpts ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}>
                  <div style={{display: "grid", gridTemplateColumns: "20px minmax(0,1fr) 76px", gap: "10px", alignItems: "start"}}>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", color: "var(--c-hex-7e9186)", paddingTop: "13px"}}>{o?.letter}</span>
                    <div>
                      <textarea value={(o?.text) ?? ''} onChange={o?.setText} rows={2} disabled={!V.bankCanEdit} style={STA} />
                      {o?.reason ? (<div style={{fontSize: "11.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.5", marginTop: "5px"}}><span style={{color: o?.color, fontWeight: "700"}}>{o?.signal}</span>{" — "}{o?.reason}</div>) : null}
                      {!V.bankIsWorst ? (<>
                        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "6px"}}>
                          <input value={(o?.flag) ?? ''} onChange={o?.setFlag} disabled={!V.bankCanEdit} placeholder="Red-flag label (if this answer should raise one)" style={{...INPUT, padding: "8px 10px", fontSize: "12px", color: "var(--c-hex-f0a070)"}} />
                          <input value={(o?.positive) ?? ''} onChange={o?.setPositive} disabled={!V.bankCanEdit} placeholder="Positive-signal label" style={{...INPUT, padding: "8px 10px", fontSize: "12px", color: "var(--c-hex-34d399)"}} />
                        </div>
                      </>) : null}
                    </div>
                    <div>
                      <input type="number" min="0" max="100" value={(o?.score) ?? ''} onChange={o?.setScore} disabled={!V.bankCanEdit} style={{...INPUT, padding: "10px 8px", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", color: o?.color, fontWeight: "700"}} />
                      <div style={{fontSize: "10px", color: o?.color, textAlign: "center", marginTop: "4px", fontFamily: "'JetBrains Mono',monospace"}}>{o?.signal}</div>
                    </div>
                  </div>
                </React.Fragment>))}
              </div>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", margin: "16px 0 7px"}}>Why it scores this way — shown to staff on every report</div>
              <textarea value={(V.bankWhy) ?? ''} onChange={V.setBankWhy} rows={4} disabled={!V.bankCanEdit} style={STA} />
              {V.bankMiss ? (<div style={{fontSize: "12px", color: "var(--c-hex-8fa396)", lineHeight: "1.55", marginTop: "8px"}}><span style={{color: "var(--c-hex-5c6b61)"}}>How to read a miss · </span>{V.bankMiss}</div>) : null}
              <p style={{margin: "10px 0 0", fontSize: "11px", color: "var(--c-hex-5c6b61)", lineHeight: "1.55"}}>{V.bankScaleNote}</p>
              {V.bankCanEdit ? (<>
                <div style={{display: "flex", alignItems: "center", gap: "14px", marginTop: "18px", flexWrap: "wrap"}}>
                  <button onClick={V.saveBank} disabled={!V.bankDirty} style={{background: V.bankDirty ? "var(--c-hex-10b981)" : "var(--c-hex-20302680)", color: "var(--c-hex-04120b)", border: "none", borderRadius: "10px", padding: "12px 22px", fontSize: "13.5px", fontWeight: "800", cursor: "pointer"}}>Save changes</button>
                  {V.bankEdited ? (<button onClick={V.revertBank} style={{background: "transparent", color: "var(--c-hex-f5b84a)", border: "1px solid var(--c-rgba-245-184-74-35)", borderRadius: "10px", padding: "11px 18px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer"}}>Revert to original</button>) : null}
                  <span style={{fontSize: "12.5px", color: "var(--c-hex-34d399)", fontWeight: "700", lineHeight: "1.5"}}>{V.bankSavedNote}</span>
                </div>
              </>) : null}
            </div>
          </div>
        </div>
      </>) : null}
      {V.vWeights ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>{"Scoring weights & evidence matrix"}</h1>
          <p style={{margin: "0 0 22px", fontSize: "13px", color: "var(--c-hex-8fa396)", maxWidth: "720px", lineHeight: "1.6"}}>Each evidence source contributes to only the competencies it can legitimately measure — the matrix prevents the same evidence from being counted twice.</p>
          <div style={{display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center"}}>
            <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginRight: "6px"}}>Rubric for</span>
            {(V.wRoleChips ?? []).map((c: any, $index: number) => (<React.Fragment key={$index}>
              <button onClick={c?.on} style={{background: c?.bg, color: c?.fg, border: "1px solid var(--c-rgba-160-190-170-2)", borderRadius: "99px", padding: "8px 16px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer"}}>{c?.label}</button>
            </React.Fragment>))}
          </div>
          <div style={{display: "grid", gridTemplateColumns: "420px 1fr", gap: "20px", alignItems: "start"}}>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "24px"}}>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "18px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>Source weights</div>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", fontWeight: "700", color: V.wSumColor}}>{"Σ "}{V.wSum}%</div>
              </div>
              <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                {(V.wRows ?? []).map((w: any, $index: number) => (<React.Fragment key={$index}>
                  <div>
                    <div style={{display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px"}}>
                      <span style={{fontWeight: "600"}}>{w?.label}</span>
                      <span style={{fontFamily: "'JetBrains Mono',monospace", color: "var(--c-hex-34d399)", fontWeight: "700"}}>{w?.val}%</span>
                    </div>
                    <input type="range" min="0" max="40" value={(w?.val) ?? ''} onChange={w?.set} style={{width: "100%", accentColor: "var(--c-hex-10b981)"}} />
                  </div>
                </React.Fragment>))}
              </div>
              <p style={{margin: "16px 0 0", fontSize: "11px", color: "var(--c-hex-5c6b61)", lineHeight: "1.55"}}>{V.wNote}</p>
            </div>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "24px", overflowX: "auto"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "16px"}}>Source × competency matrix</div>
              <div style={{display: "grid", gridTemplateColumns: "200px repeat(8,1fr)", gap: "6px", alignItems: "center", minWidth: "640px"}}>
                <div />
                {(V.mHead ?? []).map((h: any, $index: number) => (<React.Fragment key={$index}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", letterSpacing: ".05em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", textAlign: "center"}}>{h}</div>
                </React.Fragment>))}
                {(V.mRows ?? []).map((m: any, $index: number) => (<React.Fragment key={$index}>
                  <div style={{fontSize: "12px", fontWeight: "600", color: "var(--c-hex-a7b5ab)"}}>{m?.label}</div>
                  {(m?.cells ?? []).map((c: any, $index: number) => (<React.Fragment key={$index}>
                    <div style={{height: "30px", borderRadius: "7px", background: c?.bg, border: `1px solid ${c?.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "var(--c-hex-34d399)"}}>{c?.mark}</div>
                  </React.Fragment>))}
                </React.Fragment>))}
              </div>
              <p style={{margin: "16px 0 0", fontSize: "11px", color: "var(--c-hex-5c6b61)", lineHeight: "1.55"}}>Sales decisions (self-report + scenarios) count once, as one source. The combine and interview carry the majority of the weight because they are observed, not self-reported.</p>
            </div>
          </div>
          <div style={{marginTop: "20px", background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "24px"}}>
            <div style={{display: "flex", alignItems: "baseline", gap: "14px", flexWrap: "wrap", marginBottom: "6px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>{"Sales decisions scoring · "}{V.bkProfName}{" profile"}</div>
              <button onClick={V.bkReset} style={{marginLeft: "auto", background: "transparent", color: "var(--c-hex-8fa396)", border: "1px solid var(--c-rgba-160-190-170-22)", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer"}} className="ps2">Reset to defaults</button>
            </div>
            <p style={{margin: "0 0 18px", fontSize: "12.5px", color: "var(--c-hex-8fa396)", maxWidth: "760px", lineHeight: "1.6"}}>{V.bkProfTag}{" Applies to every role mapped to this profile; changing a floor or threshold re-scores every scouting report instantly and is written to the audit history."}</p>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "12px"}}>
              {(V.bkThresh ?? []).map((t: any, $index: number) => (<React.Fragment key={$index}>
                <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>
                  <span>{t?.label}</span>
                  <input type="number" min="0" max="100" value={(t?.val) ?? ''} onChange={t?.set} style={{width: "100%", boxSizing: "border-box", background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-160-190-170-18)", borderRadius: "10px", padding: "11px 12px", color: "var(--c-hex-e9f0ea)", fontSize: "13px"}} />
                </label>
              </React.Fragment>))}
            </div>
            <div style={{display: "grid", gridTemplateColumns: "1.5fr 1.2fr 1.2fr auto auto", gap: "10px 18px", alignItems: "center", marginTop: "20px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>Competency</div>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>Weight</div>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>Floor</div>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>Critical</div>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>Scored</div>
              {(V.bkCompRows ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}>
                <div style={{fontSize: "13px", fontWeight: "700"}}>{r?.name}</div>
                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                  <input type="range" min="0" max="30" value={(r?.w) ?? ''} onChange={r?.setW} style={{flex: "1", accentColor: "var(--c-hex-10b981)"}} />
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "var(--c-hex-34d399)", width: "34px", textAlign: "right"}}>{r?.w}%</span>
                </div>
                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                  <input type="range" min="20" max="80" value={(r?.floor) ?? ''} onChange={r?.setFloor} style={{flex: "1", accentColor: "var(--c-hex-f5b84a)"}} />
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "var(--c-hex-e9d9b0)", width: "34px", textAlign: "right"}}>{r?.floor}</span>
                </div>
                <button onClick={r?.toggleCrit} style={{background: r?.critBg, color: r?.critFg, border: "1px solid var(--c-rgba-160-190-170-2)", borderRadius: "8px", padding: "6px 10px", fontSize: "11.5px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap"}}>{r?.critTxt}</button>
                <button onClick={r?.toggleScored} style={{background: r?.scoredBg, color: r?.scoredFg, border: "1px solid var(--c-rgba-160-190-170-2)", borderRadius: "8px", padding: "6px 10px", fontSize: "11.5px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap"}}>{r?.scoredTxt}</button>
              </React.Fragment>))}
            </div>
            <p style={{margin: "16px 0 0", fontSize: "11px", color: "var(--c-hex-5c6b61)", lineHeight: "1.55"}}>{"Weights Σ "}{V.bkWSum}. A candidate below a critical floor is capped at “Validate in interview” whatever the overall score — the average never hides the risk. Bands describe evidence; only the hiring panel decides.</p>
          </div>
        </div>
      </>) : null}
      {V.vCalib ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Evaluator calibration</h1>
          <p style={{margin: "0 0 22px", fontSize: "13px", color: "var(--c-hex-8fa396)", maxWidth: "700px", lineHeight: "1.6"}}>Any two evaluators differing by more than 1.5 points on a competency triggers a flag. Flags are resolved in a calibration discussion — never averaged away silently.</p>
          <div style={{display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "20px", alignItems: "start"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "14px"}}>
              {(V.calFlags ?? []).map((f: any, $index: number) => (<React.Fragment key={$index}>
                {f?.open ? (<>
                  <div style={{background: "var(--c-rgba-245-184-74-05)", border: "1px solid var(--c-rgba-245-184-74-35)", borderRadius: "14px", padding: "22px 24px"}}>
                    <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px"}}>
                      <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--c-hex-04120b)", background: "var(--c-hex-f5b84a)", padding: "4px 10px", borderRadius: "99px"}}>Open flag</span>
                      <span style={{fontSize: "15px", fontWeight: "800"}}>{f?.title}</span>
                    </div>
                    <div style={{display: "flex", gap: "24px", marginBottom: "14px"}}>
                      <div>
                        <div style={MONO_LABEL}>{f?.e1}</div>
                        <div style={{fontSize: "26px", fontWeight: "900"}}>{f?.s1}</div>
                      </div>
                      <div>
                        <div style={MONO_LABEL}>{f?.e2}</div>
                        <div style={{fontSize: "26px", fontWeight: "900"}}>{f?.s2}</div>
                      </div>
                      <div>
                        <div style={{...MONO_LABEL, color: "var(--c-hex-f5b84a)"}}>Delta</div>
                        <div style={{fontSize: "26px", fontWeight: "900", color: "var(--c-hex-f5b84a)"}}>{f?.delta}</div>
                      </div>
                    </div>
                    <p style={{margin: "0 0 14px", fontSize: "12.5px", color: "var(--c-hex-a7b5ab)", lineHeight: "1.6"}}>{f?.note}</p>
                    {V.isDemo ? (<>
                      <button style={{background: "var(--c-hex-f5b84a)", color: "var(--c-hex-04120b)", border: "none", borderRadius: "10px", padding: "10px 18px", fontSize: "13px", fontWeight: "800", cursor: "pointer"}}>Schedule calibration discussion</button>
                    </>) : null}
                  </div>
                </>) : (<>
                  <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "20px 24px"}}>
                    <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                      <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--c-hex-34d399)", background: "var(--c-rgba-16-185-129-12)", padding: "4px 10px", borderRadius: "99px"}}>Resolved</span>
                      <span style={{fontSize: "14px", fontWeight: "700"}}>{f?.title}</span>
                    </div>
                  </div>
                </>)}
              </React.Fragment>))}
              {V.calFlagsEmpty ? (<>
                <div style={{background: "var(--c-hex-0f1611)", border: "1px dashed var(--c-rgba-160-190-170-22)", borderRadius: "14px", padding: "22px", fontSize: "13.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.6"}}>No agreement checks yet — they appear once two evaluators have scored the same candidate.</div>
              </>) : null}
            </div>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "22px 24px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "14px"}}>Evaluator tendencies · last 90 days</div>
              <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                {(V.calRows ?? []).map((e: any, $index: number) => (<React.Fragment key={$index}>
                  <div style={{display: "flex", alignItems: "center", gap: "14px", fontSize: "13px"}}>
                    <span style={{flex: "1", fontWeight: "600"}}>{e?.name}</span>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", color: "var(--c-hex-8fa396)"}}>{"avg "}{e?.avg}</span>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: e?.color}}>{e?.note}</span>
                  </div>
                </React.Fragment>))}
                {V.calNote ? (<>
                  <div style={{fontSize: "12.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.6"}}>{V.calNote}</div>
                </>) : null}
              </div>
              <p style={{margin: "16px 0 0", fontSize: "11px", color: "var(--c-hex-5c6b61)", lineHeight: "1.55"}}>Tendencies inform training, not score adjustments. Scores are never silently re-weighted by evaluator.</p>
            </div>
          </div>
        </div>
      </>) : null}
      {V.vValid ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Outcome validation</h1>
          <p style={{margin: "0 0 18px", fontSize: "13px", color: "var(--c-hex-8fa396)", maxWidth: "720px", lineHeight: "1.6"}}>Connecting pre-hire readiness scores to post-hire outcomes at 30 / 60 / 90 / 180 days and one year. Assessment versions are locked by cohort.</p>
          <div style={{background: "var(--c-rgba-245-184-74-06)", border: "1px solid var(--c-rgba-245-184-74-4)", borderRadius: "12px", padding: "16px 20px", marginBottom: "20px", display: "flex", gap: "12px", alignItems: "baseline"}}>
            <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--c-hex-04120b)", background: "var(--c-hex-f5b84a)", padding: "4px 10px", borderRadius: "99px", whiteSpace: "nowrap"}}>Insufficient sample</span>
            <span style={{fontSize: "13px", color: "var(--c-hex-e9d9b0)", lineHeight: "1.55"}}>Cohort 2026-A has n = 3 hires. No correlation between combine scores and outcomes should be drawn until n ≥ 25. Figures below are individual tracking, not validation evidence.</span>
          </div>
          <div style={{display: "flex", gap: "8px", marginBottom: "16px", alignItems: "center", flexWrap: "wrap"}}>
            {(V.vPeriods ?? []).map((p: any, $index: number) => (<React.Fragment key={$index}>
              <button onClick={p?.on} disabled={!!(p?.off)} style={{background: p?.bg, color: p?.fg, border: "1px solid var(--c-rgba-160-190-170-2)", borderRadius: "99px", padding: "8px 16px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer"}}>{p?.label}</button>
            </React.Fragment>))}
            {V.canRecord ? (<>
              <button onClick={V.toggleOutcome} style={{marginLeft: "auto", background: "transparent", color: "var(--c-hex-34d399)", border: "1px solid var(--c-rgba-160-190-170-3)", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer", borderColor: "var(--c-rgba-16-185-129-35)"}}>{V.outcomeBtnTxt}</button>
            </>) : null}
          </div>
          {V.outcomeOpen ? (<>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-16-185-129-3)", borderRadius: "14px", padding: "22px 24px", marginBottom: "16px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "14px"}}>Record outcomes · entered by the hire’s manager</div>
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "12px"}}>
                <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>
                  <span>Hire</span>
                  <select value={(V.ocHire) ?? ''} onChange={V.setOcHire} style={{width: "100%", boxSizing: "border-box", background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-160-190-170-18)", borderRadius: "10px", padding: "11px 12px", color: "var(--c-hex-e9f0ea)", fontSize: "13px"}}>
                    {(V.ocHireOpts ?? []).map((h: any, $index: number) => (<React.Fragment key={$index}>
                      <option value={h}>{h}</option>
                    </React.Fragment>))}
                  </select>
                </label>
                <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>
                  <span>Checkpoint</span>
                  <select value={(V.ocPeriod) ?? ''} onChange={V.setOcPeriod} style={{width: "100%", boxSizing: "border-box", background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-160-190-170-18)", borderRadius: "10px", padding: "11px 12px", color: "var(--c-hex-e9f0ea)", fontSize: "13px"}}>
                    <option value="d30">30 days</option>
                    <option value="d60">60 days</option>
                    <option value="d90">90 days</option>
                  </select>
                </label>
                {(V.ocFields ?? []).map((f: any, $index: number) => (<React.Fragment key={$index}>
                  <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>
                    <span>{f?.label}</span>
                    <input value={(f?.val) ?? ''} onChange={f?.set} placeholder={f?.ph} style={{width: "100%", boxSizing: "border-box", background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-160-190-170-18)", borderRadius: "10px", padding: "11px 12px", color: "var(--c-hex-e9f0ea)", fontSize: "13px"}} />
                  </label>
                </React.Fragment>))}
              </div>
              <div style={{display: "flex", gap: "12px", alignItems: "center", marginTop: "16px", flexWrap: "wrap"}}>
                <button onClick={V.saveOutcome} style={{background: "var(--c-hex-10b981)", color: "var(--c-hex-04120b)", border: "none", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "800", cursor: "pointer"}}>Save checkpoint</button>
                <span style={{fontSize: "12px", color: "var(--c-hex-34d399)", fontWeight: "700"}}>{V.ocSaved}</span>
                <span style={{fontSize: "11.5px", color: "var(--c-hex-5c6b61)", marginLeft: "auto"}}>Visible to leadership, admins, and hiring managers — never to evaluators scoring current candidates.</span>
              </div>
            </div>
          </>) : null}
          <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", overflowX: "auto"}}>
            <div style={{display: "grid", gridTemplateColumns: "1.4fr repeat(8,1fr)", gap: "10px", padding: "12px 22px", borderBottom: "1px solid var(--c-rgba-160-190-170-12)", fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", minWidth: "900px"}}>
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
              <div style={{display: "grid", gridTemplateColumns: "1.4fr repeat(8,1fr)", gap: "10px", padding: "14px 22px", borderBottom: "1px solid var(--c-rgba-160-190-170-07)", fontSize: "13px", alignItems: "center", minWidth: "900px"}}>
                <div>
                  <b>{h?.name}</b>
                  {" "}
                  <span style={{fontFamily: "'JetBrains Mono',monospace", color: "var(--c-hex-34d399)", fontSize: "12px"}}>{h?.readiness}</span>
                </div>
                <div style={{fontFamily: "'JetBrains Mono',monospace"}}>{h?.dials}</div>
                <div style={{fontFamily: "'JetBrains Mono',monospace"}}>{h?.mtgs}</div>
                <div style={{fontFamily: "'JetBrains Mono',monospace"}}>{h?.pipe}</div>
                <div style={{fontFamily: "'JetBrains Mono',monospace"}}>{h?.rev}</div>
                <div style={{fontFamily: "'JetBrains Mono',monospace"}}>{h?.crm}</div>
                <div style={{fontFamily: "'JetBrains Mono',monospace"}}>{h?.mgr}</div>
                <div>{h?.coach}</div>
                <div style={{color: "var(--c-hex-34d399)"}}>{h?.ret}</div>
              </div>
            </React.Fragment>))}
          </div>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px"}}>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "20px 22px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "12px"}}>Version locks by cohort</div>
              <div style={{display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px"}}>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <span>Cohort 2026-A · 3 hires</span>
                  <span style={{fontFamily: "'JetBrains Mono',monospace", color: "var(--c-hex-34d399)"}}>locked v1.1</span>
                </div>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <span>Cohort 2026-B · in progress</span>
                  <span style={{fontFamily: "'JetBrains Mono',monospace", color: "var(--c-hex-34d399)"}}>locked v1.2</span>
                </div>
              </div>
            </div>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "20px 22px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "8px"}}>Score ↔ outcome correlation</div>
              <p style={{margin: "0", fontSize: "12.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.6"}}>Hidden until n ≥ 25 with at least 90-day outcomes. Peak has committed to an I/O-psychologist-led validation study before any predictive claim is made.</p>
            </div>
          </div>
        </div>
      </>) : null}
      {V.vAppReview ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <button onClick={V.goPipe} style={{background: "none", border: "none", color: "var(--c-hex-8fa396)", fontSize: "13px", cursor: "pointer", padding: "0", marginBottom: "16px"}} className="ps2">← Pipeline</button>
          <div style={{display: "flex", alignItems: "center", gap: "20px", marginBottom: "18px", flexWrap: "wrap"}}>
            <div>
              <h1 style={{margin: "0", fontSize: "28px", fontWeight: "900", letterSpacing: "-.015em"}}>{"Application review — "}{V.arName}</h1>
              <div style={{fontSize: "13px", color: "var(--c-hex-8fa396)", marginTop: "4px"}}>{V.arSub}</div>
            </div>
            <div style={{marginLeft: "auto", textAlign: "right"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>Evidence rating</div>
              <div style={{fontSize: "30px", fontWeight: "900", color: V.arLevelColor, lineHeight: "1.2"}}>{V.arLevel}</div>
            </div>
          </div>
          <p style={{margin: "0 0 22px", fontSize: "13px", color: "var(--c-hex-8fa396)", maxWidth: "760px", lineHeight: "1.6"}}>Rate each answer on evidence quality only — did the candidate give a starting point, their own actions, and a measurable result? Writing polish, school, and background are not criteria. Blind review hides identifying details.</p>
          <div style={{display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "20px", alignItems: "start"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "14px"}}>
              {(V.arItems ?? []).map((a: any, $index: number) => (<React.Fragment key={$index}>
                <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "22px 24px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", letterSpacing: ".08em", color: "var(--c-hex-34d399)", lineHeight: "1.5", marginBottom: "10px"}}>{a?.num}{" · "}{a?.q}</div>
                  <p style={{margin: "0 0 14px", fontSize: "13.5px", lineHeight: "1.65", color: "var(--c-hex-d5ded7)"}}>{a?.ans}</p>
                  <div style={{display: "flex", gap: "6px", flexWrap: "wrap"}}>
                    {(a?.btns ?? []).map((b: any, $index: number) => (<React.Fragment key={$index}>
                      <button onClick={b?.on} style={{background: b?.bg, color: b?.fg, border: `1px solid ${b?.border}`, borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "700", cursor: "pointer"}}>{b?.label}</button>
                    </React.Fragment>))}
                  </div>
                </div>
              </React.Fragment>))}
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "14px"}}>
              <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "12px"}}>Rating guide</div>
                <div style={{display: "flex", flexDirection: "column", gap: "8px", fontSize: "12.5px", color: "var(--c-hex-a7b5ab)", lineHeight: "1.6"}}>
                  <div>
                    <b style={{color: "var(--c-hex-34d399)"}}>{"Specific & quantified"}</b>
                    {" — a starting point, the candidate’s own actions, and a number for the result."}
                  </div>
                  <div>
                    <b style={{color: "var(--c-hex-e9d9b0)"}}>Partial</b>
                    {" — a real example, but the result or the candidate’s own part is missing."}
                  </div>
                  <div>
                    <b style={{color: "var(--c-hex-f5b84a)"}}>Vague</b>
                    {" — adjectives, generalities, or no example."}
                  </div>
                </div>
              </div>
              <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "10px"}}>Stage decision</div>
                <p style={{margin: "0 0 14px", fontSize: "12.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.55"}}>{V.arSummary}</p>
                <div style={{display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px"}}>
                  <button onClick={V.arAdvance} disabled={!!(V.arBlocked)} style={{background: V.arBtnBg, color: "var(--c-hex-04120b)", border: "none", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "800", cursor: "pointer"}}>Advance to Stage 3</button>
                  <button onClick={V.arHold} disabled={!!(V.arBlocked)} style={{background: "transparent", color: "var(--c-hex-f5b84a)", border: "1px solid var(--c-rgba-160-190-170-3)", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer", borderColor: "var(--c-rgba-245-184-74-35)"}}>Not at this time</button>
                </div>
                <div style={{fontSize: "12.5px", color: "var(--c-hex-34d399)", fontWeight: "700", minHeight: "16px"}}>{V.arSaved}</div>
                <p style={{margin: "10px 0 0", fontSize: "11px", color: "var(--c-hex-5c6b61)", lineHeight: "1.5"}}>Advancing unlocks Stage 3 and emails the candidate. “Not at this time” is logged with your rating and sends the standard decision message.</p>
              </div>
            </div>
          </div>
        </div>
      </>) : null}
      {V.vSchedule ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Schedule a combine</h1>
          <p style={{margin: "0 0 22px", fontSize: "13px", color: "var(--c-hex-8fa396)", maxWidth: "760px", lineHeight: "1.6"}}>One session: one candidate, two evaluators. The candidate gets an email with their own combine link (separate from the assessment link) and a calendar file; when Google Calendar is connected, everyone receives a calendar invitation and a Google Meet link is created for you.</p>
          <div style={{display: "grid", gridTemplateColumns: "minmax(0,480px) minmax(0,1fr)", gap: "20px", alignItems: "start"}}>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "24px"}}>
              <div style={{display: "flex", flexDirection: "column", gap: "14px"}}>
                <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>
                  <span>{"Candidate · "}{V.schReadyCount}{" ready · "}{V.schOtherCount}{" still in the assessment"}</span>
                  <select value={(V.schCand) ?? ''} onChange={V.setSchCand} style={{width: "100%", boxSizing: "border-box", background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-160-190-170-18)", borderRadius: "10px", padding: "11px 12px", color: "var(--c-hex-e9f0ea)", fontSize: "13px"}}>
                    {(V.schCandOpts ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}>
                      <option value={o?.id}>{o?.label}</option>
                    </React.Fragment>))}
                  </select>
                </label>
                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px"}}>
                  <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>
                    <span>Date</span>
                    <input type="date" value={(V.schDate) ?? ''} onChange={V.setSchDate} style={{width: "100%", boxSizing: "border-box", background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-160-190-170-18)", borderRadius: "10px", padding: "11px 12px", color: "var(--c-hex-e9f0ea)", fontSize: "13px", colorScheme: "var(--scheme)"} as any} />
                  </label>
                  <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>
                    <span>Start time</span>
                    <input type="time" value={(V.schTime) ?? ''} onChange={V.setSchTime} style={{width: "100%", boxSizing: "border-box", background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-160-190-170-18)", borderRadius: "10px", padding: "11px 12px", color: "var(--c-hex-e9f0ea)", fontSize: "13px", colorScheme: "var(--scheme)"} as any} />
                  </label>
                </div>
                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px"}}>
                  <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>
                    <span>Time zone</span>
                    <select value={(V.schTz) ?? ''} onChange={V.setSchTz} style={INPUT}>
                      {(V.tzOptions ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}>
                        <option value={o?.id}>{o?.label}</option>
                      </React.Fragment>))}
                    </select>
                  </label>
                  <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>
                    <span>Length</span>
                    <select value={(V.schDur) ?? ''} onChange={V.setSchDur} style={INPUT}>
                      {(V.durOptions ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}>
                        <option value={o?.id}>{o?.label}</option>
                      </React.Fragment>))}
                    </select>
                  </label>
                </div>
                {V.schWhenPreview ? (<>
                  <div style={{fontSize: "13px", color: "var(--c-hex-34d399)", fontWeight: "700"}}>{V.schWhenPreview}</div>
                </>) : null}
                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px"}}>
                  <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>
                    <span>Evaluator 1 · plays the buyer</span>
                    <select value={(V.schE1) ?? ''} onChange={V.setSchE1} style={{width: "100%", boxSizing: "border-box", background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-160-190-170-18)", borderRadius: "10px", padding: "11px 12px", color: "var(--c-hex-e9f0ea)", fontSize: "13px"}}>
                      {(V.evalOpts ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}>
                        <option value={o?.id}>{o?.label}</option>
                      </React.Fragment>))}
                    </select>
                  </label>
                  <label style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>
                    <span>Evaluator 2 · observes</span>
                    <select value={(V.schE2) ?? ''} onChange={V.setSchE2} style={{width: "100%", boxSizing: "border-box", background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-160-190-170-18)", borderRadius: "10px", padding: "11px 12px", color: "var(--c-hex-e9f0ea)", fontSize: "13px"}}>
                      {(V.evalOpts ?? []).map((o: any, $index: number) => (<React.Fragment key={$index}>
                        <option value={o?.id}>{o?.label}</option>
                      </React.Fragment>))}
                    </select>
                  </label>
                </div>
                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px"}}>
                  <div style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>
                    <span>Assessment version</span>
                    <div style={{width: "100%", boxSizing: "border-box", background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-160-190-170-18)", borderRadius: "10px", padding: "11px 12px", color: "var(--c-hex-a7b5ab)", fontSize: "13px"}}>v1.2 · locked for Cohort 2026-B</div>
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>
                    <span>Join link · optional</span>
                    {V.schLinkEditable ? (<>
                      <input value={(V.schLinkVal) ?? ''} onChange={V.setSchLink} placeholder="Leave blank for a Google Meet link" style={INPUT} />
                    </>) : (<>
                      <div style={{width: "100%", boxSizing: "border-box", background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-160-190-170-18)", borderRadius: "10px", padding: "11px 12px", color: "var(--c-hex-34d399)", fontSize: "13px", wordBreak: "break-all"}}>{V.schLink}</div>
                    </>)}
                  </div>
                </div>
                <div style={{fontSize: "12px", color: V.schWarnColor, minHeight: "16px", lineHeight: "1.5"}}>{V.schWarn}</div>
                <button onClick={V.sendSchedule} disabled={!!(V.schBlocked)} style={{background: V.schBtnBg, color: "var(--c-hex-04120b)", border: "none", borderRadius: "10px", padding: "13px 24px", fontSize: "14px", fontWeight: "800", cursor: "pointer"}}>{V.schBusy ? 'Sending…' : 'Save & send invites'}</button>
                {V.schMsg ? (<>
                  <div style={{fontSize: "12.5px", color: "var(--c-hex-34d399)", fontWeight: "700", lineHeight: "1.55", wordBreak: "break-word"}}>{V.schMsg}</div>
                </>) : null}
                {(V.schWarnings ?? []).map((w: any, $index: number) => (<React.Fragment key={$index}>
                  <div style={{fontSize: "12px", color: "var(--c-hex-f5b84a)", lineHeight: "1.5", wordBreak: "break-word"}}>{"⚠ "}{w}</div>
                </React.Fragment>))}
                <p style={{margin: "0", fontSize: "11px", color: "var(--c-hex-5c6b61)", lineHeight: "1.5"}}>The candidate gets the date, the join link, and their combine page (Exercise B, recording notice). Evaluators get the session, the brief, and a conflict-of-interest prompt in the cockpit. Neither evaluator sees the other’s scores before submitting.</p>
              </div>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>Upcoming sessions</div>
              {(V.schedList ?? []).map((s: any, $index: number) => (<React.Fragment key={$index}>
                <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "18px 22px"}}>
                  <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                    <div style={{fontSize: "15px", fontWeight: "800", flex: "1"}}>{s?.cand}</div>
                    <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-34d399)"}}>{s?.status}</span>
                  </div>
                  <div style={{fontSize: "12.5px", color: "var(--c-hex-8fa396)", marginTop: "4px"}}>{s?.when}{" · "}{s?.evals}{s?.calendar ? " · " + s.calendar : ""}</div>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "var(--c-hex-34d399)", marginTop: "6px", wordBreak: "break-all"}}>{s?.link}</div>
                  {s?.combineLink ? (<>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", color: "var(--c-hex-7e9186)", marginTop: "4px", wordBreak: "break-all"}}>{"Candidate combine page · "}{s?.combineLink}</div>
                  </>) : null}
                </div>
              </React.Fragment>))}
            </div>
          </div>
        </div>
      </>) : null}
      {V.vDecisions ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Decision log</h1>
          <p style={{margin: "0 0 22px", fontSize: "13px", color: "var(--c-hex-8fa396)", maxWidth: "760px", lineHeight: "1.6"}}>Every advance, hold, and decline — who made it, when, on what evidence, and how aligned the evaluators were. This is the record that defends a hiring decision. Entries are never edited; corrections are appended.</p>
          <div style={{display: "flex", flexDirection: "column", gap: "12px", maxWidth: "960px"}}>
            {(V.decisionRows ?? []).map((d: any, $index: number) => (<React.Fragment key={$index}>
              <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "8px"}}>
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--c-hex-04120b)", padding: "4px 10px", borderRadius: "99px", background: d?.bg}}>{d?.decision}</span>
                  <span style={{fontSize: "15px", fontWeight: "800"}}>{d?.cand}</span>
                  <span style={{fontSize: "12.5px", color: "var(--c-hex-8fa396)"}}>{d?.role}</span>
                  <span style={{marginLeft: "auto", fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "var(--c-hex-5c6b61)"}}>{d?.t}{" · "}{d?.by}</span>
                </div>
                <p style={{margin: "0 0 8px", fontSize: "13px", color: "var(--c-hex-d5ded7)", lineHeight: "1.6"}}>{d?.rationale}</p>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", letterSpacing: ".06em", color: "var(--c-hex-7e9186)"}}>{"Evaluator agreement at decision · "}{d?.agree}</div>
              </div>
            </React.Fragment>))}
          </div>
        </div>
      </>) : null}
      {V.vUsers ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>{"Staff & permissions"}</h1>
          <p style={{margin: "0 0 22px", fontSize: "13px", color: "var(--c-hex-8fa396)", maxWidth: "760px", lineHeight: "1.6"}}>Roles decide what a person can see and do; one person can hold several. Candidates are never users — they only ever hold a link to their own assessment.</p>
          <div style={{display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px", alignItems: "start"}}>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", overflow: "hidden"}}>
              <div style={{display: "grid", gridTemplateColumns: "1.6fr 1.4fr 1.6fr .9fr auto", gap: "12px", padding: "12px 22px", borderBottom: "1px solid var(--c-rgba-160-190-170-12)", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>
                <div>Person</div>
                <div>Title</div>
                <div>Roles</div>
                <div>Status</div>
                <div />
              </div>
              {(V.userRows ?? []).map((u: any, $index: number) => (<React.Fragment key={$index}>
                <div style={{display: "grid", gridTemplateColumns: "1.6fr 1.4fr 1.6fr .9fr auto", gap: "12px", padding: "14px 22px", borderBottom: "1px solid var(--c-rgba-160-190-170-07)", alignItems: "center"}}>
                  <div>
                    <div style={{fontSize: "14px", fontWeight: "700"}}>{u?.name}</div>
                    <div style={{fontSize: "11.5px", color: "var(--c-hex-5c6b61)", wordBreak: "break-all"}}>{u?.email}</div>
                  </div>
                  <div style={{fontSize: "12.5px", color: "var(--c-hex-a7b5ab)"}}>{u?.title}</div>
                  <div style={{display: "flex", gap: "4px", flexWrap: "wrap"}}>
                    {(u?.roleTags ?? []).map((t: any, $index: number) => (<React.Fragment key={$index}>
                      <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--c-hex-34d399)", background: "var(--c-rgba-16-185-129-1)", padding: "3px 8px", borderRadius: "99px"}}>{t}</span>
                    </React.Fragment>))}
                  </div>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", fontWeight: "700", color: u?.statusColor}}>{u?.status}</div>
                  <button onClick={u?.toggle} style={{background: "transparent", color: "var(--c-hex-8fa396)", border: "1px solid var(--c-rgba-160-190-170-22)", borderRadius: "8px", padding: "7px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap"}} className="ps2">{u?.action}</button>
                </div>
              </React.Fragment>))}
            </div>
            <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "22px 24px"}}>
              <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "12px"}}>Invite a staff member</div>
              <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                <input value={(V.invName) ?? ''} onChange={V.setInvName} placeholder="Full name" style={{width: "100%", boxSizing: "border-box", background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-160-190-170-18)", borderRadius: "10px", padding: "11px 12px", color: "var(--c-hex-e9f0ea)", fontSize: "13px"}} />
                <input value={(V.invEmail) ?? ''} onChange={V.setInvEmail} placeholder="Work email" style={{width: "100%", boxSizing: "border-box", background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-160-190-170-18)", borderRadius: "10px", padding: "11px 12px", color: "var(--c-hex-e9f0ea)", fontSize: "13px"}} />
                <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                  {(V.invRoleOpts ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}>
                    <label style={{display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer", background: "var(--c-hex-0b120e)", border: `1px solid ${r?.border}`, borderRadius: "10px", padding: "10px 12px"}}>
                      <input type="checkbox" checked={!!(r?.on)} onChange={r?.toggle} style={{accentColor: "var(--c-hex-10b981)", marginTop: "3px", flexShrink: "0"}} />
                      <span>
                        <div style={{fontSize: "13px", fontWeight: "700"}}>{r?.label}</div>
                        <div style={{fontSize: "11.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.5", marginTop: "2px"}}>{r?.d}</div>
                      </span>
                    </label>
                  </React.Fragment>))}
                </div>
                <button onClick={V.sendInvite} disabled={!!(V.invBlocked)} style={{background: V.invBtnBg, color: "var(--c-hex-04120b)", border: "none", borderRadius: "10px", padding: "12px", fontSize: "13.5px", fontWeight: "800", cursor: "pointer"}}>Send invite</button>
                <div style={{fontSize: "12px", color: "var(--c-hex-34d399)", fontWeight: "700", minHeight: "14px"}}>{V.invSaved}</div>
              </div>
              <p style={{margin: "6px 0 0", fontSize: "11px", color: "var(--c-hex-5c6b61)", lineHeight: "1.5"}}>Invites expire in 7 days. University partners get Evaluator only. Deactivating keeps a person’s past scores and audit entries intact.</p>
            </div>
          </div>
        </div>
      </>) : null}
      {V.vInbox ? (<>
        <div style={{animation: "fadeUp .35s ease both"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Accommodation requests</h1>
          <p style={{margin: "0 0 22px", fontSize: "13px", color: "var(--c-hex-8fa396)", maxWidth: "760px", lineHeight: "1.6"}}>Handled by the talent team, never by evaluators. Approved accommodations adjust timers and formats automatically; the reason is never shown to evaluators and never affects scoring.</p>
          <div style={{display: "flex", flexDirection: "column", gap: "12px", maxWidth: "900px"}}>
            {(V.inboxRows ?? []).map((a: any, $index: number) => (<React.Fragment key={$index}>
              <div style={{background: "var(--c-hex-0f1611)", border: `1px solid ${a?.border}`, borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "10px"}}>
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--c-hex-04120b)", padding: "4px 10px", borderRadius: "99px", background: a?.bg}}>{a?.status}</span>
                  <span style={{fontSize: "15px", fontWeight: "800"}}>{a?.cand}</span>
                  <span style={{marginLeft: "auto", fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "var(--c-hex-5c6b61)"}}>{a?.t}</span>
                </div>
                <p style={{margin: "0 0 12px", fontSize: "13.5px", color: "var(--c-hex-d5ded7)", lineHeight: "1.6"}}>“{a?.txt}”</p>
                {a?.open ? (<>
                  <div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
                    <button onClick={a?.approveTime} style={{background: "var(--c-hex-10b981)", color: "var(--c-hex-04120b)", border: "none", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "800", cursor: "pointer"}}>Approve · +50% time</button>
                    <button onClick={a?.approveFormat} style={{background: "transparent", color: "var(--c-hex-34d399)", border: "1px solid var(--c-rgba-160-190-170-3)", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer", borderColor: "var(--c-rgba-16-185-129-35)"}}>Approve · alternative format</button>
                    <button onClick={a?.needInfo} style={{background: "transparent", color: "var(--c-hex-e9f0ea)", border: "1px solid var(--c-rgba-160-190-170-3)", borderRadius: "10px", padding: "11px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer"}}>Ask for more detail</button>
                  </div>
                </>) : null}
                {a?.closed ? (<>
                  <div style={{fontSize: "12.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.55"}}>{a?.resolution}</div>
                </>) : null}
              </div>
            </React.Fragment>))}
            {V.inboxEmpty ? (<>
              <div style={{background: "var(--c-hex-0f1611)", border: "1px dashed var(--c-rgba-160-190-170-22)", borderRadius: "14px", padding: "22px", fontSize: "13.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.6"}}>No accommodation requests. Candidates can request one from their portal at any stage; it lands here.</div>
            </>) : null}
          </div>
        </div>
      </>) : null}
      {V.vRoadmap ? (<>
        <div style={{animation: "fadeUp .35s ease both", maxWidth: "840px"}}>
          <h1 style={{margin: "0 0 6px", fontSize: "30px", fontWeight: "900", letterSpacing: "-.015em"}}>Implementation roadmap</h1>
          <p style={{margin: "0 0 24px", fontSize: "13px", color: "var(--c-hex-8fa396)", lineHeight: "1.6"}}>From prototype to production. Sequenced for a pilot with one hiring campaign.</p>
          <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
            {(V.roadmap ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}>
              <div style={{display: "flex", gap: "18px", background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "20px 24px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", fontWeight: "700", color: "var(--c-hex-10b981)", whiteSpace: "nowrap"}}>{r?.phase}</div>
                <div>
                  <div style={{fontSize: "15px", fontWeight: "800", marginBottom: "6px"}}>{r?.title}</div>
                  <p style={{margin: "0", fontSize: "13px", color: "var(--c-hex-a7b5ab)", lineHeight: "1.65"}}>{r?.body}</p>
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
              <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "14px"}}>Candidate data</div>
                <div style={{display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px"}}>
                  <span style={{fontSize: "13.5px", flex: "1"}}>Retention period</span>
                  <select value={(V.retention) ?? ''} onChange={V.setRetention} disabled={!V.canEditCore} style={{background: "var(--c-hex-0b120e)", border: "1px solid var(--c-rgba-160-190-170-18)", borderRadius: "9px", padding: "9px 12px", color: "var(--c-hex-e9f0ea)", fontSize: "13px"}}>
                    <option>12 months</option>
                    <option>24 months</option>
                    <option>36 months</option>
                  </select>
                </div>
                <div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
                  <button style={{background: "transparent", color: "var(--c-hex-e9f0ea)", border: "1px solid var(--c-rgba-160-190-170-25)", borderRadius: "9px", padding: "9px 15px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer"}}>Export candidate data</button>
                  <button style={{background: "transparent", color: "var(--c-hex-f87171)", border: "1px solid var(--c-rgba-248-113-113-35)", borderRadius: "9px", padding: "9px 15px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer"}}>Process deletion request</button>
                </div>
                <p style={{margin: "12px 0 0", fontSize: "11px", color: "var(--c-hex-5c6b61)", lineHeight: "1.55"}}>Optional demographic data is stored separately from hiring reviewers and is never visible in candidate profiles or comparisons.</p>
              </div>
              <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "14px"}}>Role-based permissions</div>
                <div style={{display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px"}}>
                  {(V.roleTable ?? []).map((r: any, $index: number) => (<React.Fragment key={$index}>
                    <div style={{display: "flex", justifyContent: "space-between", gap: "16px"}}>
                      <span style={{fontWeight: "700", whiteSpace: "nowrap"}}>{r?.label}</span>
                      <span style={{color: "var(--c-hex-8fa396)", textAlign: "right", lineHeight: "1.5"}}>{r?.d}</span>
                    </div>
                  </React.Fragment>))}
                </div>
              </div>
              <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "14px"}}>Audit history</div>
                <div style={{display: "flex", flexDirection: "column", gap: "11px"}}>
                  {(V.auditRows ?? []).map((a: any, $index: number) => (<React.Fragment key={$index}>
                    <div style={{fontSize: "12.5px", lineHeight: "1.5"}}>
                      <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "var(--c-hex-5c6b61)"}}>{a?.t}</span>
                      {" · "}
                      <b>{a?.who}</b>
                      {" — "}
                      <span style={{color: "var(--c-hex-a7b5ab)"}}>{a?.what}</span>
                    </div>
                  </React.Fragment>))}
                </div>
              </div>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
              <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-91-155-255-3)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px"}}>
                  <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-5b9bff)"}}>Fairness audit</div>
                  <span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-04120b)", background: "var(--c-hex-5b9bff)", padding: "3px 8px", borderRadius: "99px"}}>Leadership / Compliance only</span>
                </div>
                {V.fairLocked ? (<>
                  <p style={{margin: "0 0 14px", fontSize: "13px", color: "var(--c-hex-8fa396)", lineHeight: "1.6"}}>Selection rates by stage, using optional self-reported demographics stored separately from hiring reviewers. Visible only while signed in with the Leadership / Compliance role — if you hold it, switch roles in the header.</p>
                </>) : null}
                {V.fairOpen ? (<>
                  <div style={{display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: "8px", fontSize: "12.5px", marginBottom: "6px"}}>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-7e9186)"}}>Stage transition</div>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", textAlign: "right"}}>Group A</div>
                    <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", textAlign: "right"}}>Group B</div>
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px"}}>
                    {(V.fairRows ?? []).map((f: any, $index: number) => (<React.Fragment key={$index}>
                      <div style={{display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: "8px"}}>
                        <span style={{color: "var(--c-hex-a7b5ab)"}}>{f?.stage}</span>
                        <span style={{fontFamily: "'JetBrains Mono',monospace", textAlign: "right"}}>{f?.a}</span>
                        <span style={{fontFamily: "'JetBrains Mono',monospace", textAlign: "right"}}>{f?.b}</span>
                      </div>
                    </React.Fragment>))}
                    {V.fairNote ? (<>
                      <div style={{fontSize: "12.5px", color: "var(--c-hex-8fa396)", lineHeight: "1.6"}}>{V.fairNote}</div>
                    </>) : null}
                  </div>
                  <p style={{margin: "14px 0 0", fontSize: "11px", color: "var(--c-hex-5c6b61)", lineHeight: "1.55"}}>Groups are self-reported and optional. Sample sizes are currently too small for adverse-impact analysis (4/5ths rule requires larger n). Shown for monitoring discipline only.</p>
                </>) : null}
              </div>
              <div style={SCARD}>
                <div style={SLBL}>Schools / properties we hire for</div>
                <p style={SNOTE}>One per line. Add alternate names after a vertical bar so typed variations are recognised — e.g. <b>Incarnate Word Athletics | UIW | University of the Incarnate Word</b>. Used in the Add-a-candidate form, when creating jobs, for duplicate detection, and as the dropdown candidates pick from in Stage 2.</p>
                <textarea value={(V.schoolsTxt) ?? ''} onChange={V.setSchoolsTxt} onBlur={V.commitSchools} rows={5} disabled={!V.settingsEditable} style={STA} />
              </div>
              <div style={SCARD}>
                <div style={SLBL}>Hiring stages (Jobs board)</div>
                <p style={SNOTE}>New candidates land in Initial interview. Mock pitch is optional (skip straight to the VP interview), AD interview leads to the offer letter, and an accepted offer with a confirmed start date marks the job Filled.</p>
                <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                  {(V.stageList ?? []).map((s: any, $index: number) => (<React.Fragment key={$index}>
                    <div style={{display: "flex", gap: "10px", alignItems: "baseline", fontSize: "13px"}}><span style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "var(--c-hex-7e9186)", minWidth: "18px"}}>{$index + 1}</span><span style={{fontWeight: "700"}}>{s?.name}</span>{s?.sub ? (<span style={{fontSize: "12px", color: "var(--c-hex-7e9186)"}}>{s?.sub}</span>) : null}</div>
                  </React.Fragment>))}
                </div>
              </div>
              <div style={SCARD}>
                <div style={SLBL}>First-call evaluation instructions</div>
                <p style={SNOTE}>{"What the evaluation follows when a first-call transcript is submitted on a profile. Plain English; saves automatically."}{V.callPromptIsDefault ? ' Currently the default.' : ' Currently customized.'}</p>
                <textarea value={(V.callPrompt) ?? ''} onChange={V.setCallPrompt} rows={12} disabled={!V.settingsEditable} style={{...STA, fontSize: "12.5px"}} />
                {!V.callPromptIsDefault && V.settingsEditable ? (<button onClick={V.resetCallPrompt} style={{background: "none", border: "none", color: "var(--c-hex-f5b84a)", fontSize: "11.5px", cursor: "pointer", padding: "0", marginTop: "8px", textDecoration: "underline"}}>Reset to the default instructions</button>) : null}
              </div>
              <div style={SCARD}>
                <div style={SLBL}>Reminders</div>
                <p style={SNOTE}>Candidates who haven’t finished their link get a reminder 48 hours after it was sent and a final one at 72 hours, which also refreshes the link. Runs every hour automatically (once a day on the Vercel Hobby plan); this button runs the same check now.</p>
                {V.canRemind ? (<button onClick={V.remindNow} style={CHIP_BTN}>Send due reminders now</button>) : null}
                {V.remindMsg ? (<div style={{fontSize: "12.5px", color: "var(--c-hex-34d399)", marginTop: "10px", lineHeight: "1.5"}}>{V.remindMsg}</div>) : null}
              </div>
              <div style={{background: "var(--c-hex-0f1611)", border: "1px solid var(--c-rgba-160-190-170-13)", borderRadius: "14px", padding: "22px 24px"}}>
                <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "10.5px", fontWeight: "600", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--c-hex-7e9186)", marginBottom: "12px"}}>AI decision-support rules</div>
                <div style={{display: "flex", flexDirection: "column", gap: "8px", fontSize: "12.5px", color: "var(--c-hex-a7b5ab)", lineHeight: "1.55"}}>
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
