/* ==========================================================================
   SimpleMaps world map adapter.
   Uses /maps/mapdata.js + /maps/worldmap.js. Safe checks + TODO for other libs.
   ========================================================================== */

import { loadScript } from '../../../utils/dom';
import { getCountryFlagPath } from '../../../utils/icons/countryFlags';
import { getMapCountryDetails } from '../data/mapCountryDetails';
import type { WorldMapAdapter, WorldMapAdapterOptions, WorldMapAdapterHandlers } from './types';

const MAP_DATA_SCRIPT = '/maps/mapdata.js';
const WORLD_MAP_SCRIPT = '/maps/worldmap.js';

const DEFS_ID = 'worldmap-flag-defs';

function patternId(c: string): string {
  return `flag-pattern-${c.toLowerCase()}`;
}

function findMapSvg(mapEl: HTMLElement): SVGElement | null {
  const fromMap = mapEl.querySelector('svg');
  if (fromMap) return fromMap;
  const parent = mapEl.parentElement;
  if (parent) return parent.querySelector('svg');
  return document.querySelector('#map ~ * svg') ?? document.querySelector('svg');
}

function findCountryPath(svg: SVGElement, code: string): SVGPathElement | SVGGElement | null {
  const upper = code.toUpperCase();
  const byId = svg.querySelector<SVGPathElement | SVGGElement>(`[id="${upper}"]`);
  if (byId) return byId;
  const byGetEl = document.getElementById(upper);
  if (byGetEl && svg.contains(byGetEl)) return byGetEl as unknown as SVGPathElement | SVGGElement;
  const allPaths = svg.querySelectorAll<SVGPathElement>('path');
  for (let i = 0; i < allPaths.length; i++) {
    const p = allPaths[i];
    const id = (p.getAttribute?.('id') ?? (p as unknown as { id?: string }).id ?? '').trim();
    if (id.toUpperCase() === upper) return p;
  }
  const allGroups = svg.querySelectorAll<SVGGElement>('g');
  for (let i = 0; i < allGroups.length; i++) {
    const g = allGroups[i];
    const id = (g.getAttribute?.('id') ?? g.id ?? '').trim();
    if (id.toUpperCase() === upper) return g;
  }
  return null;
}

declare global {
  interface Window {
    simplemaps_worldmap?: {
      load?: (containerId?: string) => void;
      refresh_state?: (id: string) => void;
      refresh?: () => void;
      hooks?: {
        click_state?: (id: string) => void;
        over_state?: (id: string) => void;
        out_state?: (id: string) => void;
      };
      [key: string]: unknown;
    };
    simplemaps_worldmap_mapdata?: {
      main_settings?: { div?: string };
      state_specific?: Record<string, { color?: string }>;
      locations?: Record<string, { lat: string | number; lng: string | number; name: string; color?: string; type?: string; size?: string | number }>;
    };
  }
}

/** SimpleMaps implementation of WorldMapAdapter. */
export class SimpleMapsWorldAdapter implements WorldMapAdapter {
  private container: HTMLElement | null = null;
  private handlers: WorldMapAdapterHandlers = {};
  private clickAbort: AbortController | null = null;
  private flagState: { path: SVGElement | null; fill: string; code: string | null } = {
    path: null,
    fill: '',
    code: null,
  };

  async init(
    container: HTMLElement,
    _options: WorldMapAdapterOptions,
    handlers: WorldMapAdapterHandlers
  ): Promise<void> {
    this.container = container;
    this.handlers = handlers;

    await loadScript(MAP_DATA_SCRIPT);
    await loadScript(WORLD_MAP_SCRIPT);

    const w = typeof window !== 'undefined' ? window : undefined;
    if (!w) return;

    if (typeof w.simplemaps_worldmap !== 'undefined' && typeof w.simplemaps_worldmap.load === 'function') {
      w.simplemaps_worldmap.hooks = w.simplemaps_worldmap.hooks || {};
      w.simplemaps_worldmap.hooks.click_state = (id: string) => {
        this.handlers.onCountryClick?.(id);
      };
      w.simplemaps_worldmap.hooks.over_state = (id: string) => {
        this.handlers.onCountryHover?.(id);
      };
      w.simplemaps_worldmap.hooks.out_state = () => {
        this.handlers.onCountryHover?.(null);
      };
      w.simplemaps_worldmap.load('map');
    } else if (w.simplemaps_worldmap && typeof (w.simplemaps_worldmap as { load?: (id?: string) => void }).load === 'function') {
      w.simplemaps_worldmap.hooks = w.simplemaps_worldmap.hooks || {};
      w.simplemaps_worldmap.hooks.click_state = (id: string) => {
        this.handlers.onCountryClick?.(id);
      };
      w.simplemaps_worldmap.hooks.over_state = (id: string) => {
        this.handlers.onCountryHover?.(id);
      };
      w.simplemaps_worldmap.hooks.out_state = () => {
        this.handlers.onCountryHover?.(null);
      };
      (w.simplemaps_worldmap as { load: (id?: string) => void }).load('map');
    }
    /* TODO: If using another library, call its init here, e.g. window.OtherMapLib.init({ container: container.id }); */

  }



  destroy(): void {
    this.clickAbort?.abort();
    this.clickAbort = null;
    this.container = null;
    this.handlers = {};
    this.setSelectedCountry(undefined);
    /* TODO: If the library exposes destroy/teardown, call it here. */
  }

  setSelectedCountry(iso2: string | undefined): void {
    const mapEl = this.container ?? document.getElementById('map');
    if (!mapEl) return;

    const w = typeof window !== 'undefined' ? window : undefined;
    if (!w) return;

    const svg = findMapSvg(mapEl);
    if (!svg) return;

    const code = iso2?.toUpperCase();
    const state = this.flagState;

    if (!code) {
      if (state.path) {
        state.path.setAttribute('fill', state.fill);
        state.path = null;
      }
      if (state.code && w.simplemaps_worldmap_mapdata?.state_specific?.[state.code] && w.simplemaps_worldmap?.refresh_state) {
        w.simplemaps_worldmap_mapdata.state_specific[state.code].color = 'default';
        if (w.simplemaps_worldmap_mapdata.locations) {
          w.simplemaps_worldmap_mapdata.locations = {};
          if (w.simplemaps_worldmap.refresh) w.simplemaps_worldmap.refresh();
        } else {
          w.simplemaps_worldmap.refresh_state(state.code);
        }
      }
      state.code = null;
      return;
    }

    if (state.path) {
      state.path.setAttribute('fill', state.fill);
      state.path = null;
    }
    if (state.code && w.simplemaps_worldmap_mapdata?.state_specific?.[state.code] && w.simplemaps_worldmap?.refresh_state) {
      w.simplemaps_worldmap_mapdata.state_specific[state.code].color = 'default';
      w.simplemaps_worldmap.refresh_state(state.code);
    }

    const path = findCountryPath(svg, code);
    if (!path) return;

    const originalFill = path.getAttribute('fill') ?? '#88A4BC';
    state.path = path;
    state.fill = originalFill;
    state.code = code;

    let defs = svg.querySelector(`#${DEFS_ID}`);
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.id = DEFS_ID;
      svg.insertBefore(defs, svg.firstChild);
    }

    const pid = patternId(iso2 as string);
    const existing = defs.querySelector(`#${pid}`);
    if (existing) existing.remove();

    const flagUrl = getCountryFlagPath(iso2 as string);
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.id = pid;
    pattern.setAttribute('patternUnits', 'objectBoundingBox');
    pattern.setAttribute('width', '1');
    pattern.setAttribute('height', '1');
    pattern.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', flagUrl);
    img.setAttribute('x', '0');
    img.setAttribute('y', '0');
    img.setAttribute('width', '1');
    img.setAttribute('height', '1');
    img.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    pattern.appendChild(img);
    defs.appendChild(pattern);

    path.setAttribute('fill', `url(#${pid})`);

    if (w.simplemaps_worldmap_mapdata?.state_specific?.[code] && w.simplemaps_worldmap?.refresh_state) {
      w.simplemaps_worldmap_mapdata.state_specific[code].color = `url(#${pid})`;
      
      const details = getMapCountryDetails(iso2 as string);
      if (details && details.capitalLat && details.capitalLng && w.simplemaps_worldmap_mapdata) {
        w.simplemaps_worldmap_mapdata.locations = {
          "0": {
            name: details.capital,
            lat: details.capitalLat,
            lng: details.capitalLng,
            color: "#FF0067",
            type: "square",
            size: 25
          }
        };
        if (w.simplemaps_worldmap.refresh) {
          w.simplemaps_worldmap.refresh();
        } else {
          w.simplemaps_worldmap.refresh_state(code);
        }
      } else {
        w.simplemaps_worldmap.refresh_state(code);
      }
    }
  }
}

/** Factory: create the default world map adapter (SimpleMaps). */
export function createWorldMapAdapter(): WorldMapAdapter {
  return new SimpleMapsWorldAdapter();
}
