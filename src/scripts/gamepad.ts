const makeAndDispatchKeyEvent = (buttonIndex: number) => {
  const gamepadToKey = {
    0: "Enter",
    1: "Escape",
    12: "ArrowUp",
    13: "ArrowDown",
    14: "ArrowLeft",
    15: "ArrowRight",
    112: "ArrowUp",
    113: "ArrowDown",
    114: "ArrowLeft",
    115: "ArrowRight"
  }[ buttonIndex ];

  if (gamepadToKey) {
    console.log(`triggering action ${gamepadToKey}`);
    const event = new CustomEvent("YTBP_direction-input", { detail: gamepadToKey });
    window.dispatchEvent(event);
  }
};


const startGamepadLoop = (gp: Gamepad) => {
  const holdTimeouts = new Map<number, NodeJS.Timeout>();

  setInterval(() => {
    gp.buttons.forEach((button, i) => {
      if (button.pressed) {
        if (!holdTimeouts.has(i)) {
          makeAndDispatchKeyEvent(i);
          holdTimeouts.set(
            i,
            setTimeout(() => {
              console.log(`holding button ${i}`);
              holdTimeouts.delete(i);
            }, 400)
          );
        }
      } else if (holdTimeouts.has(i)) {
        clearTimeout(holdTimeouts.get(i));
        holdTimeouts.delete(i);
        console.log(`button released ${i}`);
      }
    });
    const x = gp.axes[ 0 ];
    const y = gp.axes[ 1 ];

    // Just hack the joystick and treat it the same as the d-pad
    [
      y < -0.5,
      y > 0.5,
      x < -0.5,
      x > 0.5
    ].forEach((stickPosition, i) => {
      if (stickPosition) {
        if (!holdTimeouts.has(i + 112)) {
          makeAndDispatchKeyEvent(i + 112);
          holdTimeouts.set(
            i + 112,
            setTimeout(() => {
              console.log(`holding button ${i + 112}`);
              holdTimeouts.delete(i + 112);
            }, 400)
          );
        }
      } else if (holdTimeouts.has(i + 112)) {
        clearTimeout(holdTimeouts.get(i + 112));
        holdTimeouts.delete(i + 112);
        console.log(`button released ${i + 112}`);
      }
    });

    if (y < -0.5) {
      console.log("up");
    } else if (y > 0.5) {
      console.log("down");
    }
    if (x < -0.5) {
      console.log("left");
    } else if (x > 0.5) {
      console.log("right");
    }
  }, 1);
};

window.addEventListener("gamepadconnected", (e) => {
  const gp = navigator.getGamepads()[ e.gamepad.index ];
  if (gp) {
    console.log(
      "Gamepad connected at index %d: %s. %d buttons, %d axes, mapping %s.",
      gp.index,
      gp.id,
      gp.buttons.length,
      gp.axes.length,
      gp.mapping
    );

    startGamepadLoop(gp);
  }
});
