/* eslint-disable @typescript-eslint/no-explicit-any */

export type Task = {
	attachments: any[];
	color: null;
	color_id: null;
	comments: Array<string | number>; // Ad-hoc field - the response returns the ids of the comments
	created_at: string;
	created_by: number;
	daily_estimated_minutes: number;
	done_checklist_items_count: number;
	end_date: string;
	end_time: null;
	estimate_skips_weekend: boolean;
	estimate_type: string;
	estimated_minutes: number;
	folder_id: null;
	has_notes: boolean;
	id: number;
	is_last_repetition: boolean;
	name: string;
	notes?: string; // Ad-hoc added field
	original_repeated_task_id: null;
	parent_id: null;
	plan_id: number;
	plan_status_id: number;
	plan_status_position: number;
	repetition_rule: null;
	start_date: string;
	start_time: null;
	tag_ids: any[];
	task_type: string;
	timeline_segment_id: number;
	total_checklist_items_count: number;
	tracked: boolean;
	tracking: null;
	updated_at: string;
	updated_by: number;
	visible_properties: string[];
	weight: number;
	workspace_members: number[];
};
