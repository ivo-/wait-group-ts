export default function newWaitGroup(limit) {
	const tasks = [];

	const add = async () => {
		if (tasks.length >= limit) {
			await tasks[0].pr;
			return add();
		}

		let resolver;
		const task = new Promise(resolve => {
			resolver = resolve;
		});
		tasks.push({pr: task, resolve: resolver});
	};

	const done = () => {
		tasks.shift()?.resolve();
	};

	const wait = async () => {
		if (tasks.length === 0) {
			return;
		}

		await Promise.all(tasks.map(t => t.pr));
		return wait();
	};

	const count = () => tasks.length;

	return {
		add,
		wait,
		done,
		count,
	};
}
