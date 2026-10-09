import type { GameEntities } from '../entities';

export const CameraSystem = (entities: GameEntities, { touches, input }: any) => {
  const camera = entities.camera;
  if (!camera) return entities;

  // 1. Process wheel / zoom events
  if (input) {
    for (const evt of input) {
      if (evt.name === 'wheel') {
        const delta = evt.payload?.deltaY || 0;
        const zoomDelta = delta > 0 ? -0.08 : 0.08;
        camera.targetZoom = Math.min(Math.max(camera.targetZoom + zoomDelta, 0.45), 1.8);
      }
    }
  }

  // 2. Process touch/mouse drag for panning
  if (touches) {
    const move = touches.find((t: any) => t.type === 'move');
    if (move && move.delta) {
      camera.targetX += move.delta.pageX / camera.zoom;
      camera.targetY += move.delta.pageY / camera.zoom;
    }
  }

  // 3. Smooth Lerp interpolation towards targets
  camera.x += (camera.targetX - camera.x) * 0.12;
  camera.y += (camera.targetY - camera.y) * 0.12;
  camera.zoom += (camera.targetZoom - camera.zoom) * 0.1;

  return entities;
};
