import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    show(msg: string, timeout = 3000) {
        const alertBoxEl = document.getElementById('alertBox');
        const alertItemEl = document.createElement('div');
        alertItemEl.classList.add('alert-item');
        alertItemEl.innerHTML = msg;
        const alertContainer = alertBoxEl.getElementsByClassName('alert-container').item(0);
        if (alertContainer) {
            alertContainer.appendChild(alertItemEl);
            setTimeout(() => {
                alertContainer.removeChild(alertItemEl);
            }, timeout)
        }
    }
}