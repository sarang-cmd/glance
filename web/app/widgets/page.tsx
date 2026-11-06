import { WeeklyRecapDemo } from "@/components/demos/WeeklyRecapDemo";
import { SystemHealthDemo } from "@/components/demos/SystemHealthDemo";
import { CalendarDemo } from "@/components/demos/CalendarDemo";
import { StudyDemo } from "@/components/demos/StudyDemo";
import { GitHubDemo } from "@/components/demos/GitHubDemo";
import { Intro, CTA, Caption, metadataFor } from "@/components/shared";
import { BatteryDemo } from "@/components/demos/BatteryDemo";
import { WaterDemo } from "@/components/demos/WaterDemo";
import { GraphDemo } from "@/components/demos/GraphDemo";
import { TodayDemo } from "@/components/demos/TodayDemo";

export const metadata = metadataFor("/widgets");
export default function Widgets() {
  return (
    <>
      <div className="container">
        <Intro path="/widgets" label="Widgets">
          <p>
            Useful at a glance. More detail in the companion app. Every widget
            here is a website demo of planned functionality.
          </p>
        </Intro>
        <p className="inline-notice">
          Nothing released yet. Button actions while Windows is locked still
          need verification in M0.
        </p>
        <section className="section">
          <div id="battery" className="feature-row" style={{ marginTop: 0 }}>
            <div className="feature-copy">
              <span className="index-number">01 / BATTERY+</span>
              <h2>
                Know your battery
                <br />
                beyond the percentage.
              </h2>
              <p>
                Charge, estimated time left and battery health. Switch between
                24-hour and 7-day charge history. Cycle count appears only when
                your hardware reports it.
              </p>
              <div className="spec-list">
                <div>
                  Health <span>Full-charge vs. design capacity</span>
                </div>
                <div>
                  History <span>Local background collector</span>
                </div>
              </div>
            </div>
            <div className="demo-panel">
              <BatteryDemo />
              <Caption />
            </div>
          </div>
          <div id="habits" className="feature-row reverse">
            <div className="feature-copy">
              <span className="index-number">02 / HABIT RINGS</span>
              <h2>
                A small check-in.
                <br />
                Progress you can see.
              </h2>
              <p>
                One habit engine for water, distraction-free study and exercise.
                Set your water target and log a portion. Planned exercise
                adjustments raise the day’s target after a session.
              </p>
              <p style={{ marginTop: 16 }}>
                Verified study time comes from Study with Sarang through a local
                bridge. Exercise sessions can be done, cancelled or missed.
              </p>
            </div>
            <div className="demo-panel">
              <WaterDemo />
              <Caption />
            </div>
          </div>
          <div id="consistency" className="feature-row">
            <div className="feature-copy">
              <span className="index-number">03 / CONSISTENCY GRAPH</span>
              <h2>
                See the days
                <br />
                add up.
              </h2>
              <p>
                A GitHub-style graph puts your habit history in view. The
                companion app is planned to show a full year, with individual
                habits and an all-habits aggregate.
              </p>
              <p style={{ marginTop: 16 }}>
                Cancelled days use a distinct marker. Within your monthly
                allowance, an excused day preserves your streak.
              </p>
            </div>
            <div className="demo-panel">
              <GraphDemo />
              <Caption />
            </div>
          </div>
        </section>
      </div>
      <section id="today" className="privacy-band">
        <div className="container">
          <div>
            <span className="eyebrow">04 / Today card</span>
            <h2>
              The day’s essentials.
              <br />
              One combined card.
            </h2>
            <p>
              Your next event, top task, habit rings and streak. Choose the
              combined card, individual widgets or both. Try the privacy
              selector in this demo.
            </p>
          </div>
          <div>
            <TodayDemo />
            <Caption />
          </div>
        </div>
      </section>
      <div className="container">
        <section className="section">
          <div id="calendar" className="feature-row" style={{ marginTop: 0 }}>
            <div className="feature-copy">
              <span className="index-number">05 / CALENDAR & TASKS</span>
              <h2>
                What’s next.
                <br />
                What needs doing.
              </h2>
              <p>
                Read-only Google Calendar events, with full-year browsing in the
                companion app. Bring your own Google OAuth client ID. The
                built-in task list stays in the local database and works
                offline.
              </p>
              <p style={{ marginTop: 16 }}>
                Explore a sample year in this calendar demo. The Today card
                above lets you complete a sample task. Google Tasks is out of
                scope for v1.
              </p>
            </div>
            <div className="demo-panel">
              <CalendarDemo />
              <Caption />
            </div>
          </div>
          <div id="system" className="feature-row reverse">
            <div className="feature-copy">
              <span className="index-number">06 / SYSTEM HEALTH</span>
              <h2>
                A quieter way to
                <br />
                keep an eye on things.
              </h2>
              <p>
                CPU, RAM, disk usage and network throughput, with small trend
                lines. Temperature is planned only where supported sensors make
                it available.
              </p>
            </div>
            <div className="demo-panel">
              <SystemHealthDemo />
              <p className="demo-caption">Sample data visualization</p>
            </div>
          </div>
          <div id="recap" className="feature-row">
            <div className="feature-copy">
              <span className="index-number">07 / WEEKLY RECAP</span>
              <h2>
                Your week,
                <br />
                in perspective.
              </h2>
              <p>
                A summary of focused study minutes, water goals, sessions done,
                cancelled and missed, battery statistics, completed tasks and
                streak changes. Planned for the companion app, with a compact
                widget version.
              </p>
            </div>
            <div className="demo-panel">
              <WeeklyRecapDemo />
              <p className="demo-caption">Sample data visualization</p>
            </div>
          </div>
        </section>
        <section
          id="study"
          className="section integration-section"
          aria-labelledby="study-heading"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">08 / Study bridge</span>
              <h2 id="study-heading">
                Focused time,
                <br />
                from its source.
              </h2>
            </div>
            <p>
              Study with Sarang is planned as the source of verified
              distraction-free time. Glance reads an opt-in local bridge instead
              of duplicating drift detection.
            </p>
          </div>
          <div className="integration-layout">
            <ol className="bridge-flow">
              <li>
                <strong>Study with Sarang</strong>
                <p>Publishes sessions only after the owner opts in.</p>
              </li>
              <li>
                <strong>A local JSON Lines file</strong>
                <p>
                  The preferred v1 bridge shares sessions through a local
                  folder. Its format still needs confirmation in M0.
                </p>
              </li>
              <li>
                <strong>The Glance study ring</strong>
                <p>
                  Shows progress toward 120 focused minutes. Standalone focus
                  timer sessions remain separate, unverified focus time.
                </p>
              </li>
            </ol>
            <div className="demo-panel">
              <StudyDemo />
              <Caption />
            </div>
          </div>
        </section>
        <section
          id="github"
          className="feature-row integration-feature"
          aria-labelledby="github-heading"
        >
          <div className="demo-panel">
            <GitHubDemo />
            <Caption />
          </div>
          <div className="feature-copy">
            <span className="index-number">09 / GITHUB STREAK</span>
            <h2 id="github-heading">
              Contributions,
              <br />
              at a glance.
            </h2>
            <p>
              Your contribution streak, commits today and contributions this
              week. Read-only access is planned through a token or OAuth device
              flow. The same source can feed the all-habits graph.
            </p>
            <p style={{ marginTop: 16 }}>
              Planned for M5. Open pull request and unread notification counts
              are a later, optional requirement.
            </p>
          </div>
        </section>
        <CTA />
      </div>
    </>
  );
}
