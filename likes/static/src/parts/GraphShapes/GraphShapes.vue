<template>
  <article
    ref="container"
    class="graph-shapes"
  >
    <canvas
      ref="canvas"
      class="graph-shapes__canvas"
    ></canvas>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';
import Shape from '@/classes/Shape';

const shapes = [];
const loadingShapes = new Set();
let context;
let scale = 1;
let translateX = 0;
let translateY = 0;
let idAnimationFrame;

function draw() {
  const { width, height } = context.canvas;
  context.clearRect(0, 0, width, height);

  drawShapes();
  idAnimationFrame = requestAnimationFrame(draw);
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
    const shape = shapes[i];
    const { size, image, likes } = shape;
    const distance = level * radius * 2.5;
    const radians = angle / 180 * Math.PI;
    const diffX = distance * Math.cos(radians);
    const diffY = distance * Math.sin(radians);

    context.save();
    context.translate(diffX, diffY);
    context.scale(size, size);

    // draw circle
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.closePath();
    context.stroke();

    // draw image
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.clip();
    context.drawImage(image, -radius, -radius, radius * 2, radius * 2);
    context.closePath();

    // draw text
    context.fillText(likes, 0, 0, radius);
    context.strokeText(likes, 0, 0, radius);

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
  name: 'GraphShapes',

  computed: {
    ...mapGetters({
      likers: 'likers',
    }),
  },

  watch: {
    likers() {
      this.calculateShapes();
    },
  },

  mounted() {
    const { canvas } = this.$refs;
    context = canvas.getContext('2d');

    this.setCanvas();

    canvas.addEventListener('wheel', (event) => {
      event.preventDefault();
      const { deltaY } = event;
      const step = 0.02;

      if (deltaY < 0 && scale < 3) {
        scale += step;
      }

      if (deltaY > 0 && scale - step > 0.2) {
        scale -= step;
      }
    }, false);


    let isMoving = false;
    canvas.addEventListener('mousedown', () => {
      isMoving = true;
    }, false);

    window.addEventListener('mouseup', () => {
      isMoving = false;
    }, false);

    canvas.addEventListener('mousemove', (event) => {
      if (!isMoving) {
        return;
      }

      const { width, height } = canvas;
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
    this.calculateShapes();

    window.addEventListener('resize', this.setSizes, false);
  },

  beforeDestroy() {
    cancelAnimationFrame(idAnimationFrame);
    window.removeEventListener('resize', this.setSizes, false);
  },

  methods: {
    setCanvas() {
      const { container, canvas } = this.$refs;
      const context = canvas.getContext('2d');

      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      context.fillStyle = 'white';
      context.strokeStyle = 'black';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.font = '50px Arial, Helvetica';
    },
    calculateShapes() {
      for (const { likes, id, photo50 } of this.likers) {
        let currentShape;

        const isLoaded = shapes.some((shape) => {
          if (shape.userId === id) {
            currentShape = shape;
            return true;
          }
        });

        const isLoading = Array.from(loadingShapes.values())
          .some((shape) => {
            if (shape.userId === id) {
              currentShape = shape;
              return true;
            }
          });

        const condition = isLoaded || isLoading;

        if (!condition) {
          currentShape = new Shape(id, photo50);
          loadingShapes.add(currentShape);

          currentShape.on('load', function () {
            loadingShapes.delete(this);
            shapes.push(this);
          });
        }

        currentShape.likes = likes;
      }
    },
  },
};
</script>

<style class="scss" scoped>
.graph-shapes {
  flex: 1 1 100%;
  position: relative;
}
</style>
