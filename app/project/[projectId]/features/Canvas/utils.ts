import { ElementType } from '@/stores/types';
import { MODES } from '../../__components/ToolBar/constants';

export const CanvasUtils = {
  isWithinElement: (element: ElementType, x: number, y: number) => {
    const getDistance = (x1: number, y1: number, x2: number, y2: number) =>
      Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) - Math.pow(Math.abs(y1 - y2), 2));
    const mode = element.mode;
    switch (mode) {
      case MODES.line:
        const offset =
          getDistance(element.x1, element.y1, element.x2, element.y2) -
          getDistance(element.x1, element.y1, x, y) -
          getDistance(x, y, element.x2, element.y2);
        return offset && Math.abs(offset) <= 1;
      case MODES.rectangle:
        return element.x1 <= x && element.x2 >= x && element.y1 <= y && element.y2 >= y;
    }
  },
  getElementsAtPosition: (x: number, y: number, elements: Array<ElementType>) => {
    return elements.find((element) => CanvasUtils.isWithinElement(element, x, y));
  },
  adjustElementCoordinates: (element: ElementType) => {
    const { mode, x1, y1, x2, y2 } = element;
    if (mode === 'rectangle') {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    } else {
      if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return { x1, y1, x2, y2 };
      } else {
        return { x1: x2, y1: y2, x2: x1, y2: y1 };
      }
    }
  },
  isElementNearBy: (x: number, y: number, element: ElementType) => {
    const nearPoint = (x: number, y: number, x1: number, y1: number, name: string) =>
      Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
    const { x1, x2, y1, y2 } = element;
    const topLeft = nearPoint(x, y, x1, y1, 'tl');
    const topRight = nearPoint(x, y, x2, y1, 'tr');
    const bottomLeft = nearPoint(x, y, x1, y2, 'bl');
    const bottomRight = nearPoint(x, y, x2, y2, 'br');
    return topLeft || topRight || bottomLeft || bottomRight || null;
  },
  findElementNearBy: (x: number, y: number, elements: ElementType[]) => {
    const elem = elements.find((item) => CanvasUtils.isElementNearBy(x, y, item));
    return elem ? { elm: elem, angle: CanvasUtils.isElementNearBy(x, y, elem) } : null;
  },
  getElementAtPosition: (x: number, y: number, elements: ElementType[]) => {
    return elements.find((element) => CanvasUtils.isWithinElement(element, x, y));
  },
  resizedCoordinates: (
    x: number,
    y: number,
    position: string,
    coordinates: { x1: number; y1: number; x2: number; y2: number },
  ) => {
    const { x1, y1, x2, y2 } = coordinates;
    switch (position) {
      case 'tl':
      case 'start':
        return { x1: x, y1: y, x2, y2 };
      case 'tr':
        return { x1, y1: y, x2: x, y2 };
      case 'bl':
        return { x1: x, y1, x2, y2: y };
      case 'br':
      case 'end':
        return { x1, y1, x2: x, y2: y };
      default:
        return null; //should not really get here...
    }
  },
  cursorForPosition: (position: string) => {
    switch (position) {
      case 'tl':
      case 'br':
      case 'start':
      case 'end':
        return 'nwse-resize';
      case 'tr':
      case 'bl':
        return 'nesw-resize';
      default:
        return 'move';
    }
  },
};
