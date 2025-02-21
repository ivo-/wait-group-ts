export type WaitGroup = {
	/** Adds a new task to the wait group */
	add(): Promise<void>;
	/** Marks a task as done */
	done(): void;
	/** Waits for all tasks to complete */
	wait(): Promise<void>;
	/** Returns the current number of tasks */
	count(): number;
};

/**
 * Creates a new WaitGroup that limits concurrent tasks
 * @param limit - Maximum number of concurrent tasks
 */
export function newWaitGroup(limit: number): WaitGroup;
