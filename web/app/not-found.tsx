import Link from "next/link";
export const metadata = {
  title: "Page not found",
  description:
    "This page does not exist. Return to Glance widgets and the project roadmap.",
};
export default function NotFound() {
  return (
    <div className="container">
      <div className="page-intro">
        <span className="eyebrow">404 / Page not found</span>
        <h1>
          Nothing here
          <br />
          to glance at.
        </h1>
        <p>
          That address does not point to a page on this site. Find the widgets,
          follow the roadmap or head home.
        </p>
        <div className="actions">
          <Link className="button" href="/">
            Back to home
          </Link>
          <Link className="text-link" href="/widgets">
            Explore widgets ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
