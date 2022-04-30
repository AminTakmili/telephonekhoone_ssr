import { createAnimation } from "@ionic/angular";

export function enterAnimation(baseEl: any) {
  const backdropAnimation = createAnimation()
    .addElement(baseEl.querySelector("ion-backdrop")!)
    .fromTo("opacity", "0.01", "var(--backdrop-opacity)");

  const wrapperAnimation = createAnimation()
    .addElement(baseEl.querySelector(".picker-wrapper")!)
    .keyframes([
      { offset: 0, opacity: "0", transform: "scale(0)" },
      { offset: 1, opacity: "0.99", transform: "scale(1)" },
    ]);

  return createAnimation()
    .addElement(baseEl)
    .easing("ease-out")
    .duration(300)
    .addAnimation([backdropAnimation, wrapperAnimation]);
}
export function leaveAnimation(baseEl: any) {
  return enterAnimation(baseEl).direction("reverse");
}
