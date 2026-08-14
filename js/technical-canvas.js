const MOBILE_BREAKPOINT = 720;
const MOBILE_NODE_LIMIT = 18;
const DESKTOP_NODE_LIMIT = 42;
const MAX_PIXEL_RATIO = 1.5;
const RESIZE_DELAY_MS = 140;
const CONNECTION_DISTANCE = 165;
const GRAPHITE_LINE = 'rgba(129, 136, 150, 0.16)';
const GRAPHITE_NODE = 'rgba(164, 171, 184, 0.42)';
const AMBER_NODE = 'rgba(245, 166, 35, 0.76)';

export function getCanvasProfile(viewportWidth, devicePixelRatio = 1) {
  const pixelRatio = Math.min(MAX_PIXEL_RATIO, Math.max(1, devicePixelRatio || 1));
  return {
    nodeCount: viewportWidth <= MOBILE_BREAKPOINT ? MOBILE_NODE_LIMIT : DESKTOP_NODE_LIMIT,
    pixelRatio,
  };
}

function createNodes(count, width, height, random) {
  return Array.from({ length: count }, (_, index) => ({
    accent: index % 14 === 0,
    depth: 0.35 + random() * 0.65,
    radius: 0.7 + random() * 1.15,
    vx: (random() - 0.5) * 0.16,
    vy: (random() - 0.5) * 0.16,
    x: random() * width,
    y: random() * height,
  }));
}

export function initTechnicalCanvas(
  documentRef = globalThis.document,
  windowRef = globalThis.window,
  random = Math.random,
) {
  const reducedMotion = windowRef?.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  if (reducedMotion) return undefined;

  const canvas = documentRef?.getElementById?.('technical-canvas');
  const context = canvas?.getContext?.('2d');
  if (!canvas || !context || typeof windowRef?.requestAnimationFrame !== 'function') return undefined;

  const requestFrame = windowRef.requestAnimationFrame.bind(windowRef);
  const cancelFrame = windowRef.cancelAnimationFrame?.bind(windowRef) ?? (() => {});
  const setTimer = windowRef.setTimeout?.bind(windowRef) ?? globalThis.setTimeout;
  const clearTimer = windowRef.clearTimeout?.bind(windowRef) ?? globalThis.clearTimeout;
  const finePointer = windowRef.matchMedia?.('(hover: hover) and (pointer: fine)').matches === true;
  let frameId;
  let resizeTimer;
  let width = 1;
  let height = 1;
  let nodes = [];
  const pointer = {
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
  };

  const resetPointer = () => {
    pointer.targetX = width / 2;
    pointer.targetY = height / 2;
  };

  const resizeCanvas = () => {
    width = Math.max(1, Number(windowRef.innerWidth) || canvas.clientWidth || 1);
    height = Math.max(1, Number(windowRef.innerHeight) || canvas.clientHeight || 1);
    const { nodeCount, pixelRatio } = getCanvasProfile(width, windowRef.devicePixelRatio);

    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    nodes = createNodes(nodeCount, width, height, random);
    pointer.currentX = width / 2;
    pointer.currentY = height / 2;
    resetPointer();
  };

  const drawNetwork = () => {
    context.clearRect(0, 0, width, height);
    pointer.currentX += (pointer.targetX - pointer.currentX) * 0.045;
    pointer.currentY += (pointer.targetY - pointer.currentY) * 0.045;

    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
    }

    for (let firstIndex = 0; firstIndex < nodes.length; firstIndex += 1) {
      const first = nodes[firstIndex];
      for (let secondIndex = firstIndex + 1; secondIndex < nodes.length; secondIndex += 1) {
        const second = nodes[secondIndex];
        const distance = Math.hypot(first.x - second.x, first.y - second.y);
        if (distance > CONNECTION_DISTANCE) continue;

        context.beginPath();
        context.moveTo(first.x, first.y);
        context.lineTo(second.x, second.y);
        context.lineWidth = 0.7;
        context.strokeStyle = GRAPHITE_LINE;
        context.globalAlpha = 1 - distance / CONNECTION_DISTANCE;
        context.stroke();
      }
    }

    for (const node of nodes) {
      const pointerOffsetX = (pointer.currentX - width / 2) * node.depth * 0.012;
      const pointerOffsetY = (pointer.currentY - height / 2) * node.depth * 0.012;
      context.beginPath();
      context.arc(node.x + pointerOffsetX, node.y + pointerOffsetY, node.radius, 0, Math.PI * 2);
      context.fillStyle = node.accent ? AMBER_NODE : GRAPHITE_NODE;
      context.globalAlpha = 1;
      context.fill();
    }
  };

  const animate = () => {
    frameId = undefined;
    drawNetwork();
    if (!documentRef.hidden) frameId = requestFrame(animate);
  };

  const startAnimation = () => {
    if (frameId === undefined && !documentRef.hidden) frameId = requestFrame(animate);
  };

  const pauseAnimation = () => {
    if (frameId === undefined) return;
    cancelFrame(frameId);
    frameId = undefined;
  };

  const handleVisibility = () => {
    if (documentRef.hidden) pauseAnimation();
    else startAnimation();
  };

  const handleResize = () => {
    if (resizeTimer !== undefined) clearTimer(resizeTimer);
    resizeTimer = setTimer(() => {
      resizeTimer = undefined;
      resizeCanvas();
    }, RESIZE_DELAY_MS);
  };

  const handlePointerMove = (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = canvas.getBoundingClientRect();
    pointer.targetX = event.clientX - bounds.left;
    pointer.targetY = event.clientY - bounds.top;
  };

  resizeCanvas();
  documentRef.addEventListener?.('visibilitychange', handleVisibility);
  windowRef.addEventListener?.('resize', handleResize);
  if (finePointer) {
    windowRef.addEventListener('pointermove', handlePointerMove, { passive: true });
    windowRef.addEventListener('pointerleave', resetPointer);
  }
  startAnimation();

  return () => {
    pauseAnimation();
    if (resizeTimer !== undefined) clearTimer(resizeTimer);
    documentRef.removeEventListener?.('visibilitychange', handleVisibility);
    windowRef.removeEventListener?.('resize', handleResize);
    if (finePointer) {
      windowRef.removeEventListener('pointermove', handlePointerMove);
      windowRef.removeEventListener('pointerleave', resetPointer);
    }
  };
}
