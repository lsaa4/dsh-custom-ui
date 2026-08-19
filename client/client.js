window.__ModuleLoader__.load({ id: "dsh-glass-ui", factory: (require) => {
var module = { exports: {} };
var exports = module.exports;
(()=>{const s=document.createElement('style');s.setAttribute('data-plugin',"dsh-glass-ui");s.textContent=":root {\n  --glass-opacity: .72;\n  --glass-blur: 18px;\n  --glass-font: \"\";\n  --glass-font-url: \"\";\n  --glass-bg-type: none;\n  --glass-bg-image: none;\n  --glass-bg-video: none;\n  --glass-bg-mask: 0;\n  --glass-bg-fit: cover;\n  --glass-anim-level: soft;\n  --glass-surface-light: #ffffffb8;\n  --glass-surface-dark: #101018b8;\n}\n\nbody.dsh-glass-on, body.dsh-glass-on button, body.dsh-glass-on input, body.dsh-glass-on select, body.dsh-glass-on textarea {\n  font-family: var(--glass-font);\n}\n\n#dsh-glass-bg {\n  z-index: -1;\n  pointer-events: none;\n  opacity: 0;\n  background: radial-gradient(1200px 800px at 82% -10%, #638cff38, #0000 60%), radial-gradient(1000px 700px at 8% 112%, #00d2b429, #0000 55%), linear-gradient(165deg, #4176e614, #0000 45%);\n  transition: opacity .7s, transform .7s, filter .7s;\n  position: fixed;\n  inset: 0;\n  overflow: hidden;\n}\n\nbody.dsh-glass-ready #dsh-glass-bg {\n  opacity: 1;\n}\n\n#dsh-glass-bg img, #dsh-glass-bg video {\n  object-fit: var(--glass-bg-fit, cover);\n  width: 100%;\n  height: 100%;\n  filter: blur(calc(var(--glass-blur) * .55)) saturate(1.12);\n  transition: filter .7s, opacity .7s;\n  position: absolute;\n  inset: 0;\n  transform: scale(1.06);\n}\n\nbody[data-glass-fit=\"contain\"] #dsh-glass-bg img, body[data-glass-fit=\"contain\"] #dsh-glass-bg video {\n  object-fit: contain;\n}\n\nbody[data-glass-fit=\"original\"] #dsh-glass-bg img, body[data-glass-fit=\"original\"] #dsh-glass-bg video {\n  object-fit: none;\n  width: auto;\n  max-width: none;\n  height: auto;\n  max-height: none;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%) scale(1.06);\n}\n\n#dsh-glass-bg:after {\n  content: \"\";\n  background: rgba(255, 255, 255, var(--glass-bg-mask));\n  transition: opacity .7s;\n  position: absolute;\n  inset: 0;\n}\n\nbody[data-ds-dark-theme] #dsh-glass-bg:after {\n  background: rgba(0, 0, 0, var(--glass-bg-mask));\n}\n\nbody.dsh-glass-on {\n  --dsh-scrollbar-thumb: #7f7f7f61;\n  --dsh-scrollbar-thumb-hover: #7f7f7f8c;\n}\n\n@keyframes dsh-glass-fade {\n  from {\n    opacity: 0;\n    transform: translateY(6px);\n  }\n\n  to {\n    opacity: 1;\n    transform: none;\n  }\n}\n\nbody.dsh-glass-anim-soft #root > *, body.dsh-glass-anim-strong #root > * {\n  animation: .45s cubic-bezier(.2, .6, .3, 1) both dsh-glass-fade;\n}\n\nbody.dsh-glass-anim-soft button, body.dsh-glass-anim-soft [role=\"button\"], body.dsh-glass-anim-strong button, body.dsh-glass-anim-strong [role=\"button\"] {\n  transition: transform .18s, background-color .18s, opacity .18s, border-color .18s, box-shadow .18s;\n}\n\nbody.dsh-glass-anim-soft #dsh-glass-bg, body.dsh-glass-anim-soft #dsh-glass-bg img, body.dsh-glass-anim-soft #dsh-glass-bg video, body.dsh-glass-anim-strong #dsh-glass-bg, body.dsh-glass-anim-strong #dsh-glass-bg img, body.dsh-glass-anim-strong #dsh-glass-bg video {\n  transition-duration: .9s;\n}\n\n@keyframes dsh-glass-pop {\n  0% {\n    opacity: .6;\n    transform: translateY(2px) scale(.985);\n  }\n\n  100% {\n    opacity: 1;\n    transform: none;\n  }\n}\n\nbody.dsh-glass-anim-strong #root > * {\n  animation: .5s cubic-bezier(.2, .6, .3, 1) both dsh-glass-pop;\n}\n\nbody.dsh-glass-anim-strong button:hover, body.dsh-glass-anim-strong [role=\"button\"]:hover {\n  transform: translateY(-1px) scale(1.02);\n  box-shadow: 0 4px 18px #638cff38;\n}\n\nbody.dsh-glass-anim-strong #dsh-glass-bg, body.dsh-glass-anim-strong #dsh-glass-bg img, body.dsh-glass-anim-strong #dsh-glass-bg video {\n  transition-duration: 1.4s;\n}\n\nbody.dsh-glass-anim-none #root > * {\n  animation: none !important;\n}\n\nbody.dsh-glass-anim-none #dsh-glass-bg, body.dsh-glass-anim-none #dsh-glass-bg img, body.dsh-glass-anim-none #dsh-glass-bg video {\n  transition: none !important;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  body.dsh-glass-anim-soft #root > *, body.dsh-glass-anim-strong #root > * {\n    animation: none;\n  }\n\n  body.dsh-glass-anim-soft #dsh-glass-bg, body.dsh-glass-anim-soft #dsh-glass-bg img, body.dsh-glass-anim-soft #dsh-glass-bg video, body.dsh-glass-anim-strong #dsh-glass-bg, body.dsh-glass-anim-strong #dsh-glass-bg img, body.dsh-glass-anim-strong #dsh-glass-bg video {\n    transition: none;\n  }\n}\n\n.dsh-glass-music-controls {\n  background: #7f7f7f14;\n  border: 1px solid #7f7f7f33;\n  border-radius: 12px;\n  flex-direction: column;\n  gap: 6px;\n  width: 180px;\n  margin: 0;\n  padding: 8px;\n  display: flex;\n  box-shadow: 0 4px 16px #00000014;\n}\n\n.dsh-glass-music-cover {\n  aspect-ratio: 1;\n  background: #7f7f7f1f;\n  border-radius: 8px;\n  width: 100%;\n  position: relative;\n  overflow: hidden;\n}\n\n.dsh-glass-music-cover img {\n  object-fit: cover;\n  width: 100%;\n  height: 100%;\n  display: none;\n}\n\n.dsh-glass-music-cover-placeholder {\n  color: #7f7f7fb3;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n  font-size: 32px;\n  display: flex;\n}\n\n.dsh-glass-music-progress {\n  flex-direction: column;\n  gap: 2px;\n  display: flex;\n}\n\n.dsh-glass-music-progress input[type=\"range\"] {\n  width: 100%;\n  height: 4px;\n  accent-color: var(--dsw-alias-brand-primary, #4176e6);\n}\n\n.dsh-glass-music-times {\n  opacity: .7;\n  justify-content: space-between;\n  font-size: 11px;\n  display: flex;\n}\n\n.dsh-glass-music-buttons {\n  flex-wrap: wrap;\n  justify-content: center;\n  align-items: center;\n  gap: 6px;\n  display: flex;\n}\n\n.dsh-glass-music-controls button {\n  width: 24px;\n  height: 24px;\n  color: inherit;\n  cursor: pointer;\n  background: none;\n  border: none;\n  border-radius: 6px;\n  justify-content: center;\n  align-items: center;\n  padding: 0;\n  font-size: 12px;\n  line-height: 1;\n  display: inline-flex;\n}\n\n.dsh-glass-music-controls button:hover:not(:disabled) {\n  background: #4176e61f;\n}\n\n.dsh-glass-music-controls button:disabled {\n  opacity: .35;\n  cursor: default;\n}\n\n.dsh-glass-volume {\n  align-items: center;\n  gap: 3px;\n  font-size: 11px;\n  display: inline-flex;\n}\n\n.dsh-glass-volume input[type=\"range\"] {\n  width: 48px;\n  height: 3px;\n  accent-color: var(--dsw-alias-brand-primary, #4176e6);\n}\n\n.dsh-glass-music-controls--fixed {\n  z-index: 1000;\n  position: fixed;\n}\n.d09JSa_panel {\n  flex-direction: column;\n  gap: 16px;\n  max-width: 640px;\n  padding: 4px 0 16px;\n  display: flex;\n}\n\n.d09JSa_card {\n  background: #7f7f7f0d;\n  border: 1px solid #7f7f7f2e;\n  border-radius: 10px;\n  flex-direction: column;\n  gap: 10px;\n  padding: 14px 16px;\n  display: flex;\n}\n\n.d09JSa_cardTitle {\n  margin: 0;\n  font-size: 14px;\n  font-weight: 600;\n}\n\n.d09JSa_field {\n  flex-direction: column;\n  gap: 4px;\n  display: flex;\n}\n\n.d09JSa_fieldHead {\n  justify-content: space-between;\n  align-items: center;\n  font-size: 13px;\n  display: flex;\n}\n\n.d09JSa_value {\n  font-variant-numeric: tabular-nums;\n  opacity: .75;\n}\n\n.d09JSa_range {\n  width: 100%;\n  accent-color: var(--dsw-alias-brand-primary, #4176e6);\n}\n\n.d09JSa_hint {\n  opacity: .6;\n  margin: 0;\n  font-size: 12px;\n}\n\n.d09JSa_pills {\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 6px;\n  display: flex;\n}\n\n.d09JSa_row {\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 8px;\n  display: flex;\n}\n\n.d09JSa_grow {\n  flex: 220px;\n}\n\n.d09JSa_fileName {\n  opacity: .85;\n  font-size: 13px;\n}\n\n.d09JSa_toggleRow {\n  cursor: pointer;\n  align-items: center;\n  gap: 8px;\n  font-size: 13px;\n  display: flex;\n}\n\n.d09JSa_toggleRow input {\n  accent-color: var(--dsw-alias-brand-primary, #4176e6);\n}\n\n.d09JSa_fieldLabel {\n  opacity: .85;\n  font-size: 13px;\n}\n\n.d09JSa_interval {\n  width: 90px;\n}\n\n.d09JSa_imageList {\n  flex-direction: column;\n  gap: 6px;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  display: flex;\n}\n\n.d09JSa_imageRow {\n  justify-content: space-between;\n  align-items: center;\n  gap: 8px;\n  display: flex;\n}\n\n.d09JSa_imageName {\n  min-width: 0;\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  background: none;\n  border: 1px solid #0000;\n  border-radius: 6px;\n  flex: auto;\n  align-items: center;\n  gap: 8px;\n  padding: 4px 8px;\n  font-size: 12px;\n  display: inline-flex;\n  overflow: hidden;\n}\n\n.d09JSa_imageName em {\n  color: var(--dsw-alias-brand-primary, #4176e6);\n  background: #4176e62e;\n  border-radius: 8px;\n  padding: 1px 6px;\n  font-size: 10px;\n  font-style: normal;\n}\n\n.d09JSa_imageName[data-active] {\n  border-color: #4176e666;\n}\n\n.d09JSa_cssArea {\n  width: 100%;\n  min-height: 110px;\n  color: inherit;\n  resize: vertical;\n  box-sizing: border-box;\n  background: #0000000a;\n  border: 1px solid #7f7f7f40;\n  border-radius: 8px;\n  padding: 8px 10px;\n  font-family: SF Mono, JetBrains Mono, Consolas, monospace;\n  font-size: 12px;\n  line-height: 1.5;\n}\n\n.d09JSa_saveState {\n  opacity: .7;\n  font-size: 12px;\n}\n.-pu28G_card {\n  background: #7f7f7f0d;\n  border: 1px solid #7f7f7f2e;\n  border-radius: 10px;\n  flex-direction: column;\n  gap: 10px;\n  padding: 14px 16px;\n  display: flex;\n}\n\n.-pu28G_cardTitle {\n  margin: 0;\n  font-size: 14px;\n  font-weight: 600;\n}\n\n.-pu28G_row {\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 8px;\n  display: flex;\n}\n\n.-pu28G_field {\n  flex-direction: column;\n  gap: 8px;\n  display: flex;\n}\n\n.-pu28G_fieldLabel {\n  opacity: .85;\n  font-size: 13px;\n}\n\n.-pu28G_pills {\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 6px;\n  display: flex;\n}\n\n.-pu28G_hint {\n  opacity: .6;\n  margin: 0;\n  font-size: 12px;\n}\n\n.-pu28G_loginBox {\n  flex-direction: column;\n  gap: 8px;\n  display: flex;\n}\n\n.-pu28G_qrBox {\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  display: flex;\n}\n\n.-pu28G_qrBox canvas {\n  border: 1px solid #7f7f7f33;\n  border-radius: 8px;\n}\n\n.-pu28G_qrState {\n  opacity: .75;\n  margin: 0;\n  font-size: 12px;\n}\n\n.-pu28G_account {\n  font-size: 13px;\n  font-weight: 500;\n}\n\n.-pu28G_select {\n  color: inherit;\n  background: #7f7f7f0f;\n  border: 1px solid #7f7f7f4d;\n  border-radius: 8px;\n  max-width: 320px;\n  padding: 5px 10px;\n  font-size: 13px;\n}\n\n.-pu28G_songList {\n  flex-direction: column;\n  gap: 2px;\n  max-height: 260px;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  display: flex;\n  overflow-y: auto;\n}\n\n.-pu28G_songRow {\n  align-items: center;\n  display: flex;\n}\n\n.-pu28G_songName {\n  min-width: 0;\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n  background: none;\n  border: none;\n  border-radius: 6px;\n  flex-direction: column;\n  flex: auto;\n  gap: 1px;\n  padding: 5px 8px;\n  display: flex;\n}\n\n.-pu28G_songName:hover {\n  background: #4176e61a;\n}\n\n.-pu28G_songActive, .-pu28G_songActive:hover {\n  background: #4176e62e;\n}\n\n.-pu28G_songTitle {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 13px;\n  overflow: hidden;\n}\n\n.-pu28G_songMeta {\n  opacity: .6;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 11px;\n  overflow: hidden;\n}\n\n.-pu28G_nowPlaying {\n  opacity: .75;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-width: 0;\n  font-size: 12px;\n  overflow: hidden;\n}\n\n.-pu28G_volume {\n  opacity: .85;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  display: inline-flex;\n}\n\n.-pu28G_volume input[type=\"range\"] {\n  width: 80px;\n  accent-color: var(--dsw-alias-brand-primary, #4176e6);\n}\n.kclPIa_root {\n  min-width: 0;\n  max-width: 46vw;\n  color: var(--dsw-alias-label-tertiary, #7f7f7fd9);\n  white-space: nowrap;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  line-height: 20px;\n  display: inline-flex;\n}\n\n.kclPIa_root[data-pos=\"end\"] {\n  margin-left: auto;\n}\n\n.kclPIa_icon {\n  color: var(--dsw-alias-brand-primary, #4176e6);\n  flex: none;\n}\n\n.kclPIa_title {\n  text-overflow: ellipsis;\n  flex: none;\n  max-width: 30vw;\n  font-weight: 500;\n  overflow: hidden;\n}\n\n.kclPIa_sep {\n  opacity: .6;\n  flex: none;\n}\n\n.kclPIa_line {\n  text-overflow: ellipsis;\n  flex: auto;\n  min-width: 0;\n  overflow: hidden;\n}\n";(document.head||document.documentElement).appendChild(s)})();Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let react = require("react");
let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
let react_jsx_runtime = require("react/jsx-runtime");
//#region src/client/engine.ts
const BG_ID = "dsh-glass-bg";
const FONT_FACE_ID = "dsh-glass-fontface";
const CUSTOM_CSS_ID = "dsh-glass-custom";
/** The custom font family name used when a font file is uploaded. */
const CUSTOM_FONT_FAMILY = "GlassCustomFont";
const SURFACE_LIGHT = "255, 255, 255";
const SURFACE_DARK = "16, 16, 24";
var GlassEngine = class {
	disposers = [];
	applied = false;
	carouselTimer;
	/** double-buffered wallpaper images (alternate as active) */
	imgA = null;
	imgB = null;
	active = "A";
	imageSeq = 0;
	currentVideo = null;
	videoSeq = 0;
	/** Mount the background host element (idempotent). */
	ensureBgHost() {
		let host = document.getElementById(BG_ID);
		if (host !== null) return host;
		host = document.createElement("div");
		host.id = BG_ID;
		document.body.appendChild(host);
		const remove = () => {
			host?.remove();
		};
		this.disposers.push(remove);
		return host;
	}
	/** Apply a config to the live page. Safe to call repeatedly. */
	apply(config) {
		const root = document.documentElement;
		const cssFont = config.font === "" ? "inherit" : config.font;
		root.style.setProperty("--glass-opacity", String(config.opacity));
		root.style.setProperty("--glass-blur", `${config.blur}px`);
		root.style.setProperty("--glass-font", cssFont);
		root.style.setProperty("--glass-font-url", config.fontUrl === "" ? "none" : `url("${config.fontUrl}")`);
		root.style.setProperty("--glass-bg-type", config.bgType);
		root.style.setProperty("--glass-bg-image", config.bgImage === "" ? "none" : `url("${config.bgImage}")`);
		root.style.setProperty("--glass-bg-video", config.bgVideo === "" ? "none" : `url("${config.bgVideo}")`);
		root.style.setProperty("--glass-bg-mask", String(config.bgMask));
		root.style.setProperty("--glass-bg-fit", config.bgFit);
		root.style.setProperty("--glass-anim-level", config.animLevel);
		root.style.setProperty("--glass-surface-light", `rgba(${SURFACE_LIGHT}, ${config.opacity})`);
		root.style.setProperty("--glass-surface-dark", `rgba(${SURFACE_DARK}, ${config.opacity})`);
		const body = document.body;
		body.classList.add("dsh-glass-on");
		body.dataset.glassFit = config.bgFit;
		body.classList.toggle("dsh-glass-anim-soft", config.animLevel === "soft");
		body.classList.toggle("dsh-glass-anim-strong", config.animLevel === "strong");
		body.classList.toggle("dsh-glass-anim-none", config.animLevel === "none");
		this.updateFontFace(config);
		this.updateBackground(config);
		this.updateCustomCss(config.customCss);
		body.classList.add("dsh-glass-ready");
		this.applied = true;
	}
	updateFontFace(config) {
		const existing = document.getElementById(FONT_FACE_ID);
		if (config.fontUrl === "" || !config.font.includes("GlassCustomFont")) {
			existing?.remove();
			return;
		}
		const css = `@font-face{font-family:${CUSTOM_FONT_FAMILY};src:url("${config.fontUrl}") format("woff2"),url("${config.fontUrl}") format("woff"),url("${config.fontUrl}") format("truetype");font-display:swap}`;
		if (existing !== null) {
			if (existing.textContent !== css) existing.textContent = css;
			return;
		}
		const style = document.createElement("style");
		style.id = FONT_FACE_ID;
		style.textContent = css;
		document.head.appendChild(style);
		this.disposers.push(() => style.remove());
	}
	updateCustomCss(css) {
		const existing = document.getElementById(CUSTOM_CSS_ID);
		if (css === "") {
			existing?.remove();
			return;
		}
		if (existing === null) {
			const style = document.createElement("style");
			style.id = CUSTOM_CSS_ID;
			document.head.appendChild(style);
			this.disposers.push(() => style.remove());
		}
		const el = document.getElementById(CUSTOM_CSS_ID);
		if (el !== null && el.textContent !== css) el.textContent = css;
	}
	stopCarousel() {
		if (this.carouselTimer !== void 0) {
			window.clearInterval(this.carouselTimer);
			this.carouselTimer = void 0;
		}
	}
	/**
	* Crossfade to a new wallpaper with double buffering: the new image is
	* preloaded first and only then faded in over the still-visible old one.
	* The background never goes blank, so there is no black flash while
	* switching/uploading wallpapers in the settings panel.
	*/
	imageEl(key) {
		const host = this.ensureBgHost();
		let el = key === "A" ? this.imgA : this.imgB;
		if (el === null || !host.contains(el)) {
			el = document.createElement("img");
			el.alt = "";
			el.style.opacity = "0";
			host.appendChild(el);
			if (key === "A") this.imgA = el;
			else this.imgB = el;
		}
		return el;
	}
	/**
	* Canonical absolute form of a wallpaper URL. Element `.src` getters return
	* absolute URLs while config values are relative (`/glass-ui/media/…`), so
	* raw string comparison can never dedupe — every apply() would re-probe the
	* wallpaper. Resolve both sides through here.
	*/
	absUrl(url) {
		return new URL(url, window.location.href).href;
	}
	renderImage(url) {
		const host = this.ensureBgHost();
		const abs = this.absUrl(url);
		const activeEl = this.imageEl(this.active);
		if (activeEl.src === abs) return;
		const seq = ++this.imageSeq;
		const probe = new Image();
		probe.onload = () => {
			if (seq !== this.imageSeq) return;
			if (!host.isConnected) return;
			const nextKey = this.active === "A" ? "B" : "A";
			const nextEl = this.imageEl(nextKey);
			nextEl.src = abs;
			nextEl.style.opacity = "0";
			nextEl.offsetWidth;
			nextEl.style.transition = "opacity 0.45s ease";
			nextEl.style.opacity = "1";
			activeEl.style.transition = "opacity 0.45s ease";
			activeEl.style.opacity = "0";
			this.active = nextKey;
		};
		probe.onerror = () => {};
		probe.src = abs;
	}
	/**
	* Video wallpaper with readiness gating: a bare <video> paints BLACK while
	* its source loads or switches, which is exactly the flash users saw. So a
	* hidden probe video preloads the new URL first; only when the first frame
	* is available (loadeddata) does it fade in over the still-visible old
	* video, which is then released. The gradient backdrop stays visible the
	* whole time, so the background never goes black — on upload, switch,
	* carousel, or page refresh.
	*/
	renderVideo(url) {
		const host = this.ensureBgHost();
		const abs = this.absUrl(url);
		if (this.currentVideo !== null && this.currentVideo.src === abs) return;
		const seq = ++this.videoSeq;
		const probe = document.createElement("video");
		probe.muted = true;
		probe.loop = true;
		probe.playsInline = true;
		probe.preload = "auto";
		probe.style.opacity = "0";
		const onReady = () => {
			if (seq !== this.videoSeq || !host.isConnected) {
				probe.remove();
				return;
			}
			probe.removeEventListener("loadeddata", onReady);
			probe.removeEventListener("error", onError);
			const old = this.currentVideo;
			this.currentVideo = probe;
			probe.offsetWidth;
			probe.style.transition = "opacity 0.5s ease";
			probe.style.opacity = "1";
			probe.play().catch(() => void 0);
			if (old !== null && old !== probe) {
				old.style.transition = "opacity 0.5s ease";
				old.style.opacity = "0";
				window.setTimeout(() => {
					if (old !== null && old !== this.currentVideo) {
						old.pause();
						old.removeAttribute("src");
						old.load();
						old.remove();
					}
				}, 560);
			}
		};
		const onError = () => {
			if (seq !== this.videoSeq) return;
			probe.removeEventListener("loadeddata", onReady);
			probe.remove();
		};
		probe.addEventListener("loadeddata", onReady);
		probe.addEventListener("error", onError);
		probe.src = abs;
		probe.load();
		host.appendChild(probe);
	}
	updateBackground(config) {
		this.ensureBgHost();
		this.stopCarousel();
		if (config.bgType === "image") {
			this.currentVideo?.remove();
			this.currentVideo = null;
			const slides = config.bgImages.length > 0 ? config.bgImages : config.bgImage !== "" ? [config.bgImage] : [];
			if (slides.length === 0) {
				this.imgA?.remove();
				this.imgA = null;
				this.imgB?.remove();
				this.imgB = null;
				return;
			}
			if (config.bgRotate && slides.length > 1) {
				let index = Math.max(0, slides.indexOf(config.bgImage));
				const first = slides[index];
				if (first !== void 0) this.renderImage(first);
				this.carouselTimer = window.setInterval(() => {
					index = (index + 1) % slides.length;
					const url = slides[index];
					if (url !== void 0) this.renderImage(url);
				}, config.bgRotateInterval * 1e3);
			} else this.renderImage(config.bgImage);
		} else if (config.bgType === "video") {
			this.imgA?.remove();
			this.imgA = null;
			this.imgB?.remove();
			this.imgB = null;
			if (config.bgVideo !== "") this.renderVideo(config.bgVideo);
			else {
				this.currentVideo?.remove();
				this.currentVideo = null;
			}
		} else {
			this.imgA?.remove();
			this.imgA = null;
			this.imgB?.remove();
			this.imgB = null;
			this.currentVideo?.remove();
			this.currentVideo = null;
		}
	}
	/** Remove everything the engine created (plugin unload / HMR). */
	dispose() {
		this.imageSeq += 1;
		this.videoSeq += 1;
		this.stopCarousel();
		for (const dispose of this.disposers.splice(0)) dispose();
		document.getElementById(BG_ID)?.remove();
		document.getElementById(FONT_FACE_ID)?.remove();
		document.getElementById(CUSTOM_CSS_ID)?.remove();
		const root = document.documentElement;
		for (const name of [
			"--glass-opacity",
			"--glass-blur",
			"--glass-font",
			"--glass-font-url",
			"--glass-bg-type",
			"--glass-bg-image",
			"--glass-bg-video",
			"--glass-bg-mask",
			"--glass-bg-fit",
			"--glass-anim-level",
			"--glass-surface-light",
			"--glass-surface-dark"
		]) root.style.removeProperty(name);
		const body = document.body;
		body.classList.remove("dsh-glass-on", "dsh-glass-anim-soft", "dsh-glass-anim-strong", "dsh-glass-anim-none", "dsh-glass-ready");
		delete body.dataset.glassFit;
		this.imgA = null;
		this.imgB = null;
		this.currentVideo = null;
		this.applied = false;
	}
};
//#endregion
//#region src/client/config.ts
const DEFAULT_CONFIG = {
	opacity: .72,
	blur: 18,
	font: "",
	fontUrl: "",
	bgType: "none",
	bgImage: "",
	bgImages: [],
	bgVideo: "",
	bgRotate: false,
	bgRotateInterval: 15,
	bgMask: 0,
	bgFit: "cover",
	animLevel: "soft",
	customCss: "",
	lyricPos: "inline",
	neteaseProxy: "",
	neteaseApiBase: ""
};
/** Migrate a raw (possibly legacy) config into the current shape. */
function normalizeConfig(raw) {
	const merged = {
		...DEFAULT_CONFIG,
		...raw
	};
	if (raw.animations === false && merged.animLevel === "soft") merged.animLevel = "none";
	if (merged.bgImage !== "" && !merged.bgImages.includes(merged.bgImage)) merged.bgImages = [merged.bgImage, ...merged.bgImages];
	merged.bgImages = merged.bgImages.filter((u) => typeof u === "string" && u !== "");
	if (merged.bgImages.length === 0) merged.bgImage = "";
	else merged.bgImage = merged.bgImages[0] ?? "";
	return merged;
}
async function loadConfig() {
	const res = await fetch("/glass-ui/config", { cache: "no-store" });
	if (!res.ok) throw new Error(`load config: HTTP ${res.status}`);
	return normalizeConfig(await res.json());
}
async function saveConfig(config) {
	const res = await fetch("/glass-ui/config", {
		method: "PUT",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(config)
	});
	if (!res.ok) throw new Error(`save config: HTTP ${res.status}`);
	return normalizeConfig(await res.json());
}
async function uploadMedia(blob, kind) {
	const res = await fetch("/glass-ui/media", {
		method: "POST",
		headers: { "x-media-kind": kind },
		body: blob
	});
	if (!res.ok) throw new Error(`upload ${kind}: HTTP ${res.status}`);
	return await res.json();
}
async function deleteMedia(url) {
	const res = await fetch(url, { method: "DELETE" });
	if (!res.ok) throw new Error(`delete media: HTTP ${res.status}`);
}
//#endregion
//#region src/client/locales.ts
/** zh/en dictionaries for the glass UI settings section. */
const zh = {
	nav: "自定义UI设计",
	subtitle: "毛玻璃风格、背景壁纸与交互动画",
	glassTitle: "毛玻璃强度",
	opacityLabel: "透明度",
	opacityHint: "数值越大玻璃越实、越不透明",
	blurLabel: "模糊强度",
	blurHint: "背景的模糊半径（px）",
	fontTitle: "字体",
	fontPresets: "预设字体",
	fontCustom: "自定义字体族",
	fontCustomPlaceholder: "输入字体族名称，如 \"HarmonyOS Sans SC\"",
	fontUpload: "上传字体文件",
	fontUploading: "上传中…",
	fontUploaded: "已应用：{name}",
	fontRemove: "恢复默认",
	bgTitle: "背景壁纸",
	bgNone: "无背景",
	bgImage: "图片背景",
	bgVideo: "动态壁纸",
	bgUploadImage: "上传图片",
	bgUploadVideo: "上传视频",
	bgCurrent: "当前：{name}",
	bgRemove: "移除背景",
	bgTypeHint: "动态壁纸支持 mp4 / webm / mov（≤1GB）",
	maskLabel: "背景遮罩",
	maskHint: "加深背景，提高文字可读性",
	fitLabel: "铺放方式",
	fitCover: "铺满",
	fitContain: "完整显示",
	fitOriginal: "原始大小",
	rotateLabel: "多图轮播",
	rotateHint: "定时在背景图之间平滑切换",
	rotateInterval: "切换间隔（秒）",
	imagesLabel: "背景图列表",
	currentBadge: "当前",
	removeImage: "移除",
	setCurrent: "设为当前",
	animTitle: "交互动画",
	animNone: "无",
	animSoft: "轻柔",
	animStrong: "明显",
	animHint: "无：完全静止；轻柔：渐显与柔和过渡；明显：更强的浮现与悬停微光",
	customCssTitle: "自定义 CSS",
	customCssHint: "高级用户：粘贴自定义样式，即时生效并自动保存",
	customCssPlaceholder: "例如：/* 微调某个界面元素 */\n.sidebar { border-right: 1px solid rgba(255,255,255,.08) }",
	transferTitle: "配置分享",
	exportButton: "导出配置",
	importButton: "导入配置",
	importDone: "已导入配置",
	importFail: "导入失败：{error}",
	resetTitle: "重置",
	resetButton: "恢复默认设置",
	resetDone: "已恢复默认",
	saving: "保存中…",
	saved: "已保存",
	saveFail: "保存失败：{error}",
	uploadFail: "上传失败：{error}",
	lyricTitle: "网易云音乐",
	lyricProxyLabel: "代理地址（VPN）",
	lyricApiLabel: "API 服务器（绕过风控）",
	lyricPosLabel: "歌词位置",
	lyricPosInline: "信息栏内",
	lyricPosEnd: "信息栏最右",
	lyricPosHidden: "隐藏",
	lyricQrLogin: "扫码登录网易云",
	lyricQrLoading: "正在生成二维码…",
	lyricQrScan: "请用网易云 App 扫码，并在手机上确认",
	lyricQrConfirm: "已扫码，请在手机上确认登录",
	lyricQrExpired: "二维码已过期，请重新生成",
	lyricQrCancel: "取消",
	lyricQrFail: "获取二维码失败，请重试",
	lyricCookiePh: "或粘贴网页版 Cookie（可多行，自动拼接）",
	lyricCookieLogin: "Cookie 登录",
	lyricCookieRejected: "Cookie 无效或已过期",
	lyricCookieFail: "Cookie 登录失败：{error}",
	lyricLoginOk: "登录成功：{name}",
	lyricLoggedIn: "已登录：{name}",
	lyricLogout: "退出登录",
	lyricPlaylists: "选择歌单…",
	lyricDaily: "每日推荐",
	lyricLoading: "加载中…",
	lyricListFail: "加载失败：{error}",
	lyricPlay: "播放",
	lyricPlayAll: "播放全部",
	lyricPause: "暂停",
	lyricStop: "停止",
	lyricNone: "未在播放",
	lyricHot: "热门歌单…",
	lyricSearch: "搜索",
	lyricSearchPh: "搜索歌曲…",
	lyricUnavailable: "该歌曲暂不可播放（版权/VIP 限制）",
	lyricUnknownArtist: "未知歌手",
	lyricPaused: "已暂停",
	prevTrack: "上一首",
	nextTrack: "下一首",
	volumeLabel: "音量"
};
const en = {
	nav: "UI Design",
	subtitle: "Glassmorphism, wallpapers and motion",
	glassTitle: "Glass strength",
	opacityLabel: "Opacity",
	opacityHint: "Higher = more solid, less transparent",
	blurLabel: "Blur",
	blurHint: "Background blur radius (px)",
	fontTitle: "Font",
	fontPresets: "Presets",
	fontCustom: "Custom font family",
	fontCustomPlaceholder: "e.g. \"HarmonyOS Sans SC\"",
	fontUpload: "Upload font file",
	fontUploading: "Uploading…",
	fontUploaded: "Applied: {name}",
	fontRemove: "Reset to default",
	bgTitle: "Wallpaper",
	bgNone: "None",
	bgImage: "Image",
	bgVideo: "Live wallpaper",
	bgUploadImage: "Upload image",
	bgUploadVideo: "Upload video",
	bgCurrent: "Current: {name}",
	bgRemove: "Remove wallpaper",
	bgTypeHint: "Videos: mp4 / webm / mov (≤1GB)",
	maskLabel: "Wallpaper dim",
	maskHint: "Darken the wallpaper for readability",
	fitLabel: "Fit",
	fitCover: "Cover",
	fitContain: "Contain",
	fitOriginal: "Original",
	rotateLabel: "Carousel",
	rotateHint: "Rotate through background images smoothly",
	rotateInterval: "Interval (seconds)",
	imagesLabel: "Background images",
	currentBadge: "current",
	removeImage: "remove",
	setCurrent: "make current",
	animTitle: "Motion",
	animNone: "None",
	animSoft: "Soft",
	animStrong: "Strong",
	animHint: "None: fully static · Soft: fades and gentle transitions · Strong: pronounced entrances and hover glow",
	customCssTitle: "Custom CSS",
	customCssHint: "Advanced: paste your own styles — applied instantly and saved",
	customCssPlaceholder: "/* tweak a surface */\n.sidebar { border-right: 1px solid rgba(255,255,255,.08) }",
	transferTitle: "Share settings",
	exportButton: "Export config",
	importButton: "Import config",
	importDone: "Config imported",
	importFail: "Import failed: {error}",
	resetTitle: "Reset",
	resetButton: "Restore defaults",
	resetDone: "Defaults restored",
	saving: "Saving…",
	saved: "Saved",
	saveFail: "Save failed: {error}",
	uploadFail: "Upload failed: {error}",
	lyricTitle: "NetEase Music",
	lyricProxyLabel: "Proxy (VPN)",
	lyricApiLabel: "API server (bypass block)",
	lyricPosLabel: "Lyric position",
	lyricPosInline: "In the info bar",
	lyricPosEnd: "Right end of info bar",
	lyricPosHidden: "Hidden",
	lyricQrLogin: "QR login with NetEase",
	lyricQrLoading: "Generating QR code…",
	lyricQrScan: "Scan with the NetEase app and confirm on your phone",
	lyricQrConfirm: "Scanned — confirm the login on your phone",
	lyricQrExpired: "QR code expired, please regenerate",
	lyricQrCancel: "Cancel",
	lyricQrFail: "Failed to get the QR code, please retry",
	lyricCookiePh: "or paste the web cookie (multi-line OK)",
	lyricCookieLogin: "Cookie login",
	lyricCookieRejected: "Cookie invalid or expired",
	lyricCookieFail: "Cookie login failed: {error}",
	lyricLoginOk: "Signed in: {name}",
	lyricLoggedIn: "Signed in: {name}",
	lyricLogout: "Sign out",
	lyricPlaylists: "Choose a playlist…",
	lyricDaily: "Daily recommend",
	lyricLoading: "Loading…",
	lyricListFail: "Failed to load: {error}",
	lyricPlay: "Play",
	lyricPlayAll: "Play all",
	lyricPause: "Pause",
	lyricStop: "Stop",
	lyricNone: "Nothing playing",
	lyricHot: "Hot playlists…",
	lyricSearch: "Search",
	lyricSearchPh: "Search songs…",
	lyricUnavailable: "This song is not playable (VIP/licensing restrictions)",
	lyricUnknownArtist: "Unknown artist",
	lyricPaused: "Paused",
	prevTrack: "Previous",
	nextTrack: "Next",
	volumeLabel: "Volume"
};
const FONT_PRESETS = [
	{
		id: "",
		label: "默认"
	},
	{
		id: "'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
		label: "系统 UI"
	},
	{
		id: "'SF Mono', 'JetBrains Mono', Consolas, monospace",
		label: "等宽代码"
	},
	{
		id: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
		label: "圆润中文"
	},
	{
		id: "'Georgia', 'Times New Roman', serif",
		label: "衬线"
	}
];
//#endregion
//#region src/client/GlassPanel.module.css
var GlassPanel_module_default = {
	"card": "d09JSa_card",
	"cardTitle": "d09JSa_cardTitle",
	"cssArea": "d09JSa_cssArea",
	"field": "d09JSa_field",
	"fieldHead": "d09JSa_fieldHead",
	"fieldLabel": "d09JSa_fieldLabel",
	"fileName": "d09JSa_fileName",
	"grow": "d09JSa_grow",
	"hint": "d09JSa_hint",
	"imageList": "d09JSa_imageList",
	"imageName": "d09JSa_imageName",
	"imageRow": "d09JSa_imageRow",
	"interval": "d09JSa_interval",
	"panel": "d09JSa_panel",
	"pills": "d09JSa_pills",
	"range": "d09JSa_range",
	"row": "d09JSa_row",
	"saveState": "d09JSa_saveState",
	"toggleRow": "d09JSa_toggleRow",
	"value": "d09JSa_value"
};
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/can-promise.js
var require_can_promise = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function() {
		return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
	};
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/utils.js
var require_utils$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	let toSJISFunction;
	const CODEWORDS_COUNT = [
		0,
		26,
		44,
		70,
		100,
		134,
		172,
		196,
		242,
		292,
		346,
		404,
		466,
		532,
		581,
		655,
		733,
		815,
		901,
		991,
		1085,
		1156,
		1258,
		1364,
		1474,
		1588,
		1706,
		1828,
		1921,
		2051,
		2185,
		2323,
		2465,
		2611,
		2761,
		2876,
		3034,
		3196,
		3362,
		3532,
		3706
	];
	/**
	* Returns the QR Code size for the specified version
	*
	* @param  {Number} version QR Code version
	* @return {Number}         size of QR code
	*/
	exports.getSymbolSize = function getSymbolSize(version) {
		if (!version) throw new Error("\"version\" cannot be null or undefined");
		if (version < 1 || version > 40) throw new Error("\"version\" should be in range from 1 to 40");
		return version * 4 + 17;
	};
	/**
	* Returns the total number of codewords used to store data and EC information.
	*
	* @param  {Number} version QR Code version
	* @return {Number}         Data length in bits
	*/
	exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
		return CODEWORDS_COUNT[version];
	};
	/**
	* Encode data with Bose-Chaudhuri-Hocquenghem
	*
	* @param  {Number} data Value to encode
	* @return {Number}      Encoded value
	*/
	exports.getBCHDigit = function(data) {
		let digit = 0;
		while (data !== 0) {
			digit++;
			data >>>= 1;
		}
		return digit;
	};
	exports.setToSJISFunction = function setToSJISFunction(f) {
		if (typeof f !== "function") throw new Error("\"toSJISFunc\" is not a valid function.");
		toSJISFunction = f;
	};
	exports.isKanjiModeEnabled = function() {
		return typeof toSJISFunction !== "undefined";
	};
	exports.toSJIS = function toSJIS(kanji) {
		return toSJISFunction(kanji);
	};
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.L = { bit: 1 };
	exports.M = { bit: 0 };
	exports.Q = { bit: 3 };
	exports.H = { bit: 2 };
	function fromString(string) {
		if (typeof string !== "string") throw new Error("Param is not a string");
		switch (string.toLowerCase()) {
			case "l":
			case "low": return exports.L;
			case "m":
			case "medium": return exports.M;
			case "q":
			case "quartile": return exports.Q;
			case "h":
			case "high": return exports.H;
			default: throw new Error("Unknown EC Level: " + string);
		}
	}
	exports.isValid = function isValid(level) {
		return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
	};
	exports.from = function from(value, defaultValue) {
		if (exports.isValid(value)) return value;
		try {
			return fromString(value);
		} catch (e) {
			return defaultValue;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function BitBuffer() {
		this.buffer = [];
		this.length = 0;
	}
	BitBuffer.prototype = {
		get: function(index) {
			const bufIndex = Math.floor(index / 8);
			return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
		},
		put: function(num, length) {
			for (let i = 0; i < length; i++) this.putBit((num >>> length - i - 1 & 1) === 1);
		},
		getLengthInBits: function() {
			return this.length;
		},
		putBit: function(bit) {
			const bufIndex = Math.floor(this.length / 8);
			if (this.buffer.length <= bufIndex) this.buffer.push(0);
			if (bit) this.buffer[bufIndex] |= 128 >>> this.length % 8;
			this.length++;
		}
	};
	module.exports = BitBuffer;
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Helper class to handle QR Code symbol modules
	*
	* @param {Number} size Symbol size
	*/
	function BitMatrix(size) {
		if (!size || size < 1) throw new Error("BitMatrix size must be defined and greater than 0");
		this.size = size;
		this.data = new Uint8Array(size * size);
		this.reservedBit = new Uint8Array(size * size);
	}
	/**
	* Set bit value at specified location
	* If reserved flag is set, this bit will be ignored during masking process
	*
	* @param {Number}  row
	* @param {Number}  col
	* @param {Boolean} value
	* @param {Boolean} reserved
	*/
	BitMatrix.prototype.set = function(row, col, value, reserved) {
		const index = row * this.size + col;
		this.data[index] = value;
		if (reserved) this.reservedBit[index] = true;
	};
	/**
	* Returns bit value at specified location
	*
	* @param  {Number}  row
	* @param  {Number}  col
	* @return {Boolean}
	*/
	BitMatrix.prototype.get = function(row, col) {
		return this.data[row * this.size + col];
	};
	/**
	* Applies xor operator at specified location
	* (used during masking process)
	*
	* @param {Number}  row
	* @param {Number}  col
	* @param {Boolean} value
	*/
	BitMatrix.prototype.xor = function(row, col, value) {
		this.data[row * this.size + col] ^= value;
	};
	/**
	* Check if bit at specified location is reserved
	*
	* @param {Number}   row
	* @param {Number}   col
	* @return {Boolean}
	*/
	BitMatrix.prototype.isReserved = function(row, col) {
		return this.reservedBit[row * this.size + col];
	};
	module.exports = BitMatrix;
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Alignment pattern are fixed reference pattern in defined positions
	* in a matrix symbology, which enables the decode software to re-synchronise
	* the coordinate mapping of the image modules in the event of moderate amounts
	* of distortion of the image.
	*
	* Alignment patterns are present only in QR Code symbols of version 2 or larger
	* and their number depends on the symbol version.
	*/
	const getSymbolSize = require_utils$1().getSymbolSize;
	/**
	* Calculate the row/column coordinates of the center module of each alignment pattern
	* for the specified QR Code version.
	*
	* The alignment patterns are positioned symmetrically on either side of the diagonal
	* running from the top left corner of the symbol to the bottom right corner.
	*
	* Since positions are simmetrical only half of the coordinates are returned.
	* Each item of the array will represent in turn the x and y coordinate.
	* @see {@link getPositions}
	*
	* @param  {Number} version QR Code version
	* @return {Array}          Array of coordinate
	*/
	exports.getRowColCoords = function getRowColCoords(version) {
		if (version === 1) return [];
		const posCount = Math.floor(version / 7) + 2;
		const size = getSymbolSize(version);
		const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
		const positions = [size - 7];
		for (let i = 1; i < posCount - 1; i++) positions[i] = positions[i - 1] - intervals;
		positions.push(6);
		return positions.reverse();
	};
	/**
	* Returns an array containing the positions of each alignment pattern.
	* Each array's element represent the center point of the pattern as (x, y) coordinates
	*
	* Coordinates are calculated expanding the row/column coordinates returned by {@link getRowColCoords}
	* and filtering out the items that overlaps with finder pattern
	*
	* @example
	* For a Version 7 symbol {@link getRowColCoords} returns values 6, 22 and 38.
	* The alignment patterns, therefore, are to be centered on (row, column)
	* positions (6,22), (22,6), (22,22), (22,38), (38,22), (38,38).
	* Note that the coordinates (6,6), (6,38), (38,6) are occupied by finder patterns
	* and are not therefore used for alignment patterns.
	*
	* let pos = getPositions(7)
	* // [[6,22], [22,6], [22,22], [22,38], [38,22], [38,38]]
	*
	* @param  {Number} version QR Code version
	* @return {Array}          Array of coordinates
	*/
	exports.getPositions = function getPositions(version) {
		const coords = [];
		const pos = exports.getRowColCoords(version);
		const posLength = pos.length;
		for (let i = 0; i < posLength; i++) for (let j = 0; j < posLength; j++) {
			if (i === 0 && j === 0 || i === 0 && j === posLength - 1 || i === posLength - 1 && j === 0) continue;
			coords.push([pos[i], pos[j]]);
		}
		return coords;
	};
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = /* @__PURE__ */ __commonJSMin(((exports) => {
	const getSymbolSize = require_utils$1().getSymbolSize;
	const FINDER_PATTERN_SIZE = 7;
	/**
	* Returns an array containing the positions of each finder pattern.
	* Each array's element represent the top-left point of the pattern as (x, y) coordinates
	*
	* @param  {Number} version QR Code version
	* @return {Array}          Array of coordinates
	*/
	exports.getPositions = function getPositions(version) {
		const size = getSymbolSize(version);
		return [
			[0, 0],
			[size - FINDER_PATTERN_SIZE, 0],
			[0, size - FINDER_PATTERN_SIZE]
		];
	};
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Data mask pattern reference
	* @type {Object}
	*/
	exports.Patterns = {
		PATTERN000: 0,
		PATTERN001: 1,
		PATTERN010: 2,
		PATTERN011: 3,
		PATTERN100: 4,
		PATTERN101: 5,
		PATTERN110: 6,
		PATTERN111: 7
	};
	/**
	* Weighted penalty scores for the undesirable features
	* @type {Object}
	*/
	const PenaltyScores = {
		N1: 3,
		N2: 3,
		N3: 40,
		N4: 10
	};
	/**
	* Check if mask pattern value is valid
	*
	* @param  {Number}  mask    Mask pattern
	* @return {Boolean}         true if valid, false otherwise
	*/
	exports.isValid = function isValid(mask) {
		return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
	};
	/**
	* Returns mask pattern from a value.
	* If value is not valid, returns undefined
	*
	* @param  {Number|String} value        Mask pattern value
	* @return {Number}                     Valid mask pattern or undefined
	*/
	exports.from = function from(value) {
		return exports.isValid(value) ? parseInt(value, 10) : void 0;
	};
	/**
	* Find adjacent modules in row/column with the same color
	* and assign a penalty value.
	*
	* Points: N1 + i
	* i is the amount by which the number of adjacent modules of the same color exceeds 5
	*/
	exports.getPenaltyN1 = function getPenaltyN1(data) {
		const size = data.size;
		let points = 0;
		let sameCountCol = 0;
		let sameCountRow = 0;
		let lastCol = null;
		let lastRow = null;
		for (let row = 0; row < size; row++) {
			sameCountCol = sameCountRow = 0;
			lastCol = lastRow = null;
			for (let col = 0; col < size; col++) {
				let module$1 = data.get(row, col);
				if (module$1 === lastCol) sameCountCol++;
				else {
					if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
					lastCol = module$1;
					sameCountCol = 1;
				}
				module$1 = data.get(col, row);
				if (module$1 === lastRow) sameCountRow++;
				else {
					if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
					lastRow = module$1;
					sameCountRow = 1;
				}
			}
			if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
			if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
		}
		return points;
	};
	/**
	* Find 2x2 blocks with the same color and assign a penalty value
	*
	* Points: N2 * (m - 1) * (n - 1)
	*/
	exports.getPenaltyN2 = function getPenaltyN2(data) {
		const size = data.size;
		let points = 0;
		for (let row = 0; row < size - 1; row++) for (let col = 0; col < size - 1; col++) {
			const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
			if (last === 4 || last === 0) points++;
		}
		return points * PenaltyScores.N2;
	};
	/**
	* Find 1:1:3:1:1 ratio (dark:light:dark:light:dark) pattern in row/column,
	* preceded or followed by light area 4 modules wide
	*
	* Points: N3 * number of pattern found
	*/
	exports.getPenaltyN3 = function getPenaltyN3(data) {
		const size = data.size;
		let points = 0;
		let bitsCol = 0;
		let bitsRow = 0;
		for (let row = 0; row < size; row++) {
			bitsCol = bitsRow = 0;
			for (let col = 0; col < size; col++) {
				bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
				if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
				bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
				if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
			}
		}
		return points * PenaltyScores.N3;
	};
	/**
	* Calculate proportion of dark modules in entire symbol
	*
	* Points: N4 * k
	*
	* k is the rating of the deviation of the proportion of dark modules
	* in the symbol from 50% in steps of 5%
	*/
	exports.getPenaltyN4 = function getPenaltyN4(data) {
		let darkCount = 0;
		const modulesCount = data.data.length;
		for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
		return Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10) * PenaltyScores.N4;
	};
	/**
	* Return mask value at given position
	*
	* @param  {Number} maskPattern Pattern reference value
	* @param  {Number} i           Row
	* @param  {Number} j           Column
	* @return {Boolean}            Mask value
	*/
	function getMaskAt(maskPattern, i, j) {
		switch (maskPattern) {
			case exports.Patterns.PATTERN000: return (i + j) % 2 === 0;
			case exports.Patterns.PATTERN001: return i % 2 === 0;
			case exports.Patterns.PATTERN010: return j % 3 === 0;
			case exports.Patterns.PATTERN011: return (i + j) % 3 === 0;
			case exports.Patterns.PATTERN100: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
			case exports.Patterns.PATTERN101: return i * j % 2 + i * j % 3 === 0;
			case exports.Patterns.PATTERN110: return (i * j % 2 + i * j % 3) % 2 === 0;
			case exports.Patterns.PATTERN111: return (i * j % 3 + (i + j) % 2) % 2 === 0;
			default: throw new Error("bad maskPattern:" + maskPattern);
		}
	}
	/**
	* Apply a mask pattern to a BitMatrix
	*
	* @param  {Number}    pattern Pattern reference number
	* @param  {BitMatrix} data    BitMatrix data
	*/
	exports.applyMask = function applyMask(pattern, data) {
		const size = data.size;
		for (let col = 0; col < size; col++) for (let row = 0; row < size; row++) {
			if (data.isReserved(row, col)) continue;
			data.xor(row, col, getMaskAt(pattern, row, col));
		}
	};
	/**
	* Returns the best mask pattern for data
	*
	* @param  {BitMatrix} data
	* @return {Number} Mask pattern reference number
	*/
	exports.getBestMask = function getBestMask(data, setupFormatFunc) {
		const numPatterns = Object.keys(exports.Patterns).length;
		let bestPattern = 0;
		let lowerPenalty = Infinity;
		for (let p = 0; p < numPatterns; p++) {
			setupFormatFunc(p);
			exports.applyMask(p, data);
			const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
			exports.applyMask(p, data);
			if (penalty < lowerPenalty) {
				lowerPenalty = penalty;
				bestPattern = p;
			}
		}
		return bestPattern;
	};
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = /* @__PURE__ */ __commonJSMin(((exports) => {
	const ECLevel = require_error_correction_level();
	const EC_BLOCKS_TABLE = [
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		2,
		2,
		1,
		2,
		2,
		4,
		1,
		2,
		4,
		4,
		2,
		4,
		4,
		4,
		2,
		4,
		6,
		5,
		2,
		4,
		6,
		6,
		2,
		5,
		8,
		8,
		4,
		5,
		8,
		8,
		4,
		5,
		8,
		11,
		4,
		8,
		10,
		11,
		4,
		9,
		12,
		16,
		4,
		9,
		16,
		16,
		6,
		10,
		12,
		18,
		6,
		10,
		17,
		16,
		6,
		11,
		16,
		19,
		6,
		13,
		18,
		21,
		7,
		14,
		21,
		25,
		8,
		16,
		20,
		25,
		8,
		17,
		23,
		25,
		9,
		17,
		23,
		34,
		9,
		18,
		25,
		30,
		10,
		20,
		27,
		32,
		12,
		21,
		29,
		35,
		12,
		23,
		34,
		37,
		12,
		25,
		34,
		40,
		13,
		26,
		35,
		42,
		14,
		28,
		38,
		45,
		15,
		29,
		40,
		48,
		16,
		31,
		43,
		51,
		17,
		33,
		45,
		54,
		18,
		35,
		48,
		57,
		19,
		37,
		51,
		60,
		19,
		38,
		53,
		63,
		20,
		40,
		56,
		66,
		21,
		43,
		59,
		70,
		22,
		45,
		62,
		74,
		24,
		47,
		65,
		77,
		25,
		49,
		68,
		81
	];
	const EC_CODEWORDS_TABLE = [
		7,
		10,
		13,
		17,
		10,
		16,
		22,
		28,
		15,
		26,
		36,
		44,
		20,
		36,
		52,
		64,
		26,
		48,
		72,
		88,
		36,
		64,
		96,
		112,
		40,
		72,
		108,
		130,
		48,
		88,
		132,
		156,
		60,
		110,
		160,
		192,
		72,
		130,
		192,
		224,
		80,
		150,
		224,
		264,
		96,
		176,
		260,
		308,
		104,
		198,
		288,
		352,
		120,
		216,
		320,
		384,
		132,
		240,
		360,
		432,
		144,
		280,
		408,
		480,
		168,
		308,
		448,
		532,
		180,
		338,
		504,
		588,
		196,
		364,
		546,
		650,
		224,
		416,
		600,
		700,
		224,
		442,
		644,
		750,
		252,
		476,
		690,
		816,
		270,
		504,
		750,
		900,
		300,
		560,
		810,
		960,
		312,
		588,
		870,
		1050,
		336,
		644,
		952,
		1110,
		360,
		700,
		1020,
		1200,
		390,
		728,
		1050,
		1260,
		420,
		784,
		1140,
		1350,
		450,
		812,
		1200,
		1440,
		480,
		868,
		1290,
		1530,
		510,
		924,
		1350,
		1620,
		540,
		980,
		1440,
		1710,
		570,
		1036,
		1530,
		1800,
		570,
		1064,
		1590,
		1890,
		600,
		1120,
		1680,
		1980,
		630,
		1204,
		1770,
		2100,
		660,
		1260,
		1860,
		2220,
		720,
		1316,
		1950,
		2310,
		750,
		1372,
		2040,
		2430
	];
	/**
	* Returns the number of error correction block that the QR Code should contain
	* for the specified version and error correction level.
	*
	* @param  {Number} version              QR Code version
	* @param  {Number} errorCorrectionLevel Error correction level
	* @return {Number}                      Number of error correction blocks
	*/
	exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
		switch (errorCorrectionLevel) {
			case ECLevel.L: return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
			case ECLevel.M: return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
			case ECLevel.Q: return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
			case ECLevel.H: return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
			default: return;
		}
	};
	/**
	* Returns the number of error correction codewords to use for the specified
	* version and error correction level.
	*
	* @param  {Number} version              QR Code version
	* @param  {Number} errorCorrectionLevel Error correction level
	* @return {Number}                      Number of error correction codewords
	*/
	exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
		switch (errorCorrectionLevel) {
			case ECLevel.L: return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
			case ECLevel.M: return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
			case ECLevel.Q: return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
			case ECLevel.H: return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
			default: return;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = /* @__PURE__ */ __commonJSMin(((exports) => {
	const EXP_TABLE = /* @__PURE__ */ new Uint8Array(512);
	const LOG_TABLE = /* @__PURE__ */ new Uint8Array(256);
	(function initTables() {
		let x = 1;
		for (let i = 0; i < 255; i++) {
			EXP_TABLE[i] = x;
			LOG_TABLE[x] = i;
			x <<= 1;
			if (x & 256) x ^= 285;
		}
		for (let i = 255; i < 512; i++) EXP_TABLE[i] = EXP_TABLE[i - 255];
	})();
	/**
	* Returns log value of n inside Galois Field
	*
	* @param  {Number} n
	* @return {Number}
	*/
	exports.log = function log(n) {
		if (n < 1) throw new Error("log(" + n + ")");
		return LOG_TABLE[n];
	};
	/**
	* Returns anti-log value of n inside Galois Field
	*
	* @param  {Number} n
	* @return {Number}
	*/
	exports.exp = function exp(n) {
		return EXP_TABLE[n];
	};
	/**
	* Multiplies two number inside Galois Field
	*
	* @param  {Number} x
	* @param  {Number} y
	* @return {Number}
	*/
	exports.mul = function mul(x, y) {
		if (x === 0 || y === 0) return 0;
		return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
	};
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = /* @__PURE__ */ __commonJSMin(((exports) => {
	const GF = require_galois_field();
	/**
	* Multiplies two polynomials inside Galois Field
	*
	* @param  {Uint8Array} p1 Polynomial
	* @param  {Uint8Array} p2 Polynomial
	* @return {Uint8Array}    Product of p1 and p2
	*/
	exports.mul = function mul(p1, p2) {
		const coeff = new Uint8Array(p1.length + p2.length - 1);
		for (let i = 0; i < p1.length; i++) for (let j = 0; j < p2.length; j++) coeff[i + j] ^= GF.mul(p1[i], p2[j]);
		return coeff;
	};
	/**
	* Calculate the remainder of polynomials division
	*
	* @param  {Uint8Array} divident Polynomial
	* @param  {Uint8Array} divisor  Polynomial
	* @return {Uint8Array}          Remainder
	*/
	exports.mod = function mod(divident, divisor) {
		let result = new Uint8Array(divident);
		while (result.length - divisor.length >= 0) {
			const coeff = result[0];
			for (let i = 0; i < divisor.length; i++) result[i] ^= GF.mul(divisor[i], coeff);
			let offset = 0;
			while (offset < result.length && result[offset] === 0) offset++;
			result = result.slice(offset);
		}
		return result;
	};
	/**
	* Generate an irreducible generator polynomial of specified degree
	* (used by Reed-Solomon encoder)
	*
	* @param  {Number} degree Degree of the generator polynomial
	* @return {Uint8Array}    Buffer containing polynomial coefficients
	*/
	exports.generateECPolynomial = function generateECPolynomial(degree) {
		let poly = new Uint8Array([1]);
		for (let i = 0; i < degree; i++) poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
		return poly;
	};
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Polynomial = require_polynomial();
	function ReedSolomonEncoder(degree) {
		this.genPoly = void 0;
		this.degree = degree;
		if (this.degree) this.initialize(this.degree);
	}
	/**
	* Initialize the encoder.
	* The input param should correspond to the number of error correction codewords.
	*
	* @param  {Number} degree
	*/
	ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
		this.degree = degree;
		this.genPoly = Polynomial.generateECPolynomial(this.degree);
	};
	/**
	* Encodes a chunk of data
	*
	* @param  {Uint8Array} data Buffer containing input data
	* @return {Uint8Array}      Buffer containing encoded data
	*/
	ReedSolomonEncoder.prototype.encode = function encode(data) {
		if (!this.genPoly) throw new Error("Encoder not initialized");
		const paddedData = new Uint8Array(data.length + this.degree);
		paddedData.set(data);
		const remainder = Polynomial.mod(paddedData, this.genPoly);
		const start = this.degree - remainder.length;
		if (start > 0) {
			const buff = new Uint8Array(this.degree);
			buff.set(remainder, start);
			return buff;
		}
		return remainder;
	};
	module.exports = ReedSolomonEncoder;
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/version-check.js
var require_version_check = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Check if QR Code version is valid
	*
	* @param  {Number}  version QR Code version
	* @return {Boolean}         true if valid version, false otherwise
	*/
	exports.isValid = function isValid(version) {
		return !isNaN(version) && version >= 1 && version <= 40;
	};
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/regex.js
var require_regex = /* @__PURE__ */ __commonJSMin(((exports) => {
	const numeric = "[0-9]+";
	const alphanumeric = "[A-Z $%*+\\-./:]+";
	let kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
	kanji = kanji.replace(/u/g, "\\u");
	const byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
	exports.KANJI = new RegExp(kanji, "g");
	exports.BYTE_KANJI = /* @__PURE__ */ new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
	exports.BYTE = new RegExp(byte, "g");
	exports.NUMERIC = new RegExp(numeric, "g");
	exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
	const TEST_KANJI = new RegExp("^" + kanji + "$");
	const TEST_NUMERIC = /* @__PURE__ */ new RegExp("^[0-9]+$");
	const TEST_ALPHANUMERIC = /* @__PURE__ */ new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
	exports.testKanji = function testKanji(str) {
		return TEST_KANJI.test(str);
	};
	exports.testNumeric = function testNumeric(str) {
		return TEST_NUMERIC.test(str);
	};
	exports.testAlphanumeric = function testAlphanumeric(str) {
		return TEST_ALPHANUMERIC.test(str);
	};
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/mode.js
var require_mode = /* @__PURE__ */ __commonJSMin(((exports) => {
	const VersionCheck = require_version_check();
	const Regex = require_regex();
	/**
	* Numeric mode encodes data from the decimal digit set (0 - 9)
	* (byte values 30HEX to 39HEX).
	* Normally, 3 data characters are represented by 10 bits.
	*
	* @type {Object}
	*/
	exports.NUMERIC = {
		id: "Numeric",
		bit: 1,
		ccBits: [
			10,
			12,
			14
		]
	};
	/**
	* Alphanumeric mode encodes data from a set of 45 characters,
	* i.e. 10 numeric digits (0 - 9),
	*      26 alphabetic characters (A - Z),
	*   and 9 symbols (SP, $, %, *, +, -, ., /, :).
	* Normally, two input characters are represented by 11 bits.
	*
	* @type {Object}
	*/
	exports.ALPHANUMERIC = {
		id: "Alphanumeric",
		bit: 2,
		ccBits: [
			9,
			11,
			13
		]
	};
	/**
	* In byte mode, data is encoded at 8 bits per character.
	*
	* @type {Object}
	*/
	exports.BYTE = {
		id: "Byte",
		bit: 4,
		ccBits: [
			8,
			16,
			16
		]
	};
	/**
	* The Kanji mode efficiently encodes Kanji characters in accordance with
	* the Shift JIS system based on JIS X 0208.
	* The Shift JIS values are shifted from the JIS X 0208 values.
	* JIS X 0208 gives details of the shift coded representation.
	* Each two-byte character value is compacted to a 13-bit binary codeword.
	*
	* @type {Object}
	*/
	exports.KANJI = {
		id: "Kanji",
		bit: 8,
		ccBits: [
			8,
			10,
			12
		]
	};
	/**
	* Mixed mode will contain a sequences of data in a combination of any of
	* the modes described above
	*
	* @type {Object}
	*/
	exports.MIXED = { bit: -1 };
	/**
	* Returns the number of bits needed to store the data length
	* according to QR Code specifications.
	*
	* @param  {Mode}   mode    Data mode
	* @param  {Number} version QR Code version
	* @return {Number}         Number of bits
	*/
	exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
		if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
		if (!VersionCheck.isValid(version)) throw new Error("Invalid version: " + version);
		if (version >= 1 && version < 10) return mode.ccBits[0];
		else if (version < 27) return mode.ccBits[1];
		return mode.ccBits[2];
	};
	/**
	* Returns the most efficient mode to store the specified data
	*
	* @param  {String} dataStr Input data string
	* @return {Mode}           Best mode
	*/
	exports.getBestModeForData = function getBestModeForData(dataStr) {
		if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
		else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
		else if (Regex.testKanji(dataStr)) return exports.KANJI;
		else return exports.BYTE;
	};
	/**
	* Return mode name as string
	*
	* @param {Mode} mode Mode object
	* @returns {String}  Mode name
	*/
	exports.toString = function toString(mode) {
		if (mode && mode.id) return mode.id;
		throw new Error("Invalid mode");
	};
	/**
	* Check if input param is a valid mode object
	*
	* @param   {Mode}    mode Mode object
	* @returns {Boolean} True if valid mode, false otherwise
	*/
	exports.isValid = function isValid(mode) {
		return mode && mode.bit && mode.ccBits;
	};
	/**
	* Get mode object from its name
	*
	* @param   {String} string Mode name
	* @returns {Mode}          Mode object
	*/
	function fromString(string) {
		if (typeof string !== "string") throw new Error("Param is not a string");
		switch (string.toLowerCase()) {
			case "numeric": return exports.NUMERIC;
			case "alphanumeric": return exports.ALPHANUMERIC;
			case "kanji": return exports.KANJI;
			case "byte": return exports.BYTE;
			default: throw new Error("Unknown mode: " + string);
		}
	}
	/**
	* Returns mode from a value.
	* If value is not a valid mode, returns defaultValue
	*
	* @param  {Mode|String} value        Encoding mode
	* @param  {Mode}        defaultValue Fallback value
	* @return {Mode}                     Encoding mode
	*/
	exports.from = function from(value, defaultValue) {
		if (exports.isValid(value)) return value;
		try {
			return fromString(value);
		} catch (e) {
			return defaultValue;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/version.js
var require_version = /* @__PURE__ */ __commonJSMin(((exports) => {
	const Utils = require_utils$1();
	const ECCode = require_error_correction_code();
	const ECLevel = require_error_correction_level();
	const Mode = require_mode();
	const VersionCheck = require_version_check();
	const G18 = 7973;
	const G18_BCH = Utils.getBCHDigit(G18);
	function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
		for (let currentVersion = 1; currentVersion <= 40; currentVersion++) if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) return currentVersion;
	}
	function getReservedBitsCount(mode, version) {
		return Mode.getCharCountIndicator(mode, version) + 4;
	}
	function getTotalBitsFromDataArray(segments, version) {
		let totalBits = 0;
		segments.forEach(function(data) {
			const reservedBits = getReservedBitsCount(data.mode, version);
			totalBits += reservedBits + data.getBitsLength();
		});
		return totalBits;
	}
	function getBestVersionForMixedData(segments, errorCorrectionLevel) {
		for (let currentVersion = 1; currentVersion <= 40; currentVersion++) if (getTotalBitsFromDataArray(segments, currentVersion) <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) return currentVersion;
	}
	/**
	* Returns version number from a value.
	* If value is not a valid version, returns defaultValue
	*
	* @param  {Number|String} value        QR Code version
	* @param  {Number}        defaultValue Fallback value
	* @return {Number}                     QR Code version number
	*/
	exports.from = function from(value, defaultValue) {
		if (VersionCheck.isValid(value)) return parseInt(value, 10);
		return defaultValue;
	};
	/**
	* Returns how much data can be stored with the specified QR code version
	* and error correction level
	*
	* @param  {Number} version              QR Code version (1-40)
	* @param  {Number} errorCorrectionLevel Error correction level
	* @param  {Mode}   mode                 Data mode
	* @return {Number}                      Quantity of storable data
	*/
	exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
		if (!VersionCheck.isValid(version)) throw new Error("Invalid QR Code version");
		if (typeof mode === "undefined") mode = Mode.BYTE;
		const dataTotalCodewordsBits = (Utils.getSymbolTotalCodewords(version) - ECCode.getTotalCodewordsCount(version, errorCorrectionLevel)) * 8;
		if (mode === Mode.MIXED) return dataTotalCodewordsBits;
		const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
		switch (mode) {
			case Mode.NUMERIC: return Math.floor(usableBits / 10 * 3);
			case Mode.ALPHANUMERIC: return Math.floor(usableBits / 11 * 2);
			case Mode.KANJI: return Math.floor(usableBits / 13);
			case Mode.BYTE:
			default: return Math.floor(usableBits / 8);
		}
	};
	/**
	* Returns the minimum version needed to contain the amount of data
	*
	* @param  {Segment} data                    Segment of data
	* @param  {Number} [errorCorrectionLevel=H] Error correction level
	* @param  {Mode} mode                       Data mode
	* @return {Number}                          QR Code version
	*/
	exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
		let seg;
		const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
		if (Array.isArray(data)) {
			if (data.length > 1) return getBestVersionForMixedData(data, ecl);
			if (data.length === 0) return 1;
			seg = data[0];
		} else seg = data;
		return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
	};
	/**
	* Returns version information with relative error correction bits
	*
	* The version information is included in QR Code symbols of version 7 or larger.
	* It consists of an 18-bit sequence containing 6 data bits,
	* with 12 error correction bits calculated using the (18, 6) Golay code.
	*
	* @param  {Number} version QR Code version
	* @return {Number}         Encoded version info bits
	*/
	exports.getEncodedBits = function getEncodedBits(version) {
		if (!VersionCheck.isValid(version) || version < 7) throw new Error("Invalid QR Code version");
		let d = version << 12;
		while (Utils.getBCHDigit(d) - G18_BCH >= 0) d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
		return version << 12 | d;
	};
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/format-info.js
var require_format_info = /* @__PURE__ */ __commonJSMin(((exports) => {
	const Utils = require_utils$1();
	const G15 = 1335;
	const G15_MASK = 21522;
	const G15_BCH = Utils.getBCHDigit(G15);
	/**
	* Returns format information with relative error correction bits
	*
	* The format information is a 15-bit sequence containing 5 data bits,
	* with 10 error correction bits calculated using the (15, 5) BCH code.
	*
	* @param  {Number} errorCorrectionLevel Error correction level
	* @param  {Number} mask                 Mask pattern
	* @return {Number}                      Encoded format information bits
	*/
	exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
		const data = errorCorrectionLevel.bit << 3 | mask;
		let d = data << 10;
		while (Utils.getBCHDigit(d) - G15_BCH >= 0) d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
		return (data << 10 | d) ^ G15_MASK;
	};
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Mode = require_mode();
	function NumericData(data) {
		this.mode = Mode.NUMERIC;
		this.data = data.toString();
	}
	NumericData.getBitsLength = function getBitsLength(length) {
		return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
	};
	NumericData.prototype.getLength = function getLength() {
		return this.data.length;
	};
	NumericData.prototype.getBitsLength = function getBitsLength() {
		return NumericData.getBitsLength(this.data.length);
	};
	NumericData.prototype.write = function write(bitBuffer) {
		let i, group, value;
		for (i = 0; i + 3 <= this.data.length; i += 3) {
			group = this.data.substr(i, 3);
			value = parseInt(group, 10);
			bitBuffer.put(value, 10);
		}
		const remainingNum = this.data.length - i;
		if (remainingNum > 0) {
			group = this.data.substr(i);
			value = parseInt(group, 10);
			bitBuffer.put(value, remainingNum * 3 + 1);
		}
	};
	module.exports = NumericData;
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Mode = require_mode();
	/**
	* Array of characters available in alphanumeric mode
	*
	* As per QR Code specification, to each character
	* is assigned a value from 0 to 44 which in this case coincides
	* with the array index
	*
	* @type {Array}
	*/
	const ALPHA_NUM_CHARS = [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z",
		" ",
		"$",
		"%",
		"*",
		"+",
		"-",
		".",
		"/",
		":"
	];
	function AlphanumericData(data) {
		this.mode = Mode.ALPHANUMERIC;
		this.data = data;
	}
	AlphanumericData.getBitsLength = function getBitsLength(length) {
		return 11 * Math.floor(length / 2) + 6 * (length % 2);
	};
	AlphanumericData.prototype.getLength = function getLength() {
		return this.data.length;
	};
	AlphanumericData.prototype.getBitsLength = function getBitsLength() {
		return AlphanumericData.getBitsLength(this.data.length);
	};
	AlphanumericData.prototype.write = function write(bitBuffer) {
		let i;
		for (i = 0; i + 2 <= this.data.length; i += 2) {
			let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
			value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
			bitBuffer.put(value, 11);
		}
		if (this.data.length % 2) bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
	};
	module.exports = AlphanumericData;
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Mode = require_mode();
	function ByteData(data) {
		this.mode = Mode.BYTE;
		if (typeof data === "string") this.data = new TextEncoder().encode(data);
		else this.data = new Uint8Array(data);
	}
	ByteData.getBitsLength = function getBitsLength(length) {
		return length * 8;
	};
	ByteData.prototype.getLength = function getLength() {
		return this.data.length;
	};
	ByteData.prototype.getBitsLength = function getBitsLength() {
		return ByteData.getBitsLength(this.data.length);
	};
	ByteData.prototype.write = function(bitBuffer) {
		for (let i = 0, l = this.data.length; i < l; i++) bitBuffer.put(this.data[i], 8);
	};
	module.exports = ByteData;
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Mode = require_mode();
	const Utils = require_utils$1();
	function KanjiData(data) {
		this.mode = Mode.KANJI;
		this.data = data;
	}
	KanjiData.getBitsLength = function getBitsLength(length) {
		return length * 13;
	};
	KanjiData.prototype.getLength = function getLength() {
		return this.data.length;
	};
	KanjiData.prototype.getBitsLength = function getBitsLength() {
		return KanjiData.getBitsLength(this.data.length);
	};
	KanjiData.prototype.write = function(bitBuffer) {
		let i;
		for (i = 0; i < this.data.length; i++) {
			let value = Utils.toSJIS(this.data[i]);
			if (value >= 33088 && value <= 40956) value -= 33088;
			else if (value >= 57408 && value <= 60351) value -= 49472;
			else throw new Error("Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8");
			value = (value >>> 8 & 255) * 192 + (value & 255);
			bitBuffer.put(value, 13);
		}
	};
	module.exports = KanjiData;
}));
//#endregion
//#region node_modules/.pnpm/dijkstrajs@1.0.3/node_modules/dijkstrajs/dijkstra.js
var require_dijkstra = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/******************************************************************************
	* Created 2008-08-19.
	*
	* Dijkstra path-finding functions. Adapted from the Dijkstar Python project.
	*
	* Copyright (C) 2008
	*   Wyatt Baldwin <self@wyattbaldwin.com>
	*   All rights reserved
	*
	* Licensed under the MIT license.
	*
	*   http://www.opensource.org/licenses/mit-license.php
	*
	* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	* THE SOFTWARE.
	*****************************************************************************/
	var dijkstra = {
		single_source_shortest_paths: function(graph, s, d) {
			var predecessors = {};
			var costs = {};
			costs[s] = 0;
			var open = dijkstra.PriorityQueue.make();
			open.push(s, 0);
			var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
			while (!open.empty()) {
				closest = open.pop();
				u = closest.value;
				cost_of_s_to_u = closest.cost;
				adjacent_nodes = graph[u] || {};
				for (v in adjacent_nodes) if (adjacent_nodes.hasOwnProperty(v)) {
					cost_of_e = adjacent_nodes[v];
					cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
					cost_of_s_to_v = costs[v];
					first_visit = typeof costs[v] === "undefined";
					if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
						costs[v] = cost_of_s_to_u_plus_cost_of_e;
						open.push(v, cost_of_s_to_u_plus_cost_of_e);
						predecessors[v] = u;
					}
				}
			}
			if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
				var msg = [
					"Could not find a path from ",
					s,
					" to ",
					d,
					"."
				].join("");
				throw new Error(msg);
			}
			return predecessors;
		},
		extract_shortest_path_from_predecessor_list: function(predecessors, d) {
			var nodes = [];
			var u = d;
			while (u) {
				nodes.push(u);
				predecessors[u];
				u = predecessors[u];
			}
			nodes.reverse();
			return nodes;
		},
		find_path: function(graph, s, d) {
			var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
			return dijkstra.extract_shortest_path_from_predecessor_list(predecessors, d);
		},
		/**
		* A very naive priority queue implementation.
		*/
		PriorityQueue: {
			make: function(opts) {
				var T = dijkstra.PriorityQueue, t = {}, key;
				opts = opts || {};
				for (key in T) if (T.hasOwnProperty(key)) t[key] = T[key];
				t.queue = [];
				t.sorter = opts.sorter || T.default_sorter;
				return t;
			},
			default_sorter: function(a, b) {
				return a.cost - b.cost;
			},
			/**
			* Add a new item to the queue and ensure the highest priority element
			* is at the front of the queue.
			*/
			push: function(value, cost) {
				var item = {
					value,
					cost
				};
				this.queue.push(item);
				this.queue.sort(this.sorter);
			},
			/**
			* Return the highest priority element in the queue.
			*/
			pop: function() {
				return this.queue.shift();
			},
			empty: function() {
				return this.queue.length === 0;
			}
		}
	};
	if (typeof module !== "undefined") module.exports = dijkstra;
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/segments.js
var require_segments = /* @__PURE__ */ __commonJSMin(((exports) => {
	const Mode = require_mode();
	const NumericData = require_numeric_data();
	const AlphanumericData = require_alphanumeric_data();
	const ByteData = require_byte_data();
	const KanjiData = require_kanji_data();
	const Regex = require_regex();
	const Utils = require_utils$1();
	const dijkstra = require_dijkstra();
	/**
	* Returns UTF8 byte length
	*
	* @param  {String} str Input string
	* @return {Number}     Number of byte
	*/
	function getStringByteLength(str) {
		return unescape(encodeURIComponent(str)).length;
	}
	/**
	* Get a list of segments of the specified mode
	* from a string
	*
	* @param  {Mode}   mode Segment mode
	* @param  {String} str  String to process
	* @return {Array}       Array of object with segments data
	*/
	function getSegments(regex, mode, str) {
		const segments = [];
		let result;
		while ((result = regex.exec(str)) !== null) segments.push({
			data: result[0],
			index: result.index,
			mode,
			length: result[0].length
		});
		return segments;
	}
	/**
	* Extracts a series of segments with the appropriate
	* modes from a string
	*
	* @param  {String} dataStr Input string
	* @return {Array}          Array of object with segments data
	*/
	function getSegmentsFromString(dataStr) {
		const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
		const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
		let byteSegs;
		let kanjiSegs;
		if (Utils.isKanjiModeEnabled()) {
			byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
			kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
		} else {
			byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
			kanjiSegs = [];
		}
		return numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs).sort(function(s1, s2) {
			return s1.index - s2.index;
		}).map(function(obj) {
			return {
				data: obj.data,
				mode: obj.mode,
				length: obj.length
			};
		});
	}
	/**
	* Returns how many bits are needed to encode a string of
	* specified length with the specified mode
	*
	* @param  {Number} length String length
	* @param  {Mode} mode     Segment mode
	* @return {Number}        Bit length
	*/
	function getSegmentBitsLength(length, mode) {
		switch (mode) {
			case Mode.NUMERIC: return NumericData.getBitsLength(length);
			case Mode.ALPHANUMERIC: return AlphanumericData.getBitsLength(length);
			case Mode.KANJI: return KanjiData.getBitsLength(length);
			case Mode.BYTE: return ByteData.getBitsLength(length);
		}
	}
	/**
	* Merges adjacent segments which have the same mode
	*
	* @param  {Array} segs Array of object with segments data
	* @return {Array}      Array of object with segments data
	*/
	function mergeSegments(segs) {
		return segs.reduce(function(acc, curr) {
			const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
			if (prevSeg && prevSeg.mode === curr.mode) {
				acc[acc.length - 1].data += curr.data;
				return acc;
			}
			acc.push(curr);
			return acc;
		}, []);
	}
	/**
	* Generates a list of all possible nodes combination which
	* will be used to build a segments graph.
	*
	* Nodes are divided by groups. Each group will contain a list of all the modes
	* in which is possible to encode the given text.
	*
	* For example the text '12345' can be encoded as Numeric, Alphanumeric or Byte.
	* The group for '12345' will contain then 3 objects, one for each
	* possible encoding mode.
	*
	* Each node represents a possible segment.
	*
	* @param  {Array} segs Array of object with segments data
	* @return {Array}      Array of object with segments data
	*/
	function buildNodes(segs) {
		const nodes = [];
		for (let i = 0; i < segs.length; i++) {
			const seg = segs[i];
			switch (seg.mode) {
				case Mode.NUMERIC:
					nodes.push([
						seg,
						{
							data: seg.data,
							mode: Mode.ALPHANUMERIC,
							length: seg.length
						},
						{
							data: seg.data,
							mode: Mode.BYTE,
							length: seg.length
						}
					]);
					break;
				case Mode.ALPHANUMERIC:
					nodes.push([seg, {
						data: seg.data,
						mode: Mode.BYTE,
						length: seg.length
					}]);
					break;
				case Mode.KANJI:
					nodes.push([seg, {
						data: seg.data,
						mode: Mode.BYTE,
						length: getStringByteLength(seg.data)
					}]);
					break;
				case Mode.BYTE: nodes.push([{
					data: seg.data,
					mode: Mode.BYTE,
					length: getStringByteLength(seg.data)
				}]);
			}
		}
		return nodes;
	}
	/**
	* Builds a graph from a list of nodes.
	* All segments in each node group will be connected with all the segments of
	* the next group and so on.
	*
	* At each connection will be assigned a weight depending on the
	* segment's byte length.
	*
	* @param  {Array} nodes    Array of object with segments data
	* @param  {Number} version QR Code version
	* @return {Object}         Graph of all possible segments
	*/
	function buildGraph(nodes, version) {
		const table = {};
		const graph = { start: {} };
		let prevNodeIds = ["start"];
		for (let i = 0; i < nodes.length; i++) {
			const nodeGroup = nodes[i];
			const currentNodeIds = [];
			for (let j = 0; j < nodeGroup.length; j++) {
				const node = nodeGroup[j];
				const key = "" + i + j;
				currentNodeIds.push(key);
				table[key] = {
					node,
					lastCount: 0
				};
				graph[key] = {};
				for (let n = 0; n < prevNodeIds.length; n++) {
					const prevNodeId = prevNodeIds[n];
					if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
						graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
						table[prevNodeId].lastCount += node.length;
					} else {
						if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
						graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
					}
				}
			}
			prevNodeIds = currentNodeIds;
		}
		for (let n = 0; n < prevNodeIds.length; n++) graph[prevNodeIds[n]].end = 0;
		return {
			map: graph,
			table
		};
	}
	/**
	* Builds a segment from a specified data and mode.
	* If a mode is not specified, the more suitable will be used.
	*
	* @param  {String} data             Input data
	* @param  {Mode | String} modesHint Data mode
	* @return {Segment}                 Segment
	*/
	function buildSingleSegment(data, modesHint) {
		let mode;
		const bestMode = Mode.getBestModeForData(data);
		mode = Mode.from(modesHint, bestMode);
		if (mode !== Mode.BYTE && mode.bit < bestMode.bit) throw new Error("\"" + data + "\" cannot be encoded with mode " + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
		if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) mode = Mode.BYTE;
		switch (mode) {
			case Mode.NUMERIC: return new NumericData(data);
			case Mode.ALPHANUMERIC: return new AlphanumericData(data);
			case Mode.KANJI: return new KanjiData(data);
			case Mode.BYTE: return new ByteData(data);
		}
	}
	/**
	* Builds a list of segments from an array.
	* Array can contain Strings or Objects with segment's info.
	*
	* For each item which is a string, will be generated a segment with the given
	* string and the more appropriate encoding mode.
	*
	* For each item which is an object, will be generated a segment with the given
	* data and mode.
	* Objects must contain at least the property "data".
	* If property "mode" is not present, the more suitable mode will be used.
	*
	* @param  {Array} array Array of objects with segments data
	* @return {Array}       Array of Segments
	*/
	exports.fromArray = function fromArray(array) {
		return array.reduce(function(acc, seg) {
			if (typeof seg === "string") acc.push(buildSingleSegment(seg, null));
			else if (seg.data) acc.push(buildSingleSegment(seg.data, seg.mode));
			return acc;
		}, []);
	};
	/**
	* Builds an optimized sequence of segments from a string,
	* which will produce the shortest possible bitstream.
	*
	* @param  {String} data    Input string
	* @param  {Number} version QR Code version
	* @return {Array}          Array of segments
	*/
	exports.fromString = function fromString(data, version) {
		const graph = buildGraph(buildNodes(getSegmentsFromString(data, Utils.isKanjiModeEnabled())), version);
		const path = dijkstra.find_path(graph.map, "start", "end");
		const optimizedSegs = [];
		for (let i = 1; i < path.length - 1; i++) optimizedSegs.push(graph.table[path[i]].node);
		return exports.fromArray(mergeSegments(optimizedSegs));
	};
	/**
	* Splits a string in various segments with the modes which
	* best represent their content.
	* The produced segments are far from being optimized.
	* The output of this function is only used to estimate a QR Code version
	* which may contain the data.
	*
	* @param  {string} data Input string
	* @return {Array}       Array of segments
	*/
	exports.rawSplit = function rawSplit(data) {
		return exports.fromArray(getSegmentsFromString(data, Utils.isKanjiModeEnabled()));
	};
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = /* @__PURE__ */ __commonJSMin(((exports) => {
	const Utils = require_utils$1();
	const ECLevel = require_error_correction_level();
	const BitBuffer = require_bit_buffer();
	const BitMatrix = require_bit_matrix();
	const AlignmentPattern = require_alignment_pattern();
	const FinderPattern = require_finder_pattern();
	const MaskPattern = require_mask_pattern();
	const ECCode = require_error_correction_code();
	const ReedSolomonEncoder = require_reed_solomon_encoder();
	const Version = require_version();
	const FormatInfo = require_format_info();
	const Mode = require_mode();
	const Segments = require_segments();
	/**
	* QRCode for JavaScript
	*
	* modified by Ryan Day for nodejs support
	* Copyright (c) 2011 Ryan Day
	*
	* Licensed under the MIT license:
	*   http://www.opensource.org/licenses/mit-license.php
	*
	//---------------------------------------------------------------------
	// QRCode for JavaScript
	//
	// Copyright (c) 2009 Kazuhiko Arase
	//
	// URL: http://www.d-project.com/
	//
	// Licensed under the MIT license:
	//   http://www.opensource.org/licenses/mit-license.php
	//
	// The word "QR Code" is registered trademark of
	// DENSO WAVE INCORPORATED
	//   http://www.denso-wave.com/qrcode/faqpatent-e.html
	//
	//---------------------------------------------------------------------
	*/
	/**
	* Add finder patterns bits to matrix
	*
	* @param  {BitMatrix} matrix  Modules matrix
	* @param  {Number}    version QR Code version
	*/
	function setupFinderPattern(matrix, version) {
		const size = matrix.size;
		const pos = FinderPattern.getPositions(version);
		for (let i = 0; i < pos.length; i++) {
			const row = pos[i][0];
			const col = pos[i][1];
			for (let r = -1; r <= 7; r++) {
				if (row + r <= -1 || size <= row + r) continue;
				for (let c = -1; c <= 7; c++) {
					if (col + c <= -1 || size <= col + c) continue;
					if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) matrix.set(row + r, col + c, true, true);
					else matrix.set(row + r, col + c, false, true);
				}
			}
		}
	}
	/**
	* Add timing pattern bits to matrix
	*
	* Note: this function must be called before {@link setupAlignmentPattern}
	*
	* @param  {BitMatrix} matrix Modules matrix
	*/
	function setupTimingPattern(matrix) {
		const size = matrix.size;
		for (let r = 8; r < size - 8; r++) {
			const value = r % 2 === 0;
			matrix.set(r, 6, value, true);
			matrix.set(6, r, value, true);
		}
	}
	/**
	* Add alignment patterns bits to matrix
	*
	* Note: this function must be called after {@link setupTimingPattern}
	*
	* @param  {BitMatrix} matrix  Modules matrix
	* @param  {Number}    version QR Code version
	*/
	function setupAlignmentPattern(matrix, version) {
		const pos = AlignmentPattern.getPositions(version);
		for (let i = 0; i < pos.length; i++) {
			const row = pos[i][0];
			const col = pos[i][1];
			for (let r = -2; r <= 2; r++) for (let c = -2; c <= 2; c++) if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) matrix.set(row + r, col + c, true, true);
			else matrix.set(row + r, col + c, false, true);
		}
	}
	/**
	* Add version info bits to matrix
	*
	* @param  {BitMatrix} matrix  Modules matrix
	* @param  {Number}    version QR Code version
	*/
	function setupVersionInfo(matrix, version) {
		const size = matrix.size;
		const bits = Version.getEncodedBits(version);
		let row, col, mod;
		for (let i = 0; i < 18; i++) {
			row = Math.floor(i / 3);
			col = i % 3 + size - 8 - 3;
			mod = (bits >> i & 1) === 1;
			matrix.set(row, col, mod, true);
			matrix.set(col, row, mod, true);
		}
	}
	/**
	* Add format info bits to matrix
	*
	* @param  {BitMatrix} matrix               Modules matrix
	* @param  {ErrorCorrectionLevel}    errorCorrectionLevel Error correction level
	* @param  {Number}    maskPattern          Mask pattern reference value
	*/
	function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
		const size = matrix.size;
		const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
		let i, mod;
		for (i = 0; i < 15; i++) {
			mod = (bits >> i & 1) === 1;
			if (i < 6) matrix.set(i, 8, mod, true);
			else if (i < 8) matrix.set(i + 1, 8, mod, true);
			else matrix.set(size - 15 + i, 8, mod, true);
			if (i < 8) matrix.set(8, size - i - 1, mod, true);
			else if (i < 9) matrix.set(8, 15 - i - 1 + 1, mod, true);
			else matrix.set(8, 15 - i - 1, mod, true);
		}
		matrix.set(size - 8, 8, 1, true);
	}
	/**
	* Add encoded data bits to matrix
	*
	* @param  {BitMatrix}  matrix Modules matrix
	* @param  {Uint8Array} data   Data codewords
	*/
	function setupData(matrix, data) {
		const size = matrix.size;
		let inc = -1;
		let row = size - 1;
		let bitIndex = 7;
		let byteIndex = 0;
		for (let col = size - 1; col > 0; col -= 2) {
			if (col === 6) col--;
			while (true) {
				for (let c = 0; c < 2; c++) if (!matrix.isReserved(row, col - c)) {
					let dark = false;
					if (byteIndex < data.length) dark = (data[byteIndex] >>> bitIndex & 1) === 1;
					matrix.set(row, col - c, dark);
					bitIndex--;
					if (bitIndex === -1) {
						byteIndex++;
						bitIndex = 7;
					}
				}
				row += inc;
				if (row < 0 || size <= row) {
					row -= inc;
					inc = -inc;
					break;
				}
			}
		}
	}
	/**
	* Create encoded codewords from data input
	*
	* @param  {Number}   version              QR Code version
	* @param  {ErrorCorrectionLevel}   errorCorrectionLevel Error correction level
	* @param  {ByteData} data                 Data input
	* @return {Uint8Array}                    Buffer containing encoded codewords
	*/
	function createData(version, errorCorrectionLevel, segments) {
		const buffer = new BitBuffer();
		segments.forEach(function(data) {
			buffer.put(data.mode.bit, 4);
			buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));
			data.write(buffer);
		});
		const dataTotalCodewordsBits = (Utils.getSymbolTotalCodewords(version) - ECCode.getTotalCodewordsCount(version, errorCorrectionLevel)) * 8;
		if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) buffer.put(0, 4);
		while (buffer.getLengthInBits() % 8 !== 0) buffer.putBit(0);
		const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
		for (let i = 0; i < remainingByte; i++) buffer.put(i % 2 ? 17 : 236, 8);
		return createCodewords(buffer, version, errorCorrectionLevel);
	}
	/**
	* Encode input data with Reed-Solomon and return codewords with
	* relative error correction bits
	*
	* @param  {BitBuffer} bitBuffer            Data to encode
	* @param  {Number}    version              QR Code version
	* @param  {ErrorCorrectionLevel} errorCorrectionLevel Error correction level
	* @return {Uint8Array}                     Buffer containing encoded codewords
	*/
	function createCodewords(bitBuffer, version, errorCorrectionLevel) {
		const totalCodewords = Utils.getSymbolTotalCodewords(version);
		const dataTotalCodewords = totalCodewords - ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
		const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
		const blocksInGroup1 = ecTotalBlocks - totalCodewords % ecTotalBlocks;
		const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
		const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
		const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
		const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
		const rs = new ReedSolomonEncoder(ecCount);
		let offset = 0;
		const dcData = new Array(ecTotalBlocks);
		const ecData = new Array(ecTotalBlocks);
		let maxDataSize = 0;
		const buffer = new Uint8Array(bitBuffer.buffer);
		for (let b = 0; b < ecTotalBlocks; b++) {
			const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
			dcData[b] = buffer.slice(offset, offset + dataSize);
			ecData[b] = rs.encode(dcData[b]);
			offset += dataSize;
			maxDataSize = Math.max(maxDataSize, dataSize);
		}
		const data = new Uint8Array(totalCodewords);
		let index = 0;
		let i, r;
		for (i = 0; i < maxDataSize; i++) for (r = 0; r < ecTotalBlocks; r++) if (i < dcData[r].length) data[index++] = dcData[r][i];
		for (i = 0; i < ecCount; i++) for (r = 0; r < ecTotalBlocks; r++) data[index++] = ecData[r][i];
		return data;
	}
	/**
	* Build QR Code symbol
	*
	* @param  {String} data                 Input string
	* @param  {Number} version              QR Code version
	* @param  {ErrorCorretionLevel} errorCorrectionLevel Error level
	* @param  {MaskPattern} maskPattern     Mask pattern
	* @return {Object}                      Object containing symbol data
	*/
	function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
		let segments;
		if (Array.isArray(data)) segments = Segments.fromArray(data);
		else if (typeof data === "string") {
			let estimatedVersion = version;
			if (!estimatedVersion) {
				const rawSegments = Segments.rawSplit(data);
				estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
			}
			segments = Segments.fromString(data, estimatedVersion || 40);
		} else throw new Error("Invalid data");
		const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
		if (!bestVersion) throw new Error("The amount of data is too big to be stored in a QR Code");
		if (!version) version = bestVersion;
		else if (version < bestVersion) throw new Error("\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n");
		const dataBits = createData(version, errorCorrectionLevel, segments);
		const moduleCount = Utils.getSymbolSize(version);
		const modules = new BitMatrix(moduleCount);
		setupFinderPattern(modules, version);
		setupTimingPattern(modules);
		setupAlignmentPattern(modules, version);
		setupFormatInfo(modules, errorCorrectionLevel, 0);
		if (version >= 7) setupVersionInfo(modules, version);
		setupData(modules, dataBits);
		if (isNaN(maskPattern)) maskPattern = MaskPattern.getBestMask(modules, setupFormatInfo.bind(null, modules, errorCorrectionLevel));
		MaskPattern.applyMask(maskPattern, modules);
		setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
		return {
			modules,
			version,
			errorCorrectionLevel,
			maskPattern,
			segments
		};
	}
	/**
	* QR Code
	*
	* @param {String | Array} data                 Input data
	* @param {Object} options                      Optional configurations
	* @param {Number} options.version              QR Code version
	* @param {String} options.errorCorrectionLevel Error correction level
	* @param {Function} options.toSJISFunc         Helper func to convert utf8 to sjis
	*/
	exports.create = function create(data, options) {
		if (typeof data === "undefined" || data === "") throw new Error("No input text");
		let errorCorrectionLevel = ECLevel.M;
		let version;
		let mask;
		if (typeof options !== "undefined") {
			errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
			version = Version.from(options.version);
			mask = MaskPattern.from(options.maskPattern);
			if (options.toSJISFunc) Utils.setToSJISFunction(options.toSJISFunc);
		}
		return createSymbol(data, version, errorCorrectionLevel, mask);
	};
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	function hex2rgba(hex) {
		if (typeof hex === "number") hex = hex.toString();
		if (typeof hex !== "string") throw new Error("Color should be defined as hex string");
		let hexCode = hex.slice().replace("#", "").split("");
		if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) throw new Error("Invalid hex color: " + hex);
		if (hexCode.length === 3 || hexCode.length === 4) hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
			return [c, c];
		}));
		if (hexCode.length === 6) hexCode.push("F", "F");
		const hexValue = parseInt(hexCode.join(""), 16);
		return {
			r: hexValue >> 24 & 255,
			g: hexValue >> 16 & 255,
			b: hexValue >> 8 & 255,
			a: hexValue & 255,
			hex: "#" + hexCode.slice(0, 6).join("")
		};
	}
	exports.getOptions = function getOptions(options) {
		if (!options) options = {};
		if (!options.color) options.color = {};
		const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
		const width = options.width && options.width >= 21 ? options.width : void 0;
		const scale = options.scale || 4;
		return {
			width,
			scale: width ? 4 : scale,
			margin,
			color: {
				dark: hex2rgba(options.color.dark || "#000000ff"),
				light: hex2rgba(options.color.light || "#ffffffff")
			},
			type: options.type,
			rendererOpts: options.rendererOpts || {}
		};
	};
	exports.getScale = function getScale(qrSize, opts) {
		return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
	};
	exports.getImageWidth = function getImageWidth(qrSize, opts) {
		const scale = exports.getScale(qrSize, opts);
		return Math.floor((qrSize + opts.margin * 2) * scale);
	};
	exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
		const size = qr.modules.size;
		const data = qr.modules.data;
		const scale = exports.getScale(size, opts);
		const symbolSize = Math.floor((size + opts.margin * 2) * scale);
		const scaledMargin = opts.margin * scale;
		const palette = [opts.color.light, opts.color.dark];
		for (let i = 0; i < symbolSize; i++) for (let j = 0; j < symbolSize; j++) {
			let posDst = (i * symbolSize + j) * 4;
			let pxColor = opts.color.light;
			if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
				const iSrc = Math.floor((i - scaledMargin) / scale);
				const jSrc = Math.floor((j - scaledMargin) / scale);
				pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
			}
			imgData[posDst++] = pxColor.r;
			imgData[posDst++] = pxColor.g;
			imgData[posDst++] = pxColor.b;
			imgData[posDst] = pxColor.a;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/canvas.js
var require_canvas = /* @__PURE__ */ __commonJSMin(((exports) => {
	const Utils = require_utils();
	function clearCanvas(ctx, canvas, size) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (!canvas.style) canvas.style = {};
		canvas.height = size;
		canvas.width = size;
		canvas.style.height = size + "px";
		canvas.style.width = size + "px";
	}
	function getCanvasElement() {
		try {
			return document.createElement("canvas");
		} catch (e) {
			throw new Error("You need to specify a canvas element");
		}
	}
	exports.render = function render(qrData, canvas, options) {
		let opts = options;
		let canvasEl = canvas;
		if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
			opts = canvas;
			canvas = void 0;
		}
		if (!canvas) canvasEl = getCanvasElement();
		opts = Utils.getOptions(opts);
		const size = Utils.getImageWidth(qrData.modules.size, opts);
		const ctx = canvasEl.getContext("2d");
		const image = ctx.createImageData(size, size);
		Utils.qrToImageData(image.data, qrData, opts);
		clearCanvas(ctx, canvasEl, size);
		ctx.putImageData(image, 0, 0);
		return canvasEl;
	};
	exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
		let opts = options;
		if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
			opts = canvas;
			canvas = void 0;
		}
		if (!opts) opts = {};
		const canvasEl = exports.render(qrData, canvas, opts);
		const type = opts.type || "image/png";
		const rendererOpts = opts.rendererOpts || {};
		return canvasEl.toDataURL(type, rendererOpts.quality);
	};
}));
//#endregion
//#region node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/svg-tag.js
var require_svg_tag = /* @__PURE__ */ __commonJSMin(((exports) => {
	const Utils = require_utils();
	function getColorAttrib(color, attrib) {
		const alpha = color.a / 255;
		const str = attrib + "=\"" + color.hex + "\"";
		return alpha < 1 ? str + " " + attrib + "-opacity=\"" + alpha.toFixed(2).slice(1) + "\"" : str;
	}
	function svgCmd(cmd, x, y) {
		let str = cmd + x;
		if (typeof y !== "undefined") str += " " + y;
		return str;
	}
	function qrToPath(data, size, margin) {
		let path = "";
		let moveBy = 0;
		let newRow = false;
		let lineLength = 0;
		for (let i = 0; i < data.length; i++) {
			const col = Math.floor(i % size);
			const row = Math.floor(i / size);
			if (!col && !newRow) newRow = true;
			if (data[i]) {
				lineLength++;
				if (!(i > 0 && col > 0 && data[i - 1])) {
					path += newRow ? svgCmd("M", col + margin, .5 + row + margin) : svgCmd("m", moveBy, 0);
					moveBy = 0;
					newRow = false;
				}
				if (!(col + 1 < size && data[i + 1])) {
					path += svgCmd("h", lineLength);
					lineLength = 0;
				}
			} else moveBy++;
		}
		return path;
	}
	exports.render = function render(qrData, options, cb) {
		const opts = Utils.getOptions(options);
		const size = qrData.modules.size;
		const data = qrData.modules.data;
		const qrcodesize = size + opts.margin * 2;
		const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + " d=\"M0 0h" + qrcodesize + "v" + qrcodesize + "H0z\"/>";
		const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + " d=\"" + qrToPath(data, size, opts.margin) + "\"/>";
		const viewBox = "viewBox=\"0 0 " + qrcodesize + " " + qrcodesize + "\"";
		const svgTag = "<svg xmlns=\"http://www.w3.org/2000/svg\" " + (!opts.width ? "" : "width=\"" + opts.width + "\" height=\"" + opts.width + "\" ") + viewBox + " shape-rendering=\"crispEdges\">" + bg + path + "</svg>\n";
		if (typeof cb === "function") cb(null, svgTag);
		return svgTag;
	};
}));
//#endregion
//#region src/client/netease.ts
var import_browser = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports) => {
	const canPromise = require_can_promise();
	const QRCode = require_qrcode();
	const CanvasRenderer = require_canvas();
	const SvgRenderer = require_svg_tag();
	function renderCanvas(renderFunc, canvas, text, opts, cb) {
		const args = [].slice.call(arguments, 1);
		const argsNum = args.length;
		const isLastArgCb = typeof args[argsNum - 1] === "function";
		if (!isLastArgCb && !canPromise()) throw new Error("Callback required as last argument");
		if (isLastArgCb) {
			if (argsNum < 2) throw new Error("Too few arguments provided");
			if (argsNum === 2) {
				cb = text;
				text = canvas;
				canvas = opts = void 0;
			} else if (argsNum === 3) {
				if (canvas.getContext && typeof cb === "undefined") {
					cb = opts;
					opts = void 0;
				} else {
					cb = opts;
					opts = text;
					text = canvas;
					canvas = void 0;
				}
			}
		} else {
			if (argsNum < 1) throw new Error("Too few arguments provided");
			if (argsNum === 1) {
				text = canvas;
				canvas = opts = void 0;
			} else if (argsNum === 2 && !canvas.getContext) {
				opts = text;
				text = canvas;
				canvas = void 0;
			}
			return new Promise(function(resolve, reject) {
				try {
					resolve(renderFunc(QRCode.create(text, opts), canvas, opts));
				} catch (e) {
					reject(e);
				}
			});
		}
		try {
			const data = QRCode.create(text, opts);
			cb(null, renderFunc(data, canvas, opts));
		} catch (e) {
			cb(e);
		}
	}
	exports.create = QRCode.create;
	exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
	exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
	exports.toString = renderCanvas.bind(null, function(data, _, opts) {
		return SvgRenderer.render(data, opts);
	});
})))(), 1);
async function weapi(path, data = {}) {
	const res = await fetch("/netease/weapi", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			path,
			data
		}),
		signal: AbortSignal.timeout(3e4)
	});
	if (!res.ok) throw new Error(`weapi ${path}: HTTP ${res.status}`);
	return await res.json();
}
async function getAccount() {
	try {
		const res = await fetch("/netease/account", { cache: "no-store" });
		if (!res.ok) return { loggedIn: false };
		return await res.json();
	} catch {
		return { loggedIn: false };
	}
}
async function logout() {
	await fetch("/netease/logout", { method: "POST" });
}
const COOKIE_NAME_RES = [
	/^Hm_lpvt_[a-f0-9]{32}/,
	/^Hm_lvt_[a-f0-9]{32}/,
	/^HMACCOUNT_BFESS/,
	/^JSESSIONID-WYYY/,
	/^__snaker__id/,
	/^ntes_kaola_ad/,
	/^MUSIC_A_T/,
	/^MUSIC_R_T/,
	/^gdxidpyhx/,
	/^_iuqxldmzr_/,
	/^_ntes_nnid/,
	/^_ntes_nuid/,
	/^HMACCOUNT/,
	/^MUSIC_U/,
	/^NMTID/,
	/^ntes_utid/,
	/^WM_NIKE/,
	/^WM_NI/,
	/^WM_TID/,
	/^__csrf/
].sort((a, b) => b.source.length - a.source.length);
const STANDARD_COOKIE_RE = /^(?:[^=;\s]+=[^;]*)(?:\s*;\s*[^=;\s]+=[^;]*)*$/;
function normalizeCookiePaste(raw) {
	const trimmed = raw.trim();
	if (trimmed === "") return "";
	if (STANDARD_COOKIE_RE.test(trimmed)) return trimmed;
	const lines = trimmed.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.includes("=") && !l.startsWith(";"));
	if (lines.length > 1 && lines.every((l) => /^[^=;\s]+=[^;]*$/.test(l))) return lines.join("; ");
	const unanchored = COOKIE_NAME_RES.map((re) => new RegExp(re.source.replace(/^\^/, "")));
	const parts = [];
	let rest = trimmed;
	while (rest.length > 0) {
		let name = null;
		for (const re of COOKIE_NAME_RES) {
			const m = rest.match(re);
			if (m !== null) {
				name = m[0];
				break;
			}
		}
		if (name === null) break;
		rest = rest.slice(name.length);
		let end = rest.length;
		for (const re of unanchored) {
			const idx = rest.search(re);
			if (idx !== -1 && idx < end) end = idx;
		}
		parts.push(`${name}=${rest.slice(0, end)}`);
		rest = rest.slice(end);
	}
	return parts.join("; ");
}
/** Login by pasting a music.163.com session cookie (works when QR is blocked). */
async function submitCookie(cookie) {
	const res = await fetch("/netease/cookie", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ cookie })
	});
	if (!res.ok) throw new Error(`cookie login: HTTP ${res.status}`);
	return await res.json();
}
async function requestQrKey() {
	const json = await weapi("/weapi/login/qrcode/unikey", { type: 1 });
	if (typeof json.unikey !== "string" || json.unikey === "") throw new Error("unikey missing");
	return {
		key: json.unikey,
		qrimg: json.qrimg
	};
}
async function pollQrLogin(key) {
	const json = await weapi("/weapi/login/qrcode/client/login", {
		key,
		type: 1
	});
	const code = json.code ?? -1;
	if (code === 800) return { code: 800 };
	if (code === 801) return { code: 801 };
	if (code === 802) return { code: 802 };
	if (code === 803) return {
		code: 803,
		nickname: json.nickname,
		avatarUrl: json.avatarUrl
	};
	throw new Error(`unexpected qr code ${code}`);
}
/** Playlists owned by / collected by the user. */
async function fetchPlaylists(uid) {
	return ((await weapi("/weapi/user/playlist", {
		uid,
		limit: 60,
		offset: 0,
		includeVideo: true
	})).playlist ?? []).filter((p) => typeof p.id === "number" && typeof p.name === "string").map((p) => ({
		id: p.id,
		name: p.name,
		trackCount: p.trackCount ?? 0
	}));
}
/** Tracks of one playlist. */
async function fetchPlaylistTracks(id) {
	return ((await weapi("/weapi/v6/playlist/detail", {
		id,
		n: 1e3,
		s: 8
	})).playlist?.tracks ?? []).filter((t) => typeof t.id === "number" && typeof t.name === "string").map((t) => ({
		id: t.id,
		name: t.name,
		artists: (t.ar ?? []).map((a) => a.name ?? "").filter((s) => s !== "").join(" / "),
		album: t.al?.name,
		cover: t.al?.picUrl,
		durationMs: t.dt
	}));
}
/** Daily recommended songs (requires login). */
async function fetchDailySongs() {
	return ((await weapi("/weapi/v1/discovery/recommend/songs", {})).data?.dailySongs ?? []).filter((s) => typeof s.id === "number" && typeof s.name === "string").map((s) => ({
		id: s.id,
		name: s.name,
		artists: (s.ar ?? []).map((a) => a.name ?? "").filter((x) => x !== "").join(" / "),
		album: s.al?.name,
		cover: s.al?.picUrl,
		durationMs: s.dt
	}));
}
async function fetchLyric(id) {
	const res = await fetch(`/netease/lyric?id=${id}`, { cache: "no-store" });
	if (!res.ok) throw new Error(`lyric: HTTP ${res.status}`);
	return (await res.json()).lrc ?? "";
}
/** Playable stream URL (null for VIP/region-restricted songs). */
async function fetchSongUrl(id) {
	try {
		const url = (await weapi("/weapi/song/enhance/player/url", {
			ids: [id],
			br: 32e4
		})).data?.[0]?.url;
		return typeof url === "string" && url !== "" ? url : null;
	} catch {
		return null;
	}
}
async function fetchHotPlaylists() {
	const res = await fetch("/netease/hot-playlists", { cache: "no-store" });
	if (!res.ok) throw new Error(`hot playlists: HTTP ${res.status}`);
	return (await res.json()).playlists ?? [];
}
async function searchSongs(query) {
	const res = await fetch(`/netease/search?q=${encodeURIComponent(query)}`, { cache: "no-store" });
	if (!res.ok) throw new Error(`search: HTTP ${res.status}`);
	return (await res.json()).songs ?? [];
}
/** Public stream URL via the outer-url redirect (no login required). */
async function fetchPublicSongUrl(id) {
	try {
		const res = await fetch(`/netease/song-url?id=${id}`, { cache: "no-store" });
		if (!res.ok) return null;
		const json = await res.json();
		return typeof json.url === "string" && json.url !== "" ? json.url : null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/client/lyrics.ts
/** Playback manager + LRC parser + lyric-position store. */
const LRC_TAG = /\[(\d{1,2}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g;
/** One timestamp tag → seconds (e.g. `[1:02.5]` → 62.5). */
function tagToSeconds(tag) {
	const minutes = Number(tag[1] ?? 0);
	const seconds = Number(tag[2] ?? 0);
	const fracRaw = tag[3];
	const frac = fracRaw === void 0 ? 0 : Number(fracRaw.padEnd(3, "0")) / 1e3;
	return minutes * 60 + seconds + frac;
}
/**
* Parse LRC into timed lines. Handles repeated timestamps on one line
* (`[00:10][00:20]歌词` → two lines at 10s and 20s) and skips pure metadata
* lines (no timestamp tags, e.g. `[ti:...]` / `[ar:...]`).
*/
function parseLrc(lrc) {
	const lines = [];
	for (const raw of lrc.split("\n")) {
		LRC_TAG.lastIndex = 0;
		const text = raw.replace(LRC_TAG, "").trim();
		if (text === "") continue;
		let tag;
		while ((tag = LRC_TAG.exec(raw)) !== null) lines.push({
			time: tagToSeconds(tag),
			text
		});
	}
	lines.sort((a, b) => a.time - b.time);
	return lines;
}
/** The lyric line active at `time` (or null before the first line). */
function lineAtTime(lines, time) {
	let current = null;
	for (const line of lines) {
		if (line.time > time) break;
		current = line;
	}
	return current;
}
/** Locale key for "this song cannot be played (VIP/licensing)". */
const PLAYBACK_ERROR_KEY = "lyricUnavailable";
const EMPTY = {
	song: null,
	playing: false,
	time: 0,
	duration: 0,
	currentLine: null,
	lyrics: [],
	error: null,
	loading: false,
	volume: 1,
	queue: [],
	queueIndex: -1
};
var PlaybackManager = class {
	audio = new Audio();
	song = null;
	lyrics = [];
	queue = [];
	queueIndex = -1;
	state = { ...EMPTY };
	listeners = /* @__PURE__ */ new Set();
	/** monotonically increasing play request id — stale async results are dropped */
	playSeq = 0;
	constructor() {
		this.audio.preload = "auto";
		this.audio.volume = 1;
		this.audio.volume = 1;
		this.audio.addEventListener("timeupdate", () => this.sync());
		this.audio.addEventListener("loadedmetadata", () => this.sync());
		this.audio.addEventListener("play", () => this.sync());
		this.audio.addEventListener("pause", () => this.sync());
		this.audio.addEventListener("ended", () => {
			this.sync();
			this.playNext();
		});
		this.audio.addEventListener("error", () => {
			this.state = {
				...this.state,
				playing: false,
				error: PLAYBACK_ERROR_KEY
			};
			this.emit();
		});
	}
	getSnapshot = () => this.state;
	subscribe = (listener) => {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	};
	emit() {
		for (const listener of this.listeners) listener();
	}
	sync() {
		this.state = {
			...this.state,
			playing: !this.audio.paused,
			time: this.audio.currentTime,
			duration: Number.isFinite(this.audio.duration) ? this.audio.duration : 0,
			currentLine: lineAtTime(this.lyrics, this.audio.currentTime)
		};
		this.emit();
	}
	/** Load and play a song; fetch its stream URL and lyrics. */
	async play(song, queue) {
		const seq = ++this.playSeq;
		if (queue !== void 0) {
			this.queue = queue;
			this.queueIndex = queue.findIndex((s) => s.id === song.id);
		}
		this.state = {
			...EMPTY,
			song,
			loading: true,
			volume: this.audio.volume,
			queue: this.queue,
			queueIndex: this.queueIndex
		};
		this.emit();
		const [weapiUrl, lrc] = await Promise.all([fetchSongUrl(song.id), fetchLyric(song.id).catch(() => "")]);
		if (seq !== this.playSeq) return;
		const url = weapiUrl ?? await fetchPublicSongUrl(song.id);
		if (seq !== this.playSeq) return;
		if (url === null) {
			this.state = {
				...EMPTY,
				song,
				error: PLAYBACK_ERROR_KEY,
				volume: this.audio.volume,
				queue: this.queue,
				queueIndex: this.queueIndex
			};
			this.emit();
			return;
		}
		this.lyrics = parseLrc(lrc);
		this.song = song;
		this.audio.src = url;
		this.state = {
			...this.state,
			loading: false,
			lyrics: this.lyrics
		};
		this.emit();
		try {
			await this.audio.play();
		} catch {
			if (seq !== this.playSeq) return;
			this.state = {
				...this.state,
				playing: false
			};
			this.emit();
		}
	}
	/** Auto-advance to the next song in the queue when one finishes. */
	playNext() {
		if (this.queue.length === 0 || this.queueIndex < 0 || this.queueIndex >= this.queue.length - 1) return;
		this.queueIndex += 1;
		const next = this.queue[this.queueIndex];
		if (next !== void 0) this.play(next);
	}
	toggle() {
		if (this.song === null) return;
		if (this.audio.paused) this.audio.play().catch(() => void 0);
		else this.audio.pause();
	}
	/** Set audio volume (0..1). */
	setVolume(volume) {
		const next = Number.isFinite(volume) ? Math.min(1, Math.max(0, volume)) : this.audio.volume;
		if (next === this.audio.volume) return;
		this.audio.volume = next;
		this.state = {
			...this.state,
			volume: next
		};
		this.emit();
	}
	/** Seek to a playback position in seconds. */
	seek(time) {
		if (!Number.isFinite(time)) return;
		const max = Number.isFinite(this.audio.duration) ? this.audio.duration : time;
		this.audio.currentTime = Math.min(Math.max(0, time), max);
		this.sync();
	}
	/** Play the next track in the current queue, if any. */
	next() {
		if (this.queue.length === 0 || this.queueIndex < 0 || this.queueIndex >= this.queue.length - 1) return;
		this.queueIndex += 1;
		const next = this.queue[this.queueIndex];
		if (next !== void 0) this.play(next);
	}
	/** Play the previous track, or restart the current one after 3s. */
	previous() {
		if (this.queue.length === 0 || this.queueIndex <= 0) {
			if (this.audio.currentTime > 3) {
				this.audio.currentTime = 0;
				this.sync();
			}
			return;
		}
		if (this.audio.currentTime > 3) {
			this.audio.currentTime = 0;
			this.sync();
			return;
		}
		this.queueIndex -= 1;
		const prev = this.queue[this.queueIndex];
		if (prev !== void 0) this.play(prev);
	}
	stop() {
		this.playSeq += 1;
		this.audio.pause();
		this.audio.removeAttribute("src");
		this.audio.load();
		this.song = null;
		this.lyrics = [];
		this.queue = [];
		this.queueIndex = -1;
		this.state = {
			...EMPTY,
			volume: this.audio.volume
		};
		this.emit();
	}
};
const playback = new PlaybackManager();
let lyricPos = "inline";
const posListeners = /* @__PURE__ */ new Set();
function getLyricPos() {
	return lyricPos;
}
function setLyricPos(pos) {
	if (pos === lyricPos) return;
	lyricPos = pos;
	for (const listener of posListeners) listener();
}
function subscribeLyricPos(listener) {
	posListeners.add(listener);
	return () => posListeners.delete(listener);
}
function initLyricPos(saved) {
	if (saved === "inline" || saved === "end" || saved === "hidden") lyricPos = saved;
}
//#endregion
//#region src/client/NeteasePanel.module.css
var NeteasePanel_module_default = {
	"account": "-pu28G_account",
	"card": "-pu28G_card",
	"cardTitle": "-pu28G_cardTitle",
	"field": "-pu28G_field",
	"fieldLabel": "-pu28G_fieldLabel",
	"hint": "-pu28G_hint",
	"loginBox": "-pu28G_loginBox",
	"nowPlaying": "-pu28G_nowPlaying",
	"pills": "-pu28G_pills",
	"qrBox": "-pu28G_qrBox",
	"qrState": "-pu28G_qrState",
	"row": "-pu28G_row",
	"select": "-pu28G_select",
	"songActive": "-pu28G_songActive",
	"songList": "-pu28G_songList",
	"songMeta": "-pu28G_songMeta",
	"songName": "-pu28G_songName",
	"songRow": "-pu28G_songRow",
	"songTitle": "-pu28G_songTitle",
	"volume": "-pu28G_volume"
};
//#endregion
//#region src/client/NeteasePanel.tsx
const LYRIC_POSITIONS = [
	{
		id: "inline",
		labelKey: "lyricPosInline"
	},
	{
		id: "end",
		labelKey: "lyricPosEnd"
	},
	{
		id: "hidden",
		labelKey: "lyricPosHidden"
	}
];
function fmtTime(ms) {
	if (ms === void 0 || !Number.isFinite(ms)) return "";
	const s = Math.floor(ms / 1e3);
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
function NeteasePanel({ t, lyricPos, onLyricPos, neteaseProxy, onNeteaseProxy, neteaseApiBase, onNeteaseApiBase }) {
	const [account, setAccount] = (0, react.useState)("loading");
	const [qrKey, setQrKey] = (0, react.useState)(null);
	const [qrImg, setQrImg] = (0, react.useState)(null);
	const [qrState, setQrState] = (0, react.useState)("");
	const [polling, setPolling] = (0, react.useState)(false);
	const [playlists, setPlaylists] = (0, react.useState)([]);
	const [playlistId, setPlaylistId] = (0, react.useState)(null);
	const [tracks, setTracks] = (0, react.useState)([]);
	const [daily, setDaily] = (0, react.useState)(null);
	const [hotPlaylists, setHotPlaylists] = (0, react.useState)([]);
	const [hotTracks, setHotTracks] = (0, react.useState)(null);
	const [searchQuery, setSearchQuery] = (0, react.useState)("");
	const [searchResults, setSearchResults] = (0, react.useState)(null);
	const [busy, setBusy] = (0, react.useState)(false);
	const [cookieInput, setCookieInput] = (0, react.useState)("");
	const [toast, setToast] = (0, react.useState)(null);
	const canvasRef = (0, react.useRef)(null);
	const pollTimer = (0, react.useRef)(void 0);
	const mountedRef = (0, react.useRef)(true);
	const [playing, setPlaying] = (0, react.useState)(false);
	const [currentSongId, setCurrentSongId] = (0, react.useState)(null);
	const [volume, setVolume] = (0, react.useState)(playback.getSnapshot().volume);
	(0, react.useEffect)(() => {
		return playback.subscribe(() => {
			const snap = playback.getSnapshot();
			setPlaying(snap.playing);
			setCurrentSongId(snap.song?.id ?? null);
			setVolume(snap.volume);
		});
	}, []);
	(0, react.useEffect)(() => {
		let cancelled = false;
		mountedRef.current = true;
		fetchHotPlaylists().then((list) => {
			if (!cancelled) setHotPlaylists(list);
		}).catch(() => void 0);
		getAccount().then((acc) => {
			if (cancelled) return;
			setAccount(acc);
			if (acc.loggedIn && acc.uid !== void 0) fetchPlaylists(acc.uid).then((list) => {
				if (!cancelled) setPlaylists(list);
			});
		});
		return () => {
			mountedRef.current = false;
			cancelled = true;
			if (pollTimer.current !== void 0) window.clearInterval(pollTimer.current);
		};
	}, []);
	function clearQrPoll() {
		if (pollTimer.current !== void 0) {
			window.clearTimeout(pollTimer.current);
			pollTimer.current = void 0;
		}
		setPolling(false);
	}
	function scheduleQrPoll(key) {
		if (!mountedRef.current) return;
		if (pollTimer.current !== void 0) window.clearTimeout(pollTimer.current);
		setPolling(true);
		pollTimer.current = window.setTimeout(async () => {
			pollTimer.current = void 0;
			if (!mountedRef.current) return;
			try {
				const status = await pollQrLogin(key);
				if (!mountedRef.current) return;
				if (status.code === 803) {
					clearQrPoll();
					setQrKey(null);
					const acc = {
						loggedIn: true,
						nickname: status.nickname
					};
					setAccount(acc);
					setToast(t("lyricLoginOk", { name: status.nickname ?? "" }));
					if (acc.uid === void 0) {
						const fresh = await getAccount();
						if (!mountedRef.current) return;
						setAccount(fresh.loggedIn ? fresh : acc);
						if (fresh.uid !== void 0) fetchPlaylists(fresh.uid).then((list) => {
							if (mountedRef.current) setPlaylists(list);
						});
					}
				} else if (status.code === 802) {
					setQrState(t("lyricQrConfirm"));
					scheduleQrPoll(key);
				} else if (status.code === 800) {
					clearQrPoll();
					setQrState(t("lyricQrExpired"));
				} else scheduleQrPoll(key);
			} catch {
				if (mountedRef.current) scheduleQrPoll(key);
			}
		}, 2e3);
	}
	async function startQrLogin() {
		clearQrPoll();
		setQrKey(null);
		setQrImg(null);
		setBusy(true);
		setQrState(t("lyricQrLoading"));
		try {
			const { key, qrimg } = await requestQrKey();
			if (!mountedRef.current) return;
			setQrKey(key);
			setQrImg(qrimg ?? null);
			if (qrimg === void 0 || qrimg === "") {
				const canvas = canvasRef.current;
				if (canvas !== null) await import_browser.toCanvas(canvas, `https://music.163.com/login?codekey=${key}`, {
					width: 168,
					margin: 1
				});
			}
			if (!mountedRef.current) return;
			setQrState(t("lyricQrScan"));
			scheduleQrPoll(key);
		} catch (err) {
			if (mountedRef.current) setToast(t("lyricQrFail", { error: err instanceof Error ? err.message : String(err) }));
		} finally {
			if (mountedRef.current) setBusy(false);
		}
	}
	function cancelQr() {
		clearQrPoll();
		setQrKey(null);
		setQrImg(null);
	}
	async function doCookieLogin() {
		const cookie = normalizeCookiePaste(cookieInput);
		if (cookie === "") return;
		setBusy(true);
		try {
			const result = await submitCookie(cookie);
			if (result.ok) {
				const acc = {
					loggedIn: true,
					nickname: result.nickname,
					uid: result.uid
				};
				setAccount(acc);
				setCookieInput("");
				setToast(t("lyricLoginOk", { name: result.nickname ?? "" }));
				if (acc.uid !== void 0) fetchPlaylists(acc.uid).then(setPlaylists);
			} else setToast(t("lyricCookieRejected"));
		} catch (err) {
			setToast(t("lyricCookieFail", { error: err instanceof Error ? err.message : String(err) }));
		} finally {
			setBusy(false);
		}
	}
	async function doLogout() {
		await logout();
		setAccount({ loggedIn: false });
		setPlaylists([]);
		setTracks([]);
		setDaily(null);
	}
	async function openPlaylist(id) {
		setPlaylistId(id);
		setDaily(null);
		setBusy(true);
		try {
			setTracks(await fetchPlaylistTracks(id));
		} catch (err) {
			setToast(t("lyricListFail", { error: err instanceof Error ? err.message : String(err) }));
		} finally {
			setBusy(false);
		}
	}
	async function openDaily() {
		setDaily(null);
		setPlaylistId(null);
		setHotTracks(null);
		setSearchResults(null);
		setBusy(true);
		try {
			setDaily(await fetchDailySongs());
		} catch (err) {
			setToast(t("lyricListFail", { error: err instanceof Error ? err.message : String(err) }));
		} finally {
			setBusy(false);
		}
	}
	async function openHotPlaylist(id) {
		setHotTracks(null);
		setDaily(null);
		setPlaylistId(null);
		setSearchResults(null);
		setBusy(true);
		try {
			setHotTracks(await fetchPlaylistTracks(id));
		} catch (err) {
			setToast(t("lyricListFail", { error: err instanceof Error ? err.message : String(err) }));
		} finally {
			setBusy(false);
		}
	}
	async function doSearch() {
		const q = searchQuery.trim();
		if (q === "") return;
		setSearchResults(null);
		setDaily(null);
		setPlaylistId(null);
		setHotTracks(null);
		setBusy(true);
		try {
			setSearchResults(await searchSongs(q));
		} catch (err) {
			setToast(t("lyricListFail", { error: err instanceof Error ? err.message : String(err) }));
		} finally {
			setBusy(false);
		}
	}
	function playSong(song, queue) {
		playback.play(song, queue);
	}
	const songList = searchResults ?? hotTracks ?? daily ?? tracks;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
		className: NeteasePanel_module_default.card,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
				className: NeteasePanel_module_default.cardTitle,
				children: t("lyricTitle")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: NeteasePanel_module_default.row,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: NeteasePanel_module_default.fieldLabel,
					children: t("lyricProxyLabel")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
					className: NeteasePanel_module_default.grow,
					value: neteaseProxy,
					onChange: (e) => onNeteaseProxy(e.target.value.trim())
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: NeteasePanel_module_default.row,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: NeteasePanel_module_default.fieldLabel,
					children: t("lyricApiLabel")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
					className: NeteasePanel_module_default.grow,
					value: neteaseApiBase,
					onChange: (e) => onNeteaseApiBase(e.target.value.trim())
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: NeteasePanel_module_default.row,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: NeteasePanel_module_default.fieldLabel,
					children: t("lyricPosLabel")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: NeteasePanel_module_default.pills,
					children: LYRIC_POSITIONS.map((pos) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
						active: lyricPos === pos.id,
						onClick: () => onLyricPos(pos.id),
						children: t(pos.labelKey)
					}, pos.id))
				})]
			}),
			account === "loading" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: NeteasePanel_module_default.hint,
				children: t("lyricLoading")
			}) : account === null || !account.loggedIn ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: NeteasePanel_module_default.loginBox,
				children: [qrKey === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					variant: "outline",
					disabled: busy,
					onClick: () => void startQrLogin(),
					children: t("lyricQrLogin")
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: NeteasePanel_module_default.qrBox,
					children: [
						qrImg !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
							src: qrImg,
							width: 168,
							height: 168,
							alt: "QR"
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("canvas", {
							ref: canvasRef,
							width: 168,
							height: 168
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: NeteasePanel_module_default.qrState,
							children: qrState
						}),
						polling && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							size: "sm",
							variant: "ghost",
							onClick: cancelQr,
							children: t("lyricQrCancel")
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: NeteasePanel_module_default.row,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
						className: NeteasePanel_module_default.grow,
						placeholder: t("lyricCookiePh"),
						value: cookieInput,
						onChange: (e) => setCookieInput(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter") doCookieLogin();
						}
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						size: "sm",
						variant: "outline",
						disabled: busy || cookieInput.trim() === "",
						onClick: () => void doCookieLogin(),
						children: t("lyricCookieLogin")
					})]
				})]
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: NeteasePanel_module_default.row,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: NeteasePanel_module_default.account,
					children: t("lyricLoggedIn", { name: account.nickname ?? "" })
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					size: "sm",
					variant: "ghost",
					onClick: () => void doLogout(),
					children: t("lyricLogout")
				})]
			}),
			account !== "loading" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: NeteasePanel_module_default.field,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: NeteasePanel_module_default.row,
						children: [
							account !== null && account.loggedIn ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
								className: NeteasePanel_module_default.select,
								value: playlistId ?? "",
								onChange: (e) => {
									const id = Number(e.target.value);
									if (id > 0) openPlaylist(id);
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "",
									children: t("lyricPlaylists")
								}), playlists.map((p) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
									value: p.id,
									children: [
										p.name,
										"（",
										p.trackCount,
										"）"
									]
								}, p.id))]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								variant: "outline",
								disabled: busy,
								onClick: () => void openDaily(),
								children: t("lyricDaily")
							})] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
								className: NeteasePanel_module_default.select,
								value: "",
								onChange: (e) => {
									const id = Number(e.target.value);
									if (id > 0) openHotPlaylist(id);
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "",
									children: t("lyricHot")
								}), hotPlaylists.map((p) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
									value: p.id,
									children: [
										p.name,
										"（",
										p.trackCount,
										"）"
									]
								}, p.id))]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
								className: NeteasePanel_module_default.grow,
								placeholder: t("lyricSearchPh"),
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") doSearch();
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								variant: "outline",
								disabled: busy,
								onClick: () => void doSearch(),
								children: t("lyricSearch")
							})
						]
					}),
					busy && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: NeteasePanel_module_default.hint,
						children: t("lyricLoading")
					}),
					!busy && songList !== null && songList.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: NeteasePanel_module_default.row,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							size: "sm",
							variant: "outline",
							onClick: () => void playback.play(songList[0], songList),
							children: t("lyricPlayAll")
						})
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
						className: NeteasePanel_module_default.songList,
						children: songList.slice(0, 50).map((song) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", {
							className: NeteasePanel_module_default.songRow,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: `${NeteasePanel_module_default.songName}${currentSongId === song.id ? ` ${NeteasePanel_module_default.songActive}` : ""}`,
								onClick: () => playSong(song, songList),
								title: song.album ?? "",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: NeteasePanel_module_default.songTitle,
									children: song.name
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: NeteasePanel_module_default.songMeta,
									children: [song.artists, fmtTime(song.durationMs) !== "" && ` · ${fmtTime(song.durationMs)}`]
								})]
							})
						}, song.id))
					})] })
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: NeteasePanel_module_default.row,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						size: "sm",
						variant: "ghost",
						disabled: playback.getSnapshot().song === null || playback.getSnapshot().queueIndex <= 0,
						onClick: () => playback.previous(),
						title: t("prevTrack"),
						"aria-label": t("prevTrack"),
						children: "⏮"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						size: "sm",
						variant: "ghost",
						disabled: playback.getSnapshot().song === null || playback.getSnapshot().queueIndex < 0 || playback.getSnapshot().queueIndex >= playback.getSnapshot().queue.length - 1,
						onClick: () => playback.next(),
						title: t("nextTrack"),
						"aria-label": t("nextTrack"),
						children: "⏭"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						size: "sm",
						variant: "outline",
						disabled: !playing && playback.getSnapshot().song === null,
						onClick: () => playback.toggle(),
						children: playing ? t("lyricPause") : t("lyricPlay")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						size: "sm",
						variant: "ghost",
						disabled: playback.getSnapshot().song === null,
						onClick: () => playback.stop(),
						children: t("lyricStop")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: NeteasePanel_module_default.volume,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("volumeLabel") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 1,
							step: .05,
							value: volume,
							onChange: (e) => playback.setVolume(Number(e.target.value)),
							"aria-label": t("volumeLabel")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: NeteasePanel_module_default.nowPlaying,
						children: playback.getSnapshot().song !== null ? `${playback.getSnapshot().song.name} - ${playback.getSnapshot().song.artists}` : t("lyricNone")
					})
				]
			}),
			toast !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Toast, {
				text: toast,
				onDone: () => setToast(null)
			})
		]
	});
}
//#endregion
//#region src/client/GlassPanel.tsx
/** The "UI Design" settings section: tune the glass look in real time. */
const BG_TYPES = [
	{
		id: "none",
		labelKey: "bgNone"
	},
	{
		id: "image",
		labelKey: "bgImage"
	},
	{
		id: "video",
		labelKey: "bgVideo"
	}
];
const BG_FITS = [
	{
		id: "cover",
		labelKey: "fitCover"
	},
	{
		id: "contain",
		labelKey: "fitContain"
	},
	{
		id: "original",
		labelKey: "fitOriginal"
	}
];
const ANIM_LEVELS = [
	{
		id: "none",
		labelKey: "animNone"
	},
	{
		id: "soft",
		labelKey: "animSoft"
	},
	{
		id: "strong",
		labelKey: "animStrong"
	}
];
function mediaName(url) {
	const name = url.split("/").pop() ?? url;
	return name.length > 36 ? `${name.slice(0, 33)}…` : name;
}
function GlassPanel({ t, engine }) {
	const [config, setConfig] = (0, react.useState)({ ...DEFAULT_CONFIG });
	const [saveState, setSaveState] = (0, react.useState)("idle");
	const [uploading, setUploading] = (0, react.useState)(null);
	const [toast, setToast] = (0, react.useState)(null);
	const saveTimer = (0, react.useRef)(void 0);
	/** monotonically increasing save id — a stale save response must not
	*  overwrite newer local edits (the debounce only gates the request). */
	const saveSeq = (0, react.useRef)(0);
	const imageInput = (0, react.useRef)(null);
	const videoInput = (0, react.useRef)(null);
	const fontInput = (0, react.useRef)(null);
	const importInput = (0, react.useRef)(null);
	(0, react.useEffect)(() => {
		let cancelled = false;
		loadConfig().then((cfg) => {
			if (cancelled) return;
			setConfig(cfg);
			engine.apply(cfg);
		}).catch(() => {
			if (cancelled) return;
			engine.apply({ ...DEFAULT_CONFIG });
		});
		return () => {
			cancelled = true;
			window.clearTimeout(saveTimer.current);
		};
	}, []);
	/** Apply a change immediately, persist it debounced. */
	function update(next) {
		setConfig(next);
		engine.apply(next);
		setSaveState("saving");
		window.clearTimeout(saveTimer.current);
		const seq = ++saveSeq.current;
		saveTimer.current = window.setTimeout(() => {
			saveConfig(next).then((saved) => {
				if (seq !== saveSeq.current) return;
				setConfig(saved);
			}).then(() => {
				if (seq !== saveSeq.current) return;
				setSaveState("saved");
			}).catch((err) => {
				if (seq !== saveSeq.current) return;
				setSaveState("fail");
				setToast(t("saveFail", { error: err instanceof Error ? err.message : String(err) }));
			});
		}, 600);
	}
	async function onUpload(file, kind) {
		setUploading(kind);
		try {
			const { url } = await uploadMedia(file, kind);
			if (kind === "font") update({
				...config,
				fontUrl: url,
				font: `'${CUSTOM_FONT_FAMILY}', sans-serif`
			});
			else if (kind === "image") {
				const bgImages = config.bgImages.includes(url) ? config.bgImages : [...config.bgImages, url];
				update({
					...config,
					bgType: "image",
					bgImage: url,
					bgImages,
					bgVideo: ""
				});
			} else update({
				...config,
				bgType: "video",
				bgVideo: url
			});
		} catch (err) {
			setToast(t("uploadFail", { error: err instanceof Error ? err.message : String(err) }));
		} finally {
			setUploading(null);
		}
	}
	function pickFile(ref, kind) {
		const input = ref.current;
		if (input === null) return;
		input.accept = kind === "image" ? "image/jpeg,image/png,image/webp,image/gif,image/avif" : kind === "video" ? "video/mp4,video/webm,video/quicktime" : "font/woff2,font/woff,font/ttf,font/otf,.woff2,.woff,.ttf,.otf";
		input.onchange = () => {
			const file = input.files?.[0];
			if (file !== void 0) onUpload(file, kind);
			input.value = "";
		};
		input.click();
	}
	async function removeImage(url) {
		const bgImages = config.bgImages.filter((u) => u !== url);
		const next = {
			...config,
			bgImages,
			bgImage: bgImages[0] ?? ""
		};
		if (next.bgImage === "") next.bgType = "none";
		try {
			await deleteMedia(url);
		} catch {}
		update(next);
	}
	async function removeBackground() {
		const next = {
			...config,
			bgType: "none"
		};
		const urls = [...config.bgImages, config.bgVideo].filter((u) => u !== "");
		for (const url of urls) try {
			await deleteMedia(url);
		} catch {}
		next.bgImage = "";
		next.bgImages = [];
		next.bgVideo = "";
		update(next);
	}
	async function removeFont() {
		if (config.fontUrl !== "") try {
			await deleteMedia(config.fontUrl);
		} catch {}
		update({
			...config,
			fontUrl: "",
			font: ""
		});
	}
	function reset() {
		window.clearTimeout(saveTimer.current);
		const next = { ...DEFAULT_CONFIG };
		setLyricPos(next.lyricPos);
		saveConfig(next).then(() => {
			setConfig(next);
			engine.apply(next);
			setSaveState("saved");
			setToast(t("resetDone"));
		}).catch((err) => {
			setToast(t("saveFail", { error: err instanceof Error ? err.message : String(err) }));
		});
	}
	function exportConfig() {
		const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "dsh-glass-ui-config.json";
		a.click();
		URL.revokeObjectURL(url);
	}
	async function onImportFile(file) {
		try {
			const next = normalizeConfig(JSON.parse(await file.text()));
			setLyricPos(next.lyricPos);
			await saveConfig(next);
			setConfig(next);
			engine.apply(next);
			setSaveState("saved");
			setToast(t("importDone"));
		} catch (err) {
			setToast(t("importFail", { error: err instanceof Error ? err.message : String(err) }));
		}
	}
	const hasBg = config.bgImage !== "" || config.bgVideo !== "";
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: GlassPanel_module_default.panel,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: GlassPanel_module_default.card,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
						className: GlassPanel_module_default.cardTitle,
						children: t("glassTitle")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: GlassPanel_module_default.field,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: GlassPanel_module_default.fieldHead,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("opacityLabel") }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: GlassPanel_module_default.value,
									children: [Math.round(config.opacity * 100), "%"]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "range",
								className: GlassPanel_module_default.range,
								min: 10,
								max: 95,
								value: Math.round(config.opacity * 100),
								onChange: (e) => update({
									...config,
									opacity: Number(e.target.value) / 100
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: GlassPanel_module_default.hint,
								children: t("opacityHint")
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: GlassPanel_module_default.field,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: GlassPanel_module_default.fieldHead,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("blurLabel") }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: GlassPanel_module_default.value,
									children: [config.blur, "px"]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "range",
								className: GlassPanel_module_default.range,
								min: 4,
								max: 40,
								value: config.blur,
								onChange: (e) => update({
									...config,
									blur: Number(e.target.value)
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: GlassPanel_module_default.hint,
								children: t("blurHint")
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: GlassPanel_module_default.card,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
						className: GlassPanel_module_default.cardTitle,
						children: t("fontTitle")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: GlassPanel_module_default.pills,
						children: FONT_PRESETS.map((preset) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
							active: config.font === preset.id,
							onClick: () => update({
								...config,
								font: preset.id
							}),
							children: preset.label
						}, preset.label))
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: GlassPanel_module_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
							className: GlassPanel_module_default.grow,
							placeholder: t("fontCustomPlaceholder"),
							value: config.font.includes("GlassCustomFont") ? "" : config.font.replaceAll("'", ""),
							onChange: (e) => update({
								...config,
								font: e.target.value.trim()
							})
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							size: "sm",
							variant: "outline",
							disabled: uploading === "font",
							onClick: () => pickFile(fontInput, "font"),
							children: uploading === "font" ? t("fontUploading") : t("fontUpload")
						})]
					}),
					config.fontUrl !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: GlassPanel_module_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: GlassPanel_module_default.fileName,
							children: t("fontUploaded", { name: mediaName(config.fontUrl) })
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => void removeFont(),
							children: t("fontRemove")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						ref: fontInput,
						type: "file",
						hidden: true
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: GlassPanel_module_default.card,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
						className: GlassPanel_module_default.cardTitle,
						children: t("bgTitle")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: GlassPanel_module_default.pills,
						children: BG_TYPES.map((type) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
							active: config.bgType === type.id,
							onClick: () => update({
								...config,
								bgType: type.id
							}),
							children: t(type.labelKey)
						}, type.id))
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: GlassPanel_module_default.row,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								variant: "outline",
								disabled: uploading === "image",
								onClick: () => pickFile(imageInput, "image"),
								children: uploading === "image" ? t("fontUploading") : t("bgUploadImage")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								variant: "outline",
								disabled: uploading === "video",
								onClick: () => pickFile(videoInput, "video"),
								children: uploading === "video" ? t("fontUploading") : t("bgUploadVideo")
							}),
							hasBg && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => void removeBackground(),
								children: t("bgRemove")
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: GlassPanel_module_default.hint,
						children: t("bgTypeHint")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						ref: imageInput,
						type: "file",
						hidden: true
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						ref: videoInput,
						type: "file",
						hidden: true
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: GlassPanel_module_default.field,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: GlassPanel_module_default.fieldHead,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("maskLabel") }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: GlassPanel_module_default.value,
									children: [Math.round(config.bgMask * 100), "%"]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "range",
								className: GlassPanel_module_default.range,
								min: 0,
								max: 70,
								value: Math.round(config.bgMask * 100),
								onChange: (e) => update({
									...config,
									bgMask: Number(e.target.value) / 100
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: GlassPanel_module_default.hint,
								children: t("maskHint")
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: GlassPanel_module_default.field,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: GlassPanel_module_default.fieldLabel,
							children: t("fitLabel")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: GlassPanel_module_default.pills,
							children: BG_FITS.map((fit) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
								active: config.bgFit === fit.id,
								onClick: () => update({
									...config,
									bgFit: fit.id
								}),
								children: t(fit.labelKey)
							}, fit.id))
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: GlassPanel_module_default.toggleRow,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: config.bgRotate,
								onChange: (e) => update({
									...config,
									bgRotate: e.target.checked
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("rotateLabel") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: GlassPanel_module_default.hint,
								children: t("rotateHint")
							})
						]
					}),
					config.bgRotate && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: GlassPanel_module_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: GlassPanel_module_default.fieldLabel,
							children: t("rotateInterval")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
							className: GlassPanel_module_default.interval,
							type: "number",
							min: 5,
							max: 300,
							value: String(config.bgRotateInterval),
							onChange: (e) => {
								const n = Number(e.target.value);
								if (Number.isFinite(n) && n >= 5 && n <= 300) update({
									...config,
									bgRotateInterval: n
								});
							}
						})]
					}),
					config.bgImages.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: GlassPanel_module_default.field,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: GlassPanel_module_default.fieldLabel,
							children: t("imagesLabel")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
							className: GlassPanel_module_default.imageList,
							children: config.bgImages.map((url) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
								className: GlassPanel_module_default.imageRow,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: GlassPanel_module_default.imageName,
									"data-active": url === config.bgImage || void 0,
									title: t("setCurrent"),
									onClick: () => update({
										...config,
										bgType: "image",
										bgImage: url,
										bgVideo: ""
									}),
									children: [mediaName(url), url === config.bgImage && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("em", { children: t("currentBadge") })]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => void removeImage(url),
									children: t("removeImage")
								})]
							}, url))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: GlassPanel_module_default.card,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
						className: GlassPanel_module_default.cardTitle,
						children: t("animTitle")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: GlassPanel_module_default.pills,
						children: ANIM_LEVELS.map((level) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
							active: config.animLevel === level.id,
							onClick: () => update({
								...config,
								animLevel: level.id
							}),
							children: t(level.labelKey)
						}, level.id))
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: GlassPanel_module_default.hint,
						children: t("animHint")
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NeteasePanel, {
				t,
				lyricPos: config.lyricPos,
				onLyricPos: (pos) => {
					setLyricPos(pos);
					update({
						...config,
						lyricPos: pos
					});
				},
				neteaseProxy: config.neteaseProxy,
				onNeteaseProxy: (proxy) => update({
					...config,
					neteaseProxy: proxy
				}),
				neteaseApiBase: config.neteaseApiBase,
				onNeteaseApiBase: (base) => update({
					...config,
					neteaseApiBase: base
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: GlassPanel_module_default.card,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
						className: GlassPanel_module_default.cardTitle,
						children: t("customCssTitle")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
						className: GlassPanel_module_default.cssArea,
						placeholder: t("customCssPlaceholder"),
						spellCheck: false,
						value: config.customCss,
						onChange: (e) => update({
							...config,
							customCss: e.target.value
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: GlassPanel_module_default.hint,
						children: t("customCssHint")
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: GlassPanel_module_default.card,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
						className: GlassPanel_module_default.cardTitle,
						children: t("transferTitle")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: GlassPanel_module_default.row,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								onClick: exportConfig,
								children: t("exportButton")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								onClick: () => importInput.current?.click(),
								children: t("importButton")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								onClick: () => void reset(),
								children: t("resetButton")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: GlassPanel_module_default.saveState,
								"data-state": saveState,
								children: [
									saveState === "saving" && t("saving"),
									saveState === "saved" && t("saved"),
									saveState === "fail" && t("saveFail", { error: "…" })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						ref: importInput,
						type: "file",
						accept: "application/json,.json",
						hidden: true,
						onChange: (e) => {
							const file = e.target.files?.[0];
							if (file !== void 0) onImportFile(file);
							e.target.value = "";
						}
					})
				]
			}),
			toast !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Toast, {
				text: toast,
				onDone: () => setToast(null)
			})
		]
	});
}
//#endregion
//#region src/client/LyricsLine.module.css
var LyricsLine_module_default = {
	"icon": "kclPIa_icon",
	"line": "kclPIa_line",
	"root": "kclPIa_root",
	"sep": "kclPIa_sep",
	"title": "kclPIa_title"
};
//#endregion
//#region src/client/LyricsLine.tsx
/**
* The lyric line rendered in the composer dock, level with the stats row.
* The slot renderer injects a `t` bound to this entry's locale namespace
* (registered via `locale: NS`); it is optional here only for type safety.
*/
function LyricsLine({ t }) {
	const state = (0, react.useSyncExternalStore)(playback.subscribe, playback.getSnapshot);
	const pos = (0, react.useSyncExternalStore)(subscribeLyricPos, getLyricPos);
	if (pos === "hidden") return null;
	if (state.song === null) return null;
	const title = `${state.song.name} - ${state.song.artists || (t !== void 0 ? t("lyricUnknownArtist") : "未知歌手")}`;
	const line = state.loading ? t !== void 0 ? t("lyricLoading") : "加载中…" : state.error !== null ? t !== void 0 ? t(state.error) : "该歌曲暂不可播放（版权/VIP 限制）" : state.currentLine !== null ? state.currentLine.text : state.playing ? "♪" : t !== void 0 ? t("lyricPaused") : "已暂停";
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
		className: LyricsLine_module_default.root,
		"data-pos": pos,
		title: `${title}\n${line}`,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: LyricsLine_module_default.icon,
				children: state.playing ? "♪" : "⏸"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: LyricsLine_module_default.title,
				children: title
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: LyricsLine_module_default.sep,
				children: "·"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: LyricsLine_module_default.line,
				children: line
			})
		]
	});
}
//#endregion
//#region src/client/musicControls.ts
/**
* Lightweight DOM music controls that sit below the session-log button.
*
* We intentionally keep this outside React: the DSH slot API does not expose a
* dedicated slot for this position in every version, so this mounts a small
* player card near the session-log trigger (or as a fixed bottom-left fallback
* while the trigger is still mounting).
*/
const CONTAINER_CLASS = "dsh-glass-music-controls";
const FIXED_CLASS = "dsh-glass-music-controls--fixed";
function findSessionLogButton() {
	for (const selector of [
		"button[aria-label=\"Session log\"]",
		"button[aria-label=\"Session Log\"]",
		"button[aria-label=\"session log\"]",
		"button[aria-label*=\"session log\"]",
		"button[aria-label*=\"Session Log\"]",
		"button[aria-label=\"会话日志\"]",
		"button[aria-label*=\"会话日志\"]",
		"button[title=\"Session log\"]",
		"button[title=\"Session Log\"]",
		"button[title*=\"session log\"]",
		"button[title*=\"Session Log\"]",
		"button[title=\"会话日志\"]",
		"button[title*=\"会话日志\"]",
		"[data-testid=\"session-log\"]",
		"[data-testid=\"session_log\"]",
		".session-log"
	]) {
		const el = document.querySelector(selector);
		if (el !== null) return el;
	}
	return Array.from(document.querySelectorAll("button, [role=\"button\"]")).find((el) => {
		const text = (el.textContent ?? "").toLowerCase();
		return text.includes("session log") || text.includes("会话日志") || text.includes("会话记录");
	}) ?? null;
}
function createButton(label, title) {
	const button = document.createElement("button");
	button.type = "button";
	button.textContent = label;
	button.title = title;
	button.setAttribute("aria-label", title);
	return button;
}
function formatTime(seconds) {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
	const s = Math.floor(seconds);
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
/**
* Mount the player card below the session-log button and return a disposer.
* The card is visible whenever a song is loaded (playing or paused).
*/
function mountMusicControls(t) {
	const container = document.createElement("div");
	container.className = CONTAINER_CLASS;
	container.style.display = "none";
	const coverWrap = document.createElement("div");
	coverWrap.className = "dsh-glass-music-cover";
	const coverPlaceholder = document.createElement("span");
	coverPlaceholder.className = "dsh-glass-music-cover-placeholder";
	coverPlaceholder.textContent = "♪";
	const coverImg = document.createElement("img");
	coverImg.alt = "";
	coverImg.addEventListener("error", () => {
		coverImg.style.display = "none";
		coverPlaceholder.style.display = "flex";
	});
	coverWrap.append(coverImg, coverPlaceholder);
	const progressWrap = document.createElement("div");
	progressWrap.className = "dsh-glass-music-progress";
	const progressInput = document.createElement("input");
	progressInput.type = "range";
	progressInput.min = "0";
	progressInput.max = "1000";
	progressInput.step = "1";
	progressInput.value = "0";
	progressInput.setAttribute("aria-label", "Progress");
	const timeWrap = document.createElement("div");
	timeWrap.className = "dsh-glass-music-times";
	const currentTime = document.createElement("span");
	currentTime.className = "dsh-glass-music-time-current";
	currentTime.textContent = "0:00";
	const totalTime = document.createElement("span");
	totalTime.className = "dsh-glass-music-time-total";
	totalTime.textContent = "0:00";
	timeWrap.append(currentTime, totalTime);
	progressWrap.append(progressInput, timeWrap);
	const controls = document.createElement("div");
	controls.className = "dsh-glass-music-buttons";
	const prevButton = createButton("⏮", t("prevTrack"));
	const toggleButton = createButton("⏸", t("lyricPause"));
	const nextButton = createButton("⏭", t("nextTrack"));
	const volumeWrap = document.createElement("label");
	volumeWrap.className = "dsh-glass-volume";
	volumeWrap.title = t("volumeLabel");
	const volumeIcon = document.createElement("span");
	volumeIcon.textContent = "🔊";
	const volumeInput = document.createElement("input");
	volumeInput.type = "range";
	volumeInput.min = "0";
	volumeInput.max = "1";
	volumeInput.step = "0.05";
	volumeInput.value = String(playback.getSnapshot().volume);
	volumeInput.setAttribute("aria-label", t("volumeLabel"));
	volumeWrap.append(volumeIcon, volumeInput);
	controls.append(prevButton, toggleButton, nextButton, volumeWrap);
	container.append(coverWrap, progressWrap, controls);
	const disposers = [];
	const update = () => {
		const snap = playback.getSnapshot();
		const visible = snap.song !== null;
		container.style.display = visible ? "flex" : "none";
		const cover = snap.song?.cover ?? "";
		if (cover !== "") {
			coverImg.src = cover;
			coverImg.style.display = "block";
			coverPlaceholder.style.display = "none";
		} else {
			coverImg.removeAttribute("src");
			coverImg.style.display = "none";
			coverPlaceholder.style.display = "flex";
		}
		const duration = Number.isFinite(snap.duration) ? snap.duration : 0;
		const progress = duration > 0 ? Math.min(1e3, Math.max(0, snap.time / duration * 1e3)) : 0;
		if (document.activeElement !== progressInput) progressInput.value = String(Math.round(progress));
		currentTime.textContent = formatTime(snap.time);
		totalTime.textContent = formatTime(duration);
		progressInput.disabled = duration <= 0;
		toggleButton.textContent = snap.playing ? "⏸" : "▶";
		toggleButton.title = snap.playing ? t("lyricPause") : t("lyricPlay");
		toggleButton.setAttribute("aria-label", toggleButton.title);
		prevButton.disabled = !visible || snap.queueIndex <= 0;
		nextButton.disabled = !visible || snap.queueIndex < 0 || snap.queueIndex >= snap.queue.length - 1;
		if (document.activeElement !== volumeInput) volumeInput.value = String(snap.volume);
	};
	const unsub = playback.subscribe(update);
	disposers.push(unsub);
	prevButton.addEventListener("click", () => playback.previous());
	nextButton.addEventListener("click", () => playback.next());
	toggleButton.addEventListener("click", () => playback.toggle());
	volumeInput.addEventListener("input", () => playback.setVolume(Number(volumeInput.value)));
	progressInput.addEventListener("input", () => {
		const snap = playback.getSnapshot();
		const duration = Number.isFinite(snap.duration) ? snap.duration : 0;
		if (duration > 0) playback.seek(Number(progressInput.value) / 1e3 * duration);
	});
	const tryAttach = () => {
		const sessionLog = findSessionLogButton();
		if (sessionLog === null) return false;
		const rect = sessionLog.getBoundingClientRect();
		container.style.position = "fixed";
		container.style.top = `${rect.bottom + 30}px`;
		const cardWidth = container.offsetWidth || 180;
		const maxLeft = window.innerWidth - cardWidth - 8;
		container.style.left = `${Math.max(8, Math.min(rect.left, maxLeft))}px`;
		container.style.zIndex = "1000";
		if (container.parentElement !== document.body) document.body.appendChild(container);
		container.classList.add(FIXED_CLASS);
		return true;
	};
	if (!tryAttach()) {
		document.body.appendChild(container);
		container.style.position = "fixed";
		container.style.top = "56px";
		container.style.left = "12px";
		container.style.zIndex = "1000";
		container.classList.add(FIXED_CLASS);
		const retryTimer = window.setInterval(() => {
			if (tryAttach()) window.clearInterval(retryTimer);
		}, 500);
		const timeout = window.setTimeout(() => window.clearInterval(retryTimer), 1e4);
		disposers.push(() => {
			window.clearInterval(retryTimer);
			window.clearTimeout(timeout);
		});
	}
	const reposition = () => {
		if (!tryAttach()) {
			document.body.appendChild(container);
			container.style.position = "fixed";
			container.style.top = "56px";
			container.style.left = "12px";
			container.style.zIndex = "1000";
			container.classList.add(FIXED_CLASS);
		}
	};
	window.addEventListener("scroll", reposition, true);
	window.addEventListener("resize", reposition);
	disposers.push(() => {
		window.removeEventListener("scroll", reposition, true);
		window.removeEventListener("resize", reposition);
	});
	const keepAlive = window.setInterval(() => {
		if (!container.isConnected) {
			if (!tryAttach()) {
				document.body.appendChild(container);
				container.style.position = "fixed";
				container.style.top = "56px";
				container.style.left = "12px";
				container.style.zIndex = "1000";
				container.classList.add(FIXED_CLASS);
			}
		}
	}, 2e3);
	disposers.push(() => window.clearInterval(keepAlive));
	update();
	return () => {
		for (const dispose of disposers.splice(0)) dispose();
		container.remove();
	};
}
//#endregion
//#region src/client/index.ts
/**
* dsh-glass-ui browser half.
*
* Registers the glass look:
*  1. the compiled glass.css ships inside this bundle — the build script
*     wraps it in a style-injection preamble that runs before apply();
*  2. overrides the core surface tokens to translucent glass values
*     (via ctx.theme.overrideTokens — values are var() references so the
*     opacity slider only touches :root variables);
*  3. runs the GlassEngine (background layer, fonts, root variables);
*  4. registers a "UI Design" section in the Settings dialog.
*
* Everything is fiber-owned: dispose() tears the glass off cleanly.
*/
const NS = "dsh-glass-ui";
const name = NS;
const inject = [
	"slots",
	"locale",
	"theme"
];
/**
* The translucent surface tokens. Values are var() references resolved on
* :root, so slider changes never need to re-run overrideTokens.
*/
const GLASS_TOKENS = {
	"--dsw-alias-bg-base": {
		light: "var(--glass-surface-light)",
		dark: "var(--glass-surface-dark)"
	},
	"--dsw-alias-bg-layer-1": {
		light: "var(--glass-surface-light)",
		dark: "var(--glass-surface-dark)"
	},
	"--dsw-alias-bg-layer-2": {
		light: "var(--glass-surface-light)",
		dark: "var(--glass-surface-dark)"
	},
	"--dsw-alias-bg-layer-3": {
		light: "var(--glass-surface-light)",
		dark: "var(--glass-surface-dark)"
	},
	"--dsw-alias-bg-module-platform": {
		light: "var(--glass-surface-light)",
		dark: "var(--glass-surface-dark)"
	},
	"--dsw-specific-sidebar-fill": {
		light: "var(--glass-surface-light)",
		dark: "var(--glass-surface-dark)"
	},
	"--dsw-alias-bg-overlay": {
		light: "rgba(250, 250, 252, 0.92)",
		dark: "rgba(22, 22, 30, 0.93)"
	},
	"--dsw-specific-menu": {
		light: "rgba(250, 250, 252, 0.92)",
		dark: "rgba(22, 22, 30, 0.93)"
	},
	"--dsw-alias-border-l1": {
		light: "rgba(0, 0, 0, 0.07)",
		dark: "rgba(255, 255, 255, 0.09)"
	},
	"--dsw-alias-border-l2": {
		light: "rgba(0, 0, 0, 0.12)",
		dark: "rgba(255, 255, 255, 0.14)"
	},
	"--dsw-alias-brand-primary": {
		light: "rgba(65, 118, 230, 0.92)",
		dark: "rgba(126, 168, 255, 0.94)"
	}
};
function apply(ctx) {
	const engine = new GlassEngine();
	ctx.effect(() => ctx.theme.overrideTokens(NS, GLASS_TOKENS), "dsh-glass-ui: surface tokens");
	ctx.effect(() => {
		let disposed = false;
		loadConfig().then((config) => {
			if (disposed) return;
			initLyricPos(config.lyricPos);
			engine.apply(config);
		}).catch(() => {
			if (!disposed) engine.apply({ ...DEFAULT_CONFIG });
		});
		return () => {
			disposed = true;
			engine.dispose();
		};
	}, "dsh-glass-ui: glass engine");
	ctx.effect(() => ctx.locale.register(NS, {
		zh,
		en
	}), "dsh-glass-ui: dictionaries");
	const t = ctx.locale.bind(NS);
	ctx.effect(() => mountMusicControls(t), "dsh-glass-ui: music controls");
	ctx.slots.inject("conversation.composer.dock", () => ctx.slots.register({
		name: "conversation.composer.dock",
		id: "dsh-glass-lyrics",
		order: 5,
		locale: NS
	}, () => (0, react.createElement)(LyricsLine)));
	ctx.slots.inject("settings.section", () => ctx.slots.register({
		name: "settings.section",
		id: "glass-ui",
		order: 80,
		label: () => t("nav"),
		locale: NS,
		inject: () => ({ t })
	}, () => (0, react.createElement)(GlassPanel, {
		t,
		engine
	})));
}
//#endregion
exports.apply = apply;
exports.inject = inject;
exports.name = name;

return module.exports;
}});

//# sourceMappingURL=index.cjs.map