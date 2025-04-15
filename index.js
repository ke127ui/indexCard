document.addEventListener("DOMContentLoaded", function () {
  var galleryThumbs = new Swiper('#nav', {
    slidesPerView: 5,
    loop: true,
    freeMode: true,
    loopedSlides: 5, //looped slides should be the same
    watchSlidesVisibility: true,
    // watchSlidesProgress: true,
  });
  var galleryTop = new Swiper('#page', {
    loop:true,
    loopedSlides: 5, //looped slides should be the same
    thumbs: {
      swiper: galleryThumbs,
    },
  });
  
  const formatText = (str) => str ? str.replace(/\n/g, '<br>') : '';

  let data = {};
  let indices = {}; // 각 type의 현재 인덱스를 추적

  // 모든 article 요소 선택
  const articles = document.querySelectorAll('article.swiper-slide');

  // JSON 파일 로드
  fetch('./data.json')
    .then(res => res.json())
    .then(json => {
      data = json;

      articles.forEach((article, index) => {
        const type = `type${index + 1}`;
        const contentArray = data[type];
        if (!contentArray) return;

        indices[type] = 0;

        const title = article.querySelector('.title');
        const mainTxt = article.querySelector('.main_txt');
        const descMain = article.querySelector('.desc_main');
        const descSub = article.querySelector('.desc_sub');

        const render = (idx) => {
          const item = contentArray[idx];
          if (!item) return;

          title.innerHTML = formatText(item.title);
          mainTxt.innerHTML = formatText(item.main_txt);
          descMain.innerHTML = formatText(item.desc_main);
          descSub.innerHTML = formatText(item.desc_sub);
        };

        // 처음 내용 표시
        render(0);
        
        // 루프되는 이전 버튼
        article.querySelector('.btn_prev').addEventListener('click', () => {
          indices[type] = (indices[type] - 1 + contentArray.length) % contentArray.length;
          render(indices[type]);
        });

        // 루프되는 다음 버튼
        article.querySelector('.btn_next').addEventListener('click', () => {
          indices[type] = (indices[type] + 1) % contentArray.length;
          render(indices[type]);
        });

      });
    })
    .catch(err => console.error('데이터 로딩 실패:', err));
});
