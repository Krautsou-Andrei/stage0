(()=>{"use strict";const t=document.querySelector("[data-main]");new class{constructor(t){this.dateView=t.querySelector("[data-date]"),this.time=t.querySelector("[data-time]"),this.showTime()}showTime(){const t=new Date,e=t.toLocaleTimeString();this.time.textContent=e,setTimeout(this.showTime.bind(this),1e3),this.showDate(t)}showDate(t){const e=t.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});this.dateView.textContent=e}}(t)})();