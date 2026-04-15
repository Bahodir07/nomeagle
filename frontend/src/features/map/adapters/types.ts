/* ==========================================================================
   Map adapter types — swap map libraries without changing UI pages.
   ========================================================================== */

export interface WorldMapAdapterOptions {
  /** Container height in pixels (hint for the map). */
  height?: number;
}

export interface WorldMapAdapterHandlers {
  /** Called when a country is clicked. ISO2 code (e.g. "JP", "BR"). */
  onCountryClick?: (iso2: string) => void;
  /** Called when hover enters a country (iso2) or leaves (null). */
  onCountryHover?: (iso2: string | null) => void;
}

/**
 * Adapter interface for a world map library.
 * Implementations (e.g. SimpleMaps) load the library and wire init/destroy/selection.
 */
export interface WorldMapAdapter {
  /**
   * Initialize the map inside the given container.
   * Container should be the DOM node that will hold the map (e.g. div with id "map").
   * May be async if the implementation loads scripts.
   */
  init(
    container: HTMLElement,
    options: WorldMapAdapterOptions,
    handlers: WorldMapAdapterHandlers
  ): void | Promise<void>;

  /** Clean up: remove listeners, clear map if the library supports it. */
  destroy(): void;

  /** Set the currently selected country (e.g. for highlight/flag fill). ISO2 or undefined to clear. */
  setSelectedCountry(iso2: string | undefined): void;
}
