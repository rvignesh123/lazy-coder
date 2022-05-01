/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*****************************!*\
  !*** ./src/main/preload.ts ***!
  \*****************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const electron_1 = __webpack_require__(/*! electron */ "electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        myPing() {
            electron_1.ipcRenderer.send('ipc-example', 'ping');
        },
        sendGetConfigList(scriptType) {
            electron_1.ipcRenderer.send('get-config-list', scriptType);
        },
        sendGetScripts() {
            electron_1.ipcRenderer.send('get-scripts');
        },
        createConfigIpc(request) {
            electron_1.ipcRenderer.send('create-config', request);
        },
        sendSaveConfigDetail(request) {
            electron_1.ipcRenderer.send('save-config', request);
        },
        sendGetConfig(fileName) {
            electron_1.ipcRenderer.send('get-config', fileName);
        },
        on(channel, func) {
            const validChannels = [
                'ipc-example',
                'get-config-list',
                'get-config',
                'get-scripts',
                'create-config',
                'save-config',
            ];
            if (validChannels.includes(channel)) {
                const subscription = (_event, ...args) => func(...args);
                // Deliberately strip event as it includes `sender`
                electron_1.ipcRenderer.on(channel, subscription);
                return () => electron_1.ipcRenderer.removeListener(channel, subscription);
            }
            return undefined;
        },
        once(channel, func) {
            const validChannels = [
                'ipc-example',
                'get-config-list',
                'get-config',
                'get-scripts',
                'create-config',
                'save-config',
            ];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                electron_1.ipcRenderer.once(channel, (_event, ...args) => func(...args));
            }
        },
    },
});

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbG9hZC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7OztBQ3RCQSxtRUFBd0U7QUFFeEUsd0JBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUU7SUFDMUMsV0FBVyxFQUFFO1FBQ1gsTUFBTTtZQUNKLHNCQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMxQyxDQUFDO1FBQ0QsaUJBQWlCLENBQUMsVUFBa0I7WUFDbEMsc0JBQVcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUNELGNBQWM7WUFDWixzQkFBVyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBQ0QsZUFBZSxDQUFDLE9BQWU7WUFDN0Isc0JBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFDRCxvQkFBb0IsQ0FBQyxPQUFlO1lBQ2xDLHNCQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBQ0QsYUFBYSxDQUFDLFFBQWdCO1lBQzVCLHNCQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBQ0QsRUFBRSxDQUFDLE9BQWUsRUFBRSxJQUFrQztZQUNwRCxNQUFNLGFBQWEsR0FBRztnQkFDcEIsYUFBYTtnQkFDYixpQkFBaUI7Z0JBQ2pCLFlBQVk7Z0JBQ1osYUFBYTtnQkFDYixlQUFlO2dCQUNmLGFBQWE7YUFDZCxDQUFDO1lBQ0YsSUFBSSxhQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNuQyxNQUFNLFlBQVksR0FBRyxDQUFDLE1BQXdCLEVBQUUsR0FBRyxJQUFlLEVBQUUsRUFBRSxDQUNwRSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztnQkFDaEIsbURBQW1EO2dCQUNuRCxzQkFBVyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBRXRDLE9BQU8sR0FBRyxFQUFFLENBQUMsc0JBQVcsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO2FBQ2hFO1lBRUQsT0FBTyxTQUFTLENBQUM7UUFDbkIsQ0FBQztRQUNELElBQUksQ0FBQyxPQUFlLEVBQUUsSUFBa0M7WUFDdEQsTUFBTSxhQUFhLEdBQUc7Z0JBQ3BCLGFBQWE7Z0JBQ2IsaUJBQWlCO2dCQUNqQixZQUFZO2dCQUNaLGFBQWE7Z0JBQ2IsZUFBZTtnQkFDZixhQUFhO2FBQ2QsQ0FBQztZQUNGLElBQUksYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDbkMsbURBQW1EO2dCQUNuRCxzQkFBVyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDL0Q7UUFDSCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9lbGVjdHJvbi1yZWFjdC1ib2lsZXJwbGF0ZS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9lbGVjdHJvbi1yZWFjdC1ib2lsZXJwbGF0ZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9lbGVjdHJvbi1yZWFjdC1ib2lsZXJwbGF0ZS8uL3NyYy9tYWluL3ByZWxvYWQudHMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IGNvbnRleHRCcmlkZ2UsIGlwY1JlbmRlcmVyLCBJcGNSZW5kZXJlckV2ZW50IH0gZnJvbSAnZWxlY3Ryb24nO1xuXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdlbGVjdHJvbicsIHtcbiAgaXBjUmVuZGVyZXI6IHtcbiAgICBteVBpbmcoKSB7XG4gICAgICBpcGNSZW5kZXJlci5zZW5kKCdpcGMtZXhhbXBsZScsICdwaW5nJyk7XG4gICAgfSxcbiAgICBzZW5kR2V0Q29uZmlnTGlzdChzY3JpcHRUeXBlOiBzdHJpbmcpIHtcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoJ2dldC1jb25maWctbGlzdCcsIHNjcmlwdFR5cGUpO1xuICAgIH0sXG4gICAgc2VuZEdldFNjcmlwdHMoKSB7XG4gICAgICBpcGNSZW5kZXJlci5zZW5kKCdnZXQtc2NyaXB0cycpO1xuICAgIH0sXG4gICAgY3JlYXRlQ29uZmlnSXBjKHJlcXVlc3Q6IG9iamVjdCkge1xuICAgICAgaXBjUmVuZGVyZXIuc2VuZCgnY3JlYXRlLWNvbmZpZycsIHJlcXVlc3QpO1xuICAgIH0sXG4gICAgc2VuZFNhdmVDb25maWdEZXRhaWwocmVxdWVzdDogb2JqZWN0KSB7XG4gICAgICBpcGNSZW5kZXJlci5zZW5kKCdzYXZlLWNvbmZpZycsIHJlcXVlc3QpO1xuICAgIH0sXG4gICAgc2VuZEdldENvbmZpZyhmaWxlTmFtZTogc3RyaW5nKSB7XG4gICAgICBpcGNSZW5kZXJlci5zZW5kKCdnZXQtY29uZmlnJywgZmlsZU5hbWUpO1xuICAgIH0sXG4gICAgb24oY2hhbm5lbDogc3RyaW5nLCBmdW5jOiAoLi4uYXJnczogdW5rbm93bltdKSA9PiB2b2lkKSB7XG4gICAgICBjb25zdCB2YWxpZENoYW5uZWxzID0gW1xuICAgICAgICAnaXBjLWV4YW1wbGUnLFxuICAgICAgICAnZ2V0LWNvbmZpZy1saXN0JyxcbiAgICAgICAgJ2dldC1jb25maWcnLFxuICAgICAgICAnZ2V0LXNjcmlwdHMnLFxuICAgICAgICAnY3JlYXRlLWNvbmZpZycsXG4gICAgICAgICdzYXZlLWNvbmZpZycsXG4gICAgICBdO1xuICAgICAgaWYgKHZhbGlkQ2hhbm5lbHMuaW5jbHVkZXMoY2hhbm5lbCkpIHtcbiAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gKF9ldmVudDogSXBjUmVuZGVyZXJFdmVudCwgLi4uYXJnczogdW5rbm93bltdKSA9PlxuICAgICAgICAgIGZ1bmMoLi4uYXJncyk7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBzdHJpcCBldmVudCBhcyBpdCBpbmNsdWRlcyBgc2VuZGVyYFxuICAgICAgICBpcGNSZW5kZXJlci5vbihjaGFubmVsLCBzdWJzY3JpcHRpb24pO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiBpcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBzdWJzY3JpcHRpb24pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgb25jZShjaGFubmVsOiBzdHJpbmcsIGZ1bmM6ICguLi5hcmdzOiB1bmtub3duW10pID0+IHZvaWQpIHtcbiAgICAgIGNvbnN0IHZhbGlkQ2hhbm5lbHMgPSBbXG4gICAgICAgICdpcGMtZXhhbXBsZScsXG4gICAgICAgICdnZXQtY29uZmlnLWxpc3QnLFxuICAgICAgICAnZ2V0LWNvbmZpZycsXG4gICAgICAgICdnZXQtc2NyaXB0cycsXG4gICAgICAgICdjcmVhdGUtY29uZmlnJyxcbiAgICAgICAgJ3NhdmUtY29uZmlnJyxcbiAgICAgIF07XG4gICAgICBpZiAodmFsaWRDaGFubmVscy5pbmNsdWRlcyhjaGFubmVsKSkge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgc3RyaXAgZXZlbnQgYXMgaXQgaW5jbHVkZXMgYHNlbmRlcmBcbiAgICAgICAgaXBjUmVuZGVyZXIub25jZShjaGFubmVsLCAoX2V2ZW50LCAuLi5hcmdzKSA9PiBmdW5jKC4uLmFyZ3MpKTtcbiAgICAgIH1cbiAgICB9LFxuICB9LFxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=