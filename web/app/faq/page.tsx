import {Intro,metadataFor,JsonLd,CTA} from '@/components/shared';
import {FAQ} from '@/components/faq';
import {faq} from '@/lib/content';
export const metadata=metadataFor('/faq');
export default function FAQPage(){return <div className="container"><Intro path="/faq" label="FAQ"/><FAQ/><CTA/><JsonLd data={{'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}}/></div>}
