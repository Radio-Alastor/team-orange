export default class ScamAlertTool {
  data: any;
  wrapper: HTMLElement | undefined;

  static get toolbox() {
    return {
      title: "Scam Alert",
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" fill="currentColor"/></svg>',
    };
  }

  // The tool state is essentially static, so data isn't strict, but EditorJS needs this.
  constructor({ data }: { data: any }) {
    this.data = data || {};
    this.wrapper = undefined;
  }

  // Define properties so Editor.js knows this tool is read-only from the user perspective
  static get isReadOnlySupported() {
    return true;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("scam-alert-tool-wrapper");

    // The HTML content you provided for the "Panic Button" 
    const htmlContent = `
        <div class="alert alert-danger border-0 shadow-sm p-4 mb-4" style="border-radius: 1.5rem;">
            <div class="d-flex align-items-center">
                <div class="me-3 fs-1">🚨</div>
                <div>
                    <h4 class="fw-bold mb-1">Think you've been scammed?</h4>
                    <p class="mb-2 text-dark">Don't wait. Every minute counts when protecting your money.</p>
                    <a href="/emergency" class="btn btn-danger fw-bold rounded-pill px-4">GET HELP NOW</a>
                </div>
            </div>
        </div>`;

    this.wrapper.innerHTML = htmlContent;
    return this.wrapper;
  }

  save(blockContent: HTMLElement) {
    // This is a static block, so we just return an empty object or a marker
    return {
      type: "scam_alert"
    };
  }
}
