import * as core from '@actions/core';
import * as utils from './utils.js';
import { PullRequest } from './pull_request.js';

export async function handlePullRequest(client, context, config) {
	if (!context.payload.pull_request) {
		throw new Error('the webhook payload is not exist');
	}

	const { pull_request: event } = context.payload;
	const { draft, user, number } = event;
	const { useReviewGroups, reviewGroups, addReviewers, filterLabels, runOnDraft } = config;

	if (!runOnDraft && draft) {
		core.info('Skips the process to add reviewers/assignees since PR type is draft');
		return;
	}

	if (useReviewGroups && !reviewGroups) {
		throw new Error(
			"Error in configuration file to do with using review groups. Expected 'reviewGroups' variable to be set because the variable 'useReviewGroups' = true."
		);
	}

	const owner = user.login;
	const pr = new PullRequest(client, context);

	if (filterLabels !== undefined) {
		if (filterLabels.include !== undefined && filterLabels.include.length > 0) {
			const hasLabels = pr.hasAnyLabel(filterLabels.include);
			if (!hasLabels) {
				core.info(
					'Skips the process to add reviewers/assignees since PR is not tagged with any of the filterLabels.include'
				);
				return;
			}
		}

		if (filterLabels.exclude !== undefined && filterLabels.exclude.length > 0) {
			const hasLabels = pr.hasAnyLabel(filterLabels.exclude);
			if (hasLabels) {
				core.info(
					'Skips the process to add reviewers/assignees since PR is tagged with any of the filterLabels.exclude'
				);
				return;
			}
		}
	}

	if (addReviewers) {
		try {
			const reviewers = utils.chooseReviewers(owner, config);

			if (reviewers.length > 0) {
				await pr.mentionInComments(reviewers);
				core.info(`Added reviewers to PR #${number}: ${reviewers.join(', ')}`);
			}
		} catch (error) {
			if (error instanceof Error) {
				core.warning(error.message);
			}
		}
	}
}
