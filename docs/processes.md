> This document includes a description of our processes. Do not hesitate to come here, go through the points one by one so as not to get lost

# #1 - Basic Task Completion Process

- [ ] get task
- [ ] discuss contract (if task include be and fe)
- [ ] create brunch TASK_ID-SHORT_NAME
- [ ] commit changes TASK_ID-SHORT_NAME
- [ ] clean up commits in branch after work
- [ ] pass review of reviewers ([more about review](../README.md#code-review))
- [ ] pass review of maintainer
- [ ] check out your feature on prod

# #2 - Contract discussion

Read more about Contract First here: [link](../README.md#contract-first)

- [ ] start a discussion (asynchronously in an Issue or in a call)
- [ ] determine the details of the feature, then you may need
- [ ] don't be afraid to make a mistake, the contract can always be changed during the discussion
- [ ] start the development
- [ ] (for FE) you can use MSW for comfortable local development
- [ ] (for FE) after completing the BE development, check that the feature is working correctly

Example:

```
Events {
	{ type: "ChatMessage', fromId, text }
	{ type: 'EmojiMessage', fromId, emojild }
}

PlayerState { playerId, name, avatarId, history[] }
Seat { playerId, stack, awayTimeout, offline }
```
