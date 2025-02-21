/* eslint-disable no-promise-executor-return */
import test from 'ava';
import newWaitGroup from './index.js';

test('WaitGroup - should limit concurrent tasks', async t => {
	const wg = newWaitGroup(2);

	wg.add();
	wg.add();
	t.is(wg.count(), 2);
	const task3 = wg.add();
	const task4 = wg.add();
	t.is(wg.count(), 2);
	await new Promise(resolve => setTimeout(resolve, 10));
	t.is(wg.count(), 2);
	wg.done();
	await task3;
	t.is(wg.count(), 2);
	wg.done();
	await task4;
	t.is(wg.count(), 2);
	wg.done();
	wg.done();
	t.is(wg.count(), 0);
});

test('WaitGroup - should run in correct order', async t => {
	const wg = newWaitGroup(2);
	const order = [];

	const jobs = [
		async () => {
			await wg.add();
			await new Promise(resolve => setTimeout(resolve, 5));
			order.push(1);
			wg.done();
		},
		async () => {
			await wg.add();
			await new Promise(resolve => setTimeout(resolve, 10));
			order.push(2);
			wg.done();
		},
		async () => {
			await wg.add();
			await new Promise(resolve => setTimeout(resolve, 15));
			order.push(3);
			wg.done();
		},
		async () => {
			await wg.add();
			await new Promise(resolve => setTimeout(resolve, 20));
			order.push(4);
			wg.done();
		},
		async () => {
			await wg.wait();
			order.push(5);
		},
	];

	await Promise.all(jobs.map(index => index()));
	t.deepEqual(order, [1, 2, 3, 4, 5]);
});

test('WaitGroup - should resolve wait() when all tasks complete', async t => {
	const wg = newWaitGroup(2);
	let completed = 0;

	const tasks = Array.from({length: 3}, async () => {
		await wg.add();
		await new Promise(resolve => setTimeout(resolve, 10));
		completed++;
		wg.done();
	});

	await Promise.all(tasks);
	await wg.wait();

	t.is(completed, 3);
});

test('WaitGroup - should handle rapid add/done calls', async t => {
	const wg = newWaitGroup(1);
	const results = [];

	// Rapidly add and complete 100 tasks
	const tasks = Array.from({length: 100}, async (_, i) => {
		await wg.add();
		results.push(i);
		wg.done();
	});

	await Promise.all(tasks);
	await wg.wait();

	t.is(results.length, 100);
	// Results should be in order due to the limit of 1
	t.deepEqual(results, [...Array.from({length: 100}).keys()]);
});

