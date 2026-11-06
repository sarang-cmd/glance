"use client";
import { motion, useReducedMotion } from "motion/react";
import { BatteryDemo } from "./BatteryDemo";
import { WaterDemo } from "./WaterDemo";
export function HeroDemo() {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="hero-product"
      initial={{ opacity: 1, y: reduced ? 0 : 12 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="demo-stage">
        <div className="stage-caption">
          <span>WINDOWS 11 / A QUIETER LOCK SCREEN</span>
          <span>GLANCE CONCEPT 01</span>
        </div>
        <div className="lock-clock" aria-hidden="true">
          09:41<small>Wednesday, October 21</small>
        </div>
        <div className="hero-widgets">
          <BatteryDemo />
          <WaterDemo />
        </div>
        <div className="stage-bottom">
          <span className="stage-mark">g.</span>
          <p>Your data. Your device.</p>
          <span>Local-first by design</span>
        </div>
      </div>
      <p className="demo-caption">
        <span className="tiny-dot" /> Interactive demo with sample data{" "}
        <span>Planned UI. Lock screen interactions are unverified.</span>
      </p>
    </motion.div>
  );
}
