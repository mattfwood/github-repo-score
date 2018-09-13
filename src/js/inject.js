import RepoScore from './RepoScore';

const appendScore = async () => {
  const owner = document.querySelector('.author a').textContent;
  const repoName = document.querySelector('[itemprop="name"] a').textContent;

  const repoScore = new RepoScore(owner, repoName);

  const template = `
  <li>
    <div class="js-toggler-container js-social-container starring-container on">
      <div class="select-menu repo-score-dropdown">
          <button
            class="btn btn-sm btn-with-count select-menu-button repo-score-dropdown-button"
            aria-label="Github Repo Score"
          >
            <svg
              class="octicon octicon-dashboard"
              viewBox="0 0 16 16"
              version="1.1"
              width="14"
              height="16"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M9 5H8V4h1v1zm4 3h-1v1h1V8zM6 5H5v1h1V5zM5 8H4v1h1V8zm11-5.5l-.5-.5L9 7c-.06-.02-1 0-1 0-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-.92l6-5.58zm-1.59 4.09c.19.61.3 1.25.3 1.91 0 3.42-2.78 6.2-6.2 6.2-3.42 0-6.21-2.78-6.21-6.2 0-3.42 2.78-6.2 6.2-6.2 1.2 0 2.31.34 3.27.94l.94-.94A7.459 7.459 0 0 0 8.51 1C4.36 1 1 4.36 1 8.5 1 12.64 4.36 16 8.5 16c4.14 0 7.5-3.36 7.5-7.5 0-1.03-.2-2.02-.59-2.91l-1 1z"
              ></path>
            </svg>
            Score
          </button>
          <a
            class="social-count js-social-count repo-score"
            aria-label="Score for Github Repo"
          >
            Calculating...
          </a>
        <div class="select-menu-modal-holder">
          <div
            class="select-menu-modal subscription-menu-modal js-menu-content"
            aria-expanded="false"
          >
            <div
              class="select-menu-header js-navigation-enable"
              tabindex="-1"
            >
              <svg
                class="octicon octicon-x js-menu-close close-score-dropdown"
                role="img"
                aria-label="Close"
                viewBox="0 0 12 16"
                version="1.1"
                width="12"
                height="16"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"
                ></path>
              </svg>
              <span class="select-menu-title">Score Breakdown</span>
            </div>

            <div
              class="select-menu-list js-navigation-container js-active-navigation-container score-breakdown-container"
              role="menu"
            >

              <div
                class="select-menu-item js-navigation-item "
                role="menuitem"
                tabindex="0"
              >
                Reason for Score #1:
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  </li>
  `

  const actionBar = document.querySelector('.pagehead-actions');
  actionBar.innerHTML = template + actionBar.innerHTML;

  const green = '#28a745';
  const yellow = '#ffd33d';
  const red = '#cb2431';

  const { score, breakdown } = await repoScore.getScore();
  console.log({ score, breakdown });
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

  const breakdownElement = document.querySelector('.score-breakdown-container');
  console.log(breakdownElement);
  const items = [];

  // Build array of list items from breakdown of results
  Object.keys(breakdown).forEach(key => {
    const title = key.split(/(?=[A-Z])/).join(' ');
    items.push(`
      <div class="select-menu-item js-navigation-item " role="menuitem" tabindex="0" style="padding-left: 8px; text-transform: capitalize">
        <strong>${title}:</strong> ${breakdown[key]} points
      </div>
    `)
  });
  breakdownElement.innerHTML = items.join('');

  // Open / close dropdown
  document.querySelector('.repo-score-dropdown-button').addEventListener('click', (e) => {
    console.log(e);
    const scoreDropdown = document.querySelector('.repo-score-dropdown')
    if (Array.from(scoreDropdown.classList).includes('active')) {
      scoreDropdown.classList.remove('active');
    } else {
      scoreDropdown.classList.add('active');
    }
  });

  document.querySelector('.close-score-dropdown').addEventListener('click', (e) => {
    document.querySelector('.repo-score-dropdown').classList.remove('active');
  });
}

const repoHead = document.querySelector('.repohead');

// only run on github pages with a repoHead
if (window.location.href.includes('github') && repoHead) {
  appendScore();
}
