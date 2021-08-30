export const contents = `
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

export const detail = `
		<header class="header detail">
			<button><a href="/#/page/{{currentPage}}">x<a></button>
		</header>
		<article class="article">
			<h1 class="article__title">{{title}}</h1>
			<div class="comments">
				{{__comments__}}
			</div>
		</article>
	`;
