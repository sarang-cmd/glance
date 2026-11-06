"use client";
import { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { motion, useReducedMotion } from "motion/react";
import { faq } from "@/lib/content";
export function FAQ() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<string[]>([]);
  return (
    <Accordion.Root
      className="faq-root"
      type="multiple"
      value={open}
      onValueChange={setOpen}
    >
      {faq.map(([q, a], i) => {
        const id = `question-${i}`;
        const expanded = open.includes(id);
        return (
          <Accordion.Item className="faq-item" key={q} value={id}>
            <Accordion.Header>
              <Accordion.Trigger className="faq-trigger">
                {q}
                <span aria-hidden="true">{expanded ? "−" : "+"}</span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="faq-content" forceMount asChild>
              <motion.div
                initial={false}
                animate={{
                  height: expanded ? "auto" : 0,
                  opacity: expanded ? 1 : 0,
                }}
                transition={{ duration: reduced ? 0 : 0.18 }}
                inert={!expanded}
              >
                <p>{a}</p>
              </motion.div>
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
}
