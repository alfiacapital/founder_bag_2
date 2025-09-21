export const setCookie = (name, value, days, domain) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days*24*60*60*1000);
        expires = "; expires=" + date.toUTCString();
    }
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isAlfiaDomain = window.location.hostname.endsWith('.alfia.com.sa') || window.location.hostname === 'alfia.com.sa';
    let domainPart = "";
    if (domain) {
        domainPart = `; domain=${domain}`;
    } else if (isLocalhost) {
        domainPart = "; domain=.localhost";
    } else if (isAlfiaDomain) {
        domainPart = "; domain=.alfia.com.sa";
    }
    const cookieValue = typeof value === 'boolean' ? value.toString() : value;
    document.cookie = name + "=" + cookieValue + expires + "; path=/" + domainPart;
};

export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
};
