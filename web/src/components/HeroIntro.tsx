'use client';

import { MotionConfig, LazyMotion, domAnimation, m } from 'motion/react';

/** The one orchestrated entrance on the site: hero headline and lead fade up. */
export default function HeroIntro() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <m.h1
          className="hero-title"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62, ease: [0.22, 0.61, 0.21, 1] }}
        >
          The useful parts of your lock screen. None of the feed.
        </m.h1>
        <m.p
          className="lead"
          style={{ marginTop: '1.4rem', maxWidth: '34ch' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 0.61, 0.21, 1] }}
        >
          Glance is a set of ad-free widgets for Windows 11: battery health, habit rings, your calendar and your tasks.
        </m.p>
      </MotionConfig>
    </LazyMotion>
  );
}
