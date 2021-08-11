class Header extends HTMLElement{
    constructor(){
        super();
        this.shadow = this.attachShadow({mode : "open"}); // open or closed (open : can be accessed by js)
    }

    get count(){
        return this.getAttribute("count");
    }

    // set count(val){
    //     this.setAttribute("count", val);
    // }

    // static get observeAttributes(){
    //     return ["count"];
    // }

    // attributeChangedCallBack(prop, oldVal, newVal){
    //     if(prop == 'count'){
    //         this.render();
    //     }
    // }

    connectedCallback(){
        this.render();
    }

    render(){
        // const fs = require('fs');
        // let header = fs.readFileSync(`../../header.html`);
        // console.log(header)
        this.shadow.innerHTML = `<h1>Counter</h1>
                                ${this.count}
                                <button id='inc-btn'> Increment </button>
                                <button id='dec-btn'> Decrement </button>`;
    }
}

customElements.define('custom-test', Header);