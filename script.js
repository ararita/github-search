let usersName;
let usersUrl;
let usersBio;
let year;
let city;
let publicRepos;
let followers;
let sumOfLanguages = {};

let reposData;
let repoName;
let repoLanguage;
let repoDescription;
let repoYearFrom;
let repoYearTo;
let stars;
let forks;
let permissions;
let repoUrl;

let repoInfo;

let containerEl = document.getElementById("container");
let infoEl = document.getElementById("info");

async function getProfile(user) {
  let baseUrl = "https://api.github.com/users/" + encodeURIComponent(user);

  let response = await fetch(baseUrl, {
    headers: fetchHeaders()
  });
  let data = await response.json();

  usersName = data.login;
  usersUrl = data.html_url;
  usersBio = data.bio;
  year = new Date(data.created_at).getFullYear();
  city = data.location;
  publicRepos = data.public_repos;
  followers = data.followers;

  getRepos(data.repos_url);
}

async function getRepos(reposURL) {
  let response = await fetch(reposURL, {
    headers: fetchHeaders()
  });
  reposData = await response.json();

  for (let repo of reposData) {
    let languagesURL = repo.languages_url;

    await getLanguages(languagesURL);
  }
  render();
}

async function getLanguages(languagesURL) {
  let response = await fetch(languagesURL, {
    headers: fetchHeaders()
  });
  let languagesData = await response.json();
  sumLanguages(languagesData);
}

function sumLanguages(languagesData) {
  for (let language in languagesData) {
    if (sumOfLanguages.hasOwnProperty(language)) {
      sumOfLanguages[language] += languagesData[language];
    } else {
      sumOfLanguages[language] = languagesData[language];
    }
  }
}

function onClickHandler() {
  let inputEl = document.getElementById("usersInput");
  let inputValue = inputEl.value;
  getProfile(inputValue);
}

function resetPage() {
  containerEl.innerHTML = "";
  infoEl.innerHTML = "";
}

function renderIntroSection() {
  let introSectionEl = document.createElement("section");
  let usernameEl = document.createElement("h2");
  let bioEl = document.createElement("p");
  let websiteEl = document.createElement("a");
  let summaryEl = document.createElement("p");

  introSectionEl.id = "intro-section";
  bioEl.id = "bio";
  websiteEl.id = "web";
  usernameEl.textContent = usersName;
  bioEl.textContent = usersBio;
  websiteEl.href = usersUrl;
  websiteEl.textContent = usersUrl;
  summaryEl.textContent =
    "On GitHub since " +
    year +
    ", " +
    usernameEl.textContent +
    " is a developer based in " +
    city +
    ", " +
    " with " +
    publicRepos +
    " public repositories and " +
    followers +
    " followers.";

  introSectionEl.appendChild(usernameEl);
  introSectionEl.appendChild(bioEl);
  introSectionEl.appendChild(websiteEl);
  introSectionEl.appendChild(summaryEl);

  return introSectionEl;
}

function renderLanguagesSection() {
  let languagesSectionEl = document.createElement("section");
  let languagesText = document.createElement("h3");
  let languagesList = document.createElement("ul");

  languagesSectionEl.id = "languages-section";
  languagesList.id = "languages-list";

  languagesText.textContent = "Languages";

  languagesSectionEl.appendChild(languagesText);

  for (let lang in sumOfLanguages) {
    let languagesListItem = document.createElement("li");
    let languageDisplay = document.createElement("h4");

    languagesListItem.id = "language-list-item";

    languageDisplay.textContent = lang + ", " + sumOfLanguages[lang];

    languagesListItem.appendChild(languageDisplay);
    languagesList.appendChild(languagesListItem);
  }
  languagesSectionEl.appendChild(languagesList);

  return languagesSectionEl;
}

function displayPermissions(input) {
  let perm = {
    pull: "read",
    push: "write",
    admin: "admin"
  };

  perm = perm[input];
  return perm;
}

function renderReposSection() {
  let reposEl = document.createElement("section");
  let reposText = document.createElement("h3");
  let reposList = document.createElement("ul");
  reposEl.id = "repos-section";

  reposEl.appendChild(reposText);

  reposText.textContent = "Popular Repositories";

  for (let repo of reposData) {
    console.log(repo);
    let reposListItem = document.createElement("li");
    let repoNameContainer = document.createElement("h4");
    let repoDisplayName = document.createElement("a");
    let repoDisplayYears = document.createElement("span");
    let repoDisplayLang = document.createElement("h5");
    let permissionList = document.createElement("ul");
    let repoLanguageContainer = document.createElement("div");
    let descriptionEl = document.createElement("p");
    let repoSummary = document.createElement("p");
    let separator = document.createElement("span");

    repoNameContainer.classList.add("repo-name-container");
    repoLanguageContainer.classList.add("repo-lang-container");
    permissionList.classList.add("permission-list");
    repoDisplayYears.classList.add("display-years");
    separator.classList.add("separator");
    reposListItem.classList.add("repos-list-item");

    repoName = repo.name;
    repoUrl = repo.html_url;
    console.log(repoUrl);
    repoLanguage = repo.language;
    repoYearFrom = new Date(repo.created_at).getFullYear();
    repoYearTo = new Date(repo.updated_at).getFullYear();
    repoDescription = repo.description;
    stars = repo.stargazers_count;
    forks = repo.forks_count;
    permissions = repo.permissions;
    // websiteEl.href = usersUrl;
    // websiteEl.textContent = usersUrl;
    repoDisplayName.href = repoUrl;
    repoDisplayName.textContent = repoName;
    repoDisplayYears.textContent = repoYearFrom + " - " + repoYearTo;
    repoDisplayLang.textContent = repoLanguage;
    separator.textContent = "-";
    descriptionEl.textContent = repoDescription;
    repoSummary.textContent =
      "This repository has " +
      stars +
      " stars and " +
      forks +
      " forks. If you would like more information about this repository and my contributed code, please visit " +
      repoName +
      " on GitHub.";

    reposListItem.appendChild(repoNameContainer);
    repoNameContainer.appendChild(repoDisplayName);
    repoNameContainer.appendChild(repoDisplayYears);
    reposListItem.appendChild(repoLanguageContainer);
    repoLanguageContainer.appendChild(repoDisplayLang);
    repoLanguageContainer.appendChild(separator);
    repoLanguageContainer.appendChild(permissionList);
    reposListItem.appendChild(descriptionEl);
    reposListItem.appendChild(repoSummary);

    for (let permission in permissions) {
      let value = permissions[permission];
      if (value === true) {
        let permissionListItem = document.createElement("li");
        permissionListItem.textContent = displayPermissions(permission);
        permissionList.appendChild(permissionListItem);
      }
      reposList.appendChild(reposListItem);
    }
    reposEl.appendChild(reposList);
  }
  return reposEl;
}

function render() {
  resetPage();
  let introSection = renderIntroSection();
  let languagesSection = renderLanguagesSection();
  let reposSection = renderReposSection();

  containerEl.appendChild(infoEl);

  infoEl.appendChild(introSection);
  infoEl.appendChild(languagesSection);
  infoEl.appendChild(reposSection);

  containerEl.style.display = "block";
}
