class Footer extends HTMLElement{
    constructor(){
        super();
        this.shadow = this.attachShadow({mode : "open"}); // open or closed (open : can be accessed by js)
    }

    connectedCallback(){
        this.render();
    }

    render(){
        this.shadow.innerHTML = `<footer>
                                    <div class="container">
                                        <div class="col-12">
                                            <p>Copyright : IMDb@2021</p>
                                        </div>
                                    </div>
                                </footer>`;
    }
}

customElements.define('custom-footer', Footer);