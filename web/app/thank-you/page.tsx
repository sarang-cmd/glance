import Link from 'next/link';
import {Intro,metadataFor} from '@/components/shared';
export const metadata={...metadataFor('/thank-you'),robots:{index:false,follow:false}};
export default function Thanks(){return <div className="container"><Intro path="/thank-you" label="Release list"/><div className="confirmation"><p>If your request can be processed, you’ll receive an email with a confirmation link. Your place on the release list is only confirmed after you use it. The link expires in 24 hours.</p><p style={{marginTop:20}}>Check your spam folder. If no message arrives, try again later or contact <a className="text-link" href="mailto:sarang.cmd@gmail.com">sarang.cmd@gmail.com</a>.</p><Link href="/" className="button outline">Back to Glance</Link></div></div>}
