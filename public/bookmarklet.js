(() => {
    const domain = 'http://localhost:3000';

    const title = document.title;

    const origin = window.location.origin;
    const socialTag = document.querySelector("link[rel='og:url']")?.getAttribute("href");
    const canonicalTag = document.querySelector("link[rel='canonical']")?.getAttribute("href");

    function cleanUrl(url) {
        if (!url || !url.trim) return; 
        url = url.trim(); 
        if (url == "") return null;
        if (url.startsWith("/")) return origin + url;
        return url;
    }

    const url = cleanUrl(canonicalTag) || cleanUrl(socialTag) || window.location.href;

    /*const descriptionTag = document.querySelector("meta[name='description']");
    //const description = descriptionTag ? descriptionTag.getAttribute("content") : "";*/

    const wnd = window.open(`${domain}/add?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);

    window.addEventListener("submitted", (event) => {
        console.log('received');
        if (event.origin !== origin) return;
        wnd.close();
    }, false);

})();