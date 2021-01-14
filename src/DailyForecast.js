import { LitElement, html, css } from 'lit-element';

function getWeekdayName(number){
  let weekdays = ["SO", "MO", "DI", "MI", "DO", "FR", "SA"];
  return weekdays[number];
}

export class DailyForecast extends LitElement {
  static get properties() {
    return {
      data: { type: Object },
      iconBase: { type: String },
      exclude: { type: String },
    };
  }

  static get styles() {
    return css`
      :host{
          max-width: 600px;
          display:block;
          margin-left:auto;
          margin-right:auto;
      }
      .day{
          text-align: center;
          display:flex;
          width:100%;
          align-items: center;
      }
      .day .base{
          width: 100%;
      }
      .day .extra{
          display:none;
      }
      :host(#show) .day .base{
          width:50%;
      }
      :host(#show) .day .extra{
          display: block;
          width:50%;
      }
      .day p{
          margin:0.25em;
          font-size:0.9em;
          text-align: left;
          font-weight: 300;
      }
      .day p#date{
          text-align:center;
          font-size:1.2em;
          margin-top: -5%;
      }
      .day img{
          width:100%;
          height:auto;
          vertical-align: middle;
      }
      .day img.icon{
          width:30px;
          margin-right:5px;
      }
      .day .extra p{
          display:flex;
          align-items: center;
      }
      @media(max-width: 1000px){
          .day p#date{
              font-size:0.9em;
          }
      }
      @media(min-width:992px){
          .day img{
              width:80%
          }
          .day p#date{
              font-size:0.9em;
          }
      }
    `;
  }

  render(){
    let sunrise = new Date(parseInt(this.data.sunrise)*1000);
    let sunset = new Date(parseInt(this.data.sunset)*1000);
    let date =new Date(parseInt(this.data.dt)*1000);
    let tempIcon ="temperature-warm.svg";
    if(parseFloat(this.data.temp.max) >= 25){
      tempIcon = "temperature-hot.svg";
    }
    if(parseFloat(this.data.temp.min) <= 10){
      tempIcon = "temperature-cold.svg";
    }
    return html`
      <div class="day">
        <div class="base">
          <img alt="${this.data.weather[0].description}" id="icon" src="${this.iconBase+this.data.weather[0].icon + ".png"}"/>
          <p id="date">${getWeekdayName(date.getDay())}</p>
        </div>
        <div class="extra">
          <p>
            <img alt="${this.data.weather[0].description}" class="icon" src="${this.iconBase+this.data.weather[0].icon + ".png"}"/>
            ${this.data.weather[0].description}
          </p>
          ${!this.exclude.includes("temperature")?
            html`<p><img alt="Temperature Icon" class="icon" src="${this.iconBase + tempIcon}"/>
              ${this.data.temp.min + "° / " + this.data.temp.max + "°"}
            </p>`
            :""}
          ${!this.exclude.includes("rain")?
            html`<p><img alt="Rain Icon" class="icon" src="${this.iconBase + "rain.svg"}"/>
              ${parseInt(parseFloat(this.data.pop)*100) + "%" +
              (this.data.rain?", " + this.data.rain+"mm":"")
              +(this.data.snow?", Schnee: " + this.data.snow+"mm":"")}
            </p>`
            :""}
          ${!this.exclude.includes("wind")?
            html`<p><img alt="Wind Icon" class="icon" src="${this.iconBase + "wind.svg"}"/>
              ${this.data.wind_speed + "m/s"}
            </p>`
            :""}
          ${!this.exclude.includes("sun")?
            html`<div>
              <p><img alt="Sunrise Icon" class="icon" src="${this.iconBase + "sunrise.svg"}"/>
                ${sunrise.getHours() + ":" + (sunrise.getMinutes() <10? "0":"") + sunrise.getMinutes()}
              </p>
              <p><img alt="Sunset Icon" class="icon" src="${this.iconBase + "sunset.svg"}"/>
                ${sunset.getHours() + ":" + (sunset.getMinutes() <10? "0":"")+ sunset.getMinutes()}
              </p>
            </div>`
            :""}
        </div>
      </div>`
  }
}
