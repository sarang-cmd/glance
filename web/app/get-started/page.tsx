import { Intro, metadataFor } from "@/components/shared";
import { Signup } from "@/components/signup";
import { github } from "@/lib/content";
export const metadata = metadataFor("/get-started");
export default function Start() {
  return (
    <div className="container">
      <Intro path="/get-started" label="Get started">
        <p>
          Not released yet. The requirements are written, and the first
          milestone is a small platform spike. Follow along or hear when the
          first build ships.
        </p>
      </Intro>
      <div className="signup-layout">
        <section>
          <span className="eyebrow">Follow the source</span>
          <h2 style={{ fontSize: 36, margin: "20px 0" }}>
            Built in the open.
            <br />
            From the first widget.
          </h2>
          <p>
            Star Glance on GitHub and watch the repository for updates. Ideas
            and issues are welcome, especially from Windows widget developers.
          </p>
          <div className="actions">
            <a href={github} className="button outline">
              Star on GitHub ↗
            </a>
            <a href={`${github}/subscription`} className="text-link">
              Watch the project ↗
            </a>
          </div>
          <div className="spec-list">
            <div>
              Product status <span>Planning</span>
            </div>
            <div>
              First milestone <span>M0 · Lock screen spike</span>
            </div>
            <div>
              License <span>MIT</span>
            </div>
            <div>
              Planned distribution <span>GitHub Releases & winget</span>
            </div>
          </div>
        </section>
        <section className="signup-panel">
          <h2>One email to get started.</h2>
          <p>Join the release list to hear when the first build ships.</p>
          <Signup />
        </section>
      </div>
    </div>
  );
}
