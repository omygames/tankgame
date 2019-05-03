// @ts-check

export const getWindowSize = () => {
  const { clientHeight: ch, clientWidth: cw } = window.document.body
  const ratio = window.devicePixelRatio || 1 // TODO： 看需求修改抗锯齿系数，会消耗性能
  const canvasWidth = ratio * cw
  const canvasHeight = ratio * ch
  const canvas = {
    canvasWidth,
    canvasHeight,
    height: ch,
    width: cw,
    ratio,
  }
  return canvas
}