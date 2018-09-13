// const { performance } = require('perf_hooks');
const axios = require('axios');
const moment = require('moment');

export default class RepoScore {
  constructor(owner, repo) {
    this.owner = owner;
    this.repo = repo;
  }

  /**
   * 20 points
   * Within last week: 20 points
   * Within last month: 15 points
   * Within 3 months: 10 points
   * Within 6 months: 5 points
   * More than 6 months: 0
   */
  async mostRecentCommit() {
    try {
      const { owner, repo } = this;
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?access_token=f53a3a9b618e28420561d27ca99d38a1d3cc1364`);
      const commits = res.data;
      const date = commits[0].commit.committer.date
      const daysAgo = moment().diff(date, 'days')

      // Within the last week
      if (daysAgo < 7) {
        return 20
      };

      // Within the last month
      if (daysAgo > 7 && daysAgo <= 30) {
        return 15
      };

      // Within last 3 months
      if (daysAgo > 30 && daysAgo <= 90) {
        return 10;
      };

      // Within last 6 months
      if (daysAgo > 90 && daysAgo <= 180) {
        return 5;
      };

      // More than 6 months since last commit
      return 0;
    } catch (error) {
      throw new Error(error);
    }
  }

  async commitActivity() {
    try {
      const { owner, repo } = this;
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity?access_token=f53a3a9b618e28420561d27ca99d38a1d3cc1364`);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Number of closed issues in last six months
   * 20+ issues: 20 points
   * 10+ issues: 15 points
   * 5-10 issues: 10 points
   * 1-5 issues: 5 points
   * 0 issues: 0 points
   *
   */
  async issues() {
    try {
      const { owner, repo } = this;
      const sixMonthsAgo = moment().subtract(6, 'months').format();
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues?state=closed&since=${sixMonthsAgo}&access_token=f53a3a9b618e28420561d27ca99d38a1d3cc1364`);
      const closedIssues = res.data.length;
      console.log(closedIssues);

      if (closedIssues > 20) return 20;
      if (closedIssues < 20 && closedIssues >= 15) return 15;
      if (closedIssues < 15 && closedIssues >= 10) return 10;
      if (closedIssues < 10 && closedIssues >= 0) return 5;

      return 0
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Has tests: 20
   * No tests: 0
   */

  async tests() {
    try {
      const { owner, repo } = this;
      const sixMonthsAgo = moment().subtract(6, 'months').format();
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents?access_token=f53a3a9b618e28420561d27ca99d38a1d3cc1364`);
      const contents = res.data;
      const hasTests = contents.some(item => item.name.includes('test'));

      if (hasTests) return 20;

      return 0;
    } catch (error) {
      throw new Error(error);
    }
  }

  async contributors() {
    try {
      const { owner, repo } = this;
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/stats/contributors?access_token=f53a3a9b618e28420561d27ca99d38a1d3cc1364`);
      const contributorCount = res.data.length;

      if (contributorCount > 5) return 20;
      if (contributorCount <= 4 && contributorCount >= 3) return 15;
      if (contributorCount === 2) return 10;
      if (contributorCount === 1) return 5;

      return 0;
    } catch (error) {
      throw new Error(error);
    }
  }

  async participation() {
    try {
      const { owner, repo } = this;
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/stats/participation?access_token=f53a3a9b618e28420561d27ca99d38a1d3cc1364`);
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async bonusPoints() {
    try {
      const { owner, repo } = this;
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}?access_token=f53a3a9b618e28420561d27ca99d38a1d3cc1364`);
      const repoData = res.data;
      let bonusPoints = 0;

      // Add 0.01 point for every star
      bonusPoints += repoData.stargazers_count * 0.01;

      // Add 10 points if it has a wiki
      if (repoData.has_wiki) {
        bonusPoints += 10;
      }

      // Add 5 points if it has a description
      if (repoData.description !== null) {
        bonusPoints += 5;
      }

      // Add 5 points if it has a homepage
      if (repoData.homepage !== null) {
        bonusPoints += 5;
      }

      // Cap bonus points at 20
      if (bonusPoints > 20) {
        bonusPoints = 20;
      }

      return bonusPoints;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getScore() {
    try {
      // const start = performance.now();
      const [
        // commitActivity,
        contributors,
        // participation,
        mostRecentCommit,
        issues,
        tests,
        bonusPoints
      ] = await Promise.all([
        // this.commitActivity(),
        this.contributors(),
        // this.participation(),
        this.mostRecentCommit(),
        this.issues(),
        this.tests(),
        this.bonusPoints(),
      ])
      // const commitsInLastYear = commitActivity.reduce((total, commit) => total + commit.total, 0);

      // const end = performance.now();
      // console.log('RUN TIME IN SECONDS:')
      // console.log((end - start) / 1000);
      // console.log({ contributors, mostRecentCommit, issues, tests, bonusPoints });
      const total = contributors + mostRecentCommit + issues + tests + bonusPoints;
      return {
        score: Math.round(total),
        breakdown: {
          contributors,
          mostRecentCommit,
          issues,
          tests,
          bonusPoints,
        }
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}

// const [owner, repoName] = ['alexanderwallin', 'react-spotify-player']
// const [owner, repoName] = ['yarnpkg', 'yarn'];

// const start = performance.now();
// const repo = new RepoScore(owner, repoName);
// console.log(repo.mostRecentCommit());
// console.log(repo.contributors());
// repo.getScore();

// getScore('alexanderwallin', 'react-spotify-player');
// getScore('yarnpkg', 'yarn');
