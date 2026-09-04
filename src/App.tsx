import { PeakCombine } from './PeakCombine';

// Demo switches live in the URL so any screen can be deep-linked:
//   ?role=candidate | evaluator | manager | admin | leadership   opens signed in as that role
//   ?decision=Advance | Decline                                  shows the candidate's decision card
//   ?mobile=1                                                    frames the candidate portal at phone width
//   ?fast=1                                                      runs combine timers 15x faster
//   ?reset=1                                                     clears saved demo progress (localStorage)
export default function App() {
  const q = new URLSearchParams(window.location.search);
  return (
    <PeakCombine
      defaultRole={q.get('role') ?? 'entry'}
      candidateDecision={q.get('decision') ?? 'none'}
      mobilePreview={q.get('mobile') === '1'}
      fastTimers={q.get('fast') === '1'}
      showTexture={q.get('texture') !== '0'}
    />
  );
}
