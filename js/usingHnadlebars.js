import Handlebars from "handlebars";


const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
const container = document.getElementById("root");

const state = {
	currentPage: 1,
	newsFeeds: [],
}

const source = `
<header class="header">
	<h1 class="header__title">Kush News</h1>
	<div class="header__navigation">
		<a href="#/page/{{previousPage}}">이전 페이지</a>
		<a href="#/page/{{nextPage}}">다음 페이지</a>
	</div>
</header>
<main class="main">
	{{#if hasNews}}
	<ul class="feeds">
		{{#each newsList}}
		<li class="feeds__news {{className}}">
			<a class="feeds__link" href="{{href}}">
				{{title}}
				<span class="feeds__commetns-count">댓글 개수 ({{comments_count}})</span>
			</a>
		</li>
		{{/each}}
	</ul>
	{{else}}
	<div>뉴스가 없습니다.</div>
	{{/if}}
</main>
`

let template = Handlebars.compile(source);


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
	const currentPage = state.currentPage;
	const paging = 10;

	if (newsFeed.length === 0) {
		newsFeed = state.newsFeeds = initFeeds(getData(NEWS_URL));
	}
	state.hasNews = state.newsFeeds.length > 0;

	const startIndex = paging*(currentPage -1);
	const maxIndex = Math.ceil(newsFeed.length/10);
	const endIndex = currentPage === maxIndex ? newsFeed.length : startIndex + 10;

	state.previousPage = currentPage === 1? currentPage : currentPage -1;
	state.nextPage = currentPage === maxIndex? maxIndex : currentPage +1
	
	state.newsList = [];
	for (let i=startIndex; i<endIndex; i++ ) {
		const {comments_count, id, title, read} = newsFeed[i];
		state.newsList.push({
			className: read? "red" : "",
			href: `/#/show/${i}/${id}`,
			title: title,
			comments_count: comments_count,
		});
	}
}


function router() {
	const path = location.hash;
	
	if (path === "") {
		newsContents();
	} else if (path.substr(1).includes('/show/')) {
		const [,, index, id] = path.split('/');
		newsDetail(id, index);
	} else if (path.substr(1).includes('/page/')) {
		state.currentPage = Number(path.split('/').pop());
		newsContents();
	} else {
		alert('url이 올바르지 않습니다.');
	}

	container.innerHTML = template(state);
}


window.addEventListener("hashchange", router);

router();
