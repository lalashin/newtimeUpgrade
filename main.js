//2.articles
let news = [];
let page = 1;
let total_pages = 0;
let menus = document.querySelectorAll(".menus button");
let menus2 = document.querySelectorAll(".side_menu_list button");
//console.log("menus", menus);




menus.forEach((menu) =>
    menu.addEventListener("click", (event) => getNewsByTopic(event))
);
menus2.forEach((menus2) =>
    menus2.addEventListener("click", (event) => getNewsByTopic(event))
);

let searchButton = document.getElementById("search_button");
let url;
//각 함수에서 필요한 url을 만든다.
//api호출 함수를 부른다.

const getNews = async () => {
    try {
        let header = new Headers({
            // "x-api-key": "L_y1ku9zlbj2emnwUMI5kFYIDC6qRql28-UqM4a0Mq4",
            "x-api-key": "L_y1ku9zlbj2emnwUMI5kFYIDC6qRql28-UqM4a0Mq3",
        });
        url.searchParams.set('page', page);//$page=
        console.log("url?", url);
        let response = await fetch(url, { headers: header });
        //세트처럼 외워두자!!!
        let data = await response.json();
        if (response.status == 200) {

            if (data.total_hits == 0) {
                throw new Error("검색된 결과값이 없습니다.");
            }
            //console.log("받는데이터가뭐지?", data);
            news = data.articles;
            total_pages = data.total_pages;
            page = data.page;
            // console.log("response는", response);

            render()
            pagenation()
        } else {
            throw new Error(data.message);

        }


    } catch (error) {
        //console.log("내가 잡은 에러는", error.message);
        errorRender(error.message);
    }

}

//1.API 함수
const getLatestNews = async () => {
    url = new URL(
        `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`
    );
    getNews()

};

const getNewsByTopic = async (event) => {
    // ("클릭", event.target.textContent);
    document.getElementById("mySidenav").classList.remove("active");
    let topic = event.target.textContent.toLowerCase()
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=10`)

    getNews()
}

const getNewsByKeyword = async () => {
    //1. 검색키워드 읽어오기
    //2. url 검색 키워드 부치기
    //3. 헤더준비
    //4. url 부르기
    //5. 데이터 가져오기
    //6. 데이터 보여주기

    let keyword = document.getElementById("search_input").value;
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=KR&page_size=10`);
    getNews()

    document.getElementById("search_input").value = ""
}

const render = () => {
    let newsHTML = ''
    newsHTML = news.map(item => {
        return `<div class="row news">
        <div class="col-lg-4">
            <img class="news_img_size" src="${item.media}" alt="">
        </div>
        <div class="col-lg-8">
            <h2><a href="${item.link}" target="_blank">${item.title}</a></h2>
            <p><a href="${item.link}" target="_blank">${item.summary}</a></p>
            <div>${item.clean_url} * ${item.published_date}</div>
        </div>
    </div>`
    }).join('');



    document.getElementById("news_board").innerHTML = newsHTML
}

const errorRender = (message) => {
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">
        ${message}
        </div>`

    document.getElementById("news_board").innerHTML = errorHTML;
}

const pagenation = () => {

    let link = document.querySelector('.pagination_area');
    link.addEventListener('click', function (e) {
        e.preventDefault();
    });
    let paginationHTML = ``
    //total_page
    //page
    //page group
    let pageGroup = Math.ceil(page / 5);
    //last num
    let last = pageGroup * 5
    //first num
    //let first = last - 4;
    if (last > total_pages) {
        last = total_pages;
    }
    let first = last - 4 <= 0 ? 1 : last - 4; // 첫그룹이 5이하이면
    //first ~ last
    if (first >= 6) {
        paginationHTML = `<li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(1)">
          <span aria-hidden="true">&lt;&lt;</span>
        </a>
      </li>
        <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page - 1})">
          <span aria-hidden="true">&lt;</span>
        </a>
      </li>`
    }

    for (let i = first; i <= last; i++) {
        paginationHTML += ` <li class="page-item ${page == i ? "active" : ""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
    }

    if (last < total_pages) {
        paginationHTML += `<li class="page-item">
        <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page + 1})">
          <span aria-hidden="true"> &gt;</span>
        </a>
      </li>
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${total_pages})">
          <span aria-hidden="true"> &gt;&gt;</span>
        </a>
      </li>`
    }

    document.querySelector(".pagination").innerHTML = paginationHTML;
}

const moveToPage = (pageNum) => {
    //1. 이동하고 싶은 페이지를 알아야
    page = pageNum;
    //console.log(page)
    //2. 이동하고싶은 페이지를 가지고 api를 다시 호출해주자
    getNews()
}
searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();




const openNav = () => {
    // document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mySidenav").classList.add("active");
};

const closeNav = () => {
    // document.getElementById("mySidenav").style.width = "0";
    document.getElementById("mySidenav").classList.remove("active");
}

const openSearchBox = () => {

    let inputArea = document.getElementById("input_area");

    if (inputArea.style.display === "inline") {
        inputArea.style.display = "none";
    } else {
        inputArea.style.display = "inline";
    }

}

//페이징
//1. page정보 기준으로 내가 몇번째 그룹인지 안다.
//2. 그 그룹의 첫번째와 마지막 페이지를 안다.
//3. 첫번째 ~마지막 페이지까지 그려준다.