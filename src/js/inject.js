import RepoScore from './RepoScore';
console.log('INJECTED');
console.log(RepoScore);

const owner = document.querySelector('.author a').textContent;
const repoName = document.querySelector('[itemprop="name"] a').textContent;

console.log({ owner, repoName });

const repoScore = new RepoScore(owner, repoName);

const appendScore = async () => {
  const template = `
  <li>
    <div class="js-toggler-container js-social-container starring-container on">
    <button class="btn btn-sm btn-with-count" aria-label="Github Repo Score">
      <svg class="octicon octicon-dashboard" viewBox="0 0 16 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M9 5H8V4h1v1zm4 3h-1v1h1V8zM6 5H5v1h1V5zM5 8H4v1h1V8zm11-5.5l-.5-.5L9 7c-.06-.02-1 0-1 0-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-.92l6-5.58zm-1.59 4.09c.19.61.3 1.25.3 1.91 0 3.42-2.78 6.2-6.2 6.2-3.42 0-6.21-2.78-6.21-6.2 0-3.42 2.78-6.2 6.2-6.2 1.2 0 2.31.34 3.27.94l.94-.94A7.459 7.459 0 0 0 8.51 1C4.36 1 1 4.36 1 8.5 1 12.64 4.36 16 8.5 16c4.14 0 7.5-3.36 7.5-7.5 0-1.03-.2-2.02-.59-2.91l-1 1z"></path></svg>
      Score
      </button>
      <a class="social-count js-social-count repo-score" aria-label="Score for Github Repo">
        Calculating...
      </a>
      <div>
      <form class="unstarred js-social-form" action="/yarnpkg/yarn/star" accept-charset="UTF-8" method="post">
        <input name="utf8" type="hidden" value="✓"><input type="hidden" name="authenticity_token" value="Jhcd7YEofc2Jf8wyNze+Hz+qNGpoWETohxw7KpaeXM15A/q8HNXyuBBFduspq9AFveqajkI8W7gZziuO6Szjpw==">
        <input type="hidden" name="context" value="repository">
        <button class="btn btn-sm btn-with-count js-toggler-target" aria-label="View Repo Score Details">
          <svg class="octicon octicon-star v-align-text-bottom" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
          Star
        </button>
        <a class="social-count js-social-count" href="/yarnpkg/yarn/stargazers" aria-label="32917 users starred this repository">
          32,917
        </a>
      </form>
      </div>
    </div>
  </li>
  `

  const actionBar = document.querySelector('.pagehead-actions');
  actionBar.innerHTML = template + actionBar.innerHTML;

  const green = '#28a745';
  const yellow = '#ffd33d';
  const red = '#cb2431';

  const score = await repoScore.getScore();
  let color;

  if (score > 80) {
    color = green;
  } else if (score <= 80 && score > 50) {
    color = yellow;
  } else {
    color = red;
  }

  const scoreElement = document.querySelector('.repo-score');

  scoreElement.textContent = `${score}%`;
  scoreElement.style.backgroundColor = color;
  scoreElement.style.color = '#FFF';

  // document.querySelector('.repo-score').textContent = `${score}%`;
}

const repoHead = document.querySelector('.repohead');

if (window.location.href.includes('github') && repoHead) {
  appendScore();
}
