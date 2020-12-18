# Notes


1. Find the current active sprint:

console.log(await jira.board.getAllSprints({boardId: 274, state: "active"}))

2. Get list of tickets for this sprint:
console.log(await jira.board.getIssuesForSprint({boardId: 274, sprintId: 1954, maxResults: 500, expand: ""}))

# References: 
https://developer.atlassian.com/cloud/jira/software/rest/api-group-board/#api-agile-1-0-board-boardid-sprint-get
https://www.npmjs.com/package/jira-connector