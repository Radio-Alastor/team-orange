var e=class{data;wrapper;static get toolbox(){return{title:`Scam Alert`,icon:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" fill="currentColor"/></svg>`}}constructor({data:e}){this.data=e||{},this.wrapper=void 0}static get isReadOnlySupported(){return!0}render(){return this.wrapper=document.createElement(`div`),this.wrapper.classList.add(`scam-alert-tool-wrapper`),this.wrapper.innerHTML=`
        <div class="alert alert-danger border-0 shadow-sm p-4 mb-4" style="border-radius: 1.5rem;">
            <div class="d-flex align-items-center">
                <div class="me-3 fs-1">🚨</div>
                <div>
                    <h4 class="fw-bold mb-1">Think you've been scammed?</h4>
                    <p class="mb-2 text-dark">Don't wait. Every minute counts when protecting your money.</p>
                    <a href="/emergency" class="btn btn-danger fw-bold rounded-pill px-4">GET HELP NOW</a>
                </div>
            </div>
        </div>`,this.wrapper}save(e){return{type:`scam_alert`}}};export{e as default};