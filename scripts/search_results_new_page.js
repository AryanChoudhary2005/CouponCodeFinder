
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const query = document.getElementById('searchQuery').value;
    // Navigate to the new page with the query as a parameter
    window.location.href = `searchResults.html?query=${encodeURIComponent(query)}`;
});