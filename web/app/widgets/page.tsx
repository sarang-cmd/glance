import { Intro, CTA, Caption, metadataFor } from "@/components/shared";
import {
  BatteryDemo,
  WaterDemo,
  GraphDemo,
  TodayDemo,
} from "@/components/demos";
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
                The Today demo lets you complete a sample task and hide its
                title. Google Tasks is out of scope for v1.
              </p>
            </div>
            <div className="demo-panel">
              <TodayDemo />
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
              <div className="widget">
                <div className="widget-top">
                  System health{" "}
                  <span className="widget-muted">Sample data</span>
                </div>
                <div className="system-bars">
                  {[
                    ["CPU", 18],
                    ["RAM", 48],
                    ["Disk", 32],
                  ].map(([name, value]) => (
                    <div key={name}>
                      <label htmlFor={String(name)}>
                        {name}
                        <span>{value}%</span>
                      </label>
                      <progress
                        id={String(name)}
                        value={Number(value)}
                        max={100}
                      >
                        {value}%
                      </progress>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 11, marginTop: 24 }}>
                  Network · 1.2 MB/s down · 0.1 MB/s up
                </p>
              </div>
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
              <div className="widget">
                <div className="widget-top">
                  Weekly recap <span className="widget-muted">Sample week</span>
                </div>
                <div className="recap-number">
                  480 <small>min</small>
                </div>
                <p style={{ fontSize: 12 }}>Focused study</p>
                <div className="spec-list">
                  <div>
                    Water goal reached <span>5 of 7 days</span>
                  </div>
                  <div>
                    Exercise sessions <span>2 done · 1 cancelled</span>
                  </div>
                  <div>
                    Tasks completed <span>12</span>
                  </div>
                </div>
              </div>
              <p className="demo-caption">Sample data visualization</p>
            </div>
          </div>
        </section>
        <CTA />
      </div>
    </>
  );
}
