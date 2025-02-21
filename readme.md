# wait-group-ts

> WaitGroup for JavaScript/TypeScript

## Install

```sh
npm install wait-group-ts
```

## Usage

### Wait for tasks to complete
```js
import newWaitGroup from 'wait-group-ts';

const wg = newWaitGroup(10);

// Task 1
(async () => {
	await wg.add();
	try {
		// Do task 1
	} finally {
		wg.done();
	}
})() ;

// Task 2
(async () => {
	await wg.add();
  try {
    // Do task 2
  } finally {
    wg.done();
  }
})();

await wg.wait();
```

### Rate limit tasks
```js
import newWaitGroup from 'wait-group-ts';

// Limit the number of concurrent tasks to 10
const wg = newWaitGroup(10); 

for (let i = 0; i < 100; i++) {
	(async () => {
		await wg.add();
		try {
      console.log(`Processing task ${i}`);
      await new Promise(resolve => setTimeout(resolve, 100));
		} finally {
			wg.done();
		}
	})();
}

await wg.wait();

```

## API

### newWaitGroup(limit)

#### limit

Type: `number`

The number of concurrent tasks to limit.

### add() - `Promise<void>`

Add a task to the wait group. Returns a promise that resolves when the task is added. Blocks if the limit is reached.

### done() - `void`

Remove a task from the wait group.

### wait() - `Promise<void>`

Wait for all tasks to complete. Returns a promise that resolves when all tasks are complete.

### count() - `number`

Get the number of tasks currently executing in the wait group.