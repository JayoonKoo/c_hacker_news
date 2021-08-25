const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.com";
const container = document.getElementById("root");

const state = {
	currentPage: 1,
	newsFeeds: [],
}

function getData(url) {
	ajax.open('GET', url, false);
	ajax.send();

	return JSON.parse(ajax.response);
}

function initFeeds(feeds) {
	for (let i=0; i<feeds.length; i++) {
		feeds[i].read = false;
	}

	return feeds;
}

function newsContents() {
	let newsFeed = state.newsFeeds;

	if (newsFeed.length === 0) {
		newsFeed = state.newsFeeds =  initFeeds(getData(NEWS_URL));
	}

	let template = `
		<header class="header">
			<h1 class="header__title">Kush News</h1>
			<div class="header__navigation">
				<a href="#/page/${state.currentPage -1}">이전 페이지</a>
				<a href="#/page/${state.currentPage +1}">다음 페이지</a>
			</div>
		</header>

	`
	container.innerHTML = template;
}

function router() {
	const path = location.hash;
	
	if (path === "") {
		newsContents();
	} else if (path.substr(1).includes('/show/')) {
		console.log('show');
	} else if (path.substr(1).includes('/page/')) {
		state.currentPage = Number(path.split('/').pop());
		newsContents();
	} else {
		alert('url이 올바르지 않습니다.');
	}
}

router();

window.addEventListener("hashchange", router);
getData(NEWS_URL);
