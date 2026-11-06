import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container section" style={{ minHeight: '55vh' }}>
      <h1 className="display">Nothing at this address.</h1>
      <p className="lead" style={{ marginTop: '1rem' }}>
        The page you were looking for does not exist. It may have moved, or it never shipped, much like Glance itself.
      </p>
      <p style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link className="btn btn-primary" href="/">Back to the homepage</Link>
        <Link className="btn btn-quiet" href="/faq">Read the FAQ</Link>
      </p>
    </div>
  );
}
