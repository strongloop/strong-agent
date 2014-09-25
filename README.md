# strong-agent

Profile and control Node.js processes and clusters using StrongOps.

**NOTE: This project is not released under an open source license. We welcome
bug reports as we continue development, but we are not accepting pull requests
at this time.**

## Using strong-agent

See [the full documentation](http://docs.strongloop.com/strong-agent).

## Summary

[Register](https://strongloop.com/register/) with StrongLoop.  It's free for evaluation.

Then:

    npm install -g strong-cli
    slc update
    cd .../where/your/app/is
    slc strongops # ... provide email/password
    slc run your_server.js

Go to the [dashboard](https://strongloop.com/ops/dashboard) to see your
application.

## Configuration

strong-agent requires an API key and application name, and will not start
profiling without them.

### API Key

Can be defined in:

- `userKey`: in profile's `userKey` argument
- `STRONGLOOP_KEY`: in the environment
- `userKey`: in strongloop.json (typically created with `slc strongops`)

### Metrics License

Can be defined in:

- `STRONGLOOP_LICENSE`: in the environment
- `agent_license`: in strongloop.json

Using custom metrics (the `.use()` and dynamic object tracking start-stop APIs)
requires a license, please contact
[sales@strongloop.com](mailto:sales@strongloop.com).

### Application Name

Can be defined in:

- `appName`: in profile's `appName` argument
- `STRONGLOOP_APPNAME`: in the environment
- `name`: in package.json (typical location)
- `appName`: in strongloop.json (not typical, most package.json has a `name`)

### Proxy

Proxy defined as `protocol://[user:pass@]domain[:port]`, where protocol is one
of "http", "https", or "https+noauth". The `user:pass@` is optional, as is
`:port`.

Can be defined in:

- `proxy`: in options
- `https_proxy`,`HTTPS_PROXY`,`http_proxy`,`HTTP_PROXY`: in the environment
  (lower-case proxy environment variables are traditional on some systems,
  and these variables may be present already if a proxy is required)
- `proxy`: in strongloop.json

Default is none.

### Endpoint

There is no reason to configure this, except to use HTTP instead of HTTPS if
your environment prevents outgoing HTTPS.

- `endpoint` in options
- `STRONGLOOP_ENDPOINT`: in environment
- `endpoint` in strongloop.json

Default is `https://`, it can be defined as `http://` if necessary.

### Metrics API

strong-agent provides hooks for integration with other metrics aggregators,
like [statsd](https://github.com/etsy/statsd/).  An example application can
be found [here](https://github.com/strongloop/strong-agent-statsd).

Usage is straightforward:

```javascript
require('strong-agent').use(function(name, value) {
  console.log('%s=%d', name, value);
});
```

Names are always strings and values are always numbers.  The agent reports
metrics at a currently fixed interval of 60 seconds.  The reported metrics
are for the last interval only, i.e. they cover only the last 60 seconds.
All values are for the current process only.

* `cpu.system`

  System CPU time.  CPU time spent inside the kernel on behalf of the
  process, expressed as a percentage of wall clock time.  Can exceed
  100% on multi-core systems.

  CPU time is the subset of wall clock time where the CPU is executing
  instructions on behalf of the process, i.e. where the process or its
  corresponding kernel thread is actually running.

* `cpu.total`

  Total CPU time.  Sum of user and system time, expressed as a percentage
  of wall clock time.  Can exceed 100% on multi-core systems.

  CPU time is the subset of wall clock time where the CPU is executing
  instructions on behalf of the process, i.e. where the process or its
  corresponding kernel thread is actually running.

* `cpu.user`

  User CPU time.  CPU time directly attributable to execution of the
  userspace process, expressed as a percentage of wall clock time.
  Can exceed 100% on multi-core systems.

  CPU time is the subset of wall clock time where the CPU is executing
  instructions on behalf of the process, i.e. where the process or its
  corresponding kernel thread is actually running.

* `gc.heap.used`

  The part of the V8 heap that is still in use after a minor or major
  garbage collector cycle, expressed in bytes.

  The V8 heap is where JS objects and values are stored, excluding integers
  in the range -2,147,483,648 to 2,147,483,647.  (FIXME: exact range differs
  for ia32 and x64.)

* `heap.total`

  Total size of the V8 heap, expressed in bytes.

  The V8 heap is where JS objects and values are stored, excluding integers
  in the range -2,147,483,648 to 2,147,483,647.  (FIXME: exact range differs
  for ia32 and x64.)

* `heap.used`

  The part of the V8 heap that is currently in use.  Expressed in bytes.

  The V8 heap is where JS objects and values are stored, excluding integers
  in the range -2,147,483,648 to 2,147,483,647.  (FIXME: exact range differs
  for ia32 and x64.)

* `http.connection.count`

  Number of new HTTP connections in the last interval.  (FIXME: Tracks only
  one HTTP server per process and it's not very deterministic what server
  that is.  Fortunately, most applications start only one server.)

* `loop.count`

  The number of event loop ticks in the last interval.

* `loop.minimum`

  The shortest (i.e. fastest) tick in milliseconds.

* `loop.maximum`

  The longest (slowest) tick in milliseconds.

* `loop.average`

  The mean average tick time in milliseconds.

* `messages.in.count`

  Number of received [strong-mq][] or [axon][] messages.

* `messages.out.count`

  Number of sent [strong-mq][] or [axon][] messages.

### Object tracking

The agent can optionally track the creation and reclamation of JS objects over
time.  Tracking objects is an indispensable tool for hunting down memory leaks
but as it imposes some CPU and memory overhead, it's disabled by default.

* `agent.metrics.startTrackingObjects()`

  Start tracking objects.

  Object tracking works by taking snapshots of the JavaScript heap at times
  `t0` and `t1`, then calculating their set difference and intersection.
  To a first approximation, memory overhead is `O(n)` and computational
  complexity `O(n * lg n)`, where `n` is the number of objects in the
  snapshots.

* `agent.metrics.stopTrackingObjects()`

  Stop tracking objects.  No further metrics will be reported.

When enabled, the following metrics are reported at 15 second intervals:

* `object.<type>.count`

  The number of objects created and reclaimed of type `<type>` in the last
  interval.  `<type>` is the name of the constructor that created the object,
  e.g. `Array`, `Date`, etc.

  If the count is less than zero, it means more objects have been reclaimed
  than created.

  Due to a known bug in the version of V8 that is bundled with node.js v0.10,
  it is possible that the reported number is slightly lower than the actual
  instance count.  Node.js v0.11 and newer are not affected.

* `object.<type>.size`

  The total size of the objects created and reclaimed of type `<type>` in
  the last interval.  `<type>` is the name of the constructor that created
  the object, e.g. `Array`, `Date`, etc.

  If the size is less than zero, it means more objects have been reclaimed
  than created.

### CPU profiling

The agent has a built-in CPU profiler that produces output in a format that can
be imported into the [Chrome Developer Tools][].  The profiler is available with
Node.js v0.11 and up.

* `agent.metrics.startCpuProfiling()` - Start the CPU profiler.  Throws an
  Error when the CPU profiler is unavailable.

  Calling this method multiple times is mostly harmless: the first call starts
  the profiler, successive calls are no-ops.

* `agent.metrics.stopCpuProfiling()` - Stop the CPU profiler.  Returns the
  CPU profiler information as a JSON string that can be saved to disk for
  further inspection.  Throws an Error when the CPU profile is unavailable, or
  has not been started.

  The filename must have a `.cpuprofile` suffix in order for the
  [Chrome Developer Tools] importer to recognize it.

Example usage:

```javascript
// Start collecting CPU profile traces whenever the
// average event loop tick time exceeds 100 ms.
var agent = require('strong-agent');
var fs = require('fs');
var profiling = false;

agent.use(function(name, value) {
  if (name !== 'loop.average') return;
  if (value > 100) {
    if (profiling === true) return;
    agent.metrics.startCpuProfiling();
    profiling = true;
  } else if (profiling === true) {
    var filename = 'CPU-' + Date.now() + '.cpuprofile';
    var data = agent.metrics.stopCpuProfiling();
    fs.writeFileSync(filename, data);
    profiling = false;
  }
});
```

### Custom metrics

Custom metrics can be injected dynamically into running node processes, and will
be reported via the [Metrics API](metrics-api).

Currently, custom metrics can only be injected by using the command line, `slc
runctl patch ...`, see [strong-supervisor][] for information on how to call it.

Supported metrics are counts and timers.

Counts can be incremented and decremented, and require no context.

Timers have a start, and a stop, and require a unique context capable of having
a timer property created.

Patch files are JSON descriptions of a patch set. A patchset is:

```
{
  FILESPEC: [
    PATCH,
    ...
  ],
  ...
}
```

The `FILESPEC` is a regex string long enough to uniquely match a script name.
`index.js` is unlikely to be unique, `your-app/index.js` is probably unique.
Note that the script names matched against are fully qualified when they were
required (so lengthening the file path can always result in a unique spec), and
short when builtin to node (`^util.js$`).

A file may have multiple patches applied. A patch is:

```
{
  type: TYPE,
  line: LINE,
  metric: METRIC,
  [context: CONTEXT,]
}
```

`TYPE` is one of:

- increment: increment the metric count
- decrement: decrement the metric count
- timer-start: start a metric timer
- timer-stop: stop a metric timer

`LINE` is the line number (the first line is line number `1`) at which the
metrics code will be inserted.

`METRIC` is a dot-separated metric name. It will have `custom.` prepended to
avoid conflict with built-in metric names, and will have either `.count` or
`.timer` appended (as appropriate), to indicate the type.

`CONTEXT` is a javascript expression that must result in an object that can
have a timer property created on it.

#### Example

With the following code in file `path/to/your-app/index.js`:

```
// Example server, for dynamic instrumentation
var http = require('http');

http.createServer(request).listen(process.env.PORT || 3000);

function request(req, res) {
  setTimeout(function() { // line 7
    res.end('OK\n'); // line 8
  }, Math.random() * 100);
}
```

The above can be patched to keep a count of concurrent requests and a timer for
each request by passing the following `patch.json` to `slc runctl patch`:

```
{
  "path/to/your-app/index": [
    { "type": "increment", "line": 7, "metric": "get.delay" },
    { "type": "decrement", "line": 8, "metric": "get.delay" },
    { "type": "timer-start", "line": 7, "metric": "get.delay", "context": "res" },
    { "type": "timer-stop", "line": 8, "metric": "get.delay", "context": "res" }
  ]
}
```

In order to design your patch set, consider what the effect of the patch
insertion will be. Patches must be lexically valid at the insertion point,
which is always the beginning of the line. The above patch set will,
conceptually, result in the patched file looking like:

```
// Example server, for dynamic instrumentation
var http = require('http');

http.createServer(request).listen(process.env.PORT || 3000);

function request(req, res) {
res.___timer = start('get.delay');increment('get.delay');  setTimeout(function() { // line 7
res.___timer.stop();decrement('get.delay');   res.end('OK\n'); // line 8
  }, Math.random() * 100);
}
```

Note from the above:

- Patches must by valid when inserted at the beginning of the specified line.
- Patches can be cumulative, and previous patches don't change the line
  numbering of the file.
- The context is used to store a timer on start, that can be accessed on stop.
  The context expression does not have to be identical for start and stop, but
  must evaluate to the same object.
- Duplicate stops as well as non-existence of a timer are ignored.
- Metrics can have the same name, since the type is appended.


[axon]: https://github.com/visionmedia/axon
[strong-mq]: https://github.com/strongloop/strong-mq
[strong-supervisor]: https://github.com/strongloop/strong-supervisor
[Chrome Developer Tools]: https://developer.chrome.com/devtools/docs/cpu-profiling
