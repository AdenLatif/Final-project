function cancelRedirect() {
    // Clear the meta refresh tag to stop auto-redirect
    const metaRefresh = document.querySelector('meta[http-equiv="refresh"]');
    if (metaRefresh) {
        metaRefresh.content = "";
    }
    // Update message to user
    document.getElementById('messageSection').innerHTML = '<p>Redirect canceled. Enjoy your stay!</p>';
}
