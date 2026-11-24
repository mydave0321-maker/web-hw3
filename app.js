const board = document.getElementById('board');
const dialog = document.getElementById('detail');
// 입력: 포스터 경로, 크기 ⇒ 출력: 이미지 주소
function posterUrl(path, size = 'w342') { return 'https://image.tmdb.org/t/p/' + size + path; }
// 입력: 목록, 검색어 ⇒ 출력: 검색 결과
function search(list, keyword) { return list.filter(m => m.title.toLowerCase().includes(keyword.trim().toLowerCase())); }
// 입력: 목록, 기준, 내림차순 여부 ⇒ 출력: 정렬된 복사본
function sortBy(list, key, desc) { return [...list].sort((a,b) => { const n = key === 'title' ? a.title.localeCompare(b.title,'ko') : a[key]-b[key]; return desc ? -n : n; }); }
// 입력: 영화 목록 ⇒ 출력: 카드와 개수 표시
function renderCards(list) {
  board.innerHTML = '';
  for (const m of list) {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('data-type',m.type);
    card.setAttribute('data-title',m.title);
    if(m.rating >= 8) card.classList.add('hot');
    if(!m.poster) card.classList.add('no-poster');
    card.innerHTML = `${m.poster ? `<img src="${posterUrl(m.poster)}" alt="${m.title} 포스터">` : `<div class="poster-fallback">${m.title[0]}</div>`}<span class="badge">${m.rating.toFixed(1)}</span>${m.type === 'boxoffice' ? `<span class="rank">${m.rank}위</span>` : ''}<div class="info"><h3>${m.title}</h3><p>${m.year}</p><button type="button" class="${liked.includes(m.title) ? 'like liked' : 'like'}" aria-label="찜" aria-pressed="${liked.includes(m.title)}">♥</button></div>`;
    board.appendChild(card);
  }
  document.getElementById('count').textContent = list.length + '편';
  document.getElementById('likeCount').textContent = liked.length;
  if(list.length === 0) board.classList.add('is-empty'); else board.classList.remove('is-empty');
}
// 입력: 검색창, 라디오, 정렬 값 ⇒ 출력: 최종 목록
function getView() {
  let list = search(movies, document.getElementById('q').value);
  const type = document.querySelector('input[name="type"]:checked').value;
  if(type !== 'all') list = list.filter(m => m.type === type);
  const key = document.getElementById('sort').value;
  return sortBy(list,key,key !== 'title');
}
// 입력: 현재 조건 ⇒ 출력: 갱신된 화면
function refresh() { renderCards(getView()); }
// 입력: 제목 ⇒ 출력: 상세 대화상자
function openDetail(title) {
  const m = movies.find(m => m.title === title);
  if(!m) return;
  document.getElementById('detailBody').innerHTML = `${m.poster ? `<img src="${posterUrl(m.poster,'w500')}" alt="${m.title} 포스터">` : `<div class="poster-fallback">${m.title[0]}</div>`}<h2>${m.title}</h2><p>개봉일 ${m.date}, 평점 ${m.rating.toFixed(1)}</p><p>${m.overview}</p>`;
  dialog.showModal();
}
const liked = JSON.parse(localStorage.getItem('liked') || '[]');
// 입력: 찜 배열 ⇒ 출력: 브라우저 저장
function saveLiked() { localStorage.setItem('liked',JSON.stringify(liked)); }
// 입력: 클릭 이벤트 ⇒ 출력: 찜 변경 또는 상세 표시
function handleBoardClick(e) {
  const card = e.target.closest('.card');
  if(!card) return;
  const title = card.getAttribute('data-title');
  if(e.target.closest('.like')) {
    const i = liked.indexOf(title);
    if(i === -1) liked.push(title); else liked.splice(i,1);
    saveLiked(); refresh(); return;
  }
  openDetail(title);
}
// 입력: 현재 테마 ⇒ 출력: 변경 및 저장
function toggleTheme() { document.body.classList.toggle('dark'); localStorage.setItem('theme',document.body.classList.contains('dark') ? 'dark' : 'light'); }
if(localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
document.getElementById('q').addEventListener('input',refresh);
document.getElementById('sort').addEventListener('change',refresh);
document.getElementById('typeFilter').addEventListener('change',refresh);
board.addEventListener('click',handleBoardClick);
document.getElementById('closeDetail').addEventListener('click',() => dialog.close());
document.getElementById('theme').addEventListener('click',toggleTheme);
refresh();
