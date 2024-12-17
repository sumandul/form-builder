export interface PasswordPattern {
  minLength: string;
  maxLength: string;
  pattern: string;
  message: string;
  combinedPattern: string;
}

export interface Field {
  name: string;
  placeholder: string | undefined;
  id: any;
  type: string;
  label: string;
  required?: boolean;
}

export interface Form {
  buttonText: any;
  buttonAlignment: any;
  buttonRadius: any;
  color: any | undefined;
  textColor: Color | undefined;
  fields: Field[];
  columns: number;
  passwordPattern: PasswordPattern;
}

export interface DraggableEvent {
  draggableId: string; // Unique ID of the draggable item
  type: string; // Type of drag event (e.g., 'DEFAULT')
  source: {
    index: number; // Index of the draggable item before the drag
    droppableId: string; // ID of the droppable container
  };
  reason: "DROP" | "CANCEL"; // Reason for ending the drag
  mode: "FLUID" | "SNAP"; // Dragging mode
  destination: {
    droppableId: string; // ID of the droppable container where it is dropped
    index: number; // Index in the new container
  } | null; // null if not dropped in a valid destination
  combine: {
    draggableId: string; // ID of the draggable being combined
    droppableId: string; // ID of the droppable being combined
  } | null; // null if no combination occurred
}

export interface Color {
  r?: number; // Red channel (0-255)
  g?: number; // Green channel (0-255)
  b?: number; // Blue channel (0-255)
  h?: number; // Hue (0-360)
  s?: number; // Saturation (0-100)
  l?: number; // Lightness (0-100)
}
