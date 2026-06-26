const API_KEY = 'AIzaSyDhVhdww1nQm-Mn8dNeor07KiXfslJFxcM'; // Replace with your actual API key
const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const VIDEO_DETAILS_URL = 'https://www.googleapis.com/youtube/v3/videos';

async function searchVideos(keyword, maxResults) {
    try {
        const params = {
            q: keyword,
            type: 'video',
            maxResults: maxResults,
            key: API_KEY
        };
        const response = await axios.get(SEARCH_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching search results:', error);
        return null;
    }
}

async function getDetails(videoIds) {
    try {
        const params = {
            part: 'snippet,statistics',
            id: videoIds.join(','),
            key: API_KEY
        };
        const response = await axios.get(VIDEO_DETAILS_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching video details:', error);
        return null;
    }
}

async function searchVideosWithCategoryId(keyword, publishedAfter, categoryId, maxResults) {
    try {
        const params = {
            part: 'snippet',
            q: keyword,
            type: 'video',
            publishedAfter: publishedAfter,
            videoCategoryId: categoryId,
            maxResults: maxResults,
            key: API_KEY
        };
        const response = await axios.get(SEARCH_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching videos with category ID:', error);
        return null;
    }
}

function filterVideoIds(videoDetails, minViews, minLikes) {
    return videoDetails.items.filter(item => {
        const viewCount = parseInt(item.statistics.viewCount || '0', 10);
        const likeCount = parseInt(item.statistics.likeCount || '0', 10);
        return viewCount >= minViews && likeCount >= minLikes;
    }).map(item => item.id);
}

function getUrls(description) {
    const words = description.split(/\s+/);
    return words.filter(word => word.startsWith('http://') || word.startsWith('https://')).map(word => word.replace(/[,.][\])(:;!&]/g, ''));
}

async function resolveUrl(url) {
    try {
        const proxyUrl = `http://localhost:3000/proxy?url=${encodeURIComponent(url)}`;
        const response = await axios.get(proxyUrl);
        return response.data.resolvedUrl;
    } catch (error) {
        console.error('Error resolving URL:', error);
        return null;
    }
}

function getSponsorUrls(resolvedUrls, keyword) {
    const platforms = ['twitter', 'facebook', 'reddit', 'quora', 'instagram', 'telegram', 'amazon', 'flipkart', 'twitch', 't.me', 'forum']; // Links to avoid with these platforms
    return resolvedUrls.filter(url => url.toLowerCase().includes(keyword.toLowerCase()) && !platforms.some(platform => url.toLowerCase().includes(platform)));
}

async function main(keyword) {
    const publishedAfter = "2023-01-01T11:11:11Z";
    const maxResults = 50;
    const minViews = 10000;
    const minLikes = 1000;

    const allVideos = await searchVideos(keyword, maxResults);
    if (!allVideos) return;

    const videoIds = allVideos.items.map(item => item.id.videoId);
    const videoDetails = await getDetails(videoIds);
    if (!videoDetails) return;

    const categoryIds = videoDetails.items.map(item => item.snippet.categoryId);
    const categoryCount = categoryIds.reduce((count, id) => {
        count[id] = (count[id] || 0) + 1;
        return count;
    }, {});
    const categoryId = Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b);

    const allVideosWithCategoryId = await searchVideosWithCategoryId(keyword, publishedAfter, categoryId, maxResults);
    if (!allVideosWithCategoryId) return;

    const newVideoIds = allVideosWithCategoryId.items.map(item => item.id.videoId);
    const newVideoDetails = await getDetails(newVideoIds);
    if (!newVideoDetails) return;

    const filteredVideoIds = filterVideoIds(newVideoDetails, minViews, minLikes);
    const descriptions = newVideoDetails.items.filter(item => filteredVideoIds.includes(item.id)).map(item => item.snippet.description);

    let urls = [];
    descriptions.forEach(description => {
        urls = urls.concat(getUrls(description));
    });

    const resolvedUrls = await Promise.all(urls.map(url => resolveUrl(url)));
    const finalResolvedUrls = resolvedUrls.filter(url => url !== null);
    const sponsorUrls = getSponsorUrls(finalResolvedUrls, keyword);

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    sponsorUrls.forEach(url => {
        const videoElement = document.createElement('div');
        videoElement.className = 'video-element';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', url);
        linkElement.setAttribute('target', '_blank');
        linkElement.innerText = url;
        videoElement.appendChild(linkElement);
        resultsDiv.appendChild(videoElement);
    });
}

// Get query parameter from URL
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('query');
if (query) {
    main(query);
}