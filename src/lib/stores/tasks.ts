import { get, writable } from 'svelte/store';

import type { Task } from '../types';
import { authStore } from './auth';
import { setError } from './errors';

type TasksStore = {
	dateRange: { start: number; end: number };
	tasks?: Task[];
};

export const tasksStore = writable<TasksStore>({
	dateRange: { start: -15, end: 15 },
});

type BaseFetchTasksArgs = {
	start: number;
	end: number;
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
		tasksStore.set({ dateRange: { start, end }, tasks: tasks });
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
		start: dateRange.start - 30,
		end: dateRange.end,
	});
};

export const fetchIncomingDates = async () => {
	const { dateRange } = get(tasksStore);

	await baseFetchTasks({
		start: dateRange.start,
		end: dateRange.end + 30,
	});
};
