// AppShell — generated from the Peak Sales Combine prototype template. Plain React; edit freely.
// V is the view-model returned by PeakCombine.renderVals(): values, lists, and event handlers.
import React from 'react';
import { ViewAsBanner } from './ViewAsBanner';
import { ExpiredLink } from './ExpiredLink';
import { CandidatePortal } from './CandidatePortal';
import { EvaluatorCockpit } from './EvaluatorCockpit';
import { StaffDashboard } from './StaffDashboard';

export function AppShell({ V }: { V: any }) {
  return V.inApp ? (<>
    <header style={{display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap", padding: "14px 28px", borderBottom: "1px solid rgba(160,190,170,.12)", background: "#0B110D", position: "sticky", top: "0", zIndex: "50"}}>
      <div style={{display: "flex", alignItems: "center", gap: "12px", cursor: "pointer"}} onClick={V.exitRole} title="Back to account picker">
        <img src="/assets/peak-logo.png" alt="Peak" style={{width: "34px", height: "auto"}} />
        <div>
          <div style={{fontSize: "15px", fontWeight: "900", letterSpacing: "-.01em", lineHeight: "1.1"}}>
            {"PEAK SALES "}
            <span style={{color: "#10B981"}}>COMBINE</span>
          </div>
          <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "9px", letterSpacing: ".22em", textTransform: "uppercase", color: "#7E9186"}}>{V.roleTitle}</div>
        </div>
      </div>
      <nav style={{display: "flex", gap: "4px", flex: "1 1 100%", minWidth: "0", flexWrap: "wrap", order: "3", marginTop: "-4px"}} aria-label="Primary">
        {(V.navTabs ?? []).map((tab: any, $index: number) => (<React.Fragment key={$index}>
          <button onClick={tab?.go} style={{background: tab?.bg, color: tab?.fg, border: "none", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer"}} className="ps2">{tab?.label}</button>
        </React.Fragment>))}
      </nav>
      <div style={{display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginLeft: "auto", order: "2"}}>
        {V.showRoleChips ? (<>
          <div style={{display: "flex", gap: "3px", background: "#0F1611", border: "1px solid rgba(160,190,170,.15)", borderRadius: "99px", padding: "3px"}} title="Roles you hold — switching changes what you can see and do">
            {(V.roleChips ?? []).map((rc: any, $index: number) => (<React.Fragment key={$index}>
              <button onClick={rc?.on} style={{background: rc?.bg, color: rc?.fg, border: "none", borderRadius: "99px", padding: "6px 12px", fontSize: "11.5px", fontWeight: "700", cursor: "pointer"}}>{rc?.label}</button>
            </React.Fragment>))}
          </div>
        </>) : null}
        <div style={{fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", color: "#7E9186"}}>{V.userLabel}</div>
        <button onClick={V.exitRole} style={{background: "transparent", color: "#8FA396", border: "1px solid rgba(160,190,170,.22)", borderRadius: "8px", padding: "7px 13px", fontSize: "12px", fontWeight: "600", cursor: "pointer"}} className="ps7">{V.exitLabel}</button>
      </div>
    </header>
    {V.saveErr ? (<>
      <div style={{background: "rgba(248,113,113,.12)", borderBottom: "1px solid rgba(248,113,113,.35)", color: "#F87171", fontSize: "12.5px", fontWeight: "700", padding: "8px 28px", textAlign: "center"}}>{V.saveErr}</div>
    </>) : null}
    {V.flashErr ? (<>
      <div onClick={V.clearFlash} title="Click to dismiss" style={{background: "rgba(245,184,74,.12)", borderBottom: "1px solid rgba(245,184,74,.35)", color: "#F5B84A", fontSize: "12.5px", fontWeight: "700", padding: "8px 28px", textAlign: "center", cursor: "pointer"}}>{V.flashErr}{" · click to dismiss"}</div>
    </>) : null}
    <ViewAsBanner V={V} />
    <ExpiredLink V={V} />
    <CandidatePortal V={V} />
    <EvaluatorCockpit V={V} />
    <StaffDashboard V={V} />
  </>) : null;
}
