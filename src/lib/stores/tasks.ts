import { get, writable } from 'svelte/store';

import { authStore } from './auth';
import { setError } from './errors';
import { CELL_COUNT } from '../config';
import type { Task } from '../types';
import { doDateRangesOverlap } from '../utils';

type TasksStore = {
	dateRange: { start: number; end: number };
	tasks?: Task[];
	swimlanes?: Task[][];
};

export const tasksStore = writable<TasksStore>({
	dateRange: { start: -15, end: 30 },
});

type BaseFetchTasksArgs = {
	start: number;
	end: number;
};

const doTasksOverlap = (a: Task, b: Task): boolean =>
	doDateRangesOverlap(
		[new Date(a.start_date), new Date(a.end_date)],
		[new Date(b.start_date), new Date(b.end_date)]
	);

const updateTasksStore = (tasks: Task[]): Task[][] => {
	const swimlanes: Task[][] = [];
	const sorted = [...tasks].sort((a, b) => {
		// In case dates are equal, we sort by weight
		if (a.start_date === b.start_date) {
			return a.weight > b.weight ? 1 : -1;
		}

		return a.start_date > b.start_date ? 1 : -1;
	});

	sorted.forEach((task) => {
		const availableLaneIndex = swimlanes.findIndex((lane) => {
			const doesCollapse = lane.some((laneTask) =>
				doTasksOverlap(task, laneTask)
			);
			return !doesCollapse;
		});

		if (availableLaneIndex === -1) {
			swimlanes.push([task]);
		} else {
			swimlanes[availableLaneIndex].push(task);
		}
	});

	return swimlanes;
};

const baseFetchTasks = async ({ start, end }: BaseFetchTasksArgs) => {
	const auth = get(authStore);
	if (!auth) {
		setError(
			'You are not authenticated and tasks cannot be fetched! Check your local storage or your network!'
		);
		return;
	}

	const fromDate = new Date();
	fromDate.setDate(fromDate.getDate() + start);
	const untilDate = new Date();
	untilDate.setDate(untilDate.getDate() + end);

	const { projectId, teamId, token } = auth;
	const since = fromDate.toJSON().slice(0, 10);
	const until = untilDate.toJSON().slice(0, 10);
	const url = `https://api.plan.toggl.space/api/v6-rc1/${projectId}/tasks?since=${since}&until=${until}&short=true&team=${teamId}`;

	try {
		const tasks: Task[] = await (
			await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
		).json();
		tasksStore.set({
			dateRange: { start, end },
			tasks: tasks,
			swimlanes: updateTasksStore(tasks),
		});
	} catch (_) {
		setError('Failed to fetch tasks. Check your token or your network!');
	}
};

export const fetchTasks = async () => {
	const { dateRange } = get(tasksStore);

	await baseFetchTasks({
		...dateRange,
	});
};

export const fetchPreviousDates = async () => {
	const { dateRange } = get(tasksStore);

	await baseFetchTasks({
		start: dateRange.start - CELL_COUNT,
		end: dateRange.end,
	});
};

export const fetchIncomingDates = async () => {
	const { dateRange } = get(tasksStore);

	await baseFetchTasks({
		start: dateRange.start,
		end: dateRange.end + CELL_COUNT,
	});
};
