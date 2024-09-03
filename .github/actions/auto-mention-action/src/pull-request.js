import * as core from '@actions/core';

export class PullRequest {
	#client;
	#context;

	constructor(client, context) {
		this.#client = client;
		this.#context = context;
	}

	async addReviewers(reviewers) {
		const { owner, repo, number: pull_number } = this.#context.issue;
		const result = await this.#client.rest.pulls.requestReviewers({
			owner,
			repo,
			pull_number,
			reviewers
		});
		core.debug(JSON.stringify(result));
	}

	async addAssignees(assignees) {
		const { owner, repo, number: issue_number } = this.#context.issue;
		const result = await this.#client.rest.issues.addAssignees({
			owner,
			repo,
			issue_number,
			assignees
		});
		core.debug(JSON.stringify(result));
	}

	async mentionInComments(reviewers) {
		const { owner, repo, number: prNumber } = this.#context.issue;
		const result = await this.#client.rest.issues.createComment({
			owner,
			repo,
			issue_number: prNumber,
			body: `👋 @${reviewers.join(', @')}, please review this PR!`
		});
		core.debug(JSON.stringify(result));
	}

	hasAnyLabel(labels) {
		if (!this.#context.payload.pull_request) {
			return false;
		}
		const { labels: pullRequestLabels = [] } = this.#context.payload.pull_request;
		return pullRequestLabels.some(label => labels.includes(label.name));
	}
}
