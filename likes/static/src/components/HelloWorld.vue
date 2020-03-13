<template>
  <div class="hello">
    <canvas
      ref="canvas"
      class="canvas"
    ></canvas>
  </div>
</template>

<script>
import Shape from '@/classes/Shape';
import { getRandomInt } from '@/utils';

const shapes = [];
let context;
let scale = 1;
let translateX = 0;
let translateY = 0;

function draw() {
  const { width, height } = context.canvas;
  context.clearRect(0, 0, width, height);

  drawShapes();
  requestAnimationFrame(draw);
}

function drawShapes() {
  const { width, height } = context.canvas;
  context.save();
  context.translate(
    Math.trunc(width / 2) + translateX,
    Math.trunc(height / 2) + translateY,
  );
  context.scale(scale, scale);

  const radius = 50;
  let level = 0;
  let stepDegrees = 360;
  let angle = 0;
  let currentRoundStep = 1;

  for (let i = 0; i < shapes.length; i += 1) {
    const { size } = shapes[i];
    const distance = level * radius * 2.5;
    const radians = angle / 180 * Math.PI;
    const diffX = distance * Math.cos(radians);
    const diffY = distance * Math.sin(radians);

    context.save();
    context.translate(diffX, diffY);
    context.beginPath();
    context.arc(0, 0, radius * size, 0, Math.PI * 2);
    context.closePath();
    context.stroke();
    context.restore();

    angle += stepDegrees;
    level = Math.trunc(angle / 360);

    if (currentRoundStep * stepDegrees >= 360) {
      stepDegrees = 360 / (level * 5);
      currentRoundStep = 0;
    }
    currentRoundStep += 1;
  }

  context.restore();
}

export default {
  name: 'HelloWorld',

  mounted() {
    const { canvas } = this.$refs;
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
    context = canvas.getContext('2d');

    // draw();
    context.fillStyle = 'black';
    context.strokeStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    canvas.addEventListener('wheel', (event) => {
      event.preventDefault();
      const { deltaY } = event;
      const step = 0.02;

      if (deltaY > 0 && scale < 3) {
        scale += step;
      }

      if (deltaY < 0 && scale - step > 0.2) {
        scale -= step;
      }
    }, false);


    let isMoving = false;
    canvas.addEventListener('mousedown', () => {
      isMoving = true;
    }, false);

    canvas.addEventListener('mouseup', () => {
      isMoving = false;
    }, false);

    canvas.addEventListener('mousemove', (event) => {
      if (!isMoving) {
        return;
      }

      const { movementX, movementY } = event;
      const halfWidth = Math.trunc(width / 2);
      const halfHeight = Math.trunc(height / 2);
      const conditionHorizontalLeft =
        movementX < 0 && halfWidth + translateX < 0;
      const conditionHorizontalRight =
        movementX > 0 && translateX > halfWidth;
      const conditionVerticalTop =
        movementY < 0 && halfHeight + translateY < 0;
      const conditionVerticalBottom =
        movementY > 0 && translateY > halfHeight;

      if (
        conditionHorizontalLeft
        || conditionHorizontalRight
        || conditionVerticalTop
        || conditionVerticalBottom
      ) {
        return;
      }

      translateX += movementX;
      translateY += movementY;
    }, false);

    draw();

    for (let i = 0; i < 100; i += 1) {
      setTimeout(function () {
        shapes.push(new Shape());
      }, i * 50);
    }

    function increaseRandomShape() {
      if (!shapes.length) {
        setTimeout(increaseRandomShape, 100);
        return;
      }

      const randomValue = getRandomInt(0, shapes.length - 1);
      shapes[randomValue].increment();

      setTimeout(increaseRandomShape, 100);
    }

    increaseRandomShape();
  },
};
</script>

<style scoped>
.canvas {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: auto;
  height: auto;
}
</style>
