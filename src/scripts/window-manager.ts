type Position = {
  left: number;
  top: number;
};

type DragState = {
  windowElement: HTMLElement;
  pointerId: number;
  offsetX: number;
  offsetY: number;
};

class MacWindowManager {
  private layer: HTMLElement | null = null;
  private zIndex = 30;
  private activeWindow: HTMLElement | null = null;
  private dragState: DragState | null = null;
  private clockIntervalId: number | undefined;
  private readonly openWindows = new Map<string, HTMLElement>();

  private readonly clickHandler = (event: MouseEvent): void => {
    this.handleGlobalClick(event);
  };

  private readonly keydownHandler = (event: KeyboardEvent): void => {
    this.handleKeydown(event);
  };

  private readonly pointerMoveHandler = (event: PointerEvent): void => {
    this.handlePointerMove(event);
  };

  private readonly pointerEndHandler = (event: PointerEvent): void => {
    this.stopDrag(event);
  };

  private readonly resizeHandler = (): void => {
    this.keepWindowsInsideViewport();
  };

  public constructor(private readonly root: Document = document) {}

  public init(): void {
    this.layer = this.root.querySelector<HTMLElement>("[data-window-layer]");

    if (!this.layer) {
      return;
    }

    this.root.addEventListener("click", this.clickHandler);
    this.root.addEventListener("keydown", this.keydownHandler);
    window.addEventListener("pointermove", this.pointerMoveHandler);
    window.addEventListener("pointerup", this.pointerEndHandler);
    window.addEventListener("pointercancel", this.pointerEndHandler);
    window.addEventListener("resize", this.resizeHandler);

    this.setupClock();
    this.openDefaultWindows();
  }

  public destroy(): void {
    this.root.removeEventListener("click", this.clickHandler);
    this.root.removeEventListener("keydown", this.keydownHandler);
    window.removeEventListener("pointermove", this.pointerMoveHandler);
    window.removeEventListener("pointerup", this.pointerEndHandler);
    window.removeEventListener("pointercancel", this.pointerEndHandler);
    window.removeEventListener("resize", this.resizeHandler);

    if (this.clockIntervalId) {
      window.clearInterval(this.clockIntervalId);
    }

    this.openWindows.clear();
    this.activeWindow = null;
    this.dragState = null;
  }

  private handleGlobalClick(event: MouseEvent): void {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const closeButton = target.closest<HTMLElement>("[data-window-close]");
    if (closeButton) {
      event.preventDefault();
      const windowElement = closeButton.closest<HTMLElement>("[data-window-id]");
      this.closeWindowFromElement(windowElement);
      return;
    }

    const minimizeButton = target.closest<HTMLElement>("[data-window-minimize]");
    if (minimizeButton) {
      event.preventDefault();
      const windowElement = minimizeButton.closest<HTMLElement>("[data-window-id]");
      if (windowElement) {
        this.toggleMinimize(windowElement);
      }
      return;
    }

    const maximizeButton = target.closest<HTMLElement>("[data-window-maximize]");
    if (maximizeButton) {
      event.preventDefault();
      const windowElement = maximizeButton.closest<HTMLElement>("[data-window-id]");
      if (windowElement) {
        this.toggleMaximize(windowElement);
      }
      return;
    }

    const projectTrigger = target.closest<HTMLElement>("[data-project-open]");
    if (projectTrigger?.dataset.projectOpen) {
      event.preventDefault();
      this.openWindow(`project-${projectTrigger.dataset.projectOpen}`);
      return;
    }

    const windowTrigger = target.closest<HTMLElement>("[data-window-open]");
    if (windowTrigger?.dataset.windowOpen) {
      event.preventDefault();
      this.openWindow(windowTrigger.dataset.windowOpen);
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key !== "Escape" || !this.activeWindow) {
      return;
    }

    const windowId = this.activeWindow.dataset.windowId;

    if (!windowId) {
      return;
    }

    this.closeWindow(windowId);
  }

  private openDefaultWindows(): void {
    const defaultTemplates = this.root.querySelectorAll<HTMLTemplateElement>(
      "template[data-window-template][data-window-default='true']",
    );

    defaultTemplates.forEach((template) => {
      const windowId = template.dataset.windowTemplate;

      if (windowId) {
        this.openWindow(windowId);
      }
    });
  }

  public openWindow(windowId: string): void {
    if (!this.layer) {
      return;
    }

    const existingWindow = this.openWindows.get(windowId);

    if (existingWindow?.isConnected) {
      existingWindow.classList.remove("is-minimized");
      this.bringToFront(existingWindow);
      existingWindow.focus({ preventScroll: true });
      return;
    }

    if (existingWindow && !existingWindow.isConnected) {
      this.openWindows.delete(windowId);
    }

    const template = this.findTemplate(windowId);

    if (!template) {
      console.warn(`No existe una plantilla para la ventana "${windowId}".`);
      return;
    }

    const clonedNode = template.content.firstElementChild?.cloneNode(true);

    if (!(clonedNode instanceof HTMLElement)) {
      console.warn(`La plantilla "${windowId}" no contiene un elemento HTML válido.`);
      return;
    }

    this.layer.appendChild(clonedNode);
    this.registerWindow(clonedNode);
    this.positionWindow(clonedNode);
    this.bringToFront(clonedNode);
    clonedNode.focus({ preventScroll: true });
  }

  private closeWindowFromElement(windowElement: HTMLElement | null): void {
    const windowId = windowElement?.dataset.windowId;

    if (!windowId) {
      return;
    }

    this.closeWindow(windowId);
  }

  private closeWindow(windowId: string): void {
    const windowElement = this.openWindows.get(windowId);

    if (!windowElement) {
      return;
    }

    windowElement.remove();
    this.openWindows.delete(windowId);

    if (this.activeWindow === windowElement) {
      this.activeWindow = null;
    }
  }

  private registerWindow(windowElement: HTMLElement): void {
    const windowId = windowElement.dataset.windowId;

    if (!windowId) {
      throw new Error("Cada ventana necesita un atributo data-window-id.");
    }

    this.openWindows.set(windowId, windowElement);

    windowElement.addEventListener("pointerdown", () => {
      this.bringToFront(windowElement);
    });

    const dragHandle = windowElement.querySelector<HTMLElement>("[data-window-drag-handle]");

    dragHandle?.addEventListener("pointerdown", (event) => {
      this.startDrag(event, windowElement);
    });
  }

  private bringToFront(windowElement: HTMLElement): void {
    this.zIndex += 1;

    this.openWindows.forEach((currentWindow) => {
      currentWindow.classList.toggle("is-active", currentWindow === windowElement);
    });

    windowElement.style.zIndex = String(this.zIndex);
    this.activeWindow = windowElement;
  }

  private toggleMinimize(windowElement: HTMLElement): void {
    this.bringToFront(windowElement);
    windowElement.classList.toggle("is-minimized");
  }

  private toggleMaximize(windowElement: HTMLElement): void {
    this.bringToFront(windowElement);

    const isMaximized = windowElement.classList.contains("is-maximized");

    if (isMaximized) {
      windowElement.classList.remove("is-maximized");

      if (windowElement.dataset.previousLeft && windowElement.dataset.previousTop) {
        windowElement.style.left = windowElement.dataset.previousLeft;
        windowElement.style.top = windowElement.dataset.previousTop;
      }

      delete windowElement.dataset.previousLeft;
      delete windowElement.dataset.previousTop;

      this.keepWindowInsideViewport(windowElement);
      return;
    }

    windowElement.dataset.previousLeft = windowElement.style.left;
    windowElement.dataset.previousTop = windowElement.style.top;

    windowElement.classList.remove("is-minimized");
    windowElement.classList.add("is-maximized");

    this.setPosition(windowElement, this.getEdgeMargin(), this.getTopMargin());
  }

  private startDrag(event: PointerEvent, windowElement: HTMLElement): void {
    if (this.isControlTarget(event.target)) {
      return;
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    if (windowElement.classList.contains("is-maximized")) {
      return;
    }

    const dragHandle = event.currentTarget;

    if (dragHandle instanceof HTMLElement) {
      dragHandle.setPointerCapture(event.pointerId);
    }

    const rect = windowElement.getBoundingClientRect();

    this.dragState = {
      windowElement,
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };

    windowElement.classList.remove("is-minimized");
    windowElement.classList.add("is-dragging");
    this.bringToFront(windowElement);

    event.preventDefault();
  }

  private handlePointerMove(event: PointerEvent): void {
    if (!this.dragState || this.dragState.pointerId !== event.pointerId) {
      return;
    }

    const nextLeft = event.clientX - this.dragState.offsetX;
    const nextTop = event.clientY - this.dragState.offsetY;
    const position = this.clampPosition(this.dragState.windowElement, nextLeft, nextTop);

    this.setPosition(this.dragState.windowElement, position.left, position.top);
  }

  private stopDrag(event: PointerEvent): void {
    if (!this.dragState || this.dragState.pointerId !== event.pointerId) {
      return;
    }

    this.dragState.windowElement.classList.remove("is-dragging");
    this.dragState = null;
  }

  private positionWindow(windowElement: HTMLElement): void {
    const computedStyle = window.getComputedStyle(windowElement);
    const fallbackLeft = Number.parseFloat(computedStyle.getPropertyValue("--window-x")) || 72;
    const fallbackTop = Number.parseFloat(computedStyle.getPropertyValue("--window-y")) || 72;
    const offset = Math.max(this.openWindows.size - 1, 0) * 18;

    const left = this.isSmallViewport() ? this.getEdgeMargin() : fallbackLeft + offset;
    const top = this.isSmallViewport() ? this.getTopMargin() : fallbackTop + offset;

    const position = this.clampPosition(windowElement, left, top);

    this.setPosition(windowElement, position.left, position.top);
  }

  private keepWindowsInsideViewport(): void {
    this.openWindows.forEach((windowElement, windowId) => {
      if (!windowElement.isConnected) {
        this.openWindows.delete(windowId);
        return;
      }

      this.keepWindowInsideViewport(windowElement);
    });
  }

  private keepWindowInsideViewport(windowElement: HTMLElement): void {
    if (windowElement.classList.contains("is-maximized")) {
      this.setPosition(windowElement, this.getEdgeMargin(), this.getTopMargin());
      return;
    }

    const rect = windowElement.getBoundingClientRect();
    const position = this.clampPosition(windowElement, rect.left, rect.top);

    this.setPosition(windowElement, position.left, position.top);
  }

  private clampPosition(windowElement: HTMLElement, left: number, top: number): Position {
    const rect = windowElement.getBoundingClientRect();
    const edgeMargin = this.getEdgeMargin();
    const topMargin = this.getTopMargin();
    const bottomReserve = this.getBottomReserve();

    const maxLeft = Math.max(edgeMargin, window.innerWidth - rect.width - edgeMargin);
    const maxTop = Math.max(topMargin, window.innerHeight - rect.height - bottomReserve);

    return {
      left: Math.min(Math.max(left, edgeMargin), maxLeft),
      top: Math.min(Math.max(top, topMargin), maxTop),
    };
  }

  private setPosition(windowElement: HTMLElement, left: number, top: number): void {
    windowElement.style.left = `${Math.round(left)}px`;
    windowElement.style.top = `${Math.round(top)}px`;
  }

  private findTemplate(windowId: string): HTMLTemplateElement | null {
    const templates = this.root.querySelectorAll<HTMLTemplateElement>(
      "template[data-window-template]",
    );

    return Array.from(templates).find(
      (template) => template.dataset.windowTemplate === windowId,
    ) ?? null;
  }

  private setupClock(): void {
    const clocks = this.root.querySelectorAll<HTMLTimeElement>("[data-clock]");

    if (clocks.length === 0) {
      return;
    }

    const formatter = new Intl.DateTimeFormat("es-MX", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    const updateClock = (): void => {
      const now = new Date();

      clocks.forEach((clock) => {
        clock.dateTime = now.toISOString();
        clock.textContent = formatter.format(now).replace(".", "");
      });
    };

    updateClock();
    this.clockIntervalId = window.setInterval(updateClock, 30_000);
  }

  private isControlTarget(target: EventTarget | null): boolean {
    return target instanceof Element && Boolean(target.closest("[data-window-control]"));
  }

  private isSmallViewport(): boolean {
    return window.matchMedia("(max-width: 820px)").matches;
  }

  private getEdgeMargin(): number {
    return this.isSmallViewport() ? 8 : 16;
  }

  private getTopMargin(): number {
    return this.isSmallViewport() ? 52 : 54;
  }

  private getBottomReserve(): number {
    return this.isSmallViewport() ? 92 : 112;
  }
}

declare global {
  interface Window {
    __portfolioWindowManager?: MacWindowManager;
  }
}

const bootstrapWindowManager = (): void => {
  window.__portfolioWindowManager?.destroy();

  const manager = new MacWindowManager(document);
  manager.init();

  window.__portfolioWindowManager = manager;
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapWindowManager, {
    once: true,
  });
} else {
  bootstrapWindowManager();
}

export {};