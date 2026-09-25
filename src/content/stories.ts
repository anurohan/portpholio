import type { Story } from "@/components/sections/StorySection";

/**
 * Narrative story sections. Copy is honest: these describe a CONCEPT and
 * genuine interests (electronics, robotics, mechanics), not claimed builds.
 */
export const stories: Story[] = [
  {
    id: "ai",
    index: "01",
    world: "Intelligence",
    title: "It begins as intelligence.",
    lede: "Scattered data finds structure.",
    body: "Thousands of points drift, then organise into layers — a neural system taking shape. Connections form, the network tightens toward a single point, and intelligence becomes a signal ready to travel. This is where my focus lives: retrieval, vision and language systems that turn raw data into understanding.",
    stages: ["Data", "Embeddings", "Neural layers", "Signal"],
    align: "left",
    accent: "signal",
  },
  {
    id: "electronics",
    index: "02",
    world: "Electronics",
    title: "The signal gains a body.",
    lede: "Intelligence becomes physical.",
    body: "The signal lands on a board. Copper traces draw themselves, components settle into place and pulses start to travel — LEDs answer. I'm drawn to this boundary where software meets hardware: microcontrollers, sensors and circuits that let code act on the world.",
    stages: ["Trace", "Components", "Signal path", "Alive"],
    align: "right",
    accent: "ember",
  },
  {
    id: "robotics",
    index: "03",
    world: "Robotics",
    title: "The circuit learns to move.",
    lede: "An exploded machine finds its shape.",
    body: "Parts converge from the dark and assemble: a base, joints, links, a motor, a sensor. Then it moves — motion driven by control, feedback closing the loop. Robotics is an interest I keep returning to, where perception, control and mechanism meet.",
    stages: ["Assemble", "Actuate", "Sense", "Control loop"],
    align: "left",
    accent: "ember",
  },
  {
    id: "mechanical",
    index: "04",
    world: "Mechanics",
    title: "Motion becomes mechanism.",
    lede: "One gear turns the next.",
    body: "A driver gear turns a shaft; meshing gears respond with the right ratios and directions. Nothing is decorative — every part transfers force to another. I like understanding systems down to the physics that makes them work.",
    stages: ["Drive", "Transfer", "Ratio", "Mechanism"],
    align: "right",
    accent: "ember",
  },
  {
    id: "builder",
    index: "05",
    world: "Builder",
    title: "A blueprint becomes a system.",
    lede: "Idea → design → build → test → debug → iterate.",
    body: "A wireframe fills in and becomes a working whole, components circling like tests under way. This is the throughline: I don't just write code — I like building things and taking them from a sketch through the messy middle of debugging to something that actually runs.",
    stages: ["Idea", "Design", "Build", "Test", "Debug", "Iterate", "Working system"],
    align: "left",
    accent: "signal",
  },
];
