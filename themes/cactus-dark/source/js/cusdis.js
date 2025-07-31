// https://github.com/djyde/cusdis/issues/283#issuecomment-2543119916
window.addEventListener('load', function () {
    const iframe = document.querySelector('#cusdis_thread iframe')
    
    if (iframe) {
        const iframeBody = iframe.contentWindow.document.body

        // Fix height
        let observer = new MutationObserver(() => {
            let scrollHeight = iframe.contentWindow.document.body.scrollHeight
            iframe.style.height = scrollHeight + 24 + 'px'
        })
        observer.observe(iframe.contentWindow.document.body, { childList: true, subtree: true })

        // Fix background color, font, credits and textbox label
        iframeBody.style.backgroundColor = '#1d1f21'
        iframeBody.style.fontFamily = '"Roboto Mono", monospace'
        iframeBody.querySelector("[for='reply_content']").innerText = 'Your comment'
        iframeBody.querySelector(".text-center").previousElementSibling.remove()
        iframeBody.querySelector(".text-center").remove()
    }
});