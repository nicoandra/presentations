import JiraApi from 'jira-client';
import JiraClient from "jira-connector";
import * as fs from 'fs'
 
const jira = new JiraClient({
  host: process.env["JIRA_HOSTNAME"],
  basic_auth: {
    email: process.env["JIRA_EMAIL"],
    api_token: process.env["JIRA_BEARER"]
  },
  agile: true
});

const boardId = parseInt(process.env["JIRA_BOARD_ID"])

const filePath = "./slides/current/slides.md"

let activeSprint = null;
let activeSprintTasks = null;


const fetchSprint = async () => {
    if (activeSprint) return activeSprint
    const sprints = await jira.board.getAllSprints({boardId, state: "active"})
    activeSprint = sprints.values[0]
    return activeSprint
}

const fetchSprintTasks = async () => {
    if (activeSprintTasks) return activeSprintTasks
    const sprint = await fetchSprint()
    const issues = (await jira.board.getIssuesForSprint({boardId, sprintId: sprint.id, maxResults: 500, expand: ""}))["issues"]

    const noSubtasks = issues.filter((issue) => {
        return issue.fields.issuetype.subtask == false
    })
    
    const useful = noSubtasks.map((issue) => {
        return ['status','priority', 'created', 'progress', 'issuetype', 'resolutiondate', 'description', 'resolution', 'summary'].reduce(
            (acc, curr) => {
                acc[curr] = issue.fields[curr]
                return acc
            }, 
            {
            reporter: issue.fields.reporter.displayName,
            responsible: issue.fields.assignee?.displayName || 'Not assigned', 
            storyPoints: issue.fields.customfield_10004,
            epic: issue.fields.epic,
            id: issue.id, 
            key: issue.key,
            link: `https://${process.env["JIRA_HOSTNAME"]}/secure/browse/${issue.key}`,
            }
        )
    })
    return useful
}


const buildSlideIntro = async () => {
    const sprint = await fetchSprint()
    await addTitle("Stash Team - " + sprint.name)
    await endSlide()
    await addTitle("Objective", 2)
    await addQuote(sprint.goal)
    await endSlide()
}

const addTitle = async (title, level = 1) => {
    const marks = '#'.repeat(level)
    return fs.appendFileSync(filePath, `${marks} ${title}\n\n`)
}

const addText = async (text) => {
    return fs.appendFileSync(filePath, text + "\n\n")
}

const addItemToList = async (text, level = 1) => {
    const marks = ' '.repeat((level - 1) * 2)
    return fs.appendFileSync(filePath, marks + "* " + text + "\n")
}

const addQuote = async (text) => {
    return fs.appendFileSync(filePath, `> ${text}\n\n`)
}

const endSlide = async () => {
    return fs.appendFileSync(filePath, "---end slide\n")
}

const subSlide = async () => {
    return fs.appendFileSync(filePath, "---sub slide\n")
}

const buildTaskSlides = async () => {
    const tasks = await fetchSprintTasks();
    const tasksByEpics = {}
    const epics = tasks.reduce((acc, task) => {
        if (!task.epic) return acc

        if (tasksByEpics[task.epic.name] === undefined) {
            tasksByEpics[task.epic.name] = []
        }
        tasksByEpics[task.epic.name].push(task)
        
        acc.add(task.epic.name);
        return acc
    }, new Set())
    
    await addTitle("Epics", 3)
    for (const epicName of epics) {
        await addItemToList(epicName)
    }
    await endSlide()

    for (const [epicName, tasks] of Object.entries(tasksByEpics)) {
        console.log(epicName)
        await addTitle(epicName, 2)
        let i = 0;
        for (const task of tasks) {
            await addItemToList(`[${task.key}: ${task.summary}](${task.link})`)
            await addItemToList(`${task.status.name}, by ${task.responsible}`, 2)
            if (i++ === 3) {
                await subSlide()
                await addTitle(epicName, 2)
                i = 0;
            }
            /*if (task.epic) await addText(`Epic: ${task.epic.name} - ${task.epic.summary}`)
            if (task.storyPoints) await addText(`Storypoints: ${task.storyPoints}`)
            await addText(`Status: ${task.status.name}`)
            await addText(`By: ${task.responsible}`)
            await endSlide()*/
        }
        await endSlide()
    }



}
await fs.writeFileSync(filePath, '');
await buildSlideIntro();
await buildTaskSlides();
