export default function setScissorHelper(elem, canvas, renderer) {
    const canvasRect = canvas.getBoundingClientRect();
    const elemRect = elem.getBoundingClientRect();
   
    // вычисляем относительный прямоугольник холста
    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
    const left = Math.max(0, elemRect.left - canvasRect.left);
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
    const top = Math.max(0, elemRect.top - canvasRect.top);
   
    const width = Math.min(canvasRect.width, right - left);
    const height = Math.min(canvasRect.height, bottom - top);
   
    //  установка области отсечения для рендеринга только на эту часть холста
    renderer.setScissor(left, top, width, height);
    renderer.setViewport(left, top, width, height);
   
    // return aspect
    return width / height;
}