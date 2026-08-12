import DrawingCanvas from '../game/canvas/DrawingCanvas';

type AvatarCanvasProps = {
  onCanvasReady: (
    getImage: () => string,
  ) => void;
};

export default function AvatarCanvas({
  onCanvasReady,
}: AvatarCanvasProps) {
  return (
    <DrawingCanvas
      mode="avatar"
      onCanvasReady={
        onCanvasReady
      }
    />
  );
}