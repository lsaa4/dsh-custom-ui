/** Ambient declarations for the browser client bundle. */

declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.css' {
  const css: string
  export default css
}

declare module 'qrcode' {
  const QRCode: {
    toCanvas(
      canvas: HTMLCanvasElement,
      text: string,
      opts?: Record<string, unknown>,
    ): Promise<unknown>
  }
  export default QRCode
}

declare module 'qrcode/lib/browser.js' {
  export { toCanvas } from 'qrcode'
  const QRCode: {
    toCanvas(
      canvas: HTMLCanvasElement,
      text: string,
      opts?: Record<string, unknown>,
    ): Promise<unknown>
  }
  export default QRCode
}
