import { Intro, metadataFor } from "@/components/shared";
import { github } from "@/lib/content";
export const metadata = metadataFor("/terms");
export default function Terms() {
  return (
    <div className="container">
      <Intro path="/terms" label="Terms" />
      <article className="prose">
        <p className="draft">
          DRAFT FOR REVIEW. These website terms require owner and legal review
          before production. Effective date, jurisdiction and applicable legal
          disclosures are not yet supplied. This is not legal advice.
        </p>
        <h2>Project status</h2>
        <p>
          Glance is in planning. No build is available. Widget demos use sample
          data and illustrate planned features. The demos do not establish what
          is possible on a locked Windows screen. Roadmap milestones are scope
          descriptions with no announced release dates.
        </p>
        <h2>Release list</h2>
        <p>
          The release list requests an email address and uses double opt-in.
          Confirmation is required to become subscribed. You can leave using the
          unsubscribe link included in list emails. The{" "}
          <a href="/privacy">Privacy Policy</a> describes the website data
          practices.
        </p>
        <h2>Source license</h2>
        <p>
          The repository is available under the{" "}
          <a href={`${github}/blob/main/LICENSE`}>MIT license</a>. Its
          copyright, permission and warranty terms apply to the repository. No
          additional software license is created by this website draft.
        </p>
        <h2>Reference values and compatibility</h2>
        <p>
          Proposed hydration presets and exercise adjustments are general
          references, not medical advice. Hardware reporting and Windows widget
          behavior still need testing. Planned integrations may require separate
          credentials and are subject to their providers’ requirements.
        </p>
        <h2>Contact and review items</h2>
        <p>
          Contact Sarang Batra at{" "}
          <a href="mailto:sarang.cmd@gmail.com">sarang.cmd@gmail.com</a>. DRAFT
          FOR REVIEW: the owner must determine governing law, any required
          consumer information, website liability provisions and dispute
          resolution disclosures. No payment or purchase is offered on this
          website.
        </p>
      </article>
    </div>
  );
}
