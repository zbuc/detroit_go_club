// Shared BesoGo types

export interface BesogoConfig {
  container: HTMLElement
  sgf?: string
  size?: string
  coord?: string
  tool?: string
  panels?: string
  theme?: string
  realstones?: boolean
}

export interface BesogoInstance {
  // Core BesoGo editor methods based on the source
  getRoot?: () => unknown
  getCurrent?: () => unknown
  setCurrent?: (node: unknown) => void
  loadRoot?: (gameRoot: unknown) => void
  addListener?: (event: string, callback: () => void) => void
  setTool?: (tool: string) => void
  nextNode?: (steps?: number) => void
  prevNode?: (steps?: number) => void
  cutCurrent?: () => void
  // Legacy properties for backwards compatibility
  destroy?: () => void
  getGameRoot?: () => unknown
  editor?: {
    getGameRoot?: () => unknown
  }
  game?: unknown
  gameRoot?: unknown
}

// Global BesoGo types
declare global {
  interface Window {
    besogo?: {
      create?: (container: HTMLElement, options?: Partial<BesogoConfig>) => BesogoInstance
      composeSgf?: (gameRoot: unknown) => string
      autoInit?: () => void
      realStone?: (x: number, y: number, color: number, index: number) => SVGElement
      svgStone?: (x: number, y: number, color: number) => SVGElement
      makeEditor?: (container: HTMLElement, gameRoot?: unknown) => BesogoInstance
      parseSgf?: (sgf: string) => unknown
      makeBoardDisplay?: (container: HTMLElement, editor: BesogoInstance) => void
      makeControlPanel?: (container: HTMLElement, editor: BesogoInstance) => void
    }
  }
}
