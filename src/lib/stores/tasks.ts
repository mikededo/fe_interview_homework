import { get, writable } from 'svelte/store';

import type { Task } from '../types';
import { setError } from './errors';

type TasksStore = {
	dateRange: { start: number; end: number };
	tasks?: Task[];
};

export const tasksStore = writable<TasksStore>({
	dateRange: { start: -15, end: 15 },
});

type FetchTasksArgs = { projectId: string; teamId: string; token: string };
export const fetchTasks = async ({
	projectId,
	teamId,
	token,
}: FetchTasksArgs) => {
	const { dateRange } = get(tasksStore);

	const fromDate = new Date();
	fromDate.setDate(fromDate.getDate() + dateRange.start);
	const untilDate = new Date();
	untilDate.setDate(untilDate.getDate() + dateRange.end);

	const since = fromDate.toJSON().slice(0, 10);
	const until = untilDate.toJSON().slice(0, 10);
	const url = `https://api.plan.toggl.space/api/v6-rc1/${projectId}/tasks?since=${since}&until=${until}&short=true&team=${teamId}`;

	try {
		const tasks: Task[] = await (
			await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
		).json();
		tasksStore.update((prev) => ({ ...prev, tasks: tasks, error: undefined }));
	} catch (_) {
		setError('Failed to fetch tasks. Check your token or your network!');
	}
};
