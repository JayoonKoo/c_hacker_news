const ajax = new XMLHttpRequest();
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
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
	const currentPage = state.currentPage;
	const paging = 10;

	if (newsFeed.length === 0) {
		newsFeed = state.newsFeeds = initFeeds(getData(NEWS_URL));
	}

	const startIndex = paging*(currentPage -1);
	const maxIndex = Math.ceil(newsFeed.length/10);
	const endIndex = currentPage === maxIndex ? newsFeed.length : startIndex + 10;

	let template = `
		<header class="header">
			<h1 class="header__title">Kush News</h1>
			<div class="header__navigation">
				<a href="#/page/${currentPage === 1? currentPage : currentPage -1}">이전 페이지</a>
				<a href="#/page/${currentPage === maxIndex? maxIndex : currentPage +1}">다음 페이지</a>
			</div>
		</header>
		<main class="main">
			<ul class="feeds">
				{{__feeds_items__}}
			</ul>
		</main>
	`

	const newsList = [];
	for (let i=startIndex; i<endIndex; i++ ) {
		const {comments_count, id, title, read} = newsFeed[i];
		newsList.push(`
			<li class="feeds__news ${read? "red": ""}">
				<a class="feeds__link" href="/#/show/${i}/${id}">
					${title}
					<span class="feeds__commetns-count">댓글 개수 (${comments_count})</span>
				</a>
			</li>
		`);
	}

	template = template.replace('{{__feeds_items__}}', newsList.join(''));
	
	container.innerHTML = template;
}

function makeComments(comments, called=0) {
	const commentList = [];
	for (let comment of comments) {
		const {content, user, time_ago} = comment;
		commentList.push(`
			<div class="comment" style="padding-left: ${called*40}px">
				<h4 class="comment__user">${user} <span>${time_ago}</span></h4>
				${content}
			</div>
		`)

		if (comment.comments.length !== 0) {
			commentList.push(makeComments(comment.comments, called +1));
		}
	}

	return commentList.join("");
}

function newsDetail(id, index) {
	const news = getData(CONTENT_URL.replace("@id", id));

	const {title, comments} = news;
	console.log(state.newsFeeds);
	if (state.newsFeeds.length !== 0) {
		state.newsFeeds[index].read = true;
	}
	
	let template = `
		<header class="header detail">
			<button><a href="/#/page/${state.currentPage}">x<a></button>
		</header>
		<article class="article">
			<h1 class="article__title">${title}</h1>
			<div class="comments">
				{{__comment__}}
			</div>
		</article>
	`;

	template = template.replace("{{__comment__}}",makeComments(comments));

	container.innerHTML = template;
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
}


window.addEventListener("hashchange", router);

router();
