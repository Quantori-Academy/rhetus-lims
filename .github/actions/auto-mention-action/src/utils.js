import sampleSize from 'lodash.samplesize';

export function chooseUsers(candidates, desiredNumber, filterUser) {
	const filteredCandidates = candidates.filter(reviewer => {
		return reviewer.toLowerCase() !== filterUser.toLowerCase();
	});

	// all-assign
	if (desiredNumber === 0) {
		return filteredCandidates;
	}

	return sampleSize(filteredCandidates, desiredNumber);
}

export function chooseUsersFromGroups(owner, groups, desiredNumber) {
	let users = [];
	for (const group in groups) {
		users = users.concat(chooseUsers(groups[group], desiredNumber, owner));
	}
	return users;
}

export function chooseReviewers(owner, config) {
	const { useReviewGroups, reviewGroups, numberOfReviewers, reviewers } = config;
	let chosenReviewers = [];
	const useGroups = useReviewGroups && Object.keys(reviewGroups).length > 0;

	if (useGroups) {
		chosenReviewers = chooseUsersFromGroups(owner, reviewGroups, numberOfReviewers);
	} else {
		chosenReviewers = chooseUsers(reviewers, numberOfReviewers, owner);
	}

	return chosenReviewers;
}

export async function fetchConfigurationFile(client, options) {
	const { owner, repo, path, ref } = options;
	const result = await client.rest.repos.getContent({
		owner,
		repo,
		path,
		ref
	});

	const data = result.data;

	if (!data.content) {
		throw new Error('the configuration file is not found');
	}

	const configString = Buffer.from(data.content, 'base64').toString();
	const config = yaml.safeLoad(configString);

	return config;
}
