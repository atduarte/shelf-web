(() => {
    const title = document.title;

    const canonicalTag = document.querySelector("link[rel='canonical']");
    const url = canonicalTag ? canonicalTag.getAttribute("href") : window.location.href;

    const descriptionTag = document.querySelector("meta[name='description']");
    const description = descriptionTag ? descriptionTag.getAttribute("content") : "";

    console.log({
        title,
        url,
        description
    });

})();