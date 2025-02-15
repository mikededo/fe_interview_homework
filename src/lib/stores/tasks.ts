import { get, writable } from 'svelte/store';

import { authStore, showAuthDialog } from './auth';
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
export const taskEditorStore = writable<Task | null>(null);

type BaseFetchTasksArgs = {
	start: number;
	end: number;
};

const doTasksOverlap = (a: Task, b: Task): boolean => {
	// Same as in the swimnlane, we need to add 1 as the end is inclusive
	const aEnd = new Date(a.end_date);
	aEnd.setDate(aEnd.getDate() + 1);
	const bEnd = new Date(b.end_date);
	bEnd.setDate(bEnd.getDate() + 1);

	return doDateRangesOverlap([new Date(a.start_date), aEnd], [new Date(b.start_date), bEnd]);
};

const updateTasksStore = (tasks: Task[]): Task[][] => {
	const swimlanes: Task[][] = [[]];
	const sorted = [...tasks].sort((a, b) => {
		if (a.weight !== b.weight) {
			return a.weight > b.weight ? 1 : -1;
		}

		return a.start_date > b.start_date ? 1 : -1;
	});

	sorted.forEach((task) => {
		// Since we are iterating through the tasks sorted by weight, we need to check the last swimlane
		// in which they do not overlap
		let lastCollisionIndex = 0;
		swimlanes.forEach((lane, i) => {
			lane.forEach((laneTask) => {
				if (doTasksOverlap(task, laneTask)) {
					lastCollisionIndex = i + 1;
				}
			});
		});

		if (lastCollisionIndex < swimlanes.length) {
			swimlanes[lastCollisionIndex].push(task);
		} else {
			swimlanes.push([task]);
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
		const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
		// Check if error is due to authentication issues
		if (!res.ok && res.status === 401) {
			showAuthDialog.set(true);
		}

		const tasks: Task[] = await res.json();
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

export const updateTask = (newTask: Task) => {
	// In order to keep it simple, we will
	// - Update the list form the tasks list
	// - Recalculate the swimlanes
	tasksStore.update((store) => {
		if (!store.tasks) {
			return store;
		}

		const updatedTasks = store.tasks.map((task) => (task.id === newTask.id ? newTask : task));
		return {
			...store,
			tasks: updatedTasks,
			swimlanes: updateTasksStore(updatedTasks),
		};
	});
};
