// @ts-nocheck

export function launchFPSMeter() {
  const script = document.createElement("script");

  script.onload = function () {
    const stats = new Stats();

    document.body.appendChild(stats.dom);

    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop)
    });
  };

  script.src = "//mrdoob.github.io/stats.js/build/stats.min.js";
  document.head.appendChild(script);
}
