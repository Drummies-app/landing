import { Hero } from "../components/Hero";
import { StudioPanel } from "../components/StudioPanel";
import { Ticker } from "../components/Ticker";
import { Schedule } from "../components/Schedule";
import { About } from "../components/About";
import { Roadmap } from "../components/Roadmap";
import { BuildLogTeaser } from "../components/BuildLogTeaser";
import { Waitlist } from "../components/Waitlist";
import { EasterEgg } from "../components/EasterEgg";
import type { StreamState } from "../types";
import type { LiveStatus } from "../lib/live";

interface Props {
  states: StreamState[];
  next: StreamState | null;
  latest: StreamState | null;
  now: Date;
  status: LiveStatus | null;
  onOpenLog: (event: React.MouseEvent) => void;
}

export function Home({ states, next, latest, now, status, onOpenLog }: Props) {
  return (
    <>
      <Hero
        studio={
          <StudioPanel next={next} latest={latest} now={now} status={status} />
        }
      />
      <Ticker />
      <About />
      <Schedule states={states} next={next} />
      <Roadmap />
      <BuildLogTeaser onOpen={onOpenLog} />
      <Waitlist />
      <EasterEgg />
    </>
  );
}
