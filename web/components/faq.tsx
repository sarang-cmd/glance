'use client';
import * as Accordion from '@radix-ui/react-accordion';
import {motion,useReducedMotion} from 'motion/react';
import {faq} from '@/lib/content';
export function FAQ(){const reduced=useReducedMotion();return <Accordion.Root className="faq-root" type="multiple">{faq.map(([q,a],i)=><Accordion.Item className="faq-item" key={q} value={`question-${i}`}><Accordion.Header><Accordion.Trigger className="faq-trigger">{q}<span aria-hidden="true">+</span></Accordion.Trigger></Accordion.Header><Accordion.Content className="faq-content"><motion.div initial={{opacity:reduced?1:0,y:reduced?0:-4}} animate={{opacity:1,y:0}} transition={{duration:.18}}><p>{a}</p></motion.div></Accordion.Content></Accordion.Item>)}</Accordion.Root>}
