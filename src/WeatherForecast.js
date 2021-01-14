import { LitElement, html, css } from 'lit-element';

export class WeatherForecast extends LitElement {
  static get properties() {
    return {
      lat: { type: String },
      lon: { type: String },
      apikey: { type: String },
      units: { type: String },
      lang: { type: String },
      iconBase: { type: String },
      exclude: { type: String },

      response: {type: Array},
      days: {type:Number},
      dayClass: {type:String},
      chosenItem: {type:Object},}
    ;
  }

  static get styles() {
    return css`
      :host{
          max-width: 600px;
          display:block;
          margin-left:auto;
          margin-right:auto;
      }
      #weather{
          display:flex;
          position: relative;
          flex-wrap: wrap;
          background:var(--background, #fff);
      }
      .btn-group{
          display: flex;
          justify-content: space-between;
      }
      .btn-group button{
          font-size:1em;
          border:none;
          width:100%;
          padding:1em;
          font-family: Lato, sans-serif;
          background:var(--background-deactived,#f8f8f8)
      }
      .btn-group button.active{
          background: var(--background,#fff);
      }
      daily-forecast{
          background: var(--background,#fff);
          padding:5%;
          box-sizing: border-box;
          display:flex;
          justify-content: center;
          order:2;
      }
      daily-forecast:not(#show){
          cursor:pointer;
      }
      daily-forecast.chosen{
          background:var(--background-chosen, #dff0ff);
      }
      .three daily-forecast:not(#show)
      {
          width:33.3%;
      }

      .five daily-forecast:not(#show)
      {
          width:20%;
      }

      .eight daily-forecast:not(#show)
      {
          width:25%;
      }

      .current daily-forecast:not(#show){
          display:none;
      }
      daily-forecast#show{
          order:1;
          width:100%!important;
          height:auto;
      }
      @media(max-width:367px){
          .five daily-forecast:not(#show):nth-child(3),
          .five daily-forecast:not(#show):nth-child(4),
          .five daily-forecast:not(#show):nth-child(5),
          .five daily-forecast:not(#show):nth-child(6)
          {
              width:33.3%;
          }
          .five daily-forecast:not(#show):first-child,
          .five daily-forecast:not(#show):nth-child(2),
          .five daily-forecast#show~daily-forecast:not(#show):nth-child(3)
          {
              width:50%;
          }
      }
      @media(max-width:300px){
          .btn-group{
              font-size:0.9em;
          }
      }
    `;
  }
  connectedCallback(){
    super.connectedCallback();
    if(!this.units){
      this.units="metric";
    }
    if(!this.lang){
      this.lang="de";
    }
    this.response=[];
    this.chosenItem={};
    this.dayClass="current";
    this.days=1;
    let url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + this.lat + "&lon=" + this.lon + "&exclude=hourly,minutely&appid=" + this.apikey + "&units=" + this.units +"&lang=" + this.lang;
    fetch(url)
      .then(response => response.json()).then(res => {this.response = res.daily;
      console.log(this.response)})
      .catch(err => {
        console.error(err);
      });
  }

  updateDays(e){
    switch(e.target.getAttribute('id')){
      case "current": this.days = 1; break;
      case "three": this.days = 3; break;
      case "five": this.days = 5; break;
      case "eight": this.days = 8; break;
    }
    this.shadowRoot.querySelector(".active").removeAttribute("class");
    e.target.setAttribute("class","active");
    this.dayClass = e.target.getAttribute("id");
  }

  render() {
    let forecasts=[];
    if(this.response.length >0 ){
      for (let i =0; i < this.days; i ++){
        forecasts.push(this.response[i]);
      }
      if(forecasts.indexOf(this.chosenItem)<0 || forecasts.indexOf(this.chosenItem)>this.days){
        this.chosenItem=forecasts[0];
      }
    }
    return html`
        <div class="btn-group">
            <button @click="${(e)=> this.updateDays(e)}" class="active" id="current">Heute</button>
            <button @click="${(e)=> this.updateDays(e)}" id="three">3-Tage</button>
            <button @click="${(e)=> this.updateDays(e)}" id="five">5-Tage</button>
            <button @click="${(e)=> this.updateDays(e)}" id="eight">8-Tage</button>
        </div>
        <div id="weather" class="${this.dayClass}">
            ${forecasts.map(i => html`
            <daily-forecast @click="${()=> {this.chosenItem = i;console.log(this.chosenItem)}}"
                            .data="${i}"
                            iconBase="${this.iconBase}"
                            exclude="${this.exclude}"
                            class="${i == this.chosenItem? "chosen": ""}"></daily-forecast>`)}
            <daily-forecast id="show" .data="${this.chosenItem}" iconBase="${this.iconBase}" exclude="${this.exclude}"></daily-forecast>
        </div>
    `;
  }
}
