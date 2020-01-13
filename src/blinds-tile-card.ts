import { LitElement, html, css, svg } from 'lit-element';

class BlindsTileCard extends LitElement {
  config: any;
  hass: any;
  shadowRoot: any;

  static get properties() {
    return {
      hass: {},
      config: {},
      active: {}
    };
  }
  
  constructor() {
    super();
  }
  
  render() {
    var states = [
      {
          "icon": "mdi:blinds",
          "name": "dicht"
      },
      {
          "icon": "mdi:blinds-open",
          "name": "half open"
      },
      {
          "icon": "mdi:blinds-open",
          "name": "open"
      }
    ];
    var entities = this.config.entities;
    var name = this.config.name;
    var state = this._getState(entities);

    return html`
      <span class="icon on">
        <ha-icon icon="${states[state].icon}" />
      </span>
      <span class="name on">${name}</span>
      <span class="state on">${states[state].name}</span>
    `;
  }
  
  updated() { }

  _getState(entities) {
    for(let i = 0; i< 3;i++) {
      let active = true;
      for(let j in entities) {
        let state = parseInt(this.hass.states[entities[j].entity].state);
        let position = parseInt(entities[j].positions[i]);
        if(state < (position -5) || state > (position + 5)) {
          active = false;
        }
      }

      if(active) {
        return i;
      }
    }
    return 'unavailable';
  }

  setConfig(config) {
    if (!config.name) {
      throw new Error("You need to define a name");
    }
    if (!config.entities) {
      throw new Error("You need to define an entity");
    }
    this.config = config;
  }

  getCardSize() {
    return this.config.entities.length + 1;
  }
  
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .name {
        display:block;
        font-size: 14px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.4);
        width: 100%;
        margin-top: auto;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-wrap:break-word;
        overflow: hidden;
        white-space: normal;
      }
      
      .name.on {
        color: rgba(0, 0, 0, 1);
      }
      
      .state {
        position: relative;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.4);
        text-transform: capitalize;
        float: left;
      }
      .state .previous {
        position: relative;
        margin-left: 5px;
        font-size: 9px;
        color: rgb(134, 134, 134);
        text-transform: lowercase;
      }
      
      .value {
        visibility: hidden;
      }
      
      .value.on {
        visibility: visible;
        position: relative;
        margin-left: 5px;
        font-size: 11px;
        color: rgba(255, 0, 0, 1);
        text-transform: lowercase;
      }
      
      .state.on {
        color: rgba(0, 0, 0, 1);
      }
      .state.unavailable {
        color: rgba(255, 0, 0, 1);
      }
      
      .icon {
        display:block;
        height: 40px;
        width: 40px;
        color: rgba(0, 0, 0, 0.3);
        font-size: 30px;
        padding-top:5px;
      }
      .icon ha-icon {
        width:30px;
        height:30px;
      }
                
      .icon.on {
        color: #f7d959;
      }
    `;
  }
}

customElements.define('blinds-tile-card', BlindsTileCard);