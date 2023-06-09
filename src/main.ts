import "./style.css";
import { IntObs } from "./int-obs";

window.customElements.whenDefined("int-obs").then(() => {
  console.log("int-obs is defined.");
});

document.addEventListener("intersectionchange", (event) => {
  console.group(event.type);
  console.log("target:", event.target);
  console.log("detail:", (event as CustomEvent).detail);
  console.groupEnd();
});

const intObs = document.querySelector(`int-obs[init="false"]`) as IntObs;

if (intObs) {
  intObs.observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        console.log("manually initialized", entry);
      });
    },
    {
      rootMargin: "-10% 0px -100px 0px",
      threshold: [0, 0.25, 0.75, 1],
    }
  );

  intObs.initialize();
}

const manualCallbackElement = document.querySelector(
  "#manualCallback"
) as IntObs;

manualCallbackElement.callback = (entry) => {
  entry.target.innerHTML = `manually set callback: ${entry.isIntersecting}`;
};
