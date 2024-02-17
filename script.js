const mainEl = document.querySelector(".main");
const themeBtn = document.querySelector(".header__switch");
const themeIcon = document.querySelector(".header__icon");
const fontBtn = document.querySelector(".header__selectBtn");
const searchBtn = document.querySelector(".search__btn");
const meaningsCon = document.querySelector(".meanings__container");
const fontInputs = document.querySelectorAll("input[name='font']");
const audioEl = document.querySelector(".result__audio");
const audioBtn = document.querySelector(".result__audioBtn");
const loaderContEl = document.querySelector(".loader__container");
const resultSect = document.querySelector(".result");

function changeTheme() {
  document.body.classList.toggle("dark");
}

themeIcon.addEventListener("click", changeTheme);

themeBtn.addEventListener("click", changeTheme);

fontBtn.addEventListener("click", function () {
  const fontList = document.querySelector(".header__dropdown");
  fontList.classList.toggle("show");
  this.ariaExpanded == "false"
    ? (this.ariaExpanded = "true")
    : (this.ariaExpanded = "false");
});

fontInputs.forEach((input) => {
  input.addEventListener("change", function () {
    const currFontEl = document.querySelector(".header__currentFont");
    if (document.body.classList.contains("dark")) {
      document.body.className = "";
      document.body.classList.add("dark");
    } else {
      document.body.className = "";
    }
    document.body.classList.add(input.id);
    currFontEl.textContent = input.nextElementSibling.textContent;
  });
});

//GETTING WORD FROM FORM
function searchForWord() {
  const searchInput = document.querySelector(".search__box input");
  const searchedWord = searchInput.value;
  if (!searchedWord) return;
  loaderContEl.classList.add("show");
  resultSect.classList.remove("show");
  meaningsCon.innerHTML = "";
  setTimeout(() => {
    getData(searchedWord);
  }, 300);
  searchInput.value = "";
}

searchBtn.addEventListener("click", searchForWord);
window.addEventListener("keydown", function (e) {
  if (e.code != "Enter") {
    return;
  } else {
    searchForWord();
  }
});

//GETTING DATA FROM API

async function getData(word) {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (res.status == 200) {
      const data = await res.json();
      loaderContEl.classList.remove("show");
      showWordHeading(data[0]);
      data.forEach((data) => {
        showWordMeanings(data);
      });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (err) {
    showError();
    console.error(err);
  }
}

function showError() {
  meaningsCon.innerHTML = "";
  mainEl.classList.add("error");
}

function showWordHeading(data) {
  mainEl.classList.remove("error");
  const resultEl = document.querySelector(".result__text");

  resultSect.classList.add("show");

  const wordHeadingHTML = `
  <h1 class="primary__heading">${data.word}</h1>
  <p class="results__pronunciation">${data.phonetic}</p>
  `;

  resultEl.innerHTML = "";
  resultEl.insertAdjacentHTML("afterBegin", wordHeadingHTML);

  audioEl.src = data.phonetics[0].audio;
}

function showWordMeanings(data) {
  const meaningsArray = data.meanings;
  let meaningsHtml = "";

  meaningsArray.forEach((meaning) => {
    meaningsHtml += `<section>
  <h2 class="secondary__heading">${meaning.partOfSpeech}</h2>
  <p class="speechPart__text">Meaning</p>
  <ul class="speechPart__list">
  ${meaning.definitions
    .map(
      (def) =>
        `<li class="speechPart__item">
      <p class="speechPart__definition">
        ${def.definition}
      </p>
      ${
        def.hasOwnProperty("example")
          ? ` <p class="speechPart__example">
      ${def.example}
      </p>`
          : ``
      }
     
      <div class="speechPart__box speechPart__box--def">
       ${
         def.synonyms.length == 0
           ? ``
           : `
       <p class="speechPart__synonyms">Synonyms</p>
        <span class="speechPart__synon">${def.synonyms}</span>`
       }
      </div>
    </li>`
    )

    .join("")}
  </ul>
  <div ${
    meaning.synonyms.length == 0
      ? `class="speechPart__box"`
      : `class="speechPart__box show"`
  }>
    ${
      meaning.synonyms.length == 0
        ? ``
        : `<p class="speechPart__synonyms">Synonyms</p>
        <span class="speechPart__synon">${meaning.synonyms}</span>`
    } 
  </div>
</section>`;
  });

  meaningsHtml += `
  <section class="source">
  <p class="source__text">Source</p>
  <a
    href="${data.sourceUrls}"
    class="source__link"
    target="_blank"
  >
  ${data.sourceUrls}
  </a>
  <img src="images/icon-new-window.svg" alt="" />
</section>
  `;

  meaningsCon.insertAdjacentHTML("beforeend", meaningsHtml);
}

//AUDIO FUNCTIONALITY
audioBtn.addEventListener("click", function () {
  audioEl.play();
});
