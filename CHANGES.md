2015-06-03, Version 1.6.0
=========================

 * test: dyninst patch test unsupported for 0.12.4 (Sam Roberts)

 * test: account for unpredictable gc.heap.used (Sam Roberts)

 * test: use agent.start() to avoid strongops (Sam Roberts)

 * agent: watchdog trapping epoll_pwait() or _wait() (Sam Roberts)

 * test: reset HOME to disable .strongloop licenses (Sam Roberts)

 * test: patch test not working on v8 4.2 (Sam Roberts)

 * test: account for watchdog metric in interval (Sam Roberts)

 * agent: note reason for disabling strongops (Sam Roberts)

 * test: ignore .strongloop licenses in neg test (Sam Roberts)

 * test: remove agent-early-logging (Sam Roberts)

 * agent: write debug output on license check (Sam Roberts)

 * test: debug output from log expect helper (Sam Roberts)

 * test: fix failing https test, don't force RC4-SHA (Ben Noordhuis)

 * test: fix broken http upgrade test (Ben Noordhuis)

 * agent: support strong-oracle as well as oracle (Sam Roberts)

 * test: express metrics now has a version field (Sam Roberts)

 * agent: add agent.internal.supports.watchdog flag (Ben Noordhuis)

 * agent: connect agent DB probes to strong-trace (Setogit)

 * agent: Wrap MongoDB Collection instead of Db (Setogit)

 * agent: add CLOCK_MONOTONIC_COARSE time function (Ben Noordhuis)


2015-05-06, Version agent/1.5.1
===============================

 * agent: use the .license key from license.json (Sam Roberts)


2015-05-06, Version agent/1.5.0
===============================

 * agent: licenses from ~/.strongloop/licenses.json (Ryan Graham)

 * agent: add watchdog activation counter (Ben Noordhuis)

 * agent: fix suspending the profiler thread (Ben Noordhuis)

 * agent: remove long notice about StrongOps (Sam Roberts)

 * dyninst: assert on failure, instead of indexing undefined (Sam Roberts)

 * test: skip test if race is triggered (Sam Roberts)

 * test: use regex to skip unsupported v8 versions (Sam Roberts)


2015-04-08, Version agent/1.4.0
===============================

 * add support for ':' delimited licenses (Ryan Graham)

 * agent: add more checks to metrics test (Ben Noordhuis)

 * agent: document HTTP client probe in README (Sam Roberts)

 * test: print tap-compatible skip message (Ben Noordhuis)

 * agent: use /proc/self in watchdog thread finder (Ben Noordhuis)

 * agent: generate license in watchdog test (Ben Noordhuis)

 * lib: add missing eof NLs (Sam Roberts)

 * Intercept and forward strong-express-metrics data (Miroslav Bajtoš)

 * agent: skip DI patch tests on iojs-v1.0.4 (Ryan Graham)


2015-01-21, Version agent/1.3.2
===============================

 * agent: do not package tag files (Sam Roberts)


2015-01-21, Version agent/1.3.1
===============================

 * src: fix build for v8 3.28.73 (node v0.11.15) (Sam Roberts)


2015-01-21, Version agent/1.3.0
===============================

 * test: skip DI patch tests on iojs-v1.0.x (Ryan Graham)

 * agent: make compatible with io.js v1.0 (Ben Noordhuis)

 * agent: emit 'topCalls' events on agent object (Ben Noordhuis)

 * agent: remove dead transaction chain code (Ben Noordhuis)

 * agent: add transaction chain tracking test (Ben Noordhuis)

 * agent: add agent.poll() method for testing (Ben Noordhuis)

 * agent: clean up timer class (Ben Noordhuis)

 * agent: remove unused timer.cputime property (Ben Noordhuis)

 * agent: rename internal 'i::stats' event (Ben Noordhuis)

 * agent: rename internal 'i::send' event (Ben Noordhuis)

 * agent: rename internal 'i::counts' event (Ben Noordhuis)

 * agent: emit 'topCalls' event on agent.internal obj (Ben Noordhuis)

 * test: Slow down test-addon-missing interval (Ryan Graham)

 * test: skip dyninst on v8 3.28.73 (Ryan Graham)

 * test: fix v8 version check for 3.28.73 (Ryan Graham)

 * test: loosen time elapsed test (Ryan Graham)

 * test: ensure we are connecting to valid addresses (Ryan Graham)

 * test: more complete escaping of version regex (Ryan Graham)

 * agent: use portable path pattern in mysql probe (Ryan Graham)

 * agent: remove dependency on shell for tests (Ryan Graham)

 * web: fix blog URL (Ryan Graham)

 * agent: cpu-start logs when it has a timeout (Sam Roberts)

 * agent: unbreak top functions functionality (Ben Noordhuis)

 * agent: remove sinon test dependency (Ben Noordhuis)


2014-12-17, Version agent/1.2.1
===============================

 * agent: move loop addon check from init to poll (Ryan Graham)

 * test: failing test for when addon is missing (Ryan Graham)


2014-12-15, Version agent/1.2.0
===============================

 * agent: add tiers.* prefix to tiers metrics (Ryan Graham)

 * test: skip unpatch test on buggy versions of v8 (Ryan Graham)

 * test: loosen timer on test-custom-stats test (Ryan Graham)

 * agent: remove commented out code (Ben Noordhuis)

 * agent: fix riak-js probe (Ben Noordhuis)

 * agent: make poll start/stop events public (Ben Noordhuis)

 * agent: emit poll start/stop events (Ben Noordhuis)

 * agent: make metrics collection poll-based (Ben Noordhuis)

 * agent: format lib/timer.js (Ben Noordhuis)

 * agent: throw exception if watchdog is unsupported (Ben Noordhuis)

 * agent: fix size calculation in c++ counters code (Ben Noordhuis)

 * Add CHANGES.md to strongops (Sam Roberts)


2014-12-05, Version agent/1.1.2
===============================

 * agent: v1.1.2 (Ryan Graham)

 * agent: fix rendering of table in README (Ryan Graham)

 * strongops: Make Procfile match deployment (Ryan Graham)

 * package: use debug v2.x in all strongloop deps (Sam Roberts)


2014-12-05, Version agent/1.1.1
===============================

 * agent: v1.1.1 (Sam Roberts)

 * Add section headings for metrics documentation (Sam Roberts)

 * test: ensure interval is set for collector tests (Ryan Graham)

 * test: inject license before .use() tests (Ryan Graham)

 * test: clear licenses before running test suite (Ryan Graham)

 * agent: allow multiple licenses (Ryan Graham)

 * agent: reduce intervals to single configuration (Ryan Graham)

 * agent: refactor top-functions (Ryan Graham)

 * agent: fix indentation (Ryan Graham)

 * agent: change default interval from 60s to 15s (Ryan Graham)

 * agent: make interval configurable (Ryan Graham)

 * agent: allow configuring without starting (Ryan Graham)

 * agent: safer Agent initialization (Ryan Graham)

 * agent: replace agent.metrics POJO with constructor (Ryan Graham)

 * agent: replace tap with npmjs.org version (Ryan Graham)

 * agent: remove unused jwt-simple dependency (Ryan Graham)

 * agent: remove underscore dependency (Ryan Graham)

 * agent: add documentation for probe metrics (Ben Noordhuis)

 * agent: rename tiers metric names (Ben Noordhuis)

 * agent: add min/max metrics to call counts (Ben Noordhuis)

 * agent: optimize tiers mean average calculation (Ben Noordhuis)

 * agent: remove expensive tiers Object.keys() call (Ben Noordhuis)

 * agent: flatten callback christmas tree in tests (Ben Noordhuis)

 * agent: optimize call counts infrastructure (Ben Noordhuis)

 * agent: delete obsolete comment from lib/counts.js (Ben Noordhuis)

 * test: clear license before missing license test (Ryan Graham)

 * agent: fix VS 2013 build (Ben Noordhuis)

 * agent: fix up error message on missing app name (Ben Noordhuis)

 * agent: fix up type in compat shim Return() method (Ben Noordhuis)

 * agent: fix build with VS < 2013 (Ben Noordhuis)

 * agent: add timeout arg to startCpuProfiling() (Ben Noordhuis)

 * agent: only keep reference to what we need (Ben Noordhuis)

 * agent: fix agent/cpu profiler circular dependency (Ben Noordhuis)

 * agent: don't scan arguments for callback twice (Ben Noordhuis)

 * agent: test avg query time in call counts test (Ben Noordhuis)

 * agent: add tests for mongodb, mysql, redis probes (Ben Noordhuis)

 * agent: fix edge case TypeError in redis probe (Ben Noordhuis)

 * agent: add dev mode escape hatch to license check (Ben Noordhuis)

 * agent: fix non-linux build (Ben Noordhuis)

 * lib: make watchdog cpu profiling a paid feature (Ben Noordhuis)

 * agent: add histogram function shims (Ben Noordhuis)

 * agent: add event loop watchdog (Ben Noordhuis)

 * agent: document v0.10 profiler capabilities (Ben Noordhuis)


2014-10-28, Version agent/1.0.3
===============================

 * agent: v1.0.3 (Sam Roberts)

 * agent: fix heapdiff test with v8 >= 3.28 (Ben Noordhuis)

 * agent: make .cpuprofile output work with v0.10 (Ben Noordhuis)

 * test: fix flaky dyninst timing test (Sam Roberts)


2014-10-14, Version agent/1.0.2
===============================

 * agent: 1.0.2 (Sam Roberts)

 * agent: don't call Reset() in Persistent destructor (Ben Noordhuis)

 * agent: escape backslashes in .cpuprofile output (Ben Noordhuis)


2014-10-08, Version agent/1.0.1
===============================

 * agent: v1.0.1 (Sam Roberts)

 * agent: fix windows build (Bert Belder)

 * agent: squelch msvc integer conversion warning (Bert Belder)

 * agent: v1.0.0 (Sam Roberts)

 * agent: wrap di metrics patches in try/catch (Sam Roberts)

 * agent: improve patch examples and tests (Sam Roberts)

 * agent: log start/stop of cpu profiler (Sam Roberts)

 * agent: make profiler use CpuProfiler compat shim (Ben Noordhuis)

 * agent: add CpuProfiler compat shim (Ben Noordhuis)

 * agent: rewrite COMPAT_NODE_VERSION macro (Ben Noordhuis)

 * agent: remove SL_NODE_VERSION macro (Ben Noordhuis)

 * agent: rework SL_PLATFORM macros (Ben Noordhuis)

 * agent: replace memcmp() with Compare() (Ben Noordhuis)

 * agent: remove unnecessary v8:: qualifier (Ben Noordhuis)

 * agent: add counter aggregation infrastructure (Ben Noordhuis)

 * agent: add WakeUp::Stop() method (Ben Noordhuis)

 * agent: fix wakeup bug, clear queue (Ben Noordhuis)

 * agent: rename SL_CALLBACK_PROPERTIES_MAP (Ben Noordhuis)

 * agent: don't process.nextTick() in metrics.add() (Ben Noordhuis)

 * agent: don't use object literal for dictionary (Ben Noordhuis)

 * agent: remove unused _count metric attribute (Ben Noordhuis)

 * agent: remove unused info send buffer (Ben Noordhuis)

 * agent: remove loop metrics send buffer (Ben Noordhuis)

 * agent: remove metrics send buffer (Ben Noordhuis)

 * agent: remove tiers send buffer (Ben Noordhuis)

 * agent: dynamic injection of statsd-like metrics (Sam Roberts)

 * agent: add support for custom statsd-like metrics (Sam Roberts)

 * agent: remove test dependency on method count (Sam Roberts)

 * agent: comment the dyninst API, and expose Debug (Sam Roberts)

 * agent: use a mailto link for sales@support.com (Sam Roberts)

 * agent: fix typo in namespace name (Ben Noordhuis)

 * agent: don't make agent object undetectable (Ben Noordhuis)

 * agent: avoid empty sender:tiers debug messages (Sam Roberts)

 * agent: add require() method to global agent object (Ben Noordhuis)

 * agent: add dynamic instrumentation sample app (Ben Noordhuis)

 * agent: implement dynamic instrumentation (Ben Noordhuis)

 * agent: add ASSERT() and CHECK() macros (Ben Noordhuis)

 * agent: remove ContainerOf() helper (Ben Noordhuis)

 * agent: considerably simplify gcinfo logic (Ben Noordhuis)

 * agent: add GetHeapStatistics() compat shim (Ben Noordhuis)

 * agent: use lazy static baton for gcinfo (Ben Noordhuis)

 * agent: add Lazy<T> for placement new instantiation (Ben Noordhuis)

 * agent: add inline keywords to gcinfo Baton methods (Ben Noordhuis)

 * agent: make gcinfo use wakeup infrastructure (Ben Noordhuis)

 * agent: factor out event wakeup logic (Ben Noordhuis)

 * agent: add typesafe-ish ContainerOf() helper (Ben Noordhuis)

 * agent: fix regression in test-agent-metrics.js (Ben Noordhuis)

 * agent: don't call Local<T>::New() when converting (Ben Noordhuis)

 * agent: add Throw() functions to compat shim (Ben Noordhuis)

 * agent: update .clang-format to r217573 (Ben Noordhuis)

 * agent: some more js linting (Ben Noordhuis)

 * agent: clean up minor style violations (Ben Noordhuis)

 * agent: update copyright boilerplate in Makefile (Ben Noordhuis)

 * agent: add clang-format target to package.json (Ben Noordhuis)

 * agent: update c++ clang-format rules (Ben Noordhuis)

 * agent: format js and c++ with clang-format (Ben Noordhuis)

 * agent: add note to README about v0.10 heapdiff bug (Ben Noordhuis)

 * agent: use consistent filenames (Ben Noordhuis)

 * agent: format javascript source with clang-format (Ben Noordhuis)

 * agent: fix heapdiff algorithm for node.js v0.12 (Ben Noordhuis)

 * agent: add missing inline keywords (Ben Noordhuis)

 * agent: add heap snapshotting compat shim (Ben Noordhuis)

 * agent: format with `clang-format --style=google` (Ben Noordhuis)

 * agent: add v8::Boolean::New() shim (Ben Noordhuis)

 * agent: change compat shim license, alter namespace (Ben Noordhuis)

 * agent: sales@strongloop.com for license questions (Ryan Graham)

 * agent: update README to mention metrics license (Sam Roberts)

 * agent: Use STRONGLOOP_ for agent configuration (Sam Roberts)

 * web: add EU retion to Heroku addon list (Ryan Graham)


2014-08-27, Version agent/0.4.14
================================

 * agent: v0.4.14 (Ryan Graham)

 * agent: v0.4.14-1 (Ryan Graham)

 * agent: add test license generator (Ryan Graham)

 * agent: Require license for .use(), object tracking (Ryan Graham)

 * agent: Slow down agent-metrics test for CI (Ryan Graham)

 * agent: workaround for tests under v0.11.x (Ryan Graham)

 * agent: improve debugability of heapdiff test (Ryan Graham)

 * agent: update test to expect thrown Error (Ryan Graham)

 * agent: slow down test-metrics-control (Ryan Graham)

 * agent: use relative require in tests (Ryan Graham)

 * agent: don't lint 3rd party code (Ryan Graham)

 * test: slow down queue-while-connecting intervals (Ryan Graham)

 * agent: refine binding object callback approach (Ben Noordhuis)

 * agent: emit gc stats on binding object callback (Ben Noordhuis)

 * agent: keep reference to binding object (Ben Noordhuis)


2014-08-11, Version agent/0.4.13
================================

 * agent: v0.4.13 (Sam Roberts)

 * web: log 'slc strongops' login success (Ryan Graham)


2014-07-29, Version production-2014-07-31-0921
==============================================



2014-07-29, Version staging-2014-07-30-0915
===========================================

 * api: Use session.email for email lookup (Ryan Graham)

 * agent: throw Error when cpu profiling unsupported (Sam Roberts)


2014-07-14, Version staging-2014-07-25-1001
===========================================

 * register: update tests, register deprecated (Ryan Graham)

 * web: Remove /ops/rest/register (Ryan Graham)

 * web: extend wp-api tests (Ryan Graham)


2014-07-17, Version agent/0.4.12
================================

 * agent: v0.4.12 (Sam Roberts)

 * agent: Require key for Agent API use (Ryan Graham)

 * agent: report version for .use() or .profile() (Ryan Graham)

 * agent: move arg parsing from agent.js to config.js (Sam Roberts)

 * agent: message encoding removed from transport (Sam Roberts)

 * agent: allow simultaneous transport and metrics (Sam Roberts)

 * agent: rename http.connections metric (Ben Noordhuis)

 * agent: fix windows 7 runtime abort (Ben Noordhuis)

 * samples: add controller sample app (Ben Noordhuis)

 * agent: fix msvc 2012 build error (Ben Noordhuis)

 * agent: inherit from std::iterator<> (Ben Noordhuis)

 * agent: remove two unused variables (Ben Noordhuis)

 * agent: note in readme about contributions (Ryan Graham)

 * agent: rename license file (Ryan Graham)

 * agent: Add repository and bug urls to package.json (Ryan Graham)

 * agent: config is an agent property, not global (Sam Roberts)

 * agent: remove dependency of topFunctions on nodeflyConfig (Sam Roberts)

 * agent: timer intervals passed to component init functions (Sam Roberts)

 * agent: don't start tiers timer until .init() (Sam Roberts)


2014-07-08, Version agent/0.4.11
================================

 * agent: v0.4.11 (Sam Roberts)

 * agent: fix proxy.callback() bug (Ben Noordhuis)

 * agent: pass agent instance explicitly to modules (Ben Noordhuis)

 * agent: remove timer proxies (Ben Noordhuis)

 * agent: avoid reserved words (Ryan Graham)

 * Increase handshake threshold in test (Ryan Graham)

 * test: export test DB details (Ryan Graham)


2014-07-04, Version agent/0.4.10
================================

 * agent: incorrect use of config causing timer loop (Sam Roberts)

 * Revert "agent: test all documented metrics are reported" (Ben Noordhuis)

 * agent: test all documented metrics are reported (Sam Roberts)

 * agent: do not sanitize away loop counts (Sam Roberts)

 * agent: remove FixedString function (Ben Noordhuis)


2014-06-19, Version agent/0.4.9
===============================

 * agent: v0.4.9 (Sam Roberts)

 * Update architecture diagram to show HTTP (Ryan Graham)

 * agent: add heap profiler start/stop api (Ben Noordhuis)


2014-06-11, Version agent/0.4.8
===============================

 * agent: v0.4.8 (Sam Roberts)

 * agent: Fixed missing PUT /model/:id (Krishna Raman)

 * agent: make json err.data property non-enumerable (Ben Noordhuis)

 * agent: log bad input on json decoder error (Ben Noordhuis)

 * agent: add .data property to json errors (Ben Noordhuis)

 * agent: fix style issue in lib/json.js (Ben Noordhuis)

 * agent: add cpu profiler api example to README (Ben Noordhuis)

 * agent: document cpu profiler start/stop api (Ben Noordhuis)

 * agent: list strong-agent license in package (Sam Roberts)

 * agent: add cpu profiler start/stop api (Ben Noordhuis)

 * agent: rework early logging (Ben Noordhuis)

 * common: Add quick script for truncating old data (Ryan Graham)

 * agent: report message probe metrics (Ben Noordhuis)

 * agent: fix early logging (Ben Noordhuis)

 * agent: emit all events on internal event emitter (Ben Noordhuis)


2014-06-02, Version agent/0.4.7
===============================

 * agent: v0.4.7 (Sam Roberts)

 * agent: introduce metrics-only mode (Ben Noordhuis)

 * agent: simplify gcinfo callback logic some more (Ben Noordhuis)

 * agent: simplify gcinfo callback logic (Ben Noordhuis)

 * agent: fix div-by-zero in queue metric (Ben Noordhuis)

 * agent: collect min event loop tick time (Ben Noordhuis)

 * agent: change function vars to functions proper (Ben Noordhuis)

 * collector: reduce query logging (Ryan Graham)

 * db: migrate MyISAM tables to InnoDB for faster snapshotting (Ryan Graham)


2014-05-29, Version production-2014-05-29-1452
==============================================



2014-05-29, Version staging-2014-05-29-1214
===========================================

 * agent: pre-filter data the collector ignores (Ryan Graham)

 * collector: Filter inserts into log3 (Ryan Graham)

 * agent: Use loopback 1.8.x for tests (Ryan Graham)

 * agent: simplify metrics tests (Ryan Graham)

 * agent: expose reconnect delay for tests (Ryan Graham)

 * agent: make sender interval configurable (Ryan Graham)

 * agent: Move async to devDependencies (Ryan Graham)

 * agent: Remove unused devDependency 'should' (Ryan Graham)

 * agent/test: Increase paranoia (Ryan Graham)

 * agent: Remove unused dependency restler (Ryan Graham)

 * agent: Remove unused/undocumented binaries (Ryan Graham)

 * agent: Remove dependency on node-measured (Ryan Graham)

 * agent: remove unused UrlAggregator.js (Ryan Graham)

 * agent: remove tiers dependency on node-measured (Ryan Graham)

 * agent: simplify counts (Ryan Graham)

 * agent: move counts interval to config (Ryan Graham)

 * web: update restler to avoid iconv build warnings (Sam Roberts)


2014-05-28, Version agent/0.4.6
===============================

 * agent: v0.4.6 (Sam Roberts)

 * agent: prune unused debug flag (Sam Roberts)

 * agent: support an alternate logger to node console (Sam Roberts)

 * agent: remove process.hrtime support check (Sam Roberts)

 * agent: allow mysql probe to work on Windows (Ryan Graham)

 * db: Index (pid, sessionId) on collector_sessions (Ryan Graham)

 * agent: fix semi-random crash in cpu profiler test (Ben Noordhuis)

 * agent: raise collectInterval in preconnect test (Ben Noordhuis)

 * agent: don't poll /proc or call out to ps(1) (Ben Noordhuis)

 * agent: reword wall clock time calculation (Ben Noordhuis)

 * agent: fix agent-proxy-basic-auth-fail test (Ben Noordhuis)

 * agent: rename CopyMemory() and CompareMemory() (Ben Noordhuis)

 * agent: add ReturnableHandleScope::Return() (Ben Noordhuis)

 * agent: consolidate v0.10 and v0.12 c++ code (Ben Noordhuis)

 * agent: use named imports in strong-agent.cc (Ben Noordhuis)

 * agent: use consistent argument names (Ben Noordhuis)

 * agent: replace Handle with Local (Ben Noordhuis)

 * agent: add SL_PLATFORM_* defines (Ben Noordhuis)


2014-05-22, Version production-2014-05-22-1225
==============================================

 * logger: Don't overwhelm production logs (Ryan Graham)


2014-05-22, Version agent/0.4.5
===============================



2014-05-22, Version production-2014-05-22-1150
==============================================

 * agent: v0.4.5 (Sam Roberts)

 * agent: make proxy method compiler arg count aware (Ben Noordhuis)

 * agent: patch all identical getters on object (Ben Noordhuis)

 * agent: make getter proxy idempotent (Ben Noordhuis)

 * agent: add getter proxy method tests (Ben Noordhuis)

 * agent: optimize method patching some more (Ben Noordhuis)

 * agent: optimize proxy methods (Ben Noordhuis)

 * agent: rewrite object method monkey-patching logic (Ben Noordhuis)

 * agent: remove unused arg from proxy.callback() (Ben Noordhuis)

 * agent: remove superfluous method proxy hook (Ben Noordhuis)

 * agent: add comment to no-op http probe (Ben Noordhuis)

 * agent: remove process.exit() from http probe (Ben Noordhuis)

 * agent: hide http.Server object tracking state (Ben Noordhuis)

 * agent: rename server_obj to httpServer (Ben Noordhuis)


2014-05-20, Version staging-2014-05-21-1138
===========================================

 * web: add preview tag to traces tab (Ryan Graham)

 * metrics-tail: Convert sessions cache LRU cache (Ryan Graham)

 * tail-metrics: Remove commented out code (Ryan Graham)

 * metrics-tail: Remove unused bad_sessions cache (Ryan Graham)

 * metrics-tail: Remove duplicate cache (Ryan Graham)

 * topcalls-tail: Remove dead code (Ryan Graham)

 * metrics-tail: Handle more agents (Ryan Graham)

 * agent: env var for increasing reporting frequency (Ryan Graham)

 * collector: Improve logging of SQL errors (Ryan Graham)

 * common: Use bunyan as production logger (Ryan Graham)

 * rollups: use common logger for rollup utilities (Ryan Graham)

 * mailer: Use common logger (Ryan Graham)

 * alerts: use common logger for all logging (Ryan Graham)

 * common: Use common-logger within nodefly-common (Ryan Graham)

 * web: Consolidate logging to use common logger (Ryan Graham)

 * src: Remove uhura from strong-agent (Ryan Graham)

 * api: Consolidate logging with common logger (Ryan Graham)

 * collector: Consolidate logging (Ryan Graham)


2014-05-20, Version staging-2014-05-20-1705
===========================================

 * collector: support memory profile stop over http (Sam Roberts)

 * agent: turn express shell tests into js tests (Ben Noordhuis)

 * agent: make express tests independent of $PWD (Ben Noordhuis)

 * agent: make `npm test` run only *.js tests (Ben Noordhuis)

 * agent: remove monkey-patched transport methods (Ben Noordhuis)

 * agent: remove unused callback argument (Ben Noordhuis)

 * web: fix random switch to CPU profiler view (seanbrookes)

 * agent,collector,web: robust profile start/stop (Sam Roberts)

 * agent: report addon presence in agent version (Sam Roberts)

 * makefile: db-recreate target recreates the DB (Sam Roberts)

 * samples: add minimal express app using agent 0.3.4 (Sam Roberts)

 * web: Don't rely on full_name from WordPress (Ryan Graham)

 * agent: consistent usage of SL_ENV (Sam Roberts)

 * agent: refactor removing single-use `env` variable (Sam Roberts)

 * web: Remove unused dependencies (Ryan Graham)

 * web: Move INTERCOM_SECRET into common config (Ryan Graham)

 * register: enable proper coverage of tests (Ryan Graham)

 * test: strip escape characters from kensa output (Ryan Graham)

 * test: Use test db for Heroku tests (Ryan Graham)

 * test: Extract common test utilities (Ryan Graham)

 * test: Add TODO for axon-app tests (Ryan Graham)

 * register/test: Move env var into test (Ryan Graham)

 * test: Increase timeouts for CI (Ryan Graham)

 * test: Use dirname $0 for base dir (Ryan Graham)

 * config: simplify test.env (Ryan Graham)

 * alerts/test: Update Alert.update test (Ryan Graham)

 * alerts/test: Fix bad time handling (Ryan Graham)

 * web: run tests without special config (Ryan Graham)

 * common: remove duplicate DB config (Ryan Graham)

 * common: give all configs dev defaults (Ryan Graham)

 * web,common: Move SL WP config into common config (Ryan Graham)

 * agent: test against express3 and express4 (Ryan Graham)

 * tests: Make wrapped agent tests match 'npm test' (Ryan Graham)

 * db: Index collector_session.sessionEnd (Ryan Graham)


2014-05-09, Version production-2014-05-09-1514
==============================================



2014-05-09, Version staging-2014-05-09-1036
===========================================

 * agent/test: Fix invalid counts test (Ryan Graham)

 * api,web: lookup user by email instead of id (Ryan Graham)

 * web: Use more direct login flow for Heroku SSO (Ryan Graham)

 * web: Don't advertize GitHub as auth option (Ryan Graham)

 * agent: don't clear name of callCounts metrics (Ryan Graham)

 * samples: Add sample app that uses axon (Ryan Graham)

 * agent: Add basic mq probe for visionmedia/axon (Ryan Graham)

 * collector: increase json size limit to 100MB (Sam Roberts)


2014-05-08, Version agent/0.4.4
===============================

 * agent: v0.4.4 (Sam Roberts)

 * agent,register: tweaks to config.js api (Sam Roberts)

 * agent,api,collector,web: remove error reporter (Ben Noordhuis)

 * agent,register: remove support of STRONGLOOP_PROXY (Sam Roberts)

 * agent: move ensureConfig() into config.js (Sam Roberts)

 * agent,register: refactor and cleanup configuration (Sam Roberts)

 * Procfile: give NODE a default value inline (Ryan Graham)

 * docs: move comments on metrics flow into docs/ (Sam Roberts)


2014-05-07, Version agent/0.4.3
===============================



2014-05-07, Version register/0.3.3
==================================

 * register: v0.3.3 (Sam Roberts)

 * agent: v0.4.3 (Sam Roberts)

 * register: support all proxy env variable names (Sam Roberts)

 * register: add http proxy support (Ben Noordhuis)

 * agent: fix formatting of password-less auth (Ben Noordhuis)

 * agent: also log warning on 407 status code (Ben Noordhuis)

 * agent: log proxy auth details (Ben Noordhuis)

 * agent: Add support for HTTPS_PROXY/HTTP_PROXY (Ryan Graham)

 * agent: add http proxy basic auth support (Ben Noordhuis)

 * agent: fix timing issue in loopback tiers test (Ben Noordhuis)


2014-05-04, Version staging-2014-05-04-1655
===========================================

 * collector: handle query object (Ryan Graham)

 * no-data-alert: Adjust threshold and interval (Ryan Graham)


2014-04-21, Version staging-2014-04-30-1543
===========================================

 * collector: close session on request end (Sam Roberts)

 * collector: check transport is open both ways (Sam Roberts)

 * collector: refactor session open/close (Sam Roberts)

 * readme: add more information about SQL structure (Sam Roberts)

 * readme: add information about which app IDs (Sam Roberts)

 * agent: consistent logging throughout agent (Sam Roberts)


2014-04-25, Version staging-2014-04-25-1704
===========================================



2014-04-25, Version production-2014-04-25-1739
==============================================

 * web: fix invalid stop request from Heap prof. UI (seanbrookes)


2014-04-25, Version staging-2014-04-25-1658
===========================================



2014-04-25, Version staging-2014-04-25-1645
===========================================

 * web: fix lingering breakdown by % slow path chart (seanbrookes)


2014-04-23, Version staging-2014-04-25-1700
===========================================

 * agent: Clean up indentation in mysql probe (Ryan Graham)

 * agent: Instrument mysql.Connection.prototype (Ryan Graham)

 * collector: Set jsonMaxLen to match production (Ryan Graham)

 * agent: add dev fingerprint (Ryan Graham)


2014-04-25, Version staging-2014-04-25-1401
===========================================

 * web: CPU Profiler view UX updates (seanbrookes)


2014-04-24, Version staging-2014-04-24-1653
===========================================

 * common: Give web runnable defaults (Ryan Graham)

 * test: Add tests for Heroku Add-on (Ryan Graham)

 * web: Use Heroku addon manifest for credentials (Ryan Graham)

 * web: Update Heroku addon manifest (Ryan Graham)

 * web: fix missing breakdown by % child chart (seanbrookes)


2014-04-23, Version staging-2014-04-24-0927
===========================================

 * web: fix slow endpoints become unresponsive (seanbrookes)


2014-04-22, Version staging-2014-04-23-1328
===========================================

 * mailer: Update AWS SES comment (Ryan Graham)

 * web,mailer: Update email from address (Ryan Graham)

 * web: Display git commit in footer (Ryan Graham)

 * agent: update heapdiff Key::kMaxSize, save memory (Ben Noordhuis)

 * agent: turn SL_ARRAY_SIZE() into a template (Ben Noordhuis)

 * agent: add memcmp/memcpy warnings to cpplint (Ben Noordhuis)

 * agent: move utility functions into separate header (Ben Noordhuis)

 * agent: fix uint16_t memcmp and memcpy operations (Ben Noordhuis)

 * agent: include v8-profiler.h in strong-agent.h (Ben Noordhuis)

 * agent: update after libuv api change (Ben Noordhuis)

 * docs: Update README.md (Ryan Graham)


2014-04-16, Version agent/0.4.2
===============================

 * agent: Handle modules that export null (Ryan Graham)


2014-04-16, Version agent/0.4.1
===============================

 * no-data-alert: Tag email with NODE_ENV (Ryan Graham)

 * no-data-alert: Increase sensitivity, reduce log noise (Ryan Graham)

 * no-data-alert: Monitor topcalls table for freshness (Ryan Graham)

 * no-data-alert: Simplify SQL for latest timestamp (Ryan Graham)

 * no-data-alert: Refactor to allow for multi-table (Ryan Graham)

 * agent: express 4.x has no app._router to hook (Sam Roberts)

 * agent: test express route hooks don't error (Sam Roberts)

 * agent: do not print message twice (Sam Roberts)

 * web: Make slowest endpoints tabs look clickable (Ryan Graham)

 * agent: cpuinfo tolerating no-file error conditions (Sam Roberts)


2014-04-14, Version staging-2014-04-14-1544
===========================================



2014-04-14, Version prod-2014-04-14-1816
========================================

 * web: fix error view not render correctly (seanbrookes)


2014-04-11, Version staging-2014-04-14-1304
===========================================

 * mailer: Handle alert config not found (Ryan Graham)

 * alerts: handle config not found (Ryan Graham)

 * collector: fix error on null sock.address() (Sam Roberts)

 * test: consolidate test running at top level (Ryan Graham)

 * tests: Define base test environment (Ryan Graham)

 * web: Adjust everyauth dep to use canonical form (Ryan Graham)

 * rollup: Update no-data alert test (Ryan Graham)

 * common: Make migrations portable (Ryan Graham)

 * web: fix end of file empty line issues (seanbrookes)

 * web: fix ui out of sync with session data (seanbrookes)


2014-04-10, Version agent/0.4.0
===============================

 * agent: v0.4.0 (Sam Roberts)

 * agent: remove handshake state (Sam Roberts)

 * agent: queue messages while handshake is ongoing (Ben Noordhuis)

 * agent: deduplicate JsonEncoder initialization (Ben Noordhuis)

 * agent: handle json decoder errors (Ben Noordhuis)

 * agent: log collector and proxy short URLs (Sam Roberts)

 * agent: pretty up log messages (Sam Roberts)

 * collector: log session store as single line (Sam Roberts)


2014-04-09, Version staging-2014-04-10-1
========================================

 * collector: dump slice and buffer state on error (Sam Roberts)

 * agent,collector: slice json+NL off decode buffer (Sam Roberts)

 * collector: increase size of allowed JSON (Sam Roberts)

 * collector: Format INSERT to be more readable (Ryan Graham)

 * collector: set start time for session (Sam Roberts)

 * agent: account for proxy in collectorUrl (Ryan Graham)

 * collector: log bad handshake json (Sam Roberts)

 * agent,collector: fix json decode of segmented json (Sam Roberts)

 * web: remove beta message from CPU profiler view (seanbrookes)

 * collector: test overly long JSON messages (Sam Roberts)

 * collector: log when we kill the connection (Sam Roberts)

 * collector: log protocol with DEBUG=collector:debug (Sam Roberts)

 * collector: log data that failed to decode as JSON (Sam Roberts)

 * web: update links on welcome/alert views (seanbrookes)

 * collector: only use alnum characters in session id (Ben Noordhuis)

 * collector: test session is opened and closed (Sam Roberts)

 * collector: generate URL-safe session ids (Ben Noordhuis)

 * collector: raise agent handshake timeout to 10s (Ben Noordhuis)

 * env: More appropriate DEBUG value (Ryan Graham)

 * docs: Remove staging config (Ryan Graham)

 * collector: end http sessions (Sam Roberts)

 * web: remove ok gotit message from welcome view (seanbrookes)

 * web: fix cant stop profiler issues on first run staging (seanbrookes)

 * web: timer feedback on profiler control buttons (seanbrookes)

 * agent: add timestamps to transport log messages (Ben Noordhuis)

 * metrics-tail: Add warning about memory leak (Ryan Graham)

 * metrics-tail: report size of axon queue in status line (Ryan Graham)

 * docs: Update development.env for common logger (Ryan Graham)

 * tail-jobs: Enhance state logging (Ryan Graham)

 * topcalls-rollup: Switch to common logger (Ryan Graham)

 * metrics-rollup: convert to common logger (Ryan Graham)

 * common: Fix logger naming (Ryan Graham)

 * agent: add workaround for joyent/node#5439 in test (Ben Noordhuis)

 * collector: add http.ServerRequest 'error' listener (Ben Noordhuis)

 * agent: log on initial succesful connection (Sam Roberts)

 * collector: Use nodefly_collector_certs to select certs (Ryan Graham)

 * agent: fix collector endpoint reporting (Sam Roberts)

 * web: update welcome message and when it is displayed (seanbrookes)

 * agent,collector: use production CA for staging (Ben Noordhuis)

 * agent: update staging http and https endpoints (Ben Noordhuis)

 * collector: add /health http endpoint (Ben Noordhuis)

 * agent: log collector url at startup (Sam Roberts)

 * agent: use consistent strong-agent log prefix (Sam Roberts)

 * common,collector: change default http/https ports (Ben Noordhuis)

 * Revert "Log in demo user" (Sam Roberts)

 * topcalls-tail: Periodic logging of count and queue (Ryan Graham)

 * jobs: make logging more configurable (Ryan Graham)

 * topcalls-tail: Switch to common logger (Ryan Graham)

 * no-data-alert: Log current delta (Ryan Graham)

 * no-data-alert: Convert to common logger (Ryan Graham)

 * metrics-tail: Add periodic logging of queue state (Ryan Graham)

 * metrics-tail: Switch to common logger (Ryan Graham)

 * common: Add common logging interface (Ryan Graham)

 * common: Remove unused nodefly_server code (Ryan Graham)

 * agent: don't spam console on connection errors (Ben Noordhuis)

 * agent: update engines field (Ben Noordhuis)

 * agent,collector: make agent use plain http/https (Ben Noordhuis)

 * collector: delete stale tests (Ben Noordhuis)

 * samples/leveldb: listen on port 8888 (Ben Noordhuis)

 * web: turn off slow endpoints over 1h (seanbrookes)

 * agent: hide lib/errors.js in stacktraces (Ben Noordhuis)

 * agent: remove unused config variable (Sam Roberts)

 * agent: report agent version when profiling (Sam Roberts)

 * agent: update README with current links and usage (Sam Roberts)


2014-04-02, Version staging-2013-04-02-2
========================================



2014-04-02, Version staging-2013-04-02
======================================

 * src: Make loading .env not fail build (Ryan Graham)

 * src: fix 'make .env' for unknown NODE_ENV values (Ryan Graham)

 * agent: Fix crash on startup from unexpected SL_ENV (Ryan Graham)

 * test: test for handling of random SL_ENV value (Ryan Graham)

 * web: bypass profiler view caching (seanbrookes)

 * web: ensure only positive values for cluster count (seanbrookes)

 * docs: Update to match server move (Ryan Graham)

 * web: fix formatting issues with commas (seanbrookes)

 * doc: process for agent/register/uhura publish (Sam Roberts)


2014-03-28, Version uhura/0.1.2
===============================

 * uhura: v0.1.2 (Sam Roberts)

 * uhura: don't use ^ in dep, it breaks node v0.10.* (Sam Roberts)

 * docs: merge common/README.md into top level (Ryan Graham)

 * docs: Update dev environment description (Ryan Graham)

 * make: Fix 'make link' (Ryan Graham)

 * src: Strip coments when generating .env files (Ryan Graham)

 * make: Use NODE_ENV from .env in Makefile (Ryan Graham)

 * topcalls-tail: use /usr/bin/time to reduce log noise (Ryan Graham)

 * production: Merge branch 'fix/topcall-tail-cleanup' (Ryan Graham)

 * common: handle two arg invoke of mysql runQuery() (Ben Noordhuis)

 * web: fix FireFox issues with help tooltip popovers (seanbrookes)

 * docs: Document current deployment process (Ryan Graham)

 * docs: Remove blank.env in favour of dev.env (Ryan Graham)

 * agent: remove bin/ files that are no longer packed (Sam Roberts)

 * agent/0.3.3 (Sam Roberts)

 * web: remove beta tags (seanbrookes)


2014-03-26, Version strongops-deploy-2
======================================

 * rollup: Delete temp files from topcalls-tail cycle (Ryan Graham)


2014-03-25, Version initial-strongops-deploy
============================================

 * samples: Use Makefile for linking (Ryan Graham)


2014-03-25, Version agent/0.3.4
===============================

 * agent: remove bin/ files that are no longer packed (Sam Roberts)


2014-03-25, Version agent/0.3.3
===============================

 * agent/0.3.3 (Sam Roberts)

 * src: Capture staging details (Ryan Graham)

 * web: remove beta tags (seanbrookes)

 * common: Fix horribly syntax error (Ryan Graham)

 * samples/leveldb: create database in __dirname (Ben Noordhuis)

 * samples/leveldb: upgrade to level 0.18.0 (Ben Noordhuis)

 * samples/leveldb: link to in-repo agent (Ben Noordhuis)

 * Add shell script that connects to server (Ryan Graham)

 * Print listening address on startup (Ryan Graham)

 * Update package.json, add MIT license (Ryan Graham)

 * Make default 'npm start' work (Ryan Graham)

 * camelCase all_the_snakes (Ryan Graham)

 * Standardize on '' for strings (Ryan Graham)

 * fixjsstyle index.js (Ryan Graham)

 * Re-indent to 2 spaces (Ryan Graham)

 * Alignment (Ryan Graham)

 * Initial commit (Ryan Graham)

 * agent: npmignore files that shouldn't be published (Sam Roberts)

 * rollup: Update no-data-alert message (Ryan Graham)

 * collector: Add staging as alias for dev certs (Ryan Graham)

 * docs: Document ALL environment variables (Ryan Graham)

 * web/test: Use common config (Ryan Graham)

 * web: Use config for Redis (Ryan Graham)

 * api: Move SL_CORS_HOSTS (Ryan Graham)

 * common: Remove unused PORT config (Ryan Graham)

 * mailer: Use common config (Ryan Graham)

 * web: Remove nconf in favour of common config (Ryan Graham)

 * web,common: Move web config into common (Ryan Graham)

 * common: Simplify nconf loading (Ryan Graham)

 * common: Remove configLoader (Ryan Graham)

 * mailer,web: Consolidate nodemailer config (Ryan Graham)

 * rollup: make metrics-rollup logging match others (Ryan Graham)

 * agent: don't use ^ in dep, it breaks node v0.10.* (Sam Roberts)

 * src: Only load .env when needed (Ryan Graham)

 * common: Remove MongoDB refrences (Ryan Graham)

 * all: Clean up npm scripts and .env loading (Ryan Graham)

 * src: Add support for different runners in Procfile (Ryan Graham)

 * src: Remove direct use of strong-agent by apps (Ryan Graham)

 * src: move links to top-level node_modules (Ryan Graham)


2014-03-21, Version register/v0.3.2
===================================

 * register: update package version and description (Sam Roberts)

 * common: delete unused migrations/ directory (Sam Roberts)

 * common: cpu data JSON field should be LONGTEXT (Sam Roberts)

 * agent: upgrade to node-measured 0.1.4 (Ben Noordhuis)

 * Revert "api: fix jasmine-node option name" (Sam Roberts)

 * readme: how to link slc strongops/slc run to dev (Sam Roberts)

 * rollup: Remove extraneous dependencies (Ryan Graham)

 * rollup: Mark potentially unused files (Ryan Graham)

 * jobs: use common confir for weekly new-user report (Ryan Graham)

 * rollup: Switch to nodefly-common's mysqlPool (Ryan Graham)

 * rollup: Remove unused rollup script (Ryan Graham)

 * rollup,common: Remove date.format.js (Ryan Graham)

 * rollup: Remove unused config files (Ryan Graham)

 * rollup: fix broken .env loading in npm scripts (Ryan Graham)

 * web: remove broken require() (Ryan Graham)

 * agent: use a probe to find strong-cluster-control (Sam Roberts)

 * uhura: use DEBUG=uhura:protocol to see all data (Sam Roberts)

 * jobs: describe what session_id is in metrics table (Sam Roberts)

 * agent: fix NODEFLY_DEBUG=uvmon erroring out (Sam Roberts)

 * web: node supervisor dependency no longer used (Sam Roberts)

 * web: comments and dead code cleanup (Sam Roberts)

 * web: delete login/wordpress unused routes (Sam Roberts)

 * web: delete obsolete/unused password reset routes (Sam Roberts)

 * web: delete pre-nodefly api (Sam Roberts)

 * web: delete unused account routes (Sam Roberts)

 * web: note a missing email link in strongops header (Sam Roberts)

 * api: comments and dead code cleanup (Sam Roberts)

 * api,collector: log profile start/stop events (Sam Roberts)

 * collector: wrap long lines and fix indentation (Sam Roberts)

 * readme: sql table notes (Sam Roberts)

 * collector: remove unused sql queries (Ben Noordhuis)

 * src: Clean up Makefile (Ryan Graham)

 * src: Separate DB setup from depenency setup (Ryan Graham)

 * src: Remove nodefly-register link from strong-agent (Ryan Graham)

 * rollup: fix missing mail dir in dev mode (Ryan Graham)

 * src: Fix typos in Procfile (Ryan Graham)

 * agent/client: honor SL_ENV=staging defaults (Sam Roberts)

 * collector: cleanup some log and debug output (Sam Roberts)

 * jobs: log3 processor cleanup and commenting (Sam Roberts)

 * jobs: no data alerts use debug not console.log (Sam Roberts)

 * web: fix spelling errors, update tooltips take 2 (seanbrookes)

 * register: respect SL_ENV variable for REST endpoint (Sam Roberts)

 * agent: make timer module clobber-resistant (Ben Noordhuis)

 * agent: remove unused zeparser dependency (Sam Roberts)

 * package.json: save current dependency specs (Sam Roberts)

 * api: fix jasmine-node option name (Sam Roberts)

 * common,jobs,register,web: remove unused requires (Ben Noordhuis)

 * agent,api,collector: remove unused requires (Ben Noordhuis)

 * collector: end all open sessions on startup (Sam Roberts)

 * web: fix whitespace (Ben Noordhuis)

 * web: remove unused dummyData.json file (Ben Noordhuis)

 * web: remove ancient nodefly agent tarballs (Ben Noordhuis)

 * alerts: Use nodelfy-common shared config (Ryan Graham)

 * src: Add axon to global config (Ryan Graham)

 * test: load .env for web tests (Ryan Graham)

 * no-data-alert: Use common config for nodemailer (Ryan Graham)

 * jobs/rollup: Support no-password mysql user (Ryan Graham)

 * jobs/rollup: Use nodefly-common for configuration (Ryan Graham)

 * docs: Update developer setup instructions (Ryan Graham)

 * dev: Top level Makefile for setting up environment (Ryan Graham)

 * src: Add top level Procfile (Ryan Graham)

 * agent: fix lib/counts.js stats reset regression (Ben Noordhuis)

 * agent: remove no-op Agent#millis() method (Ben Noordhuis)

 * agent: add counts.interval property (Ben Noordhuis)

 * web: fix slowest endpoint graph not loading alone (seanbrookes)

 * gitignore: ignore npm debug logs (Sam Roberts)

 * alerts: remove .DS_Store file (Ben Noordhuis)

 * agent: remove versioned copy of node-measured (Ben Noordhuis)

 * jobs: remove SQL debug statements from log (Sam Roberts)

 * web: log failed slc login/register attempts (Sam Roberts)

 * web: allow supervisor to timestamp log (Sam Roberts)

 * DEVELOP.md: fix damaged `#!/bin/sh` (Sam Roberts)

 * agent: report app instance information at start (Sam Roberts)

 * DEVELOP.md: fix error in slc strongops URL (Sam Roberts)

 * DEVELOP.md: merge in wiki, gists, personal notes (Sam Roberts)

 * api: style change,  move "," to end of line (Sam Roberts)

 * rollups: silence the logging every second (Sam Roberts)

 * api: log message made more comprehensible (Sam Roberts)

 * collector/api: profiler update state tracking (Sam Roberts)

 * collector: whitespace cleanup (themitchy)

 * src: rename SL_USE() to Use() (Ben Noordhuis)

 * src: rename SL_FIXED_STRING() to FixedString() (Ben Noordhuis)

 * src: turn SL_FIXED_STRING() into a function (Ben Noordhuis)

 * src: add isolate argument to v0.10 SL_FIXED_STRING (Ben Noordhuis)

 * register: fix typo in README.md (Ben Noordhuis)

 * src: update to v8 3.24 api (Ben Noordhuis)

 * agent: update default collector hostname (Ben Noordhuis)

 * agent: make global STRONGAGENT object undetectable (Ben Noordhuis)

 * agent: rename nf variables to agent (Ben Noordhuis)

 * agent: rename nodefly global to STRONGAGENT (Ben Noordhuis)

 * agent: rename nodefly.js -> agent.js (Ben Noordhuis)

 * DEVELOP.md: move from agent/ to top-level (Sam Roberts)

 * agent: make include guards pass lint check (Ben Noordhuis)

 * api,collector,web: make npm link to strongops deps (Ben Noordhuis)

 * api: fix up connect-redis usage (Ben Noordhuis)

 * collector: fix up connect-redis initialization (Ben Noordhuis)

 * collector: remove unused sql query (Ben Noordhuis)

 * web: use support@strongloop.com as error contact (Sam Roberts)

 * agent,api,collector,common,jobs: fix whitespace (Ben Noordhuis)

 * agent: remove timekit dependency from package.json (Ben Noordhuis)

 * strongops: first commit, check in skeleton project (Ben Noordhuis)

 * Restore post to ActOn (themitchy)

 * make google api call for font script file in doc head protocol agnostic to avoid security errors (seanbrookes)

 * fix: Accept CF-Visitor header for https check (Ryan Graham)

 * fix: handle complex x-forwarded-proto headers (Ryan Graham)

 * Include demo app with any user (themitchy)

 * Include demo app for all users (themitchy)

 * src: update heap diff 'missing add-on' warning (Ben Noordhuis)

 * src: optimize heap diff algorithm (Ben Noordhuis)

 * src: integrate memwatch heap diff functionality (Ben Noordhuis)

 * Hide the user key for demo user (themitchy)

 * Simplify account page. (themitchy)

 * Log in demo user (themitchy)

 * update .gitignore to filter WebStorm .idea content (seanbrookes)

 * Change name link. (themitchy)

 * src: compile with -fvisibility=hidden (Ben Noordhuis)

 * src: update copyright headers (Ben Noordhuis)

 * src: enable more compiler warnings (Ben Noordhuis)

 * doc: attribute node-time in license file (Ben Noordhuis)

 * doc: format StrongLoop-LICENSE file (Ben Noordhuis)

 * Peg mysql dependency to a known working version (Ryan Graham)

 * src: make check-imports.sh exit with error status (Ben Noordhuis)

 * test: lower config.loopInterval in test-metrics.js (Ben Noordhuis)

 * src: integrate nodefly-uvmon module (Ben Noordhuis)

 * test: add loop statistics test (Ben Noordhuis)

 * src: rename module.cc to strong-agent.cc (Ben Noordhuis)

 * Update axon annotation (Ryan Graham)

 * Annotate Profile with job descriptions (Ryan Graham)

 * More annotations (Ryan Graham)

 * Remove unused tail_topcalls.js job (Ryan Graham)

 * Annotate observations in tail rollup job (Ryan Graham)

 * Logout of wordpress. (themitchy)

 * Redirect to WP login if not authed. (themitchy)

 * Moved adhoc middleware into getBoot (themitchy)

 * Use the provided email as a username. (themitchy)

 * Restore Sumitha's as receipient (Ryan Graham)

 * Rewrite new-signups report mailer (Ryan Graham)

 * Disable loopback chart that isn't working yet. (themitchy)

 * Copy google analytics verbatim from main site. (themitchy)

 * UI fixes for heap profiler. (themitchy)

 * test: fix up test/test-metrics.js (Ben Noordhuis)

 * lib: just rethrow exception when node is exiting (Ben Noordhuis)

 * Improve test output for CI (Ryan Graham)

 * package.json: don't abort if node-gyp fails (Ben Noordhuis)

 * lib: make log message consistent with others (Sam Roberts)

 * package.json: depend on uhura ~0.1.1 (Ben Noordhuis)

 * Clean up package and repo for CI (Ryan Graham)

 * sql migrations: add index to users.hash (Ben Noordhuis)

 * Fix new-user report mail addresses (Ryan Graham)

 * Move weekly new user report into rollup/ (Ryan Graham)

 * fix password formatting (qz)

 * Remove noisy logs and fix style (themitchy)

 * Remove db update (themitchy)

 * Remove daily limit (themitchy)

 * Add indexes for columns that the API server uses (themitchy)

 * package.json: bump version, 0.1.0 => 0.1.1 (Ben Noordhuis)

 * lib: use uhura.Client#unref() (Ben Noordhuis)

 * package.json: bump version to v0.3.1 (Ben Noordhuis)

 * lib/client: conditionally unref reconnect timer (Ben Noordhuis)

 * lib/client: add ref() and unref() methods (Ben Noordhuis)

 * test: add createConnection regression test (Ben Noordhuis)

 * test: don't use hard-coded tcp port numbers (Ben Noordhuis)

 * lib/client: make createConnection callback-driven (Ben Noordhuis)

 * Revert "src: make backwards compatible with v0.8" (Ben Noordhuis)

 * src: plug gcinfo memory leak (Ben Noordhuis)

 * src: make backwards compatible with v0.8 (Ben Noordhuis)

 * lib: emit caught error if collector times out (Ben Noordhuis)

 * lib: unref child process handle (Ben Noordhuis)

 * lib: unref node-measured timer (Ben Noordhuis)

 * test: replace mocha with node-tap (Ben Noordhuis)

 * package.json: convert to UNIX line endings (Ben Noordhuis)

 * lib/client: unref reconnect timer (Ben Noordhuis)

 * Do not export an empty object as strong-agent (Sam Roberts)

 * test: drop dependency on request module (Ben Noordhuis)

 * test: fix tiers collector tests (Ben Noordhuis)

 * test: remove develop collector test (Ben Noordhuis)

 * test: remove STRONGLOOP_COLLECTOR test (Ben Noordhuis)

 * test: fix STRONGLOOP_COLLECTOR test (Ben Noordhuis)

 * lib: fix collector filtering in http client probe (Ben Noordhuis)

 * Prefetch metric_ids (Ryan Graham)

 * tail: Update mertric_id cache on fetch (Ryan Graham)

 * Style consistency (Ryan Graham)

 * Update Procfile to better match production (Ryan Graham)

 * Import Upstart scripts verbatim from production (Ryan Graham)

 * Adjust no-data alerter paths (Ryan Graham)

 * Move no-data alerter into jobs package (Ryan Graham)

 * Update alert_if_no_data.js to reuse rollup code (Ryan Graham)

 * Simlify mysqlPool wrapper (Ryan Graham)

 * Add tests for no-data alerter (Ryan Graham)

 * Add package.json (Ryan Graham)

 * Import mysqlPool.js from prod (Ryan Graham)

 * Update to match what is running on gateway (Ryan Graham)

 * Make alert_if_no_data.js not run if require()'d (Ryan Graham)

 * alert_if_no_data.js: whitespace, EOL, EOF (Ryan Graham)

 * Add note about using run-parts to verify cron jobs (Ryan Graham)

 * whitespace and indentation fixes (themitchy)

 * remove broken subusers routes (themitchy)

 * Send confirmation of profiler stop/start (themitchy)

 * Fix collector configs. (themitchy)

 * Replace tabs with spaces, missing semicolon. (themitchy)

 * npmignore: ignore build/editor/test artifacts (Ben Noordhuis)

 * certs: add certificates and keys for test env (Ben Noordhuis)

 * lib: share strong-agent add-on loading logic (Ben Noordhuis)

 * test: add two basic heap profiler tests (Ben Noordhuis)

 * src: tidy up node.js version checks (Ben Noordhuis)

 * test: drop bad assumption from cpu profiler test (Ben Noordhuis)

 * src: integrate gcinfo module (Ben Noordhuis)

 * src: add code lint checker (Ben Noordhuis)

 * src: guard against NULL CpuProfile (Ben Noordhuis)

 * src: turn profiler into general purpose module (Ben Noordhuis)

 * lib: don't start profiling if its already started (Sam Roberts)

 * lib: don't log cluster-control activity (Sam Roberts)

 * lib: prefix console output with strong-agent (Sam Roberts)

 * lib: when not configured, explain how to fix (Sam Roberts)

 * lib: prefix log message with strong-agent (Sam Roberts)

 * lib: inform user of dashboard location (Sam Roberts)

 * lib: identify app name and host that is profiled (Sam Roberts)

 * lib: cluster updates faster, and more informatively (Sam Roberts)

 * npm: replace memwatch dep with strong-memwatch (Ben Noordhuis)

 * test: don't use hard-coded port numbers (Ben Noordhuis)

 * Consistent error messages and username support (themitchy)

 * Minor rewording and add link to official docs. (Rand McKinney)

 * Update crontab instructions for weekly report (Ryan Graham)

 * Make users_who_started_using_StrongOps.js executable (Ryan Graham)

 * Commit latest live code from gateway (Ryan Graham)

 * lib, src: add v0.10/v0.12 cpu profiler bindings (Ben Noordhuis)

 * lib: start tls-enabled uhura server (Ben Noordhuis)

 * test: fix up test/apiv2 (Ben Noordhuis)

 * lib: consistently log cluster-control version (Sam Roberts)

 * test: use quiet mode in tests (Sam Roberts)

 * lib: report startup messages as info (Sam Roberts)

 * lib: add nf.info(), and quiet option to disable (Sam Roberts)

 * profile: allow options to be null or undefined (Sam Roberts)

 * lib: log lack of dependencies only when profiling (Sam Roberts)

 * Restore intercom scripts. (themitchy)

 * npm: update author and homepage fields (Ben Noordhuis)

 * lib: remove unused express-server.js file (Sam Roberts)

 * lib: make connection type configurable (Ben Noordhuis)

 * Send error message with registration error (themitchy)

 * User api for StrongOps (themitchy)

 * Removed subuser routes (themitchy)

 * Added a WordPress api module (themitchy)

 * Removed old user API. (themitchy)

 * lib: fix line and endings and trailing whitespace (Ben Noordhuis)

 * lib/probes: intercept http 'upgrade' event (Ben Noordhuis)

 * Move loopback from dependencies to devDependencies (Miroslav Bajtoš)

 * Added a separate tier for LoopBack (Salehen Shovon Rahman)

 * lib/client: fix stalls with large payloads (Ben Noordhuis)

 * Use correct production url. (themitchy)

 * Use 409 as status check for existing user. (themitchy)

 * test: don't call gc() unconditionally (Ben Noordhuis)

 * test: add timer/socket unref regression test (Ben Noordhuis)

 * lib: fix hanging process, unref uhura socket (Ben Noordhuis)

 * lib: fix hanging process, unref setInterval timers (Ben Noordhuis)

 * added jshint configs (themitchy)

 * Style up some login buttons for Github and StrongLoop (themitchy)

 * removed a bunch of unused login and registration links/pages/templates (themitchy)

 * Add create time for github users. (themitchy)

 * Auth against strongloop.com (themitchy)

 * Simplify user registration and remove unused code. (themitchy)

 * Strip shared session middleware. (themitchy)

 * lib: remove mongodb dependency (Ben Noordhuis)

 * lib: remove unused lib/alerts.js (Ben Noordhuis)

 * test: unversion test/coverage.html (Ben Noordhuis)

 * lib: remove dead code (Ben Noordhuis)

 * lib: handle JSON parse errors (Ben Noordhuis)

 * Allow the baseUrl to be overridden by env. (themitchy)

 * Added jshint configs and fixed whitespace. (themitchy)

 * lib: fix global variable leak (Ben Noordhuis)

 * “limited” was spelled incorrectly. (themitchy)

 * LoopBack data is now displayed on the dashboard (Salehen Shovon Rahman)

 * API server now serves LoopBack readings (Salehen Shovon Rahman)

 * LoopBack data is now recognized (Salehen Shovon Rahman)

 * lib: remove unused function emailer.sendFeedback() (Ben Noordhuis)

 * lib: remove unused imports from server.js (Ben Noordhuis)

 * lib: remove crawlable pages (Ben Noordhuis)

 * views: remove unused files (Ben Noordhuis)

 * Remove 'env' from scripts.test to simplify CI (Ryan Graham)

 * Replace blanket with istanbul for coverage (Ryan Graham)

 * Add timeout overrides to individual tests (Ryan Graham)

 * Separate app.use calls for each middleware. (themitchy)

 * Strip duration off of data. (themitchy)

 * all: remove stale openshift files (Ben Noordhuis)

 * lib: don't use express.bodyParser() (Ben Noordhuis)

 * lib, test: fix up whitespace errors (Ben Noordhuis)

 * lib: fix up whitespace errors (Ben Noordhuis)

 * push graph data into 3h+ buckets (Eugene Kaydalov)

 * lib: remove unused sl-heroku routes (Ben Noordhuis)

 * lib, routes: fix up whitespace errors (Ben Noordhuis)

 * The dashboard makes separate calls for top functions (Salehen Shovon Rahman)

 * A loopback app is now successfully recorded (Salehen Shovon Rahman)

 * Print server address using server.address(). (Ben Noordhuis)

 * Convert lib/server.js to UNIX line endings. (Ben Noordhuis)

 * npm: use git+ssh:// url for nodefly-common (Ben Noordhuis)

 * Add callback for listen. (themitchy)

 * Moved loopback to a new migration. (Salehen Shovon Rahman)

 * Added a loopback_version column to the apps table (Salehen Shovon Rahman)

 * Update broken links (themitchy)

 * Avoid TypeError when SL_CORS_HOSTS is undefined. (Ben Noordhuis)

 * Convert lib/app.js to UNIX line endings. (Ben Noordhuis)

 * Fix up register link on /ops page. (Ben Noordhuis)

 * testing locally was timing out (themitchy)

 * Can now detect if Loopback is present (Salehen Shovon Rahman)

 * Bundle request (Ryan Graham)

 * use current time (themitchy)

 * Soft coded the text elements (Salehen Shovon Rahman)

 * The alert dialogue now fully functional (Salehen Shovon Rahman)

 * Removed the hard dependency to e.target (Salehen Shovon Rahman)

 * Fixed bug that prevented config from being POSTed (Salehen Shovon Rahman)

 * Added labels to the dialogue (Salehen Shovon Rahman)

 * Forced delete of all globally inserted dialogues (Salehen Shovon Rahman)

 * Moved the alert creation code to the caller (Salehen Shovon Rahman)

 * dialog bug fix: the select boxes now repopulates (Salehen Shovon Rahman)

 * The dialogue box is entirely self-contained. (Salehen Shovon Rahman)

 * Refactored the dialogue views name. (Salehen Shovon Rahman)

 * Moved the alert dialogue html to its own file (Salehen Shovon Rahman)

 * Deleted more code. (Salehen Shovon Rahman)

 * Deleted code. (Salehen Shovon Rahman)

 * Moved the submit code to the dialogue class (Salehen Shovon Rahman)

 * Moved the dialogue logic to its own class (Salehen Shovon Rahman)

 * Renaming of attributes and addition of a new property (Salehen Shovon Rahman)

 * Refactored the name of selectors (Salehen Shovon Rahman)

 * Fixed a bug for connections selectors (Salehen Shovon Rahman)

 * Refactored the connections selector (Salehen Shovon Rahman)

 * Refactored the Heap Selectors (Salehen Shovon Rahman)

 * Refactored the CPU selectors (Salehen Shovon Rahman)

 * Refactored the tiers selectors (Salehen Shovon Rahman)

 * Added an indentation. (Salehen Shovon Rahman)

 * send sessionId instead of pid (themitchy)

 * use session id to lookup heap profile data (themitchy)

 * connect to correct redid server (themitchy)

 * lookup app_id correctly (themitchy)

 * initial commit for alerts mailer (Eugene Kaydalov)

 * config change (themitchy)

 * line up data query to the whole minute (Eugene Kaydalov)

 * revert change to show gaps in data (themitchy)

 * style tweaks for headers and messages (themitchy)

 * add popover to beta tags (themitchy)

 * add message for no alerts (themitchy)

 * add beta tag to alerts and errors pages (themitchy)

 * add beta tag to headers (themitchy)

 * only sum conn_throughput (root)

 * bump version (themitchy)

 * un-grey the alert configure dialog boxes (themitchy)

 * make redisClient available to the rest of the application (themitchy)

 * merge conflicts (themitchy)

 * implement restart-all (themitchy)

 * overhauled the way scale size data was tracked (themitchy)

 * new styles for cpus count and current cluster size (themitchy)

 * user model provides a way to look up a session by id (themitchy)

 * have to sum conn_throughput metric, not avg it (eugene kaydalov)

 * pushbutton resize (themitchy)

 * chart box styling (themitchy)

 * more general style fixes (themitchy)

 * options fix for backbone 1.1 (themitchy)

 * use strong loop colours globally (themitchy)

 * more strongloop-ish styling (themitchy)

 * general styling fixes (themitchy)

 * fix classname, disable on click (themitchy)

 * styling on workers list (themitchy)

 * decoupling worker list from main cluster view (themitchy)

 * added id (themitchy)

 * add function to lookup cluster meta data on user model (themitchy)

 * quick poll for dev (themitchy)

 * upgrade backbone (themitchy)

 * fix tabs (themitchy)

 * add comparator (themitchy)

 * Got the UI to auto update whenever the clusters updates itself. (Salehen Shovon Rahman)

 * Make jshint happier (Ryan Graham)

 * Fix old should.js usage (Ryan Graham)

 * Replace blanket with istanbul (Ryan Graham)

 * Don't include coerge and build artifacts in npm (Ryan Graham)

 * Got the filters to work. (Salehen Shovon Rahman)

 * Got a text box showing. (Salehen Shovon Rahman)

 * Manage to send a shutdown signal to the api server. (Salehen Shovon Rahman)

 * fix reference to script (themitchy)

 * Fixed a bug where a non-cluster app will cause the controls to crash (Salehen Shovon Rahman)

 * remove hard-coded config (themitchy)

 * Welp pushing out what I have so far. (Salehen Shovon Rahman)

 * More styling. (Salehen Shovon Rahman)

 * Restyled the processes list. (Salehen Shovon Rahman)

 * Delegated the evet calls to the model. (Salehen Shovon Rahman)

 * SLP-324 respond to cluster terminate and shutdown commands (themitchy)

 * Got workers list showing on the screen. (Salehen Shovon Rahman)

 * make sure bootUser has cluster session metadata (themitchy)

 * SLP-329 generic control channel route for any commands (themitchy)

 * SLP-323 respond to cluster:restart-all (themitchy)

 * SLP-326 store num cpus (themitchy)

 * SLP-322 store number of cpus (themitchy)

 * store workers for older cluster control as well (themitchy)

 * bubble up session meta-data from 'data' column (themitchy)

 * SLP-325 store workers list when cluster data updates (themitchy)

 * Made the error logs look much nicer. Hope people are fond of this. (Salehen Shovon Rahman)

 * Changed the color on the select box. (Salehen Shovon Rahman)

 * use sessionId/pid as key for collector_sessions (themitchy)

 * s/\t/  /g (themitchy)

 * override lookup path for module (for dev setups using "npm link") (themitchy)

 * SLP-321 rename options to clusterInfo (it's not just options),  send worker list (themitchy)

 * update contact link (themitchy)

 * Add istanbul (Ryan Graham)

 * Mention StrongOps in README (Ryan Graham)

 * Added the new GA. (Salehen Shovon Rahman)

 * Additional fix for SLP-298, get child apps for all routes (Andrew Martens)

 * remove trace file creation (supermonster)

 * added folders for data to sit in (supermonster)

 * changing the structure of data2_x tables to allow rollups v3 (supermonster)

 * add topcalls processor v3 (using data2_x tables for now) (supermonster)

 * Made the labels look less disabled. (Salehen Shovon Rahman)

 * Added spinners to dashboard charts. (Salehen Shovon Rahman)

 * Fix for SLP-298 (Andrew Martens)

 * Managed to show a message whenever there aren't any profiler data (Salehen Shovon Rahman)

 * Switched to using font-awesome. (Salehen Shovon Rahman)

 * Got the spinners to show on the heap profiler (Salehen Shovon Rahman)

 * fix data validation (themitchy)

 * add some debug options (themitchy)

 * Added a hash to the dashboard link. (Salehen Shovon Rahman)

 * Move 'request' to devDependencies (Ryan Graham)

 * hot fix for backwards compatibility with strong-cluster-control < 0.2.0 (themitchy)

 * Fixed the memory leak (Salehen Shovon Rahman)

 * remove console log (themitchy)

 * cluster UI now works with apps that aren't clusters (themitchy)

 * Heap chart repopulates upon revisit of heap page (Salehen Shovon Rahman)

 * keys were backwards (themitchy)

 * Don't monkey-patch app.listen() as it won't get called for http.createServer(app).listen(...) (Stephen Belanger)

 * Confusing naming schemes suck, especially when you deprecate one but leave the code that continues to store the unused data... (Stephen Belanger)

 * A boat load of bug fixes. (Salehen Shovon Rahman)

 * redesigned the errors objects. (Salehen Shovon Rahman)

 * removing debug logs (themitchy)

 * put alert dialogs back in with correct keys (themitchy)

 * Navigation elements are right aligned, now. (Salehen Shovon Rahman)

 * Now able to change the sessions. (Salehen Shovon Rahman)

 * Fixed the session picker. (Salehen Shovon Rahman)

 * Added an empty message. (Salehen Shovon Rahman)

 * Fixed a boat laod of bugs. (Salehen Shovon Rahman)

 * Changed width, and infiniscroll now works (Salehen Shovon Rahman)

 * The error logs are returned in reverse chronological order (Salehen Shovon Rahman)

 * Added a limit parameter. (Salehen Shovon Rahman)

 * Shrunk the left column. (Salehen Shovon Rahman)

 * Styled the logs. (Salehen Shovon Rahman)

 * Cleaned up the design. (Salehen Shovon Rahman)

 * Cleaned up the load logic. (Salehen Shovon Rahman)

 * Finally. Got data to flow in. (Salehen Shovon Rahman)

 * Done a bunch of refactoring. (Salehen Shovon Rahman)

 * Default for all processes has been set to true. (Salehen Shovon Rahman)

 * Moved the picker to the left side. (Salehen Shovon Rahman)

 * The picker looks nicer, now. (Salehen Shovon Rahman)

 * Got everything connected (Salehen Shovon Rahman)

 * Got a lot of the functionalities working. (Salehen Shovon Rahman)

 * Refactored the code. (Salehen Shovon Rahman)

 * Added UI elements for the filters. (Salehen Shovon Rahman)

 * Removed a console.log call. (Salehen Shovon Rahman)

 * Starting to get more of the UI stuff working. (Salehen Shovon Rahman)

 * Started to add routing stuff. (Salehen Shovon Rahman)

 * Added a page for the error logs. (Salehen Shovon Rahman)

 * Remove console.log from top-level error reporter (Stephen Belanger)

 * Fix broken test (Stephen Belanger)

 * Change event name away from error. That can blow stuff up... (Stephen Belanger)

 * Catch express errors per-route, with domain wrapper to forward the errors (Stephen Belanger)

 * Send errors to collector (Stephen Belanger)

 * changes to password change (Andrew Martens)

 * password changes (Andrew Martens)

 * Move ACK callback locater to ensure it gets ignored by non-ack-supporting servers (Stephen Belanger)

 * Restructure of acknowledgements feature to be backwards compatible (Stephen Belanger)

 * return 404 for cluster not found, return empty array when no rows in errors query (Andrew Martens)

 * dataHandler can return custom errors/statusCode instead of everything being 500 or 404 (Andrew Martens)

 * fix table tame (themitchy)

 * use hash for session_id in errors table (Andrew Martens)

 * changed errors session_id to match hash from collector_sessions (Andrew Martens)

 * changed session_id to match hash from collector_sessions (Andrew Martens)

 * fixed typo (Andrew Martens)

 * Added /cluster/:clusterId/errors (Andrew Martens)

 * Fix alert timestamps on web side (Stephen Belanger)

 * Filter out inactive alerts (Stephen Belanger)

 * Colors now change according to process state (Salehen Shovon Rahman)

 * Added the two extra columns (Salehen Shovon Rahman)

 * Add pid and sessionActive to alerts responses (Stephen Belanger)

 * Name now updates. (Salehen Shovon Rahman)

 * Edit dialogue box looks much nicer (Salehen Shovon Rahman)

 * show config string, update styles (themitchy)

 * push parsed config string into template (themitchy)

 * show app name on alerts details (themitchy)

 * populate configs with app details (themitchy)

 * provide util method to lookup app by key (themitchy)

 * Changed the font to Ubuntu. (Salehen Shovon Rahman)

 * Added labels to the edit alert dialog (Salehen Shovon Rahman)

 * Added alerts to main nav (themitchy)

 * Had the update function return the original data (Salehen Shovon Rahman)

 * ts should be datetime (Andrew Martens)

 * Front-end gets updated, upon save (Salehen Shovon Rahman)

 * The data updates on the server. (Salehen Shovon Rahman)

 * Got the edit alert config dialog to work (Salehen Shovon Rahman)

 * Delete alert config now working (Stephen Belanger)

 * Update alerts route to display data from new alerts system, grouped by alert config. (Stephen Belanger)

 * Change comparator to correct spelling, fix double json stringify bug, fix bug with using clusterKey as rowid rather than hash. (Stephen Belanger)

 * Added alert tests and squashed lots of alert-related bugs (Stephen Belanger)

 * correct metric name (themitchy)

 * enable alert dialog (themitchy)

 * don't force hardcoded path on developers (themitchy)

 * clean up top calls import (themitchy)

 * cleanup tail import (themitchy)

 * ignore data files (themitchy)

 * resolve path for scripts (themitchy)

 * ignore repeated warnings (themitchy)

 * keep var folder (themitchy)

 * dumper was not executing the correct command (themitchy)

 * correct path for module (themitchy)

 * The charts now zoom in. (Salehen Shovon Rahman)

 * SLP-80 Removed console.log calls. (Salehen Shovon Rahman)

 * Got empty spaces to show for gaps in graph data (Salehen Shovon Rahman)

 * Added UX sugars to indicate that there aren't any data. (Salehen Shovon Rahman)

 * Changed the wording form "heap count" to "heap usage count" (Salehen Shovon Rahman)

 * Separated the charts between usage and count. (Salehen Shovon Rahman)

 * Filters no longer cause dashboard to crash (Salehen Shovon Rahman)

 * Removed cookie domain except for prod/staging (Andrew Martens)

 * Update Cluster Control UI and integrate new data. (Michael Schoonmaker)

 * Add a UI for the new cluster control channel. (Michael Schoonmaker)

 * Add routes for the collector's new cluster control channel. (Michael Schoonmaker)

 * Migrate cluster data to MySQL. (Michael Schoonmaker)

 * Add a cluster control channel. (Michael Schoonmaker)

 * Add session_id to stored error data (Stephen Belanger)

 * Edit errors schema to add session_id and allow empty values for type/command (Stephen Belanger)

 * Add cluster data to SQL migrations. (Michael Schoonmaker)

 * The playbutton now re-enables. (Salehen Shovon Rahman)

 * Remove console.log in errors (Stephen Belanger)

 * Add errors migration (Stephen Belanger)

 * Don't name the event 'error', that might blow stuff up... (Stephen Belanger)

 * Store reported errors (Stephen Belanger)

 * We now also have count chart. (Salehen Shovon Rahman)

 * Add DEVELOP doc for contributors to StrongAgent and StrongOps. (Michael Schoonmaker)

 * only limit cpu profile (themitchy)

 * initial commit. unit test for metrics (eugene kaydalov)

 * rollup topfunctions restructure initial commit (eugene kaydalov)

 * restructure (eugene kaydalov)

 * Add active start/end times to alerts table (Stephen Belanger)

 * only force strongloop cookie on staging and production (themitchy)

 * let STRONGLOOP_COLLECTOR override config (themitchy)

 * test for overriding the collector host (themitchy)

 * allow transport to init without connecting (for tests) (themitchy)

 * Ignore socket errors server-side. Just means a client lost connection somehow. (Stephen Belanger)

 * using isFinite() to test cpu values (Andrew Martens)

 * tabs/spaces, removed unnecessary console.log (Andrew Martens)

 * moved array_sum to proc.js (Andrew Martens)

 * Should probably actually ADD the ACK module... (Stephen Belanger)

 * Added ACK support and maxQueueLength setting (Stephen Belanger)

 * moved linux procfs code to proc.js (Andrew Martens)

 * made code more consistent (Andrew Martens)

 * leave out multipart because it uploads temp files (themitchy)

 * Use userKey instead of hash; fixed missing API Key on account dashboard (Andrew Martens)

 * Added sessionId to graphData for V2 (Andrew Martens)

 * moderately saner logging (themitchy)

 * sending to alerts should not be disabled (themitchy)

 * Specify valid origins for CORS (Andrew Martens)

 * Remove unnecessary console.log (Andrew Martens)

 * Use cookies for .strongloop.com (Andrew Martens)

 * Removed unnecessary logging (Andrew Martens)

 * Fixing up graphData issues with frontend (Andrew Martens)

 * fixes for password change (Andrew Martens)

 * Added POST /users/me to update password (Andrew Martens)

 * Added user register/delete (Andrew Martens)

 * working call for /clusters/:clusterId/graphData (Andrew Martens)

 * use credentials for CORS (Andrew Martens)

 * removed devhack references to localhost (Andrew Martens)

 * use .strongloop.com for cookies (Andrew Martens)

 * Update tests (Stephen Belanger)

 * Add logErrors toggle (Stephen Belanger)

 * add blanket to package.json for test coverage analysis (emma wu)

 * exclude node_module in test coverage (emma wu)

 * fixed blanket pattern (emmawu)

 * user API no longer points to localhost (Andrew Martens)

 * Update cluster control channel to use public methods. (Michael Schoonmaker)

 * add blanket for ci coverage analysis (Linqing)

 * Dogfood V2 API changes (Andrew Martens)

 * Expose instance counts (Stephen Belanger)

 * logout clears session (themitchy)

 * blog link (themitchy)

 * Add repo to package.json (Stephen Belanger)

 * correct link for blog (themitchy)

 * clear session storage on logout (themitchy)

 * return empty array if app can't be found (themitchy)

 * Add MIT License (Stephen Belanger)

 * The y-axis moves/scales (Salehen Shovon Rahman)

 * cleanup, removing files that are no longer in use (Eugene Kaydalov)

 * ignore all strongloop emails for act-on (themitchy)

 * clean up memory profiler (themitchy)

 * remove old stuff that will never be used (Eugene Kaydalov)

 * Delay instances chart setup until we definitely have data (Stephen Belanger)

 * Put memwatch.HeapDiff on a timer, as it forces a silent GC and will prevent the stats event from ever getting called. (Stephen Belanger)

 * Should be inclusive of start time, not end time. Otherwise we may miss a record that hasn't been created yet. (Stephen Belanger)

 * absolute links for register and login (themitchy)

 * intermediate landing page for heroku sso (themitchy)

 * balance landing buttons (themitchy)

 * more sensible landing page for users with no apps (themitchy)

 * how-to should link straight to docs.strongloop (themitchy)

 * update feedback link (themitchy)

 * favicon, page title (themitchy)

 * don't strip www (themitchy)

 * account page for password change & api key (themitchy)

 * middleware module (themitchy)

 * after heroku sso go to ops (themitchy)

 * send / and /ops/dashboard to strongloop if using nodefly hostname (themitchy)

 * redirect to ops (themitchy)

 * ask for password when creating new strongops user (themitchy)

 * Minor changes to error reporting (Andrew Martens)

 * remove unused bits (themitchy)

 * Added the StrongOps feedback link (Salehen Shovon Rahman)

 * Fix instances range to go up to and INCLUDING end time (Stephen Belanger)

 * include display name with spoofed session (themitchy)

 * only work with strongloop session (themitchy)

 * display full name (themitchy)

 * enable profile link in top bar (themitchy)

 * Add alerts migration, not sure how that disappeared, and add pid to instances (Stephen Belanger)

 * Make rollups work in dev...again... (Stephen Belanger)

 * modified metrics processor to v3 (Eugene Kaydalov)

 * Purge bad sql migrations from master (Stephen Belanger)

 * Update migrations to support latest codebase, disabled partitions as they don't work on dev. (Stephen Belanger)

 * don't send alerts (themitchy)

 * need to callback even if there are no extra users (themitchy)

 * client apiserver config'd from env (themitchy)

 * remove unused crap (themitchy)

 * redirect to correct page (themitchy)

 * update to use strongloop heroku add-on (themitchy)

 * how to version updates (themitchy)

 * Fix conflicts (Stephen Belanger)

 * Disable alerts.send from old alerts system (Stephen Belanger)

 * Massage the output format into something TimeSeries.js in the web frontend understands (Stephen Belanger)

 * load up apps and api keys for duplicate email accounts (themitchy)

 * landing stuff is done in the header (for now) (themitchy)

 * removed pricing email link (themitchy)

 * Cleaned up the green bar a little bit more. (Salehen Shovon Rahman)

 * Added a green bar, removed dead code, p tags use Ubuntu (Salehen Shovon Rahman)

 * chained logout (themitchy)

 * Updated the copyright message (Salehen Shovon Rahman)

 * Got the z-index issue fixed. (Salehen Shovon Rahman)

 * Realined the dashboard filter (Salehen Shovon Rahman)

 * support NODEFLY_APPLICATION_KEY as backup (themitchy)

 * sanitization fix needs to be done from develop, master is behind (Stephen Belanger)

 * The active nav elements now get a green bar. (Salehen Shovon Rahman)

 * Added ping, get /clusters/:clusterId returns 404 when resource not found (Andrew Martens)

 * More fixes to mongodb sanitization (Stephen Belanger)

 * missed the notAuth export (themitchy)

 * let me turn off forceHttps middleware (themitchy)

 * clean up mustAuth notAuth (themitchy)

 * fall back to ops session email (themitchy)

 * modified output Date format per Sumitha's request (Eugene Kaydalov)

 * get ops logo in menu (themitchy)

 * add job that sends a list of users who started using StrongOps to Sumitha (Eugene Kaydalov)

 * update active menus (themitchy)

 * Version bump (Stephen Belanger)

 * Fix conflicts in package.json (Stephen Belanger)

 * Fix mongodb sanitization sometimes complaining about null values (Stephen Belanger)

 * update staging server name (themitchy)

 * The dashboard-filters top position is now aligned (Salehen Shovon Rahman)

 * Moved the navigation menu (Salehen Shovon Rahman)

 * Deleted the top navbar. (Salehen Shovon Rahman)

 * Updated the footer (Salehen Shovon Rahman)

 * Changed the hover colour of navbar elements (Salehen Shovon Rahman)

 * Removed some comments. (Salehen Shovon Rahman)

 * Pushed the changes from rebranding into develop (Salehen Shovon Rahman)

 * Added more list elements to the navbar. (Salehen Shovon Rahman)

 * s/\n/  /g (themitchy)

 * Basic heap profiler chart re-implementation (Stephen Belanger)

 * grab oracle top calls (themitchy)

 * add session_metrics and log3 tables (Eugene Kaydalov)

 * add oracle support (Eugene Kaydalov)

 * Added the StrongLoop logo to the hompage. (Salehen Shovon Rahman)

 * Styled the navigation bar (Salehen Shovon Rahman)

 * support env var STRONGLOOP_KEY as well because heroku add-ons have hard prefix rules (themitchy)

 * Added the social icons to the header (Salehen Shovon Rahman)

 * don't crash if no data in log3 (Eugene Kaydalov)

 * Added the StrongLoop logo to the footer. (Salehen Shovon Rahman)

 * Changed the logo on the dashboard to StrongLoop (Salehen Shovon Rahman)

 * Change agent to search for userKey in strongloop.json and update docs to explain cascading config search (Stephen Belanger)

 * Run first memory profile step right away (Stephen Belanger)

 * SLP-221 add repository url (themitchy)

 * missed last version bump (themitchy)

 * Refactoring; auth; initial graph data (Andrew Martens)

 * add missing files to setup dev (eugene kaydalov)

 * allow session spoofing for dev (themitchy)

 * find or create user based on SL session data (themitchy)

 * stub out getting multiple emails (themitchy)

 * disable socket.io (not working under /ops right now) (themitchy)

 * no more registration (themitchy)

 * Added ps params for freebsd cpu info (Andrew Martens)

 * change column name to be backward compatible (Eugene Kaydalov)

 * Parameterization for parsePs() (Andrew Martens)

 * Relocated code to parse output of ps (Andrew Martens)

 * fix bad string concat bug (Eugene Kaydalov)

 * Clean-up of the code. (Salehen Shovon Rahman)

 * How-to section has Ubuntu font. (Salehen Shovon Rahman)

 * move from log2 to log3 (which is partitioned) (Eugene Kaydalov)

 * Moved a lot of the fonts from proxima to Ubuntu (Salehen Shovon Rahman)

 * Minor fix to migrations to sooth a cranky mysql (Andrew Martens)

 * Rename some uhura references to collector (Ryan Graham)

 * Make tests pass by accepting config options (Ryan Graham)

 * Make tests fail by using desired API (Ryan Graham)

 * rollups v3 initial commit (eugene kaydalov)

 * Production SQL database definition for dev work (Andrew Martens)

 * change data query to use rollups v3 data structures (Eugene Kaydalov)

 * Fixed the background color (Salehen Shovon Rahman)

 * Lower case HTML. Uppercase CSS (Part 2) (Salehen Shovon Rahman)

 * Lower case HTML. Uppercase CSS (Salehen Shovon Rahman)

 * Re-add instances data as a new route. It got removed in the clustered graph data rewrite. (Stephen Belanger)

 * Fix for global.nodefly undefined (Stephen Belanger)

 * Still need to normalize CPU values to +ve (Andrew Martens)

 * moved CPU ptime calc for linux to fix logic bug (Andrew Martens)

 * handle getConnections() err (themitchy)

 * authenticate to redis (themitchy)

 * No seriously, CPU values should be 0-100 (Andrew Martens)

 * Also force undefined CPU readings to 0 (Andrew Martens)

 * Update README.md (Mitch Granger)

 * refer to docs if not configured (themitchy)

 * Relocated negative cpu value fix for unit testing (Andrew Martens)

 * dependency on uvmon should be 'stable' not 'latest' (Andrew Martens)

 * Ensuring that CPU % values are never negative (Andrew Martens)

 * separated execute from rollback,commit to catch the command for rollback,commit (Eugene Kaydalov)

 * change tiers from 15 to 60 seconds (Eugene Kaydalov)

 * protect if app is not a web service (Eugene Kaydalov)

 * mocha args in correct position (themitchy)

 * take MOCHA_ARGS from jenkins (themitchy)

 * generously look to res.body or res.body.message for the error string, also pass http response with error (themitchy)

 * added tests for errors on existing user and bad passwords (themitchy)

 * added around() method (Eugene Kaydalov)

 * initial commit, fails on line 56 (Eugene Kaydalov)

 * password error broken (themitchy)

 * turfing redundant/failing test (themitchy)

 * Add a way to disabling colour on Jenkins runs (Ryan Graham)

 * Fix references broken by rename (Ryan Graham)

 * Rename lib/transport/uhura.js lib/transport.js (Ryan Graham)

 * Remove old transport implementation (Ryan Graham)

 * Override test reporter via $REPORTER env variable (Ryan Graham)

 * Add repository to package.json (Stephen Belanger)

 * initial docs.json (themitchy)

 * Fixed childrenCount in cpu profiler test (Andrew Martens)

 * Add pid to instances records (Stephen Belanger)

 * Use random ephemeral ports for tiers tests (Ryan Graham)

 * Use randome ephemeral port for sanity tests (Ryan Graham)

 * Disconnect from Uhura server on agent stop (Ryan Graham)

 * Remove trailing whitespace (Ryan Graham)

 * Add passing stop() (Ryan Graham)

 * Add test for stop() method existing (Ryan Graham)

 * Add option for testing subset of tests (Ryan Graham)

 * Need to use https now, as http redirects and changes POST to GET (Stephen Belanger)

 * Make cpu-profiler tests more explicit (Ryan Graham)

 * Added `db-migrate` (Salehen Shovon Rahman)

 * Fix tiers tests to work with new data format (Stephen Belanger)

 * Moved database access into dataHelper.js (Andrew Martens)

 * relative path for shva (themitchy)

 * updating heroku add-on to work with /ops prefix (themitchy)

 * Added StrongLoop license (Andrew Martens)

 * Use new cpu profiler (Stephen Belanger)

 * force https based on 'x-forwarded-proto' (themitchy)

 * non https health check because… aws (themitchy)

 * ops prefix (themitchy)

 * only force https on live servers (themitchy)

 * force https (themitchy)

 * fix intercom js (themitchy)

 * additions to /v2/clusters (Andrew Martens)

 * doing /clusters with async.waterfall (Andrew Martens)

 * Proper repo this time (Andrew Martens)

 * stop old nodefly service from writing to disk (themitchy)

 * everyauth only seems to work at / (themitchy)

 * hacks to get everyauth working under /ops (themitchy)

 * relative paths (themitchy)

 * relative paths for /ops prefix (themitchy)

 * prepare for switch to stock node-measured (Eugene Kaydalov)

 * simple config loader (themitchy)

 * ignore (themitchy)

 * formatting (themitchy)

 * Prevent failing test from cascading and interfering with other tests (Ryan Graham)

 * Add links to leveldown probe (Ryan Graham)

 * Fix tiers tests and tiers data event (Stephen Belanger)

 * Update to support /ops and add tests (Stephen Belanger)

 * intercom.io protocol matching (themitchy)

 * https when https (themitchy)

 * ignore compiled stylesheet (themitchy)

 * fixing password reset (themitchy)

 * Safer stubbing (Ryan Graham)

 * no funny port for api server (themitchy)

 * TODO for node-measured -> measured migration (Ryan Graham)

 * name (themitchy)

 * Make tiers tests runnable on their own (Ryan Graham)

 * Teach jshint about Mocha globals (Ryan Graham)

 * Shorten line, make jshint happier (Ryan Graham)

 * DOn't use /ops yet (Stephen Belanger)

 * Implement #batch(), passing tests (Ryan Graham)

 * Add failing spec for instrumenting #batch() (Ryan Graham)

 * Further splitting up of leveldown tests (Ryan Graham)

 * Refactor leveldown tests to assert less per test (Ryan Graham)

 * Replace custom spy with sinon (Ryan Graham)

 * Add sinon module for spies/mocks in tests (Ryan Graham)

 * fixjsstyle test/leveldown.js (Ryan Graham)

 * Further DRYing of leveldown test (Ryan Graham)

 * Refactor leveldown tests to improve testability (Ryan Graham)

 * Improve correctness of .destroy/.repair test (Ryan Graham)

 * DRY up leveldown tests some more (Ryan Graham)

 * Consolidate leveldown mocking, improve test focus (Ryan Graham)

 * Rollup monitor script, imported from production (Ryan Graham)

 * CPU profiler unit test (Andrew Martens)

 * Convert from tabs to 2 spaces (Ryan Graham)

 * Use '' for strings (Ryan Graham)

 * Simplify agent sanity tests (Ryan Graham)

 * Make note about potential performance problem (Ryan Graham)

 * Implement basic instrumentation of iterators (Ryan Graham)

 * Add failing tests for instrumentation of iterators (Ryan Graham)

 * Refactor put/get/del instrumentation (Ryan Graham)

 * Implement a basic mock/spy pattern to test leveldown instrumentation (Ryan Graham)

 * Remove db-migrate from devDependencies...this goes in common (Stephen Belanger)

 * Fix bug in tiers conversion to external measured package (Stephen Belanger)

 * Add mongo sanitization and convert tiers to use external measured package (Stephen Belanger)

 * Tidy up names in tests (Ryan Graham)

 * Cleanup of leveldown probe (Ryan Graham)

 * More rough tests (Ryan Graham)

 * refresh boot user from database (themitchy)

 * https if https (themitchy)

 * there is no more dashboard shelf (themitchy)

 * disable alerts setup (wip) (themitchy)

 * alerts store config (themitchy)

 * Initial leveldown probe tests (Ryan Graham)

 * camelCase (Ryan Graham)

 * fixjsstyle lib/wrapping_probes/leveldown.js (Ryan Graham)

 * Convert tabs to 2 spaces (Ryan Graham)

 * Fix the incorrect use of hash in cancellation code (Stephen Belanger)

 * Update to support cancellation (Tests only) (Stephen Belanger)

 * Initial work on probe that wraps leveldown (Ryan Graham)

 * Add support for probes that wrap modules intead of modify them (Ryan Graham)

 * Add rest routes for account manipulation, with new cancellation support. These are required by the nodefly-register module (Stephen Belanger)

 * Fixed CPU usage for 64-bit Solaris/SmartOS (Andrew Martens)

 * Add createSession validation to sanity tests (Ryan Graham)

 * Simplify sanity test (Ryan Graham)

 * Update tiers test to evaluate within uhura server, rather than intercepting transport (Stephen Belanger)

 * Make sure agent transport is disconnected (Ryan Graham)

 * Document oddity (Ryan Graham)

 * this.currentTest seems to be version specific (Ryan Graham)

 * Add missing dev dependency on express (Ryan Graham)

 * Close fake collector's server (Ryan Graham)

 * Fix Conflicts (Stephen Belanger)

 * Plug some leaks and add tiers test (Stephen Belanger)

 * Refactor test to more correctly use before/afterEach (Ryan Graham)

 * Sanity check for agent connecting to collector (Ryan Graham)

 * Clean up tests (Ryan Graham)

 * Working coverage reporting (Ryan Graham)

 * Make cpuinfo.cpuutil() tests work (Ryan Graham)

 * Add passing sanity specs (Ryan Graham)

 * Convert failing vows tests to failing mocha specs (Ryan Graham)

 * Use mocha for tests (with blanket for coverage) (Ryan Graham)

 * Remove references to API versions that no longer exist (Ryan Graham)

 * Fix typos in package.json (Ryan Graham)

 * remove timekit dependency and direct use of pre-packaged node-measuredfork (Eugene Kaydalov)

 * Start centralizing database config/migrations (Ryan Graham)

 * Make use of nodefly-common helper for test setup (Ryan Graham)

 * Replace test/test.sh with nodefly-common helper (Ryan Graham)

 * Use module-relative paths (Ryan Graham)

 * Add missing dependency on db-migrate (Ryan Graham)

 * Unless not false, do not this... (Ryan Graham)

 * Put less in its proper place (Ryan Graham)

 * Prefix is relative to mount point, not root (Ryan Graham)

 * Resolve paths instead of just concatenating (Ryan Graham)

 * missing dependancy (themitchy)

 * remove unused configs (themitchy)

 * rename to log2 (themitchy)

 * Update migrations (Stephen Belanger)

 * start tail (themitchy)

 * use log2 (themitchy)

 * fix less middleware (themitchy)

 * restore alert boxes (themitchy)

 * appId != app_id (themitchy)

 * fix index (themitchy)

 * include email (themitchy)

 * unused js (themitchy)

 * more relative paths (themitchy)

 * prepping for /ops mount point (themitchy)

 * wip: prepping for mount point to be /ops (themitchy)

 * dependency nodefly-v8-profiler now uses 'stable' instead of 'latest' (Andrew Martens)

 * Wired up alerts interfaces (Stephen Belanger)

 * don't attempt to run query without app id (themitchy)

 * cleaning up old unused mongo code (themitchy)

 * set value instead of append (it could be an object) (themitchy)

 * purge old unused mongo code (themitchy)

 * purging of old mongo code (themitchy)

 * tail raw data and fire data events for alerts (Eugene Kaydalov)

 * missed package update (themitchy)

 * getConnections fix (themitchy)

 * Add login API (Stephen Belanger)

 * spelling (themitchy)

 * more changes to support working under /ops with proxy (themitchy)

 * Alerts REST API (Stephen Belanger)

 * all binary modules are now optional dependencies (Andrew Martens)

 * update password reset (themitchy)

 * tossing unused stuffs (themitchy)

 * move login/register stuff to separate module (themitchy)

 * major refactoring of login & registration (themitchy)

 * Changed field names for ActOn integration (Andrew Martens)

 * enable intercom secure mode (themitchy)

 * default to one week (themitchy)

 * fix remember me to just use cookie age (themitchy)

 * use index.ejs to bootstrap user data (themitchy)

 * more informative error (themitchy)

 * remove old alert stuff (themitchy)

 * remove testing routes (themitchy)

 * remove fake data generator (themitchy)

 * restore profiler, bump version (themitchy)

 * Added riak-js probe (Andrew Martens)

 * extra reminder on profiler (themitchy)

 * actual blog link (themitchy)

 * update privacy link (themitchy)

 * update tos link (themitchy)

 * update to links, announcement image on landing page (themitchy)

 * rollback to connections instead of getConnections() because the proxy.js would fail on it (eugene kaydalov)

 * labels backwards (themitchy)

 * how to update (themitchy)

 * Submit registrations to Act On as well (Andrew Martens)

 * Shut up node, you're drunk (Stephen Belanger)

 * change calculated value from micro to milliseconds (Eugene Kaydalov)

 * time to timer rename (Eugene Kaydalov)

 * remove a call to stackTrace() (Eugene Kaydalov)

 * final cleanup before release (Eugene Kaydalov)

 * valid package name (themitchy)

 * use strong-agent (themitchy)

 * put strongmq metrics back in (themitchy)

 * initial cleanup. several probes left (eugene kaydalov)

 * set precision (themitchy)

 * use SUM for mq messages (themitchy)

 * change user-facing names to strong* (themitchy)

 * strong-mq chart (themitchy)

 * add message about preview mode (themitchy)

 * add profiler to top nab (themitchy)

 * updating various links to point to sl website (themitchy)

 * clean up control channel styling (themitchy)

 * fix npm start (themitchy)

 * alert for limit exceeded (themitchy)

 * render 'no profile found' properly (themitchy)

 * remove unused button (themitchy)

 * disable alerts poling (themitchy)

 * update footer (themitchy)

 * update sl heroku routes (themitchy)

 * set limit on profiler usage (themitchy)

 * use new top_calls tables (themitchy)

 * update sql migrations (themitchy)

 * streams "re-patch" themselves when "on" is called so we'll make sure that patch is proxy'd (themitchy)

 * run both jobs from npm start (themitchy)

 * scripts are configurable from env (themitchy)

 * have dumper let us know if there were script problems (themitchy)

 * Remove broken test (Stephen Belanger)

 * Missed something (Stephen Belanger)

 * Switch to connect 2.8.x (Stephen Belanger)

 * fix heap data metric names (Eugene Kaydalov)

 * fix JSON export/import problem (Eugene Kaydalov)

 * capture tiers no matter what (themitchy)

 * restore dummy proxy on setTimeout and nextTick (themitchy)

 * invalid default value for date time (themitchy)

 * don't start timers if no config provided(agent not started) (themitchy)

 * populate collection_sessions.app_id (Eugene Kaydalov)

 * gitignore data files (themitchy)

 * switch to new agent name and auto-detect configs mode (themitchy)

 * removed reference to mysql_pool_local (themitchy)

 * chmod u+x on shell scripts (themitchy)

 * add rollup support (Eugene Kaydalov)

 * map correct object for strongmq counts (themitchy)

 * added support for top calls via session_id (Eugene Kaydalov)

 * Added period to end of sentence in the "Fast Set Up" section (davenodefly)

 * Update features.html (davenodefly)

 * Enable memory profiler in agent (Stephen Belanger)

 * add session filter to dashboard (themitchy)

 * generic style for pretty checkboxes (themitchy)

 * have graph data model support sessionId (themitchy)

 * fix bug in session picker (themitchy)

 * make query by sessionId work (themitchy)

 * Add count tracking to other probes (Stephen Belanger)

 * Slow down callCounts emit frequency (Stephen Belanger)

 * graph node probably shouldn't be in there... (Stephen Belanger)

 * Don't need that console.log... (Stephen Belanger)

 * Added sl-mq/strong-mq probe (Stephen Belanger)

 * added support for session GET parameter (Eugene Kaydalov)

 * magma chart (themitchy)

 * Bump version (Stephen Belanger)

 * add support for 'pid' (using data2_X db tables) (Eugene Kaydalov)

 * Removed lib/queue.js in favour of new metrics.  Piggybacked new uvmon data onto old queue metrics. (Andrew Martens)

 * profiler styling (themitchy)

 * add session picker and control channel to profiler dashboard (themitchy)

 * control channel controls (themitchy)

 * create session picker (themitchy)

 * send sessionId and pid to profiler view (themitchy)

 * get sessions for each app when loading user data (themitchy)

 * update profiler status when data comes in (themitchy)

 * add status column to profiler_runs (themitchy)

 * update and retrieve status column (themitchy)

 * move core stuff above router middleware (themitchy)

 * unique constraint on sessionId (themitchy)

 * use connection pool and accept sessionId instead of appId (themitchy)

 * refactoring / cleanup (themitchy)

 * update session on duplicate sessionId (themitchy)

 * minor data format change; uvmon points to bin repo (Andrew Martens)

 * Fixed conflicts (Stephen Belanger)

 * Restore tier interval to 15 seconds (Stephen Belanger)

 * bind to main socket now that uruha fix is live (themitchy)

 * add debug to session storage (themitchy)

 * Bind disconnect handler to connection, not socket (Stephen Belanger)

 * Increase tier reporting interval (Stephen Belanger)

 * Added ensureConfig to cascade load config data and ensure the agent does not run without valid configs (Stephen Belanger)

 * initial profiler dashboard with cluster chooser (themitchy)

 * Tested and working (Stephen Belanger)

 * Respond with complete user record (Stephen Belanger)

 * Added readme (Stephen Belanger)

 * first commit (Stephen Belanger)

 * remove debug log (themitchy)

 * update gitignore (themitchy)

 * update gitgnore and start script (themitchy)

 * update git ignore and start script (themitchy)

 * Loop monitor tie-in with nodefly-uvmon (Andrew Martens)

 * store pid (themitchy)

 * store server time for updates (themitchy)

 * remove insert to session_track (themitchy)

 * don't send to alerts (themitchy)

 * disconnect was bound to wrong object (themitchy)

 * lock to minor version of connect (themitchy)

 * only record connectedAgents if a pid is provided (themitchy)

 * Forgot the profilers...whoops. (Stephen Belanger)

 * rename "Top Functions" to "Slow Endpoints" (themitchy)

 * pass in unit for tooltip (themitchy)

 * fix config selection (themitchy)

 * Update db-migrate migrations (Stephen Belanger)

 * Can now trigger profiler events on agents from API server (Stephen Belanger)

 * remove _in and _out prefixes.  Don't graph _out. (themitchy)

 * connect to production if we can't get hostname from browser (themitchy)

 * strict hostname match for configs (themitchy)

 * image checkbox for safari compatibility (themitchy)

 * min height of main content pane (themitchy)

 * un-hardcode appId (themitchy)

 * routes for sl heroku auth (themitchy)

 * ignore env files (themitchy)

 * valid session if it has appName or hostname (themitchy)

 * don't assume query will return rows (themitchy)

 * ignore invalid updates from older agents (themitchy)

 * Reconnection test, plus add db-migrate to dev dependencies (Stephen Belanger)

 * API V2 Tests with code coverage (Stephen Belanger)

 * Corrected spelling of "Utililization" to "Utilization" (davenodefly)

 * Capitalized "apple" (davenodefly)

 * print out correct value for debug log (themitchy)

 * formatting, clean-up, session fixing (themitchy)

 * API V2 tests written (Stephen Belanger)

 * remove catcher which does nothing (Eugene Kaydalov)

 * remove garbage that gets packaged into npm (Eugene Kaydalov)

 * add support for app_id for log data (Eugene Kaydalov)

 * Fix session data mismatch (Stephen Belanger)

 * make reconnect recover the whole session state from storage (Eugene Kaydalov)

 * Fix some global leaks (Stephen Belanger)

 * some fixes to reconnect (themitchy)

 * reversing hard-coded configs (themitchy)

 * populate apps table, change app_hash generation algo (Eugene Kaydalov)

 * fix for "on duplicate update" bug (themitchy)

 * Session invalidation (Stephen Belanger)

 * More test coverage (Stephen Belanger)

 * make sure appId is stored in shared Uhura session (themitchy)

 * use uhura@stable (themitchy)

 * Forgot the reconnect thing... (Stephen Belanger)

 * handle reconnect (themitchy)

 * Reduced max timout for exponential backoff to be more sane, fixed session store changes not saving when changed server-side, fixed double reconnect bug, and added error logging (Stephen Belanger)

 * add verbose logging (themitchy)

 * fixed position filters (themitchy)

 * update configs with cleaner hostnames (themitchy)

 * remove full url (themitchy)

 * remove unused styles (themitchy)

 * fix for tabs ui, better top functions styling (themitchy)

 * make sure chart updates as soon as possible (themitchy)

 * add some debug logs (themitchy)

 * make sure tests exit (themitchy)

 * update tests (themitchy)

 * how about I actually USE the config (themitchy)

 * use hostname to pick configs (themitchy)

 * utility for setting debug log level (themitchy)

 * remove require to AppChooser (themitchy)

 * Rewrite tests to use unix sockets (Stephen Belanger)

 * clean up unused stuff, disable alerts (themitchy)

 * Clean up top functions template (themitchy)

 * catch highcharts errors (themitchy)

 * re-use top function query with bind (themitchy)

 * Fix tests to destroy socket rather than safe disconnect. (Stephen Belanger)

 * Fix start/resume loop when session data unavailable on attempted resume. Save session data on change rather than disconnect...that was stupid. (Stephen Belanger)

 * basic rendering of top functions (themitchy)

 * get top function data for time range from cluster tables (themitchy)

 * store top functions into mysql top_calls table (Eugene Kaydalov)

 * lock validator version (themitchy)

 * Add code coverage testing (Stephen Belanger)

 * force a failed build in jenkins (themitchy)

 * different logging for tests (themitchy)

 * add db-migrate and restler for testing (themitchy)

 * db seeding and tests for api server (themitchy)

 * stub out top functions area (themitchy)

 * wire tooltips back up, disable alerts (themitchy)

 * setFilter silent doesn't update path (themitchy)

 * graph picker & refactoring (themitchy)

 * filter by metric/graph (themitchy)

 * Fix for missing session records (Stephen Belanger)

 * filters refactor and styling (themitchy)

 * Backoff maximum and listener warning fix (Stephen Belanger)

 * v2 dashboard stuff (wip) (themitchy)

 * all graph data is objects instead of arrays (themitchy)

 * send start for end if there was no new data (themitchy)

 * send last row ts for convenience (themitchy)

 * enable jsonp (themitchy)

 * Fix missing agentVersion (Stephen Belanger)

 * I'm a dumbass (themitchy)

 * update package.json to use uhura (themitchy)

 * added some debug logs (themitchy)

 * modify api server to use bucket tables (themitchy)

 * unique constraint on apphash (themitchy)

 * fix socket.io api (themitchy)

 * fix redirect for express 2.5.X (themitchy)

 * Move old Socket.IO interface to v0.1 folder and create v2 folder with Uhura interface (Stephen Belanger)

 * Preliminary uhura integration (Stephen Belanger)

 * Fix error reconnection, change sid to sessionID, emit disconnect events on server, and do some more cleanup (Stephen Belanger)

 * update header styles for partner page (themitchy)

 * link crawlable content to partners page (themitchy)

 * partners page (themitchy)

 * partner logos (themitchy)

 * update ami to include cronjob for server restart (themitchy)

 * add support for rolled up data (Eugene Kaydalov)

 * stop logout button from floating away (themitchy)

 * use less-middleware to compile less files (themitchy)

 * fix broken host check (themitchy)

 * More documentation (Stephen Belanger)

 * Pass options through to server (Stephen Belanger)

 * Small hack to support connect-redis session middleware (Stephen Belanger)

 * Indentation cleanup (Stephen Belanger)

 * Forgot to add semicolons to index.js (Stephen Belanger)

 * Add session store test and lots of semicolons (Stephen Belanger)

 * Strip www from url, allowing Github OAuth and sessions to work properly. (Stephen Belanger)

 * report error on closing connection (themitchy)

 * pull in pool options through config (themitchy)

 * didn't need to be wrapped in getConnection (themitchy)

 * use runQuery instead of getConnection (themitchy)

 * debug logs, remove unnecessary getConnection call (themitchy)

 * separate debugging for data/server (themitchy)

 * Pointed everyauth dependency at our github repo, since upstream isn't pulling in fixes (Andrew Martens)

 * appFinder module to search/create apps (themitchy)

 * add session id to data log (themitchy)

 * redelegate all events on render (themitchy)

 * new backbone version uses 'get' in favour of getByCid (themitchy)

 * remove socket.io-client dependancy, add request module (themitchy)

 * initial rest interface (themitchy)

 * replace socket.io with http transport (themitchy)

 * route for establishing session (themitchy)

 * move data storage module into v1 dir (themitchy)

 * remove prototype stuff (themitchy)

 * update package (themitchy)

 * ensure events are delegated after model re-renders page (themitchy)

 * move data storage calls into separate module (themitchy)

 * session store uses mysql pool (themitchy)

 * create mysql pool (themitchy)

 * update mysql version for pooling (themitchy)

 * remove debug logs (themitchy)

 * longer notification poll (themitchy)

 * longer user poll (themitchy)

 * Fix redis.auth (Stephen Belanger)

 * Absolute path fix (Stephen Belanger)

 * bin/nodefly fix (Stephen Belanger)

 * Removed out-of-date references to Node.js versions. (Andrew Martens)

 * bump versions (themitchy)

 * Forgot to add to binary list in package.json (Stephen Belanger)

 * Added nodefly binary (Stephen Belanger)

 * Minor fix (Stephen Belanger)

 * Redis fix (Stephen Belanger)

 * typo (themitchy)

 * wip: route loader for versioned api (themitchy)

 * warning about kill signal (themitchy)

 * styles for dashboard menu (themitchy)

 * Forgot these... (Stephen Belanger)

 * version update (themitchy)

 * Change line type (Stephen Belanger)

 * timezone-less query (themitchy)

 * Forgot to commit the Font Awesome stuff (Stephen Belanger)

 * don't clear local storage (themitchy)

 * logging (themitchy)

 * fixed missing event (themitchy)

 * don't send userId (themitchy)

 * better debug log (themitchy)

 * instance monitoring fixes (Stephen Belanger)

 * Make memwatch optional (Stephen Belanger)

 * Added instances stuff (Stephen Belanger)

 * remember last used appKey (themitchy)

 * Hack to trigger chooser after initial chart load (Stephen Belanger)

 * only show one app for appHash (themitchy)

 * optional debug logging (themitchy)

 * Criteria-based instances chart working (Stephen Belanger)

 * Basic memory chart. Need to add top scoping stuff. (Stephen Belanger)

 * cpu chart still needs to check for duplicate time stamps (themitchy)

 * timezone-proof query (themitchy)

 * back to restler, gzip pipe was causing problems (themitchy)

 * make sure timestamp is utc (themitchy)

 * show units (themitchy)

 * clean up some unused chart parsing (themitchy)

 * update aws package script (themitchy)

 * updating dep versions (themitchy)

 * sql for cluster'd log data (themitchy)

 * only use cluster data (themitchy)

 * add session id into the log data record (Eugene Kaydalov)

 * add another insert for collector_sessions table (Eugene Kaydalov)

 * Show help message when instance logging data is not available (Stephen Belanger)

 * if the job was inactive for a any amount of time, run prepare_job.sql and start the job (Eugene Kaydalov)

 * add tail_log/insert_tears job (Eugene Kaydalov)

 * dashboard drop down menu stub view for memory dashboard (themitchy)

 * comment out apps menu (themitchy)

 * disable single-require js (themitchy)

 * wii dashboard drop down (themitchy)

 * remove old open shift stuff (themitchy)

 * add 2 api calls for cluster support: getClusterAppId and getClusterData (Eugene Kaydalov)

 * nodefly-mark had been removed from package.json (themitchy)

 * formatting / indentation (themitchy)

 * Fix _.keys() error when instances field is not present (Stephen Belanger)

 * use intercom window instead of feedback emailer (themitchy)

 * update addresses (themitchy)

 * smtp config fix (themitchy)

 * shell script to create aws instance, deploy web app, build ASG ready image, and clean up after itself (themitchy)

 * Instances frontend stuff. Not entirely working yet, so moved to new branch. (Stephen Belanger)

 * dumb routes for old api (themitchy)

 * Openshift how-to panel (Stephen Belanger)

 * use nodefly.com instead of apm.nodefly.com (themitchy)

 * switch from restler to request (themitchy)

 * Made Makefile work without db-migrate, and added symlink fix to Vagrantfile (Stephen Belanger)

 * require correct gcinfo (themitchy)

 * Fixed some issues when running migrations on a newly-created db. (Andrew Martens)

 * session_track table (themitchy)

 * back to regular gc-info removed memwatch dep (themitchy)

 * google+ link (themitchy)

 * get expensive data after aggregation (themitchy)

 * add missing dep (themitchy)

 * remove some debug (themitchy)

 * add dep for underscore (themitchy)

 * use aggregation framework to get top functions (themitchy)

 * support new data format for top functions (themitchy)

 * Limit instance data to top 10 (Stephen Belanger)

 * switch to gcinfo2 until we get publish access to gcinfo (themitchy)

 * fix saveTopFunctions (themitchy)

 * remove legacy stuff (themitchy)

 * remove legacy stuff from collector (themitchy)

 * remove mongolab reference move insert to dataMan (themitchy)

 * use url for app chooser (themitchy)

 * update styles (themitchy)

 * set id for backbone data (themitchy)

 * added writing into session_track table (Eugene Kaydalov)

 * update Chosen library (themitchy)

 * Instances data collection and serving (Stephen Belanger)

 * cron settings (Eugene Kaydalov)

 * prepare the job to be run as a cron job (Eugene Kaydalov)

 * cron jobs for populating the apps table (Eugene Kaydalov)

 * exit when mysqlbacklog is empty (Eugene Kaydalov)

 * tail table for jobs to keep track of last processed records for tables. (Eugene Kaydalov)

 * assign_app.php is a job that takes collector session entries and assigns a cluster app to each it creates a new app if it hasn't been registered yet (Eugene Kaydalov)

 * specified current location of ini file (Eugene Kaydalov)

 * a job that takes redis new session entries and copies them to mysql (Eugene Kaydalov)

 * remove useless index (themitchy)

 * use built require modules if production (themitchy)

 * built require modules (themitchy)

 * update require (themitchy)

 * version control blog template (themitchy)

 * remove unused singleton code (themitchy)

 * work directly on $ object (themitchy)

 * query not handled with require (themitchy)

 * Add apps table and 2 new columns to collector_sessions (Eugene Kaydalov)

 * update module version (themitchy)

 * handle request hops and keep transaction (themitchy)

 * send new data to new mongo instance (themitchy)

 * update async module (themitchy)

 * un-break mongo reconnect (themitchy)

 * script to create mongo indexes (themitchy)

 * allow direct access to collections (themitchy)

 * create indexes manually (themitchy)

 * store new data format for top functions (themitchy)

 * added getUserClusterApps call for getUser API method (Eugene Kaydalov)

 * write session data to collector_sessions table (themitchy)

 * remove old session write (themitchy)

 * Add jobs to github. Initially the log_p table transfer to log (MyISAM to InnoDB migration) and the apps expiry script (Eugene Kaydalov)

 * Initial commit (supermonster)

 * better index (themitchy)

 * Switch to log From log_p (Jacob Groundwater)

 * styles for apps page (themitchy)

 * not proxying EE for now (themitchy)

 * updating version (themitchy)

 * add debug to socket module (themitchy)

 * check if transport is open before sending (themitchy)

 * added debug (themitchy)

 * AppsView renders user changes (themitchy)

 * apps collection is redundant (themitchy)

 * make local copy of apps array so we don't trigger 'change' (themitchy)

 * give Intercom time to load (themitchy)

 * updated intercom js (themitchy)

 * basic table for app data (themitchy)

 * login and register initiate polling user data (themitchy)

 * add app collection (themitchy)

 * app view listens to user model (themitchy)

 * make user model self-fetching (themitchy)

 * simplify view manager (themitchy)

 * configure poll interval for user data (themitchy)

 * rename nav (themitchy)

 * single call for apps (themitchy)

 * send ids with apps and users (themitchy)

 * remove debug (themitchy)

 * updating package version (themitchy)

 * parodying the event emitter directly causes crashes for some (themitchy)

 * upgrade backbone and underscore (themitchy)

 * ensure events are delegated after remove/re-add (themitchy)

 * allow view.remove() to function correctly (themitchy)

 * styles for app nav (themitchy)

 * nab for apps view (themitchy)

 * start view for apps (themitchy)

 * only disconnect if connected (themitchy)

 * fix postal code (themitchy)

 * set copyright to current year, always. (themitchy)

 * shim available width (themitchy)

 * chart styles limit children in chart (themitchy)

 * firefox compatible image preloading (themitchy)

 * switch up the colours a little (themitchy)

 * formate mongo query better (themitchy)

 * new endpoint paths graph (themitchy)

 * Add NodeFly Dependencies (Jacob Groundwater)

 * Add NodeFly Analytics to Packages (Jacob Groundwater)

 * record session end and start (themitchy)

 * version bump (themitchy)

 * ensure events are passed context (themitchy)

 * pass called method down to hook (themitchy)

 * pass ws lib errors to socket error handler (themitchy)

 * Version Bump (Jacob Groundwater)

 * Change Linux CPU Calculation to Async (Jacob Groundwater)

 * Use Collector Port from Config (Jacob Groundwater)

 * Fix Redis Configs (Jacob Groundwater)

 * Fix Redis Config (Jacob Groundwater)

 * Obtain Redis Config from Environment (Jacob Groundwater)

 * Use Redis-Backed Socket Sessions (Jacob Groundwater)

 * Use Single Mongo Instance (Jacob Groundwater)

 * Use Trivial Round-Robin MySQL Connection Pool (Jacob Groundwater)

 * update version (themitchy)

 * fix outgoing http probes (themitchy)

 * Use Polling for Alerts Instead of Events (Jacob Groundwater)

 * configure mongo to reconnect (themitchy)

 * Change Axon Socket Type to Sub from Pull (Jacob Groundwater)

 * Remove Set Notices - Moved to Collector Side to Support Web Clustering (Jacob Groundwater)

 * Add Buildfile (Jacob Groundwater)

 * Remove Old Mongo Configuration (Jacob Groundwater)

 * Use MongoLabs Only (Jacob Groundwater)

 * empty chart container before redrawing (themitchy)

 * store collector sessions on redis list (themitchy)

 * keep orig values (themitchy)

 * only show graph if data is available (themitchy)

 * send graph with top functions if present (themitchy)

 * no hook after tick(for now) (themitchy)

 * graph outgoing HTTP (themitchy)

 * store graph with top routes (themitchy)

 * style tweaks for tooltip and piping graph (themitchy)

 * UI for endpoint graph (themitchy)

 * quick fix for us taking global.config (themitchy)

 * graph data for probes (themitchy)

 * helper for graph data (themitchy)

 * set up closures for graph data (themitchy)

 * fix search for apps to only use first entry (themitchy)

 * throw in a stack trace if it's there (themitchy)

 * update package version (themitchy)

 * socketIO error could be a string… or not (themitchy)

 * strict checking for probe (themitchy)

 * Add Makefile for AWS Deployment (Jacob Groundwater)

 * include route prefix if available (themitchy)

 * fix indent (themitchy)

 * more in-your-face reminder of where to put the require (themitchy)

 * extra warning about putting the require first (themitchy)

 * column for 'remembered' sessions (themitchy)

 * check for persisted session if regular session becomes invalid (themitchy)

 * handle persisted session on page load (themitchy)

 * restore remembered user's session (themitchy)

 * retrieve remembered user from DB (themitchy)

 * checkbox for 'remember me' (themitchy)

 * cookies for remember token (themitchy)

 * update and clear remember token on login/logout (themitchy)

 * calculate and store remember me token (themitchy)

 * Show Full Error (Jacob Groundwater)

 * update collection list for postgres topFunctions (themitchy)

 * ui to show postgres functions (themitchy)

 * postgres probe (themitchy)

 * Add Git Ignore (Jacob Groundwater)

 * Remove Mongo Check from Web (Jacob Groundwater)

 * Quiet Debug Logging (Jacob Groundwater)

 * Fix Socket Reconnect Scope Issue (Jacob Groundwater)

 * remove css image preloaded (breaks FF) (themitchy)

 * Make MongoLabs Authentication Optional (Jacob Groundwater)

 * Update README (Jacob Groundwater)

 * Make HealthCheck Report to Logs (Jacob Groundwater)

 * Update Alert Status on Change Event (Jacob Groundwater)

 * Add MongoDB Dependency (Jacob Groundwater)

 * Fetch New Alert Count on Notification (Jacob Groundwater)

 * Remove Event Listeners When Socket Closes (Jacob Groundwater)

 * use hosted mongo for new calls (themitchy)

 * Add Alert Buttons Back to Dashboard (Jacob Groundwater)

 * Add Alerts Back In (Jacob Groundwater)

 * wrap intercom calls in try/catch (themitchy)

 * added check for mongodb (themitchy)

 * default values for required fields (themitchy)

 * add intercom.io support (themitchy)

 * send created date with user data (themitchy)

 * modal won't reset page scroll now (themitchy)

 * keywords update (themitchy)

 * clear error message properly (themitchy)

 * fix titles for alert configure dialog (themitchy)

 * conditional profiling of web server (themitchy)

 * correct interval (themitchy)

 * remove old UrlAggregator refs (themitchy)

 * handle case where reduce doesn't run for single result (themitchy)

 * ensure indexes (themitchy)

 * renamed some functions to make backwards compatibility clearer (themitchy)

 * changed event name of topFunctions for backwards compatibility (themitchy)

 * all probes using new topFunctions tool (themitchy)

 * use time range to determine start of window for top functions (themitchy)

 * Add parseInt for Axon Ports (Jacob Groundwater)

 * Require parseInt for Environmentally Determined Ports (Jacob Groundwater)

 * Add NodeFly Metrics to Collector (Jacob Groundwater)

 * collector requires underscore (themitchy)

 * reduce/retrieve topFunctionts (themitchy)

 * save express/http top functions (themitchy)

 * log tweaking (themitchy)

 * optionally profile from env (themitchy)

 * added methods to save and reduce topFunction data (themitchy)

 * send top functions all at once (themitchy)

 * use new topFunction collector in http and express probes (themitchy)

 * collect top functions every minute (themitchy)

 * allow collector to be specified in env (themitchy)

 * remove alerts from features (themitchy)

 * quiet down the logging (themitchy)

 * close db handle no matter what (themitchy)

 * add reconnection limit and max attempts config (themitchy)

 * disabled alerts (themitchy)

 * Less spammy invite (themitchy)

 * bug after deleting invite (themitchy)

 * move socket setup and events to separate module (themitchy)

 * sep stuff (themitchy)

 * field validation for alerts (themitchy)

 * redis session ttl (themitchy)

 * fix screenshot origin with scrolling (themitchy)

 * css image preloader (themitchy)

 * screenshots for features page (themitchy)

 * invite view fixes (themitchy)

 * Change Color for Drop Down Menus in Alerts Config (Jacob Groundwater)

 * this was removing the root element for the web site (themitchy)

 * fixed link (themitchy)

 * Change Text Color in Alerts Dialogue (Jacob Groundwater)

 * Fix Formatting of Alert Duration on Alerts List Page (Jacob Groundwater)

 * Change Alerts format to Minutes (Jacob Groundwater)

 * Map Alert Selectors to Alert Types (Jacob Groundwater)

 * Revert "Revert "Make Alert List Asynchronous"" (themitchy)

 * Revert "Revert "Make Notification Search Asynchronous"" (themitchy)

 * Revert "Make Alert List Asynchronous" (themitchy)

 * Revert "Make Notification Search Asynchronous" (themitchy)

 * initial features page (themitchy)

 * Remove Popup Confirmations (Jacob Groundwater)

 * Remove Grey Color from Alert Text (Jacob Groundwater)

 * alert config for times by tier (themitchy)

 * Fix Time Format Error in Notification (Jacob Groundwater)

 * Fix Notifications Comment / Documentation (Jacob Groundwater)

 * Switch Concurrent Connection and Throughput Indexes for Alerts (Jacob Groundwater)

 * fixed expired session landing page "no-render" bug (themitchy)

 * appChooser on how to uses correct model (themitchy)

 * change label (themitchy)

 * fix bug for loving back in as different user (themitchy)

 * parent can delete invites (themitchy)

 * accept empty app and hostname (themitchy)

 * rest call for removing parent/child link (themitchy)

 * update child_id when accepting invite (themitchy)

 * Ignore Missing Agent Version (Jacob Groundwater)

 * Make Alert List Asynchronous (Jacob Groundwater)

 * Make Notification Search Asynchronous (Jacob Groundwater)

 * show pending invites (themitchy)

 * mark invites accepted (themitchy)

 * column for accepting invites (themitchy)

 * Fix Procfile (Jacob Groundwater)

 * Deployment Fixes (Jacob Groundwater)

 * hide tooltips when clicking anywhere (themitchy)

 * chart title alignment (themitchy)

 * alerts are set up on login and registration (themitchy)

 * higher contrast buttons in chart titles (themitchy)

 * alert categories match chart series (themitchy)

 * user specified and multiple emails for alerts (themitchy)

 * login / accept invite for existing user (themitchy)

 * fix class / id (themitchy)

 * login form for invites (themitchy)

 * styles for auth error (themitchy)

 * fix class name and id (themitchy)

 * proper rendering of invite for users logged in or not (themitchy)

 * if user is logged in, make sure it's the correct user (themitchy)

 * remove check for data (themitchy)

 * show child apps to parent (themitchy)

 * unused call (themitchy)

 * registration of new users through invite (themitchy)

 * ui for sending invite start of ui for receiving invite (themitchy)

 * added rest calls to send and get invite data (themitchy)

 * function to send invitation (themitchy)

 * drop belongs in reverse script (themitchy)

 * pure sql migrations (themitchy)

 * usernames for password reset (themitchy)

 * fix for views on password reset (themitchy)

 * update password (themitchy)

 * move account routes to separate module (themitchy)

 * feedback for form submission (themitchy)

 * update account styles (themitchy)

 * fixed styles for modal body (themitchy)

 * old user_id key not used anymore (themitchy)

 * res not req (themitchy)

 * properly named file (themitchy)

 * remove incorrectly named image (themitchy)

 * super basic enterprise login (themitchy)

 * moved socket.io stuff into it's own module (themitchy)

 * handle alerts vs notifications (themitchy)

 * make alerts api available to routes (themitchy)

 * alerts REST moved into routes/alerts (themitchy)

 * Change Writeup in Heroku Console (Jacob Groundwater)

 * Point Heroku to Production (Jacob Groundwater)

 * Fix 404 to Use Absolute Paths (Jacob Groundwater)

 * Change Sales Email to Support (Jacob Groundwater)

 * Update Heroku User Email on SSO (Jacob Groundwater)

 * Bind to PORT from Environment (Jacob Groundwater)

 * Remove Link to Old Site (Jacob Groundwater)

 * Final Draft for Heroku Console Page (Jacob Groundwater)

 * Retain Heroku User Activity Data (Jacob Groundwater)

 * Change Heroku Dashboard Preview Image (Jacob Groundwater)

 * Add Heroku Premium Page (Jacob Groundwater)

 * Update Slogan (Jacob Groundwater)

 * Fix Heroku Header Styling (Jacob Groundwater)

 * Pass Heroku Cookie to Console (Jacob Groundwater)

 * Maintain Heroku Dashboard After Login (Jacob Groundwater)

 * Set Link on Heroku Dashboard Button (Jacob Groundwater)

 * Redirect Heroku Dashboard on Unsuccessful Authentication (Jacob Groundwater)

 * Set Better Default Name for Heroku (Jacob Groundwater)

 * Add Popups to Heroku Page (Jacob Groundwater)

 * Add Heroku Config Page (Jacob Groundwater)

 * moved app into it's own module (themitchy)

 * Update Add-on Manifest URLs for Production (Jacob Groundwater)

 * Add Heroku Integration (Jacob Groundwater)

 * Include els Template Module (Jacob Groundwater)

 * consistent semicolons and formatting (themitchy)

 * Fix db Module Name Error (Jacob Groundwater)

 * Set Views Directory to Non-Public Path (Jacob Groundwater)

 * better styles for drop downs (themitchy)

 * port fix (themitchy)

 * Add Alert-Trigger Get Example (Jacob Groundwater)

 * Refactor alerts to triggers in Main App (Jacob Groundwater)

 * Add Notification Documentation (Jacob Groundwater)

 * Simplify Notification Name Listing (Jacob Groundwater)

 * Simplify Alerts File Layout (Jacob Groundwater)

 * Update Live Alert Receiver (Jacob Groundwater)

 * Connect Alerts Service to Application via Axon (Jacob Groundwater)

 * Add Alert Notifications Service (Jacob Groundwater)

 * Update Notification Schema (Jacob Groundwater)

 * Bump Agent Version and Description (Jacob Groundwater)

 * a few more style tweaks for alerts (themitchy)

 * style tweaks on alert lists (themitchy)

 * display active alerts (themitchy)

 * send alerts to web client (themitchy)

 * Add Health Check Page for ELB that Queries MySQL and Redis (Jacob Groundwater)

 * Bump Version (Jacob Groundwater)

 * Remove Platform Check (Jacob Groundwater)

 * Fix Reference to Database (Jacob Groundwater)

 * Mac CPU Fix (Jacob Groundwater)

 * Accept Binding Port from Environment (Jacob Groundwater)

 * Remove undefined Error (Jacob Groundwater)

 * Add Referrer DB Migration (Jacob Groundwater)

 * Fix Log Table Migration (Jacob Groundwater)

 * Remove Console Comments from CPU Profiler (Jacob Groundwater)

 * Add AWS Specific Configuration (Jacob Groundwater)

 * Convert DB Connection to Proxy (Jacob Groundwater)

 * Do MySQL Reconnection Scheme (Jacob Groundwater)

 * Add 404 Page (Jacob Groundwater)

 * Add HTML Character Encoding Meta Tag (Jacob Groundwater)

 * Set NodeFly App Name to ENV Var or Default (Jacob Groundwater)

 * changed "procede" to "proceed" (supermonster)

 * fixed dumb version checking (themitchy)

 * made feedback form it's own page (themitchy)

 * smarter/dumber password reset (themitchy)

 * Update Heroku Message (Jacob Groundwater)

 * Fix Port Config (Jacob Groundwater)

 * updating reset password styles (themitchy)

 * Rename Complex Tab to Advanced (Jacob Groundwater)

 * Add Semicolons (Jacob Groundwater)

 * Fix Variables in HowTo for Clarity (Jacob Groundwater)

 * Use Provider User ID as Default Name (Jacob Groundwater)

 * added a forgot password link to landing page (themitchy)

 * update login page styles (themitchy)

 * add, list, and delete alerts (themitchy)

 * Update HowTo for New Agent Naming (Jacob Groundwater)

 * created rest call to get all alerts for logged in user (themitchy)

 * Add Keywords (Jacob Groundwater)

 * Fix Single-Item Array Issue in Profile Name (Jacob Groundwater)

 * Scope Fix (Jacob Groundwater)

 * Use Hostname in Data Upload (Jacob Groundwater)

 * Cleanup Agent File (Jacob Groundwater)

 * Cleanup Agent Imports (Jacob Groundwater)

 * Use DNS Name for Collector (Jacob Groundwater)

 * Add Vectorized Host Name (Jacob Groundwater)

 * Fix Redis Client from Crashing Application (Jacob Groundwater)

 * Remove nconf and Directly Require PORT ENV Variable or Ues Default (Jacob Groundwater)

 * Read ENV Port (Jacob Groundwater)

 * Fix Agent Versioning (Jacob Groundwater)

 * Provide Default C9 User Name (Jacob Groundwater)

 * Rename everyauth File for Github and C9 Authentication (Jacob Groundwater)

 * Unionize everyauth Code (Jacob Groundwater)

 * Set Default HMAC Keys (Jacob Groundwater)

 * Fix Bad Database Names (Jacob Groundwater)

 * Remove Extraneous Code Generated During Rebase (Jacob Groundwater)

 * Allow Empty Name and Email from Github Registration (Jacob Groundwater)

 * Cleanup and Fix Bad Scope (Jacob Groundwater)

 * Use ENV Variable for HMAC Keys (Jacob Groundwater)

 * Add c9 Login Support (Jacob Groundwater)

 * remove hard coded config env (themitchy)

 * Fix CPU Time for Solaris Platform (Jacob Groundwater)

 * clear session storage if there's no user (themitchy)

 * fixing setup for redistogo (themitchy)

 * Explicitly Require nodefly-gcinfo Stable Tag (Jacob Groundwater)

 * Add Solaris to Accepted Platforms (Jacob Groundwater)

 * setup redistogo (themitchy)

 * fixing port (themitchy)

 * upping npm version (themitchy)

 * adding Procfile for heroku (themitchy)

 * upping node version for heroku (themitchy)

 * doh! broke the package json (themitchy)

 * trying out heroku deployment (themitchy)

 * submit button styles (themitchy)

 * set referrer cookie expiration (themitchy)

 * store referer and ip on signup (themitchy)

 * adding alerts dialog (wii) (themitchy)

 * fixed middleware order (themitchy)

 * support ajax crawling of static resources (themitchy)

 * update red is socket directory (themitchy)

 * Warn user if account already exists (themitchy)

 * fix missing style on active nav button (themitchy)

 * better behaviour of drop down shelf (themitchy)

 * Change wording on link to old site (themitchy)

 * Bump Agent Version (Jacob Groundwater)

 * Omit Timekit from Windows (Jacob Groundwater)

 * added dima's headers to files that were missing it (supermonster)

 * Update Roadmap (Jacob Groundwater)

 * Add Examples with Images to HowTo (Jacob Groundwater)

 * set frame based on time range use new log_p table (themitchy)

 * put license in redis probe (themitchy)

 * send timeRange to api server instead of frame size (themitchy)

 * removed commented out code and debug commands (supermonster)

 * Add Minimum Password Requirements to Password Reset (Jacob Groundwater)

 * Add Minimum Password Requirements (Jacob Groundwater)

 * link to old service (themitchy)

 * landing page redirects to dashboard if already logged in (themitchy)

 * focus inputs (themitchy)

 * popover fixes (themitchy)

 * reset drill down when app selection changes (themitchy)

 * clean up unused code (themitchy)

 * maintain state on selected app and time range (themitchy)

 * hide alerts nab button (themitchy)

 * Update Github App Id and Secret (Jacob Groundwater)

 * Fix Migration (Jacob Groundwater)

 * Change Database Column Names to Underscores (Jacob Groundwater)

 * reverse colours for times graph (themitchy)

 * templates the tabs for top functions (themitchy)

 * Update Contacts Page (Jacob Groundwater)

 * temp fix on querySelector for IE (themitchy)

 * password reset fixes and styling (themitchy)

 * Update Pricing Info (Jacob Groundwater)

 * update error messages and styling for login page (themitchy)

 * Use Case Insensitive Match on Email During Login (Jacob Groundwater)

 * Remove Strict Regex for Email Validation (Jacob Groundwater)

 * Remove Bla Blas (Jacob Groundwater)

 * Add Version Warning (Jacob Groundwater)

 * fixed how-to page functionality (themitchy)

 * Fix Installation Instructions (Jacob Groundwater)

 * Change View Port for Mobile Device Compatibility (Jacob Groundwater)

 * Specify nodefly-gcinfo Version Explicitly (Jacob Groundwater)

 * Update Agent for Publishing (Jacob Groundwater)

 * shelf styling (themitchy)

 * Use DI for everyauth Github Module (Jacob Groundwater)

 * select connection function (themitchy)

 * restful interface to alerts (themitchy)

 * Add Github Login (Jacob Groundwater)

 * Rename Session Variables (Jacob Groundwater)

 * Update Database Compatability (Jacob Groundwater)

 * Add async Module to Web Server (Jacob Groundwater)

 * Remove Extraneous Logging from V8 GC Info (Jacob Groundwater)

 * Add Alert Generator to Collector (Jacob Groundwater)

 * landing, login, contact, privacy, tos pages (themitchy)

 * Fix Collector (Jacob Groundwater)

 * new ui for landing page/registration/login (themitchy)

 * Add Notifications Database Migration (Jacob Groundwater)

 * Add Alert Notification Storage (Jacob Groundwater)

 * Add Database Back End (Jacob Groundwater)

 * don't reduce series unless they need it (themitchy)

 * chart optimizations (themitchy)

 * Update Package Dependency (Jacob Groundwater)

 * Move Alerts Server to Own Package (Jacob Groundwater)

 * Organize Alerts Module (Jacob Groundwater)

 * Add Alerts Framework to Collector (Jacob Groundwater)

 * Add Alert Emitter (Jacob Groundwater)

 * set minimum size on data series (themitchy)

 * removed some empty lines. just for testing (supermonster)

 * remove echo (supermonster)

 * Add Alerts Module (Jacob Groundwater)

 * handle gzip (themitchy)

 * support gzip (themitchy)

 * configurable time ranges for graphs (themitchy)

 * refactoring user login (themitchy)

 * update tooltip for dbs (themitchy)

 * new chart drill downs (themitchy)

 * Use 'prod' Unless NODEFLY_ENV Set (Jacob Groundwater)

 * Add 'underscore' Dependency in 'apiserver' Package File (Jacob Groundwater)

 * Fix Configuration to Switch Between 'dev' and 'prod' (Jacob Groundwater)

 * Add 'nodefly-gcinfo' Package Dependency (Jacob Groundwater)

 * shelf styles, chart tweaks (themitchy)

 * new chart styles and tooltips (themitchy)

 * new top-nav and app-chooser (themitchy)

 * chosen library (themitchy)

 * new ui assets (themitchy)

 * update agent (themitchy)

 * fix tier reporting when there's no parent request (themitchy)

 * popovers (themitchy)

 * fixed version reporting (themitchy)

 * drop node_in from tiers (themitchy)

 * revert config to work with openshift (themitchy)

 * memcache probes report queries (themitchy)

 * adding memcache chart (themitchy)

 * refactor mongo api (themitchy)

 * update probes to track db query (themitchy)

 * router/dashboard refactoring added drop down to dbs list (themitchy)

 * Replace Memwatch with GCInfo (Jacob Groundwater)

 * show mysql calls in top functions (themitchy)

 * add mysql calls to slowest functions (themitchy)

 * clear model on update (themitchy)

 * set unique app hash (themitchy)

 * removed DEV text from title (themitchy)

 * fixed broken page reload on waiting for apps (themitchy)

 * put async module back in (themitchy)

 * path for config changed (themitchy)

 * fall back to row timestamp if real ts isn't there (themitchy)

 * updating package (themitchy)

 * update agent version set web server to be monitored (themitchy)

 * don't display default series (themitchy)

 * sample red is in/out (themitchy)

 * sample mongodb in/out (themitchy)

 * sample memcached in/out (themitchy)

 * sample http client in/out (themitchy)

 * new data format for times by tier (themitchy)

 * sample a 'node' time as total request - tiers (themitchy)

 * sample mysql times as in/out (themitchy)

 * send time with tiers (themitchy)

 * handle new data format and in/out tiers (themitchy)

 * redraw graphs for new socket session (themitchy)

 * moved times by tier chart to top (themitchy)

 * Add Hash to Account Info (Jacob Groundwater)

 * Highlight Menu Bar Tab for Account (Jacob Groundwater)

 * Allow Direct Linking to #accounts Page (Jacob Groundwater)

 * Add Fields to Account Page (Jacob Groundwater)

 * Make Model URL Relative (Jacob Groundwater)

 * Basic account model storage (themitchy)

 * initial AccountView and Model (themitchy)

 * Add Account Route (Jacob Groundwater)

 * keep requested page in routes (themitchy)

 * Refactor SHVA Route to Module (Jacob Groundwater)

 * Refactor everyauth and db Into Submodule (Jacob Groundwater)

 * Add Github Authentication Compatability with Existing AJAX Login Methods (Jacob Groundwater)

 * Remove Vows Testing from Agent Package (Jacob Groundwater)

 * Fix Query Database for User Hash (Jacob Groundwater)

 * Cleanup (Jacob Groundwater)

 * Return Error when everyauth User is Not Found (Jacob Groundwater)

 * Fix Github Registering New User (Jacob Groundwater)

 * Use All Caps for Github User Authentication Env Variables (Jacob Groundwater)

 * Cleanup Github User Authentication (Jacob Groundwater)

 * Fix User Selection Error (Jacob Groundwater)

 * Github Login to HowTo Page (Jacob Groundwater)

 * Revert to Express 2.0 (Jacob Groundwater)

 * Add Github User Migration (Jacob Groundwater)

 * hard code mongo collections (themitchy)

 * passing mandatory options to mongo (themitchy)

 * cpu info calculated consistently with other platforms (themitchy)

 * Fix Demo Server Bugs (Jacob Groundwater)

 * back to old agent module name (themitchy)

 * Change Fix (Jacob Groundwater)

 * Fix Collector After Merge (Jacob Groundwater)

 * show instructions for command line marker tool (themitchy)

 * timers by tier. first take on 'in/out' support. mysql only (supermonster)

 * show graph annotations (themitchy)

 * update backbone and high charts (themitchy)

 * cleanup (themitchy)

 * Use ENV for All Common Configurations (Jacob Groundwater)

 * Disable Quiet Option for Supervisor (Jacob Groundwater)

 * Fix Timekit for Windows Issue (Jacob Groundwater)

 * Make Timekit an Optional Dependency (Jacob Groundwater)

 * Use nconf for All Configurations (Jacob Groundwater)

 * Make Module memwatch an Optional Dependency (Jacob Groundwater)

 * Remove Legacy Debugger Triggers (Jacob Groundwater)

 * Fix Merge Problem (Jacob Groundwater)

 * Fix Latent Merge Conflict (Jacob Groundwater)

 * Undo Mongo Fix that Caused Errors (Jacob Groundwater)

 * check version for external calls (themitchy)

 * support external calls data (themitchy)

 * Add Support for Windows CPU (Jacob Groundwater)

 * Explicitly Set Safe Mode for MongoDB (Jacob Groundwater)

 * Convert nconf to Use Foreman .env File (Jacob Groundwater)

 * Surpress Debug Messages in Supervisor (Jacob Groundwater)

 * Use Supervise Instead of Forever (Jacob Groundwater)

 * Switch From Forever to Foreman Process Management (Jacob Groundwater)

 * Add Case for Mac CPU Time on Short Running Processes (Jacob Groundwater)

 * Use nconf to Configure Databases and Other Resources (Jacob Groundwater)

 * Use nconf to Handle Database and Other Resource Configurations (Jacob Groundwater)

 * Fix Required Packages & Foreverize Start Script (Jacob Groundwater)

 * Fix Web UI Chart Script (Jacob Groundwater)

 * Add Mac OSX CPU Data (Jacob Groundwater)

 * Watch for Changes with Forever (Jacob Groundwater)

 * Adjust Development Configurations for Local Use (Jacob Groundwater)

 * Fix Server.js File in Collector (Jacob Groundwater)

 * Forever-ized NPM Startup Scripts (Jacob Groundwater)

 * Fix Deprecated Express Usage (Jacob Groundwater)

 * Fix Exports Tests (Jacob Groundwater)

 * Use Database Migrations (Jacob Groundwater)

 * Throw Topical Error if MongoDB is Unavailable (Jacob Groundwater)

 * Add Test Support to All Packages (Jacob Groundwater)

 * Ignore NPM Debug Logs (Jacob Groundwater)

 * Reorganize into Modules (Jacob Groundwater)

 * doh (themitchy)

 * cleaning up (themitchy)

 * notify web client to log in when session invalid (themitchy)

 * updated defaults for demo:demo account (themitchy)

 * navbar ui bug (themitchy)

 * update agent version in package (themitchy)

 * updated packages (themitchy)

 * update install instructions show message for not avail charts (themitchy)

 * remove link to wip queue stack stuff (themitchy)

 * get and display event loop blocks (themitchy)

 * master password for webclient (themitchy)

 * updated package (themitchy)

 * remove submodule ref (themitchy)

 * add series for memcached (themitchy)

 * check agent version type (themitchy)

 * handle data from different versions of agent (themitchy)

 * only show drill down if data is available (themitchy)

 * udpating npm packages (themitchy)

 * support drill-down on top functions (themitchy)

 * style updates (themitchy)

 * display hostname in app chooser (themitchy)

 * updated nodefly package (themitchy)

 * new nodefly package (themitchy)

 * handle downed api server without crashing (themitchy)

 * move all ports & ips to a config module easier switching between prod/dev (themitchy)

 * bootstrap for modal lib (themitchy)

 * feedback form (themitchy)

 * check for apps when on howto page (themitchy)

 * updating agent (themitchy)

 * refactor and clean (themitchy)

 * updating npm package (themitchy)

 * instructions show npm tarball link (themitchy)

 * agent module tarball (themitchy)

 * add redis (themitchy)

 * fix title (themitchy)

 * add mongoDB (themitchy)

 * only load apps if we don't already have some (themitchy)

 * added title (themitchy)

 * set apphash on app load (themitchy)

 * update apps and app chooser when rendering the dashboard (themitchy)

 * update apps from db (themitchy)

 * use same db as prod for now (themitchy)

 * correcting table (themitchy)

 * fill bar chart categories (themitchy)

 * update instructions template (themitchy)

 * remove home tab (themitchy)

 * very thourough disconnect of socket simplo view manager for tracking views (themitchy)

 * set app data on login (themitchy)

 * send app data with login (themitchy)

 * pass in appHash from client (themitchy)

 * hardcoded defaults for demo user (themitchy)

 * use appHash as key for top functions (themitchy)

 * passing app hash (themitchy)

 * syncing agent (themitchy)

 * woops (themitchy)

 * better app switching (themitchy)

 * google analytics (themitchy)

 * reset time after app change (themitchy)

 * different key for agent (themitchy)

 * use local agent (themitchy)

 * multiple axes for connections chart (themitchy)

 * all small charts now same size (themitchy)

 * added crosshair and time to tooltip (themitchy)

 * multi-series tooltip & graph formatting (themitchy)

 * time range is 60minutes (themitchy)

 * more frequent metrics (themitchy)

 * hack for heap series not all in one object (themitchy)

 * back to millis (themitchy)

 * overwrite duplicate points if y is 0 (themitchy)

 * removing submodule hook from build script(didn't work) (themitchy)

 * adding agent back in (can't submodule update private repo on openshift) (themitchy)

 * submodule update in build hook (themitchy)

 * removing duplicate agent (themitchy)

 * added nodefly-apm as a submodule (themitchy)

 * use class to hide top form (themitchy)

 * top functions margin (themitchy)

 * roll back to ms for top functions (themitchy)

 * set range for top functions (themitchy)

 * overwrite 0 duplicates points (themitchy)

 * add stime, utimte, GC full (themitchy)

 * add stime, utime to cpu info (themitchy)

 * fix for data points out of order (themitchy)

 * same color for top func (themitchy)

 * initial package file for agent (themitchy)

 * complete password reset (themitchy)

 * show success message on password reset (themitchy)

 * escape password (themitchy)

 * user correct key for password reset debug cleanup (themitchy)

 * change color of active menu (themitchy)

 * change labels to micro (themitchy)

 * back to default chart colors (themitchy)

 * WIP: password reset (themitchy)

 * add series to heap chart (themitchy)

 * WIP password reset (themitchy)

 * remove debug msg (themitchy)

 * cleaning up tooltips for top functions (themitchy)

 * cleaning / formatting (themitchy)

 * Welcome message for login page (themitchy)

 * adding icons for welcome page (themitchy)

 * Turn off responsive css for now(not working so well with highcharts) (themitchy)

 * disable credits allow zooming (themitchy)

 * force xhr-polling because failover takes too long (themitchy)

 * loader for dashboard (themitchy)

 * styling for nav bar (themitchy)

 * set app for demo user (themitchy)

 * remove debug point to correct servers (themitchy)

 * app chooser changes parameters to api server (themitchy)

 * don't show app chooser if there are no apps (themitchy)

 * added app chooser (themitchy)

 * send apps with login handle socket reconnect (themitchy)

 * refactoring timeseries graphs (themitchy)

 * show name and api key (themitchy)

 * debug timeseries (themitchy)

 * cutoff wait time for updates (themitchy)

 * debugging chart stuff (themitchy)

 * chain updates (themitchy)

 * set proper demo user key (themitchy)

 * send user key to api (themitchy)

 * pass key to nodefly profile (themitchy)

 * aggregate urls for top functions (themitchy)

 * integrate UrlAggregator in agent (themitchy)

 * initial howto page (themitchy)

 * force axis range style tweaks for logins (themitchy)

 * style tweaks for login page (themitchy)

 * merge register and login views no top bar on login view (themitchy)

 * hardcoded demo user (themitchy)

 * fix registration bug (themitchy)

 * truncate label names added some debug logs (themitchy)

 * add testing functions to server (themitchy)

 * fix overlapping first call bug point openshift at dev server (themitchy)

 * sort timeseries data if out of order don't clober timeseries data (themitchy)

 * cleanup config (themitchy)

 * fake old data to recreate bug (themitchy)

 * enforce order properly (themitchy)

 * agent.io dep (themitchy)

 * enforce order of timeseries data (themitchy)

 * adding node-gyp dep (themitchy)

 * added deps for mongo and timekit (themitchy)

 * added nodefly profiler (themitchy)

 * fixed bug with reusing dashboard view cleaning up navbar (themitchy)

 * added top nav & login/logout functions started using less (themitchy)

 * put user key/hash in session (themitchy)

 * config requires net module (themitchy)

 * backwards compatability with old auth (themitchy)

 * some refactoring and code cleanup (themitchy)

 * express 2.5.x compatible configuration tweaks (themitchy)

 * downgrade express (themitchy)

 * update node version (themitchy)

 * update express (themitchy)

 * send redis client with socket and path (themitchy)

 * attempt unix socket connection for redis (themitchy)

 * move redis configs to config (themitchy)

 * registration UI fix sessionID tracking (themitchy)

 * registration, authentication and redis session store (themitchy)

 * default api to / (themitchy)

 * added socket.io dep (themitchy)

 * remove redis store (themitchy)

 * specify deps for web server (themitchy)

 * wrong name format (themitchy)

 * use openshift port & ip (themitchy)

 * bringing in webclient to openshift repo (themitchy)

 * initial checkin (webclient) (themitchy)

 * cpuinfo (root)

 * hello glen (root)

 * Creating template (Template builder)

 * Update README.md (Francesco Vollero)

 * Bumped Redis version to 2.4.12 (Francesco Vollero)

 * removed the second and unuseful #!/bin/bash (Francesco Vollero)

 * docs: Added some info on Redis configuration and a quick example (Francesco Vollero)

 * docs: Substituted the word polyglot with redis (Francesco Vollero)

 * docs: Fixing README.md (Francesco Vollero)

 * Added .openshift folder with build script (Francesco Vollero)

 * initial commit (Francesco Vollero)


2013-10-07, Version alerts/production
=====================================

 * Forgot to remove some logging stuff... (Stephen Belanger)

 * Fix bug where alerts would try to update a non-existent record if nothing existed in the db yet. (Stephen Belanger)

 * Save active_start and active_end to database (Stephen Belanger)

 * Fix to prevent multiple inactive records created due to weird state changes (Stephen Belanger)

 * remove debugger line (themitchy)

 * Fix conflicts (Stephen Belanger)

 * use configLoader (themitchy)

 * Make alerts work again (Stephen Belanger)

 * Update to work with use app-wide configs for per-process alerts (Stephen Belanger)

 * Add tests to alerts service (Stephen Belanger)

 * Duration record not needed in seed (Stephen Belanger)

 * Alerts rewrite (Stephen Belanger)


2013-02-12, Version alerts/0.1.7
================================



2013-02-12, Version alerts/0.1.6
================================



2013-02-12, Version alerts/0.1.5
================================



2013-02-12, Version alerts/0.1.0
================================



2013-02-12, Version alerts/0.1.4
================================



2013-02-12, Version alerts/0.2.0
================================



2013-02-12, Version alerts/0.1.2
================================



2013-02-12, Version alerts/0.1.1
================================



2013-02-12, Version alerts/0.1.3
================================

 * Add NodeFly Dependencies (Jacob Groundwater)

 * Add NodeFly Analytics to Packages (Jacob Groundwater)

 * Remove Website Alert Events (Jacob Groundwater)

 * Change Axon Socket Type to Publish Over Push (Jacob Groundwater)

 * Record Notifications Collector-Side (Jacob Groundwater)

 * Add Empty Check for State (Jacob Groundwater)

 * Update Alert Send Times (Jacob Groundwater)

 * Remove Debugging Statements (Jacob Groundwater)

 * Adjust Reported Times of Alerts (Jacob Groundwater)

 * Support Special Case for Alert Duration Equal to Zero (Jacob Groundwater)

 * Remote Noisy Console Logging (Jacob Groundwater)

 * Add Trigger for Time = 0 (Jacob Groundwater)

 * Support Special Case of Duration = 0 (Jacob Groundwater)

 * Require parseInt for Environmentally Determined Ports (Jacob Groundwater)

 * Make Times by Tier Demo Oscillate (Jacob Groundwater)

 * Add Times by Tier Demo (Jacob Groundwater)

 * Fix Alert Format Error (Jacob Groundwater)

 * Add Alert Processor for "Times By Tier" (Jacob Groundwater)

 * Add Axon Connection Notifications (Jacob Groundwater)

 * Add Password for Alerts Server MySQL Connection (Jacob Groundwater)

 * Add Get-Alert to Alert REQ/REP Service (Jacob Groundwater)

 * Remove Storage System (Jacob Groundwater)

 * Add Tests for Comparator Change (Jacob Groundwater)

 * Alerts Comparitor Fix (Jacob Groundwater)

 * fix for null value showing as object (themitchy)

 * Support Vectorized Metrics (Jacob Groundwater)

 * Add Push Stream for Storage Server (Jacob Groundwater)

 * Move Demo to Sub Directory (Jacob Groundwater)

 * Update Package File for Alerts (Jacob Groundwater)

 * Add Tests (Jacob Groundwater)

 * Remove Unused Module (Jacob Groundwater)

 * Handle Edge Cases Gracefully (Jacob Groundwater)

 * Add Comments (Jacob Groundwater)

 * Housekeeping (Jacob Groundwater)

 * Fix for MySQL (Jacob Groundwater)

 * Add Database Back End (Jacob Groundwater)

 * Make Alerts Data Store Asynchronous (Jacob Groundwater)

 * Add CRUD for Alerts (Jacob Groundwater)

 * Add Email to Events Emitted (Jacob Groundwater)

 * Update Demo (Jacob Groundwater)

 * Fix Multiplexer (Jacob Groundwater)

 * Fix Stupid Status Messages (Jacob Groundwater)

 * Report Only Up/Down Notices (Jacob Groundwater)

 * Snapshot (Jacob Groundwater)

 * Working Demo (Jacob Groundwater)

 * Add Comparator Verbs (Jacob Groundwater)

 * Full Demo (Jacob Groundwater)

 * Move Demo Code to Demo Module (Jacob Groundwater)

 * Use Axon for Alerts (Jacob Groundwater)

 * Add Alerts Package (Jacob Groundwater)

 * Move Alerts Server to Own Package (Jacob Groundwater)


2013-11-15, Version register/production
=======================================

 * Mention StrongOps in README (Ryan Graham)

 * add blanket for ci coverage analysis (Linqing)

 * Update README.md (Mitch Granger)

 * mocha args in correct position (themitchy)

 * take MOCHA_ARGS from jenkins (themitchy)

 * generously look to res.body or res.body.message for the error string, also pass http response with error (themitchy)

 * added tests for errors on existing user and bad passwords (themitchy)

 * Add repository to package.json (Stephen Belanger)

 * Need to use https now, as http redirects and changes POST to GET (Stephen Belanger)

 * Update to support /ops and add tests (Stephen Belanger)

 * DOn't use /ops yet (Stephen Belanger)

 * Update to support cancellation (Tests only) (Stephen Belanger)

 * Add login API (Stephen Belanger)

 * Tested and working (Stephen Belanger)

 * Respond with complete user record (Stephen Belanger)

 * Added readme (Stephen Belanger)

 * first commit (Stephen Belanger)


2014-02-08, Version uhura/0.1.1
===============================

 * package.json: bump version, 0.1.0 => 0.1.1 (Ben Noordhuis)

 * lib/client: conditionally unref reconnect timer (Ben Noordhuis)

 * lib/client: add ref() and unref() methods (Ben Noordhuis)

 * test: add createConnection regression test (Ben Noordhuis)

 * test: don't use hard-coded tcp port numbers (Ben Noordhuis)

 * lib/client: make createConnection callback-driven (Ben Noordhuis)

 * lib/client: unref reconnect timer (Ben Noordhuis)

 * lib: make connection type configurable (Ben Noordhuis)

 * lib/client: fix stalls with large payloads (Ben Noordhuis)

 * lib: handle JSON parse errors (Ben Noordhuis)


2013-11-18, Version uhura/production
====================================

 * Replace blanket with istanbul (Ryan Graham)

 * Add istanbul (Ryan Graham)

 * Move ACK callback locater to ensure it gets ignored by non-ack-supporting servers (Stephen Belanger)

 * Restructure of acknowledgements feature to be backwards compatible (Stephen Belanger)

 * Ignore socket errors server-side. Just means a client lost connection somehow. (Stephen Belanger)

 * Should probably actually ADD the ACK module... (Stephen Belanger)

 * add blanket to package.json for test coverage analysis (emma wu)


2013-10-03, Version uhura/0.1.0
===============================

 * Added ACK support and maxQueueLength setting (Stephen Belanger)

 * Update tests (Stephen Belanger)


2013-10-01, Version uhura/0.0.10
================================

 * Add logErrors toggle (Stephen Belanger)

 * Add repo to package.json (Stephen Belanger)

 * Add MIT License (Stephen Belanger)

 * Remove broken test (Stephen Belanger)

 * Missed something (Stephen Belanger)


2013-07-19, Version uhura/0.0.9
===============================

 * Switch to connect 2.8.x (Stephen Belanger)


2013-07-04, Version uhura/0.0.8
===============================

 * Bump version (Stephen Belanger)

 * Bind disconnect handler to connection, not socket (Stephen Belanger)


2013-06-27, Version uhura/0.0.7
===============================

 * bump version (themitchy)

 * lock to minor version of connect (themitchy)


2013-06-18, Version uhura/0.0.6
===============================

 * Fix session data mismatch (Stephen Belanger)

 * Session invalidation (Stephen Belanger)

 * More test coverage (Stephen Belanger)


2013-06-13, Version uhura/0.0.5
===============================

 * Bump version (Stephen Belanger)

 * Forgot the reconnect thing... (Stephen Belanger)


2013-06-13, Version uhura/0.0.4
===============================

 * Bump version (Stephen Belanger)

 * Reduced max timout for exponential backoff to be more sane, fixed session store changes not saving when changed server-side, fixed double reconnect bug, and added error logging (Stephen Belanger)


2013-06-11, Version uhura/0.0.3
===============================

 * Version bump (Stephen Belanger)

 * Rewrite tests to use unix sockets (Stephen Belanger)

 * Fix tests to destroy socket rather than safe disconnect. (Stephen Belanger)

 * Fix start/resume loop when session data unavailable on attempted resume. Save session data on change rather than disconnect...that was stupid. (Stephen Belanger)

 * Add code coverage testing (Stephen Belanger)


2013-06-03, Version uhura/0.0.2
===============================

 * Backoff maximum and listener warning fix (Stephen Belanger)

 * Fix error reconnection, change sid to sessionID, emit disconnect events on server, and do some more cleanup (Stephen Belanger)

 * More documentation (Stephen Belanger)

 * Pass options through to server (Stephen Belanger)

 * Small hack to support connect-redis session middleware (Stephen Belanger)

 * Indentation cleanup (Stephen Belanger)

 * Forgot to add semicolons to index.js (Stephen Belanger)

 * Add session store test and lots of semicolons (Stephen Belanger)


2013-05-15, Version uhura/0.0.1
===============================

 * first commit (Stephen Belanger)


2014-03-07, Version web/production
==================================



2014-03-07, Version web/1.0.1
=============================

 * Restore post to ActOn (themitchy)

 * make google api call for font script file in doc head protocol agnostic to avoid security errors (seanbrookes)

 * fix: Accept CF-Visitor header for https check (Ryan Graham)

 * fix: handle complex x-forwarded-proto headers (Ryan Graham)

 * Include demo app for all users (themitchy)

 * Hide the user key for demo user (themitchy)

 * Simplify account page. (themitchy)

 * Log in demo user (themitchy)

 * update .gitignore to filter WebStorm .idea content (seanbrookes)

 * Change name link. (themitchy)

 * Logout of wordpress. (themitchy)

 * Redirect to WP login if not authed. (themitchy)

 * Moved adhoc middleware into getBoot (themitchy)

 * Use the provided email as a username. (themitchy)

 * Disable loopback chart that isn't working yet. (themitchy)

 * Copy google analytics verbatim from main site. (themitchy)

 * UI fixes for heap profiler. (themitchy)

 * fix password formatting (qz)

 * whitespace and indentation fixes (themitchy)

 * remove broken subusers routes (themitchy)

 * Consistent error messages and username support (themitchy)

 * Restore intercom scripts. (themitchy)

 * Send error message with registration error (themitchy)

 * User api for StrongOps (themitchy)

 * Removed subuser routes (themitchy)

 * Added a WordPress api module (themitchy)

 * Removed old user API. (themitchy)

 * added jshint configs (themitchy)

 * Style up some login buttons for Github and StrongLoop (themitchy)

 * removed a bunch of unused login and registration links/pages/templates (themitchy)

 * Add create time for github users. (themitchy)

 * Auth against strongloop.com (themitchy)

 * Simplify user registration and remove unused code. (themitchy)

 * Strip shared session middleware. (themitchy)

 * lib: remove mongodb dependency (Ben Noordhuis)

 * lib: fix global variable leak (Ben Noordhuis)

 * “limited” was spelled incorrectly. (themitchy)

 * LoopBack data is now displayed on the dashboard (Salehen Shovon Rahman)

 * lib: remove unused function emailer.sendFeedback() (Ben Noordhuis)

 * lib: remove unused imports from server.js (Ben Noordhuis)

 * lib: remove crawlable pages (Ben Noordhuis)

 * views: remove unused files (Ben Noordhuis)

 * all: remove stale openshift files (Ben Noordhuis)

 * lib: remove unused sl-heroku routes (Ben Noordhuis)

 * lib, routes: fix up whitespace errors (Ben Noordhuis)

 * lib: don't use express.bodyParser() (Ben Noordhuis)

 * The dashboard makes separate calls for top functions (Salehen Shovon Rahman)

 * Update broken links (themitchy)

 * Print server address using server.address(). (Ben Noordhuis)

 * Fix up register link on /ops page. (Ben Noordhuis)

 * use current time (themitchy)

 * Soft coded the text elements (Salehen Shovon Rahman)

 * The alert dialogue now fully functional (Salehen Shovon Rahman)

 * Removed the hard dependency to e.target (Salehen Shovon Rahman)

 * Fixed bug that prevented config from being POSTed (Salehen Shovon Rahman)

 * Added labels to the dialogue (Salehen Shovon Rahman)

 * Forced delete of all globally inserted dialogues (Salehen Shovon Rahman)

 * Moved the alert creation code to the caller (Salehen Shovon Rahman)

 * dialog bug fix: the select boxes now repopulates (Salehen Shovon Rahman)

 * The dialogue box is entirely self-contained. (Salehen Shovon Rahman)

 * Refactored the dialogue views name. (Salehen Shovon Rahman)

 * Moved the alert dialogue html to its own file (Salehen Shovon Rahman)

 * Deleted more code. (Salehen Shovon Rahman)

 * Deleted code. (Salehen Shovon Rahman)

 * Moved the submit code to the dialogue class (Salehen Shovon Rahman)

 * Moved the dialogue logic to its own class (Salehen Shovon Rahman)

 * Renaming of attributes and addition of a new property (Salehen Shovon Rahman)

 * Refactored the name of selectors (Salehen Shovon Rahman)

 * Fixed a bug for connections selectors (Salehen Shovon Rahman)

 * Refactored the connections selector (Salehen Shovon Rahman)

 * Refactored the Heap Selectors (Salehen Shovon Rahman)

 * Refactored the CPU selectors (Salehen Shovon Rahman)

 * Refactored the tiers selectors (Salehen Shovon Rahman)

 * Added an indentation. (Salehen Shovon Rahman)

 * send sessionId instead of pid (themitchy)

 * lookup app_id correctly (themitchy)

 * config change (themitchy)

 * revert change to show gaps in data (themitchy)

 * style tweaks for headers and messages (themitchy)

 * add popover to beta tags (themitchy)

 * add message for no alerts (themitchy)

 * add beta tag to alerts and errors pages (themitchy)

 * add beta tag to headers (themitchy)

 * un-grey the alert configure dialog boxes (themitchy)

 * implement restart-all (themitchy)

 * overhauled the way scale size data was tracked (themitchy)

 * new styles for cpus count and current cluster size (themitchy)

 * user model provides a way to look up a session by id (themitchy)

 * pushbutton resize (themitchy)

 * chart box styling (themitchy)

 * more general style fixes (themitchy)

 * options fix for backbone 1.1 (themitchy)

 * use strong loop colours globally (themitchy)

 * more strongloop-ish styling (themitchy)

 * general styling fixes (themitchy)

 * fix classname, disable on click (themitchy)

 * styling on workers list (themitchy)

 * decoupling worker list from main cluster view (themitchy)

 * added id (themitchy)

 * add function to lookup cluster meta data on user model (themitchy)

 * quick poll for dev (themitchy)

 * upgrade backbone (themitchy)

 * fix tabs (themitchy)

 * add comparator (themitchy)

 * Got the UI to auto update whenever the clusters updates itself. (Salehen Shovon Rahman)

 * Got the filters to work. (Salehen Shovon Rahman)

 * Got a text box showing. (Salehen Shovon Rahman)

 * Manage to send a shutdown signal to the api server. (Salehen Shovon Rahman)

 * Fixed a bug where a non-cluster app will cause the controls to crash (Salehen Shovon Rahman)

 * Welp pushing out what I have so far. (Salehen Shovon Rahman)

 * More styling. (Salehen Shovon Rahman)

 * Restyled the processes list. (Salehen Shovon Rahman)

 * Delegated the evet calls to the model. (Salehen Shovon Rahman)

 * Got workers list showing on the screen. (Salehen Shovon Rahman)

 * make sure bootUser has cluster session metadata (themitchy)

 * Made the error logs look much nicer. Hope people are fond of this. (Salehen Shovon Rahman)

 * Changed the color on the select box. (Salehen Shovon Rahman)

 * update contact link (themitchy)

 * Added the new GA. (Salehen Shovon Rahman)

 * Made the labels look less disabled. (Salehen Shovon Rahman)

 * Added spinners to dashboard charts. (Salehen Shovon Rahman)

 * Managed to show a message whenever there aren't any profiler data (Salehen Shovon Rahman)

 * Switched to using font-awesome. (Salehen Shovon Rahman)

 * Got the spinners to show on the heap profiler (Salehen Shovon Rahman)

 * Added a hash to the dashboard link. (Salehen Shovon Rahman)

 * Fixed the memory leak (Salehen Shovon Rahman)

 * cluster UI now works with apps that aren't clusters (themitchy)

 * Heap chart repopulates upon revisit of heap page (Salehen Shovon Rahman)

 * keys were backwards (themitchy)

 * A boat load of bug fixes. (Salehen Shovon Rahman)

 * redesigned the errors objects. (Salehen Shovon Rahman)

 * removing debug logs (themitchy)

 * put alert dialogs back in with correct keys (themitchy)

 * Navigation elements are right aligned, now. (Salehen Shovon Rahman)

 * Now able to change the sessions. (Salehen Shovon Rahman)

 * Fixed the session picker. (Salehen Shovon Rahman)

 * Added an empty message. (Salehen Shovon Rahman)

 * Fixed a boat laod of bugs. (Salehen Shovon Rahman)

 * Changed width, and infiniscroll now works (Salehen Shovon Rahman)

 * Shrunk the left column. (Salehen Shovon Rahman)

 * Styled the logs. (Salehen Shovon Rahman)

 * Cleaned up the design. (Salehen Shovon Rahman)

 * Cleaned up the load logic. (Salehen Shovon Rahman)

 * Finally. Got data to flow in. (Salehen Shovon Rahman)

 * Done a bunch of refactoring. (Salehen Shovon Rahman)

 * Default for all processes has been set to true. (Salehen Shovon Rahman)

 * Moved the picker to the left side. (Salehen Shovon Rahman)

 * The picker looks nicer, now. (Salehen Shovon Rahman)

 * Got everything connected (Salehen Shovon Rahman)

 * Got a lot of the functionalities working. (Salehen Shovon Rahman)

 * Refactored the code. (Salehen Shovon Rahman)

 * Added UI elements for the filters. (Salehen Shovon Rahman)

 * Removed a console.log call. (Salehen Shovon Rahman)

 * Starting to get more of the UI stuff working. (Salehen Shovon Rahman)

 * Started to add routing stuff. (Salehen Shovon Rahman)

 * Added a page for the error logs. (Salehen Shovon Rahman)

 * changes to password change (Andrew Martens)

 * Fix alert timestamps on web side (Stephen Belanger)

 * Filter out inactive alerts (Stephen Belanger)

 * Colors now change according to process state (Salehen Shovon Rahman)

 * Added the two extra columns (Salehen Shovon Rahman)

 * Add pid and sessionActive to alerts responses (Stephen Belanger)

 * Name now updates. (Salehen Shovon Rahman)

 * Edit dialogue box looks much nicer (Salehen Shovon Rahman)

 * show config string, update styles (themitchy)

 * push parsed config string into template (themitchy)

 * show app name on alerts details (themitchy)

 * populate configs with app details (themitchy)

 * provide util method to lookup app by key (themitchy)

 * Changed the font to Ubuntu. (Salehen Shovon Rahman)

 * Added labels to the edit alert dialog (Salehen Shovon Rahman)

 * Added alerts to main nav (themitchy)

 * Had the update function return the original data (Salehen Shovon Rahman)

 * merge conflicts (themitchy)

 * Front-end gets updated, upon save (Salehen Shovon Rahman)

 * The data updates on the server. (Salehen Shovon Rahman)

 * Got the edit alert config dialog to work (Salehen Shovon Rahman)

 * Delete alert config now working (Stephen Belanger)

 * Update alerts route to display data from new alerts system, grouped by alert config. (Stephen Belanger)

 * Change comparator to correct spelling, fix double json stringify bug, fix bug with using clusterKey as rowid rather than hash. (Stephen Belanger)

 * Added alert tests and squashed lots of alert-related bugs (Stephen Belanger)

 * correct metric name (themitchy)

 * enable alert dialog (themitchy)

 * The charts now zoom in. (Salehen Shovon Rahman)

 * SLP-80 Removed console.log calls. (Salehen Shovon Rahman)

 * Got empty spaces to show for gaps in graph data (Salehen Shovon Rahman)

 * Added UX sugars to indicate that there aren't any data. (Salehen Shovon Rahman)

 * Changed the wording form "heap count" to "heap usage count" (Salehen Shovon Rahman)

 * Separated the charts between usage and count. (Salehen Shovon Rahman)

 * Filters no longer cause dashboard to crash (Salehen Shovon Rahman)

 * Update Cluster Control UI and integrate new data. (Michael Schoonmaker)

 * Add a UI for the new cluster control channel. (Michael Schoonmaker)

 * The playbutton now re-enables. (Salehen Shovon Rahman)

 * We now also have count chart. (Salehen Shovon Rahman)

 * only force strongloop cookie on staging and production (themitchy)

 * Use userKey instead of hash; fixed missing API Key on account dashboard (Andrew Martens)

 * use credentials for CORS (Andrew Martens)

 * removed devhack references to localhost (Andrew Martens)

 * use .strongloop.com for cookies (Andrew Martens)

 * user API no longer points to localhost (Andrew Martens)

 * Dogfood V2 API changes (Andrew Martens)

 * correct link for blog (themitchy)

 * clear session storage on logout (themitchy)

 * return empty array if app can't be found (themitchy)

 * The y-axis moves/scales (Salehen Shovon Rahman)

 * clean up memory profiler (themitchy)

 * Delay instances chart setup until we definitely have data (Stephen Belanger)


2013-10-03, Version web/0.3.0-3
===============================

 * leave out multipart because it uploads temp files (themitchy)


2013-09-27, Version web/0.3.0-2
===============================

 * logout clears session (themitchy)

 * blog link (themitchy)


2013-09-26, Version web/0.3.0-1
===============================

 * s/\t/  /g (themitchy)

 * ignore all strongloop emails for act-on (themitchy)


2013-09-19, Version web/0.3.0
=============================

 * absolute links for register and login (themitchy)

 * intermediate landing page for heroku sso (themitchy)

 * balance landing buttons (themitchy)

 * more sensible landing page for users with no apps (themitchy)

 * how-to should link straight to docs.strongloop (themitchy)

 * update feedback link (themitchy)

 * favicon, page title (themitchy)

 * don't strip www (themitchy)

 * account page for password change & api key (themitchy)

 * middleware module (themitchy)

 * after heroku sso go to ops (themitchy)

 * send / and /ops/dashboard to strongloop if using nodefly hostname (themitchy)

 * redirect to ops (themitchy)

 * ask for password when creating new strongops user (themitchy)

 * remove unused bits (themitchy)

 * Added the StrongOps feedback link (Salehen Shovon Rahman)

 * include display name with spoofed session (themitchy)

 * only work with strongloop session (themitchy)

 * display full name (themitchy)

 * enable profile link in top bar (themitchy)

 * need to callback even if there are no extra users (themitchy)

 * client apiserver config'd from env (themitchy)

 * remove unused crap (themitchy)

 * how to version updates (themitchy)

 * load up apps and api keys for duplicate email accounts (themitchy)

 * landing stuff is done in the header (for now) (themitchy)

 * removed pricing email link (themitchy)

 * Cleaned up the green bar a little bit more. (Salehen Shovon Rahman)

 * Added a green bar, removed dead code, p tags use Ubuntu (Salehen Shovon Rahman)

 * chained logout (themitchy)

 * Updated the copyright message (Salehen Shovon Rahman)

 * Got the z-index issue fixed. (Salehen Shovon Rahman)

 * Realined the dashboard filter (Salehen Shovon Rahman)

 * The active nav elements now get a green bar. (Salehen Shovon Rahman)

 * missed the notAuth export (themitchy)

 * let me turn off forceHttps middleware (themitchy)

 * clean up mustAuth notAuth (themitchy)

 * fall back to ops session email (themitchy)

 * get ops logo in menu (themitchy)

 * update active menus (themitchy)

 * s/\t/  /g (themitchy)

 * update staging server name (themitchy)

 * The dashboard-filters top position is now aligned (Salehen Shovon Rahman)

 * Moved the navigation menu (Salehen Shovon Rahman)

 * Deleted the top navbar. (Salehen Shovon Rahman)

 * Updated the footer (Salehen Shovon Rahman)

 * Changed the hover colour of navbar elements (Salehen Shovon Rahman)

 * Removed some comments. (Salehen Shovon Rahman)

 * Pushed the changes from rebranding into develop (Salehen Shovon Rahman)

 * Added more list elements to the navbar. (Salehen Shovon Rahman)

 * s/\n/  /g (themitchy)

 * Basic heap profiler chart re-implementation (Stephen Belanger)

 * Added the StrongLoop logo to the hompage. (Salehen Shovon Rahman)

 * Styled the navigation bar (Salehen Shovon Rahman)

 * Added the social icons to the header (Salehen Shovon Rahman)

 * Added the StrongLoop logo to the footer. (Salehen Shovon Rahman)

 * Changed the logo on the dashboard to StrongLoop (Salehen Shovon Rahman)

 * allow session spoofing for dev (themitchy)

 * find or create user based on SL session data (themitchy)

 * stub out getting multiple emails (themitchy)

 * disable socket.io (not working under /ops right now) (themitchy)

 * no more registration (themitchy)

 * Clean-up of the code. (Salehen Shovon Rahman)

 * How-to section has Ubuntu font. (Salehen Shovon Rahman)

 * Moved a lot of the fonts from proxima to Ubuntu (Salehen Shovon Rahman)

 * Fixed the background color (Salehen Shovon Rahman)

 * Lower case HTML. Uppercase CSS (Part 2) (Salehen Shovon Rahman)

 * Lower case HTML. Uppercase CSS (Salehen Shovon Rahman)

 * authenticate to redis (themitchy)


2013-09-16, Version web/0.2.3-5
===============================

 * redirect to correct page (themitchy)

 * update to use strongloop heroku add-on (themitchy)


2013-09-11, Version web/0.2.3-4
===============================

 * grab oracle top calls (themitchy)


2013-08-30, Version web/0.2.3-3
===============================

 * password error broken (themitchy)


2013-08-30, Version web/0.2.3-2
===============================

 * relative path for shva (themitchy)

 * updating heroku add-on to work with /ops prefix (themitchy)


2013-08-25, Version web/0.2.3-1
===============================

 * force https based on 'x-forwarded-proto' (themitchy)

 * non https health check because… aws (themitchy)

 * ops prefix (themitchy)

 * only force https on live servers (themitchy)

 * force https (themitchy)

 * s/\t/  /g (themitchy)

 * fix intercom js (themitchy)


2013-08-21, Version web/0.2.3
=============================

 * stop old nodefly service from writing to disk (themitchy)

 * everyauth only seems to work at / (themitchy)

 * hacks to get everyauth working under /ops (themitchy)

 * relative paths (themitchy)

 * relative paths for /ops prefix (themitchy)


2013-08-19, Version web/0.2.2
=============================

 * intercom.io protocol matching (themitchy)

 * https when https (themitchy)

 * ignore compiled stylesheet (themitchy)

 * fixing password reset (themitchy)

 * no funny port for api server (themitchy)

 * name (themitchy)

 * refresh boot user from database (themitchy)

 * https if https (themitchy)

 * there is no more dashboard shelf (themitchy)

 * disable alerts setup (wip) (themitchy)

 * alerts store config (themitchy)

 * Fix the incorrect use of hash in cancellation code (Stephen Belanger)

 * Add rest routes for account manipulation, with new cancellation support. These are required by the nodefly-register module (Stephen Belanger)

 * Put less in its proper place (Ryan Graham)

 * Prefix is relative to mount point, not root (Ryan Graham)

 * Resolve paths instead of just concatenating (Ryan Graham)

 * fix less middleware (themitchy)

 * restore alert boxes (themitchy)

 * appId != app_id (themitchy)

 * fix index (themitchy)

 * include email (themitchy)

 * unused js (themitchy)

 * more relative paths (themitchy)

 * relative paths (themitchy)

 * prepping for /ops mount point (themitchy)

 * wip: prepping for mount point to be /ops (themitchy)

 * Wired up alerts interfaces (Stephen Belanger)

 * spelling (themitchy)

 * more changes to support working under /ops with proxy (themitchy)

 * Alerts REST API (Stephen Belanger)

 * update password reset (themitchy)

 * tossing unused stuffs (themitchy)

 * move login/register stuff to separate module (themitchy)

 * major refactoring of login & registration (themitchy)

 * Changed field names for ActOn integration (Andrew Martens)

 * enable intercom secure mode (themitchy)

 * default to one week (themitchy)

 * fix remember me to just use cookie age (themitchy)

 * use index.ejs to bootstrap user data (themitchy)

 * more informative error (themitchy)

 * remove old alert stuff (themitchy)

 * remove testing routes (themitchy)

 * remove fake data generator (themitchy)


2013-07-25, Version web/0.2.1
=============================

 * extra reminder on profiler (themitchy)

 * actual blog link (themitchy)

 * update privacy link (themitchy)

 * update tos link (themitchy)

 * update to links, announcement image on landing page (themitchy)

 * labels backwards (themitchy)

 * how to update (themitchy)

 * Submit registrations to Act On as well (Andrew Martens)

 * valid package name (themitchy)

 * use strong-agent (themitchy)

 * set precision (themitchy)

 * strong-mq chart (themitchy)

 * add message about preview mode (themitchy)

 * add profiler to top nab (themitchy)

 * updating various links to point to sl website (themitchy)

 * clean up control channel styling (themitchy)

 * fix npm start (themitchy)

 * alert for limit exceeded (themitchy)

 * render 'no profile found' properly (themitchy)

 * remove unused button (themitchy)

 * disable alerts poling (themitchy)

 * update footer (themitchy)

 * update sl heroku routes (themitchy)

 * Added period to end of sentence in the "Fast Set Up" section (davenodefly)

 * Update features.html (davenodefly)

 * add session filter to dashboard (themitchy)

 * generic style for pretty checkboxes (themitchy)

 * have graph data model support sessionId (themitchy)

 * fix bug in session picker (themitchy)

 * magma chart (themitchy)

 * profiler styling (themitchy)

 * add session picker and control channel to profiler dashboard (themitchy)

 * control channel controls (themitchy)

 * create session picker (themitchy)

 * send sessionId and pid to profiler view (themitchy)

 * get sessions for each app when loading user data (themitchy)

 * initial profiler dashboard with cluster chooser (themitchy)


2013-07-03, Version web/0.2.0
=============================

 * rename "Top Functions" to "Slow Endpoints" (themitchy)

 * pass in unit for tooltip (themitchy)

 * fix config selection (themitchy)

 * remove _in and _out prefixes.  Don't graph _out. (themitchy)

 * connect to production if we can't get hostname from browser (themitchy)

 * strict hostname match for configs (themitchy)

 * image checkbox for safari compatibility (themitchy)

 * min height of main content pane (themitchy)

 * routes for sl heroku auth (themitchy)

 * ignore env files (themitchy)

 * Corrected spelling of "Utililization" to "Utilization" (davenodefly)

 * Capitalized "apple" (davenodefly)

 * fixed position filters (themitchy)

 * update configs with cleaner hostnames (themitchy)

 * remove full url (themitchy)

 * remove unused styles (themitchy)

 * fix for tabs ui, better top functions styling (themitchy)

 * make sure chart updates as soon as possible (themitchy)

 * add some debug logs (themitchy)

 * how about I actually USE the config (themitchy)

 * use hostname to pick configs (themitchy)

 * utility for setting debug log level (themitchy)

 * remove require to AppChooser (themitchy)

 * clean up unused stuff, disable alerts (themitchy)

 * Clean up top functions template (themitchy)

 * catch highcharts errors (themitchy)

 * basic rendering of top functions (themitchy)

 * stub out top functions area (themitchy)

 * wire tooltips back up, disable alerts (themitchy)

 * setFilter silent doesn't update path (themitchy)

 * graph picker & refactoring (themitchy)

 * filters refactor and styling (themitchy)

 * v2 dashboard stuff (wip) (themitchy)


2013-05-21, Version web/0.1.3b
==============================

 * fix redirect for express 2.5.X (themitchy)


2013-05-21, Version web/0.1.3a
==============================

 * update header styles for partner page (themitchy)

 * link crawlable content to partners page (themitchy)

 * partners page (themitchy)

 * partner logos (themitchy)


2013-05-17, Version web/0.1.3
=============================

 * update ami to include cronjob for server restart (themitchy)

 * stop logout button from floating away (themitchy)

 * use less-middleware to compile less files (themitchy)

 * fix broken host check (themitchy)

 * Strip www from url, allowing Github OAuth and sessions to work properly. (Stephen Belanger)

 * Pointed everyauth dependency at our github repo, since upstream isn't pulling in fixes (Andrew Martens)

 * redelegate all events on render (themitchy)

 * new backbone version uses 'get' in favour of getByCid (themitchy)


2013-04-18, Version web/0.1.2
=============================

 * ensure events are delegated after model re-renders page (themitchy)


2013-04-18, Version web/0.1.1
=============================

 * remove debug logs (themitchy)

 * longer notification poll (themitchy)

 * longer user poll (themitchy)


2013-04-16, Version web/0.1.0
=============================

 * Removed out-of-date references to Node.js versions. (Andrew Martens)

 * typo (themitchy)

 * warning about kill signal (themitchy)

 * styles for dashboard menu (themitchy)

 * Forgot these... (Stephen Belanger)

 * Forgot to commit the Font Awesome stuff (Stephen Belanger)

 * don't clear local storage (themitchy)

 * logging (themitchy)

 * don't send userId (themitchy)

 * remember last used appKey (themitchy)

 * Hack to trigger chooser after initial chart load (Stephen Belanger)

 * only show one app for appHash (themitchy)

 * optional debug logging (themitchy)

 * Criteria-based instances chart working (Stephen Belanger)

 * Basic memory chart. Need to add top scoping stuff. (Stephen Belanger)

 * cpu chart still needs to check for duplicate time stamps (themitchy)

 * back to restler, gzip pipe was causing problems (themitchy)

 * show units (themitchy)

 * clean up some unused chart parsing (themitchy)

 * update aws package script (themitchy)

 * updating dep versions (themitchy)

 * Show help message when instance logging data is not available (Stephen Belanger)

 * dashboard drop down menu stub view for memory dashboard (themitchy)

 * remove debug log (themitchy)

 * comment out apps menu (themitchy)

 * disable single-require js (themitchy)

 * wii dashboard drop down (themitchy)

 * remove old open shift stuff (themitchy)

 * formatting / indentation (themitchy)

 * Fix _.keys() error when instances field is not present (Stephen Belanger)

 * use intercom window instead of feedback emailer (themitchy)

 * update addresses (themitchy)

 * smtp config fix (themitchy)

 * shell script to create aws instance, deploy web app, build ASG ready image, and clean up after itself (themitchy)

 * Instances frontend stuff. Not entirely working yet, so moved to new branch. (Stephen Belanger)

 * dumb routes for old api (themitchy)

 * Openshift how-to panel (Stephen Belanger)

 * use nodefly.com instead of apm.nodefly.com (themitchy)

 * switch from restler to request (themitchy)

 * google+ link (themitchy)

 * support new data format for top functions (themitchy)

 * use url for app chooser (themitchy)

 * update styles (themitchy)

 * set id for backbone data (themitchy)

 * update Chosen library (themitchy)

 * use built require modules if production (themitchy)

 * built require modules (themitchy)

 * update require (themitchy)

 * version control blog template (themitchy)

 * remove unused singleton code (themitchy)

 * work directly on $ object (themitchy)

 * query not handled with require (themitchy)

 * added getUserClusterApps call for getUser API method (Eugene Kaydalov)

 * styles for apps page (themitchy)

 * AppsView renders user changes (themitchy)

 * apps collection is redundant (themitchy)

 * make local copy of apps array so we don't trigger 'change' (themitchy)

 * give Intercom time to load (themitchy)

 * updated intercom js (themitchy)

 * basic table for app data (themitchy)

 * login and register initiate polling user data (themitchy)

 * add app collection (themitchy)

 * app view listens to user model (themitchy)

 * make user model self-fetching (themitchy)

 * simplify view manager (themitchy)

 * configure poll interval for user data (themitchy)

 * rename nav (themitchy)

 * single call for apps (themitchy)

 * send ids with apps and users (themitchy)

 * remove debug (themitchy)

 * upgrade backbone and underscore (themitchy)

 * ensure events are delegated after remove/re-add (themitchy)

 * allow view.remove() to function correctly (themitchy)

 * styles for app nav (themitchy)

 * nab for apps view (themitchy)

 * start view for apps (themitchy)

 * only disconnect if connected (themitchy)

 * fix postal code (themitchy)

 * set copyright to current year, always. (themitchy)

 * shim available width (themitchy)

 * chart styles limit children in chart (themitchy)

 * firefox compatible image preloading (themitchy)

 * switch up the colours a little (themitchy)

 * new endpoint paths graph (themitchy)

 * Use Polling for Alerts Instead of Events (Jacob Groundwater)

 * Change Axon Socket Type to Sub from Pull (Jacob Groundwater)

 * Remove Set Notices - Moved to Collector Side to Support Web Clustering (Jacob Groundwater)

 * Add Buildfile (Jacob Groundwater)

 * empty chart container before redrawing (themitchy)

 * keep orig values (themitchy)

 * only show graph if data is available (themitchy)

 * formatting (themitchy)

 * style tweaks for tooltip and piping graph (themitchy)

 * UI for endpoint graph (themitchy)

 * Add Makefile for AWS Deployment (Jacob Groundwater)

 * more in-your-face reminder of where to put the require (themitchy)

 * extra warning about putting the require first (themitchy)

 * check for persisted session if regular session becomes invalid (themitchy)

 * handle persisted session on page load (themitchy)

 * restore remembered user's session (themitchy)

 * retrieve remembered user from DB (themitchy)

 * checkbox for 'remember me' (themitchy)

 * cookies for remember token (themitchy)

 * update and clear remember token on login/logout (themitchy)

 * calculate and store remember me token (themitchy)

 * ui to show postgres functions (themitchy)

 * Remove Mongo Check from Web (Jacob Groundwater)

 * remove css image preloaded (breaks FF) (themitchy)

 * Make HealthCheck Report to Logs (Jacob Groundwater)

 * Update Alert Status on Change Event (Jacob Groundwater)

 * Add MongoDB Dependency (Jacob Groundwater)

 * Fetch New Alert Count on Notification (Jacob Groundwater)

 * Remove Event Listeners When Socket Closes (Jacob Groundwater)

 * Add Alert Buttons Back to Dashboard (Jacob Groundwater)

 * Add Alerts Back In (Jacob Groundwater)

 * wrap intercom calls in try/catch (themitchy)

 * added check for mongodb (themitchy)

 * add intercom.io support (themitchy)

 * send created date with user data (themitchy)

 * modal won't reset page scroll now (themitchy)

 * keywords update (themitchy)

 * clear error message properly (themitchy)

 * fix titles for alert configure dialog (themitchy)

 * conditional profiling of web server (themitchy)

 * Add parseInt for Axon Ports (Jacob Groundwater)

 * remove alerts from features (themitchy)

 * disabled alerts (themitchy)

 * Less spammy invite (themitchy)

 * bug after deleting invite (themitchy)

 * sep stuff (themitchy)

 * field validation for alerts (themitchy)

 * redis session ttl (themitchy)

 * fix screenshot origin with scrolling (themitchy)

 * css image preloader (themitchy)

 * screenshots for features page (themitchy)

 * invite view fixes (themitchy)

 * Change Color for Drop Down Menus in Alerts Config (Jacob Groundwater)

 * this was removing the root element for the web site (themitchy)

 * fixed link (themitchy)

 * Change Text Color in Alerts Dialogue (Jacob Groundwater)

 * Fix Formatting of Alert Duration on Alerts List Page (Jacob Groundwater)

 * Change Alerts format to Minutes (Jacob Groundwater)

 * Map Alert Selectors to Alert Types (Jacob Groundwater)

 * Revert "Revert "Make Alert List Asynchronous"" (themitchy)

 * Revert "Revert "Make Notification Search Asynchronous"" (themitchy)

 * Revert "Make Alert List Asynchronous" (themitchy)

 * Revert "Make Notification Search Asynchronous" (themitchy)

 * initial features page (themitchy)

 * Remove Popup Confirmations (Jacob Groundwater)

 * Remove Grey Color from Alert Text (Jacob Groundwater)

 * alert config for times by tier (themitchy)

 * Fix Time Format Error in Notification (Jacob Groundwater)

 * Fix Notifications Comment / Documentation (Jacob Groundwater)

 * Switch Concurrent Connection and Throughput Indexes for Alerts (Jacob Groundwater)

 * fixed expired session landing page "no-render" bug (themitchy)

 * appChooser on how to uses correct model (themitchy)

 * change label (themitchy)

 * fix bug for loving back in as different user (themitchy)

 * parent can delete invites (themitchy)

 * rest call for removing parent/child link (themitchy)

 * update child_id when accepting invite (themitchy)

 * Ignore Missing Agent Version (Jacob Groundwater)

 * Make Alert List Asynchronous (Jacob Groundwater)

 * Make Notification Search Asynchronous (Jacob Groundwater)

 * show pending invites (themitchy)

 * mark invites accepted (themitchy)

 * Fix Procfile (Jacob Groundwater)

 * Deployment Fixes (Jacob Groundwater)

 * hide tooltips when clicking anywhere (themitchy)

 * chart title alignment (themitchy)

 * alerts are set up on login and registration (themitchy)

 * higher contrast buttons in chart titles (themitchy)

 * alert categories match chart series (themitchy)

 * user specified and multiple emails for alerts (themitchy)

 * login / accept invite for existing user (themitchy)

 * fix class / id (themitchy)

 * login form for invites (themitchy)

 * styles for auth error (themitchy)

 * fix class name and id (themitchy)

 * proper rendering of invite for users logged in or not (themitchy)

 * if user is logged in, make sure it's the correct user (themitchy)

 * remove check for data (themitchy)

 * show child apps to parent (themitchy)

 * unused call (themitchy)

 * registration of new users through invite (themitchy)

 * ui for sending invite start of ui for receiving invite (themitchy)

 * added rest calls to send and get invite data (themitchy)

 * function to send invitation (themitchy)

 * usernames for password reset (themitchy)

 * fix for views on password reset (themitchy)

 * update password (themitchy)

 * move account routes to separate module (themitchy)

 * feedback for form submission (themitchy)

 * update account styles (themitchy)

 * fixed styles for modal body (themitchy)

 * old user_id key not used anymore (themitchy)

 * res not req (themitchy)

 * properly named file (themitchy)

 * remove incorrectly named image (themitchy)

 * super basic enterprise login (themitchy)

 * moved socket.io stuff into it's own module (themitchy)

 * handle alerts vs notifications (themitchy)

 * make alerts api available to routes (themitchy)

 * alerts REST moved into routes/alerts (themitchy)

 * Change Writeup in Heroku Console (Jacob Groundwater)

 * Point Heroku to Production (Jacob Groundwater)

 * Fix 404 to Use Absolute Paths (Jacob Groundwater)

 * Change Sales Email to Support (Jacob Groundwater)

 * Update Heroku User Email on SSO (Jacob Groundwater)

 * Bind to PORT from Environment (Jacob Groundwater)

 * Remove Link to Old Site (Jacob Groundwater)

 * Final Draft for Heroku Console Page (Jacob Groundwater)

 * Retain Heroku User Activity Data (Jacob Groundwater)

 * Change Heroku Dashboard Preview Image (Jacob Groundwater)

 * Add Heroku Premium Page (Jacob Groundwater)

 * Update Slogan (Jacob Groundwater)

 * Fix Heroku Header Styling (Jacob Groundwater)

 * Pass Heroku Cookie to Console (Jacob Groundwater)

 * Maintain Heroku Dashboard After Login (Jacob Groundwater)

 * Set Link on Heroku Dashboard Button (Jacob Groundwater)

 * Redirect Heroku Dashboard on Unsuccessful Authentication (Jacob Groundwater)

 * Set Better Default Name for Heroku (Jacob Groundwater)

 * Add Popups to Heroku Page (Jacob Groundwater)

 * Add Heroku Config Page (Jacob Groundwater)

 * moved app into it's own module (themitchy)

 * Update Add-on Manifest URLs for Production (Jacob Groundwater)

 * Add Heroku Integration (Jacob Groundwater)

 * Include els Template Module (Jacob Groundwater)

 * consistent semicolons and formatting (themitchy)

 * Fix db Module Name Error (Jacob Groundwater)

 * Set Views Directory to Non-Public Path (Jacob Groundwater)

 * better styles for drop downs (themitchy)

 * port fix (themitchy)

 * Add Alert-Trigger Get Example (Jacob Groundwater)

 * Refactor alerts to triggers in Main App (Jacob Groundwater)

 * Add Notification Documentation (Jacob Groundwater)

 * Simplify Notification Name Listing (Jacob Groundwater)

 * Simplify Alerts File Layout (Jacob Groundwater)

 * Update Live Alert Receiver (Jacob Groundwater)

 * Connect Alerts Service to Application via Axon (Jacob Groundwater)

 * Add Alert Notifications Service (Jacob Groundwater)

 * a few more style tweaks for alerts (themitchy)

 * style tweaks on alert lists (themitchy)

 * display active alerts (themitchy)

 * send alerts to web client (themitchy)

 * Add Health Check Page for ELB that Queries MySQL and Redis (Jacob Groundwater)

 * Fix Reference to Database (Jacob Groundwater)

 * Accept Binding Port from Environment (Jacob Groundwater)

 * Remove undefined Error (Jacob Groundwater)

 * Add AWS Specific Configuration (Jacob Groundwater)

 * Convert DB Connection to Proxy (Jacob Groundwater)

 * Do MySQL Reconnection Scheme (Jacob Groundwater)

 * Add 404 Page (Jacob Groundwater)

 * Add HTML Character Encoding Meta Tag (Jacob Groundwater)

 * Set NodeFly App Name to ENV Var or Default (Jacob Groundwater)

 * changed "procede" to "proceed" (supermonster)

 * fixed dumb version checking (themitchy)

 * made feedback form it's own page (themitchy)

 * smarter/dumber password reset (themitchy)

 * Update Heroku Message (Jacob Groundwater)

 * Fix Port Config (Jacob Groundwater)

 * updating reset password styles (themitchy)

 * Rename Complex Tab to Advanced (Jacob Groundwater)

 * Add Semicolons (Jacob Groundwater)

 * Fix Variables in HowTo for Clarity (Jacob Groundwater)

 * Use Provider User ID as Default Name (Jacob Groundwater)

 * added a forgot password link to landing page (themitchy)

 * update login page styles (themitchy)

 * add, list, and delete alerts (themitchy)

 * Update HowTo for New Agent Naming (Jacob Groundwater)

 * created rest call to get all alerts for logged in user (themitchy)

 * Fix Redis Client from Crashing Application (Jacob Groundwater)

 * Remove nconf and Directly Require PORT ENV Variable or Ues Default (Jacob Groundwater)

 * Read ENV Port (Jacob Groundwater)

 * Provide Default C9 User Name (Jacob Groundwater)

 * Rename everyauth File for Github and C9 Authentication (Jacob Groundwater)

 * Unionize everyauth Code (Jacob Groundwater)

 * Set Default HMAC Keys (Jacob Groundwater)

 * Fix Bad Database Names (Jacob Groundwater)

 * Remove Extraneous Code Generated During Rebase (Jacob Groundwater)

 * Allow Empty Name and Email from Github Registration (Jacob Groundwater)

 * Cleanup and Fix Bad Scope (Jacob Groundwater)

 * Use ENV Variable for HMAC Keys (Jacob Groundwater)

 * Add c9 Login Support (Jacob Groundwater)

 * remove hard coded config env (themitchy)

 * clear session storage if there's no user (themitchy)

 * fixing setup for redistogo (themitchy)

 * setup redistogo (themitchy)

 * fixing port (themitchy)

 * upping npm version (themitchy)

 * adding Procfile for heroku (themitchy)

 * upping node version for heroku (themitchy)

 * doh! broke the package json (themitchy)

 * trying out heroku deployment (themitchy)

 * submit button styles (themitchy)

 * set referrer cookie expiration (themitchy)

 * store referer and ip on signup (themitchy)

 * adding alerts dialog (wii) (themitchy)

 * fixed middleware order (themitchy)

 * support ajax crawling of static resources (themitchy)

 * update red is socket directory (themitchy)

 * Warn user if account already exists (themitchy)

 * fix missing style on active nav button (themitchy)

 * better behaviour of drop down shelf (themitchy)

 * Change wording on link to old site (themitchy)

 * Update Roadmap (Jacob Groundwater)

 * Add Examples with Images to HowTo (Jacob Groundwater)

 * send timeRange to api server instead of frame size (themitchy)

 * Add Minimum Password Requirements to Password Reset (Jacob Groundwater)

 * Add Minimum Password Requirements (Jacob Groundwater)

 * link to old service (themitchy)

 * landing page redirects to dashboard if already logged in (themitchy)

 * focus inputs (themitchy)

 * popover fixes (themitchy)

 * reset drill down when app selection changes (themitchy)

 * clean up unused code (themitchy)

 * maintain state on selected app and time range (themitchy)

 * hide alerts nab button (themitchy)

 * Update Github App Id and Secret (Jacob Groundwater)

 * Change Database Column Names to Underscores (Jacob Groundwater)

 * reverse colours for times graph (themitchy)

 * templates the tabs for top functions (themitchy)

 * Update Contacts Page (Jacob Groundwater)

 * temp fix on querySelector for IE (themitchy)

 * password reset fixes and styling (themitchy)

 * Update Pricing Info (Jacob Groundwater)

 * update error messages and styling for login page (themitchy)

 * Use Case Insensitive Match on Email During Login (Jacob Groundwater)

 * Remove Strict Regex for Email Validation (Jacob Groundwater)

 * Remove Bla Blas (Jacob Groundwater)

 * Add Version Warning (Jacob Groundwater)

 * fixed how-to page functionality (themitchy)

 * Fix Installation Instructions (Jacob Groundwater)

 * Change View Port for Mobile Device Compatibility (Jacob Groundwater)

 * shelf styling (themitchy)

 * Use DI for everyauth Github Module (Jacob Groundwater)

 * select connection function (themitchy)

 * restful interface to alerts (themitchy)

 * Add Github Login (Jacob Groundwater)

 * Rename Session Variables (Jacob Groundwater)

 * Update Database Compatability (Jacob Groundwater)

 * Add async Module to Web Server (Jacob Groundwater)

 * landing, login, contact, privacy, tos pages (themitchy)

 * new ui for landing page/registration/login (themitchy)

 * Add Alert Notification Storage (Jacob Groundwater)

 * chart optimizations (themitchy)

 * Update Package Dependency (Jacob Groundwater)

 * Add Alert Emitter (Jacob Groundwater)

 * Add Alerts Module (Jacob Groundwater)

 * handle gzip (themitchy)

 * configurable time ranges for graphs (themitchy)

 * refactoring user login (themitchy)

 * update tooltip for dbs (themitchy)

 * new chart drill downs (themitchy)

 * Fix Configuration to Switch Between 'dev' and 'prod' (Jacob Groundwater)

 * shelf styles, chart tweaks (themitchy)

 * new chart styles and tooltips (themitchy)

 * new top-nav and app-chooser (themitchy)

 * chosen library (themitchy)

 * new ui assets (themitchy)

 * update agent (themitchy)

 * popovers (themitchy)

 * drop node_in from tiers (themitchy)

 * revert config to work with openshift (themitchy)

 * update package (themitchy)

 * adding memcache chart (themitchy)

 * router/dashboard refactoring added drop down to dbs list (themitchy)

 * show mysql calls in top functions (themitchy)

 * clear model on update (themitchy)

 * removed DEV text from title (themitchy)

 * fixed broken page reload on waiting for apps (themitchy)

 * updating package (themitchy)

 * update agent version set web server to be monitored (themitchy)

 * don't display default series (themitchy)

 * handle new data format and in/out tiers (themitchy)

 * redraw graphs for new socket session (themitchy)

 * moved times by tier chart to top (themitchy)

 * Add Hash to Account Info (Jacob Groundwater)

 * Highlight Menu Bar Tab for Account (Jacob Groundwater)

 * Allow Direct Linking to #accounts Page (Jacob Groundwater)

 * Add Fields to Account Page (Jacob Groundwater)

 * Make Model URL Relative (Jacob Groundwater)

 * Basic account model storage (themitchy)

 * initial AccountView and Model (themitchy)

 * Add Account Route (Jacob Groundwater)

 * keep requested page in routes (themitchy)

 * Refactor SHVA Route to Module (Jacob Groundwater)

 * Refactor everyauth and db Into Submodule (Jacob Groundwater)

 * Add Github Authentication Compatability with Existing AJAX Login Methods (Jacob Groundwater)

 * Cleanup (Jacob Groundwater)

 * Return Error when everyauth User is Not Found (Jacob Groundwater)

 * Fix Github Registering New User (Jacob Groundwater)

 * Use All Caps for Github User Authentication Env Variables (Jacob Groundwater)

 * Cleanup Github User Authentication (Jacob Groundwater)

 * Fix User Selection Error (Jacob Groundwater)

 * Github Login to HowTo Page (Jacob Groundwater)

 * Revert to Express 2.0 (Jacob Groundwater)

 * Change Fix (Jacob Groundwater)

 * show instructions for command line marker tool (themitchy)

 * update version (themitchy)

 * show graph annotations (themitchy)

 * update backbone and high charts (themitchy)

 * cleanup (themitchy)

 * Use nconf for All Configurations (Jacob Groundwater)

 * check version for external calls (themitchy)

 * support external calls data (themitchy)

 * Use Supervise Instead of Forever (Jacob Groundwater)

 * Use nconf to Configure Databases and Other Resources (Jacob Groundwater)

 * Fix Required Packages & Foreverize Start Script (Jacob Groundwater)

 * Fix Web UI Chart Script (Jacob Groundwater)

 * doh (themitchy)

 * cleaning up (themitchy)

 * notify web client to log in when session invalid (themitchy)

 * updated defaults for demo:demo account (themitchy)

 * navbar ui bug (themitchy)

 * update agent version in package (themitchy)

 * updated packages (themitchy)

 * update install instructions show message for not avail charts (themitchy)

 * remove link to wip queue stack stuff (themitchy)

 * get and display event loop blocks (themitchy)

 * master password for webclient (themitchy)

 * updated package (themitchy)

 * remove submodule ref (themitchy)

 * add series for memcached (themitchy)

 * check agent version type (themitchy)

 * handle data from different versions of agent (themitchy)

 * only show drill down if data is available (themitchy)

 * udpating npm packages (themitchy)

 * support drill-down on top functions (themitchy)

 * style updates (themitchy)

 * display hostname in app chooser (themitchy)

 * updated nodefly package (themitchy)

 * new nodefly package (themitchy)

 * handle downed api server without crashing (themitchy)

 * move all ports & ips to a config module easier switching between prod/dev (themitchy)

 * bootstrap for modal lib (themitchy)

 * feedback form (themitchy)

 * check for apps when on howto page (themitchy)

 * updating agent (themitchy)

 * refactor and clean (themitchy)

 * updating npm package (themitchy)

 * instructions show npm tarball link (themitchy)

 * agent module tarball (themitchy)

 * add redis (themitchy)

 * fix title (themitchy)

 * add mongoDB (themitchy)

 * only load apps if we don't already have some (themitchy)

 * added title (themitchy)

 * set apphash on app load (themitchy)

 * update apps and app chooser when rendering the dashboard (themitchy)

 * update apps from db (themitchy)

 * use same db as prod for now (themitchy)

 * correcting table (themitchy)

 * fill bar chart categories (themitchy)

 * update instructions template (themitchy)

 * remove home tab (themitchy)

 * very thourough disconnect of socket simplo view manager for tracking views (themitchy)

 * set app data on login (themitchy)

 * send app data with login (themitchy)

 * pass in appHash from client (themitchy)

 * hardcoded defaults for demo user (themitchy)

 * use appHash as key for top functions (themitchy)

 * passing app hash (themitchy)

 * syncing agent (themitchy)

 * woops (themitchy)

 * better app switching (themitchy)

 * google analytics (themitchy)

 * reset time after app change (themitchy)

 * different key for agent (themitchy)

 * use local agent (themitchy)

 * multiple axes for connections chart (themitchy)

 * all small charts now same size (themitchy)

 * added crosshair and time to tooltip (themitchy)

 * multi-series tooltip & graph formatting (themitchy)

 * time range is 60minutes (themitchy)

 * more frequent metrics (themitchy)

 * hack for heap series not all in one object (themitchy)

 * back to millis (themitchy)

 * overwrite duplicate points if y is 0 (themitchy)

 * removing submodule hook from build script(didn't work) (themitchy)

 * adding agent back in (can't submodule update private repo on openshift) (themitchy)

 * submodule update in build hook (themitchy)

 * removing duplicate agent (themitchy)

 * added nodefly-apm as a submodule (themitchy)

 * use class to hide top form (themitchy)

 * top functions margin (themitchy)

 * roll back to ms for top functions (themitchy)

 * set range for top functions (themitchy)

 * overwrite 0 duplicates points (themitchy)

 * add stime, utimte, GC full (themitchy)

 * add stime, utime to cpu info (themitchy)

 * fix for data points out of order (themitchy)

 * same color for top func (themitchy)

 * initial package file for agent (themitchy)

 * complete password reset (themitchy)

 * show success message on password reset (themitchy)

 * escape password (themitchy)

 * user correct key for password reset debug cleanup (themitchy)

 * change color of active menu (themitchy)

 * change labels to micro (themitchy)

 * back to default chart colors (themitchy)

 * WIP: password reset (themitchy)

 * add series to heap chart (themitchy)

 * WIP password reset (themitchy)

 * remove debug msg (themitchy)

 * cleaning up tooltips for top functions (themitchy)

 * cleaning / formatting (themitchy)

 * Welcome message for login page (themitchy)

 * adding icons for welcome page (themitchy)

 * Turn off responsive css for now(not working so well with highcharts) (themitchy)

 * disable credits allow zooming (themitchy)

 * force xhr-polling because failover takes too long (themitchy)

 * loader for dashboard (themitchy)

 * styling for nav bar (themitchy)

 * set app for demo user (themitchy)

 * remove debug point to correct servers (themitchy)

 * app chooser changes parameters to api server (themitchy)

 * don't show app chooser if there are no apps (themitchy)

 * remove debug logs (themitchy)

 * added app chooser (themitchy)

 * send apps with login handle socket reconnect (themitchy)

 * refactoring timeseries graphs (themitchy)

 * show name and api key (themitchy)

 * debug timeseries (themitchy)

 * cutoff wait time for updates (themitchy)

 * debugging chart stuff (themitchy)

 * chain updates (themitchy)

 * set proper demo user key (themitchy)

 * send user key to api (themitchy)

 * pass key to nodefly profile (themitchy)

 * aggregate urls for top functions (themitchy)

 * integrate UrlAggregator in agent (themitchy)

 * initial howto page (themitchy)

 * force axis range style tweaks for logins (themitchy)

 * style tweaks for login page (themitchy)

 * merge register and login views no top bar on login view (themitchy)

 * hardcoded demo user (themitchy)

 * fix registration bug (themitchy)

 * truncate label names added some debug logs (themitchy)

 * add testing functions to server (themitchy)

 * fix overlapping first call bug point openshift at dev server (themitchy)

 * sort timeseries data if out of order don't clober timeseries data (themitchy)

 * cleanup config (themitchy)

 * fake old data to recreate bug (themitchy)

 * enforce order properly (themitchy)

 * agent.io dep (themitchy)

 * enforce order of timeseries data (themitchy)

 * adding node-gyp dep (themitchy)

 * added deps for mongo and timekit (themitchy)

 * added nodefly profiler (themitchy)

 * fixed bug with reusing dashboard view cleaning up navbar (themitchy)

 * added top nav & login/logout functions started using less (themitchy)

 * put user key/hash in session (themitchy)

 * config requires net module (themitchy)

 * backwards compatability with old auth (themitchy)

 * some refactoring and code cleanup (themitchy)

 * express 2.5.x compatible configuration tweaks (themitchy)

 * downgrade express (themitchy)

 * update node version (themitchy)

 * update express (themitchy)

 * send redis client with socket and path (themitchy)

 * attempt unix socket connection for redis (themitchy)

 * move redis configs to config (themitchy)

 * registration UI fix sessionID tracking (themitchy)

 * registration, authentication and redis session store (themitchy)

 * default api to / (themitchy)

 * added socket.io dep (themitchy)

 * remove redis store (themitchy)

 * specify deps for web server (themitchy)

 * wrong name format (themitchy)

 * use openshift port & ip (themitchy)

 * bringing in webclient to openshift repo (themitchy)

 * initial checkin (webclient) (themitchy)

 * cpuinfo (root)

 * hello glen (root)

 * Creating template (Template builder)

 * Update README.md (Francesco Vollero)

 * Bumped Redis version to 2.4.12 (Francesco Vollero)

 * removed the second and unuseful #!/bin/bash (Francesco Vollero)

 * docs: Added some info on Redis configuration and a quick example (Francesco Vollero)

 * docs: Substituted the word polyglot with redis (Francesco Vollero)

 * docs: Fixing README.md (Francesco Vollero)

 * Added .openshift folder with build script (Francesco Vollero)

 * initial commit (Francesco Vollero)


2013-12-03, Version jobs/production
===================================

 * fix reference to script (themitchy)

 * remove hard-coded config (themitchy)

 * remove trace file creation (supermonster)

 * added folders for data to sit in (supermonster)

 * add topcalls processor v3 (using data2_x tables for now) (supermonster)

 * fix table tame (themitchy)

 * don't force hardcoded path on developers (themitchy)

 * clean up top calls import (themitchy)

 * cleanup tail import (themitchy)

 * ignore data files (themitchy)

 * resolve path for scripts (themitchy)

 * ignore repeated warnings (themitchy)

 * keep var folder (themitchy)

 * dumper was not executing the correct command (themitchy)

 * correct path for module (themitchy)

 * rollup topfunctions restructure initial commit (eugene kaydalov)

 * restructure (eugene kaydalov)

 * moderately saner logging (themitchy)

 * sending to alerts should not be disabled (themitchy)

 * cleanup, removing files that are no longer in use (Eugene Kaydalov)

 * remove old stuff that will never be used (Eugene Kaydalov)

 * Make rollups work in dev...again... (Stephen Belanger)

 * modified metrics processor to v3 (Eugene Kaydalov)

 * modified output Date format per Sumitha's request (Eugene Kaydalov)

 * add job that sends a list of users who started using StrongOps to Sumitha (Eugene Kaydalov)

 * don't crash if no data in log3 (Eugene Kaydalov)

 * add missing files to setup dev (eugene kaydalov)

 * rollups v3 initial commit (eugene kaydalov)

 * prepare for switch to stock node-measured (Eugene Kaydalov)

 * Rollup monitor script, imported from production (Ryan Graham)

 * Use module-relative paths (Ryan Graham)

 * missing dependancy (themitchy)

 * remove unused configs (themitchy)

 * start tail (themitchy)

 * use log2 (themitchy)

 * tail raw data and fire data events for alerts (Eugene Kaydalov)

 * put strongmq metrics back in (themitchy)

 * run both jobs from npm start (themitchy)

 * scripts are configurable from env (themitchy)

 * have dumper let us know if there were script problems (themitchy)

 * fix heap data metric names (Eugene Kaydalov)

 * fix JSON export/import problem (Eugene Kaydalov)

 * gitignore data files (themitchy)

 * switch to new agent name and auto-detect configs mode (themitchy)

 * removed reference to mysql_pool_local (themitchy)

 * chmod u+x on shell scripts (themitchy)

 * add rollup support (Eugene Kaydalov)

 * add another insert for collector_sessions table (Eugene Kaydalov)

 * if the job was inactive for a any amount of time, run prepare_job.sql and start the job (Eugene Kaydalov)

 * add tail_log/insert_tears job (Eugene Kaydalov)

 * cron settings (Eugene Kaydalov)

 * prepare the job to be run as a cron job (Eugene Kaydalov)

 * cron jobs for populating the apps table (Eugene Kaydalov)

 * exit when mysqlbacklog is empty (Eugene Kaydalov)

 * assign_app.php is a job that takes collector session entries and assigns a cluster app to each it creates a new app if it hasn't been registered yet (Eugene Kaydalov)

 * specified current location of ini file (Eugene Kaydalov)

 * a job that takes redis new session entries and copies them to mysql (Eugene Kaydalov)

 * Add jobs to github. Initially the log_p table transfer to log (MyISAM to InnoDB migration) and the apps expiry script (Eugene Kaydalov)

 * Initial commit (supermonster)


2013-12-03, Version common/production
=====================================

 * merge conflicts (themitchy)

 * changing the structure of data2_x tables to allow rollups v3 (supermonster)

 * changed session_id to match hash from collector_sessions (Andrew Martens)

 * ts should be datetime (Andrew Martens)

 * Edit errors schema to add session_id and allow empty values for type/command (Stephen Belanger)

 * Add cluster data to SQL migrations. (Michael Schoonmaker)

 * Add errors migration (Stephen Belanger)

 * Add active start/end times to alerts table (Stephen Belanger)

 * Add alerts migration, not sure how that disappeared, and add pid to instances (Stephen Belanger)

 * Purge bad sql migrations from master (Stephen Belanger)

 * Update migrations to support latest codebase, disabled partitions as they don't work on dev. (Stephen Belanger)

 * add session_metrics and log3 tables (Eugene Kaydalov)

 * Minor fix to migrations to sooth a cranky mysql (Andrew Martens)

 * Production SQL database definition for dev work (Andrew Martens)

 * Added `db-migrate` (Salehen Shovon Rahman)

 * Update README.md (Mitch Granger)

 * simple config loader (themitchy)

 * ignore (themitchy)

 * formatting (themitchy)

 * Start centralizing database config/migrations (Ryan Graham)

 * Add missing dependency on db-migrate (Ryan Graham)

 * rename to log2 (themitchy)

 * Update migrations (Stephen Belanger)

 * purging of old mongo code (themitchy)

 * update sql migrations (themitchy)

 * invalid default value for date time (themitchy)

 * add status column to profiler_runs (themitchy)

 * unique constraint on sessionId (themitchy)

 * update gitignore (themitchy)

 * store pid (themitchy)

 * Update db-migrate migrations (Stephen Belanger)

 * Can now trigger profiler events on agents from API server (Stephen Belanger)


2013-06-21, Version common/0.2.0
================================

 * Fix some global leaks (Stephen Belanger)

 * sql for cluster'd log data (themitchy)


2013-06-17, Version common/0.1.7
================================

 * reversing hard-coded configs (themitchy)

 * populate apps table, change app_hash generation algo (Eugene Kaydalov)


2013-05-22, Version common/0.1.6
================================



2013-05-22, Version common/0.1.5
================================

 * unique constraint on apphash (themitchy)


2013-05-15, Version common/0.1.4
================================

 * report error on closing connection (themitchy)

 * pull in pool options through config (themitchy)


2013-04-16, Version common/0.1.1
================================



2013-04-16, Version common/0.1.2
================================



2013-04-16, Version common/0.1.3
================================

 * create mysql pool (themitchy)

 * update mysql version for pooling (themitchy)


2013-04-09, Version common/0.1.0
================================

 * logging (themitchy)

 * Made Makefile work without db-migrate, and added symlink fix to Vagrantfile (Stephen Belanger)

 * Fixed some issues when running migrations on a newly-created db. (Andrew Martens)

 * session_track table (themitchy)

 * get expensive data after aggregation (themitchy)

 * add missing dep (themitchy)

 * add dep for underscore (themitchy)

 * use aggregation framework to get top functions (themitchy)

 * fix saveTopFunctions (themitchy)

 * remove mongolab reference move insert to dataMan (themitchy)

 * Instances data collection and serving (Stephen Belanger)

 * tail table for jobs to keep track of last processed records for tables. (Eugene Kaydalov)

 * remove useless index (themitchy)

 * Add apps table and 2 new columns to collector_sessions (Eugene Kaydalov)

 * send new data to new mongo instance (themitchy)

 * update async module (themitchy)

 * un-break mongo reconnect (themitchy)

 * script to create mongo indexes (themitchy)

 * allow direct access to collections (themitchy)

 * create indexes manually (themitchy)

 * update sql migrations (themitchy)

 * better index (themitchy)

 * Fix Redis Configs (Jacob Groundwater)

 * Fix Redis Config (Jacob Groundwater)

 * Use Single Mongo Instance (Jacob Groundwater)

 * Use Trivial Round-Robin MySQL Connection Pool (Jacob Groundwater)

 * configure mongo to reconnect (themitchy)

 * Remove Old Mongo Configuration (Jacob Groundwater)

 * Use MongoLabs Only (Jacob Groundwater)

 * fix search for apps to only use first entry (themitchy)

 * column for 'remembered' sessions (themitchy)

 * update collection list for postgres topFunctions (themitchy)

 * Quiet Debug Logging (Jacob Groundwater)

 * Make MongoLabs Authentication Optional (Jacob Groundwater)

 * use hosted mongo for new calls (themitchy)

 * default values for required fields (themitchy)

 * handle case where reduce doesn't run for single result (themitchy)

 * ensure indexes (themitchy)

 * added methods to save and reduce topFunction data (themitchy)

 * quiet down the logging (themitchy)

 * accept empty app and hostname (themitchy)

 * column for accepting invites (themitchy)

 * drop belongs in reverse script (themitchy)

 * pure sql migrations (themitchy)

 * Update Notification Schema (Jacob Groundwater)

 * Add Referrer DB Migration (Jacob Groundwater)

 * Fix Log Table Migration (Jacob Groundwater)

 * Fix Migration (Jacob Groundwater)

 * Add Notifications Database Migration (Jacob Groundwater)

 * Add Database Back End (Jacob Groundwater)

 * add mysql calls to slowest functions (themitchy)

 * set unique app hash (themitchy)

 * Fix Query Database for User Hash (Jacob Groundwater)

 * Add Github User Migration (Jacob Groundwater)

 * hard code mongo collections (themitchy)

 * passing mandatory options to mongo (themitchy)

 * Use ENV for All Common Configurations (Jacob Groundwater)

 * Fix Latent Merge Conflict (Jacob Groundwater)

 * Undo Mongo Fix that Caused Errors (Jacob Groundwater)

 * Explicitly Set Safe Mode for MongoDB (Jacob Groundwater)

 * Convert nconf to Use Foreman .env File (Jacob Groundwater)

 * Use nconf to Handle Database and Other Resource Configurations (Jacob Groundwater)

 * Adjust Development Configurations for Local Use (Jacob Groundwater)

 * Use Database Migrations (Jacob Groundwater)

 * Throw Topical Error if MongoDB is Unavailable (Jacob Groundwater)

 * Add Test Support to All Packages (Jacob Groundwater)

 * Reorganize into Modules (Jacob Groundwater)


2013-12-03, Version collector/production
========================================

 * SLP-326 store num cpus (themitchy)

 * SLP-325 store workers list when cluster data updates (themitchy)

 * use sessionId/pid as key for collector_sessions (themitchy)

 * Confusing naming schemes suck, especially when you deprecate one but leave the code that continues to store the unused data... (Stephen Belanger)

 * changed errors session_id to match hash from collector_sessions (Andrew Martens)

 * Migrate cluster data to MySQL. (Michael Schoonmaker)

 * Add a cluster control channel. (Michael Schoonmaker)

 * Add session_id to stored error data (Stephen Belanger)

 * Remove console.log in errors (Stephen Belanger)

 * Don't name the event 'error', that might blow stuff up... (Stephen Belanger)

 * Store reported errors (Stephen Belanger)


2013-09-17, Version collector/0.2.3
===================================

 * don't send alerts (themitchy)

 * Fix conflicts (Stephen Belanger)

 * Disable alerts.send from old alerts system (Stephen Belanger)

 * Add pid to instances records (Stephen Belanger)


2013-09-07, Version collector/0.2.2
===================================

 * move from log2 to log3 (which is partitioned) (Eugene Kaydalov)

 * Remove db-migrate from devDependencies...this goes in common (Stephen Belanger)

 * Remove references to API versions that no longer exist (Ryan Graham)

 * Fix typos in package.json (Ryan Graham)

 * Replace test/test.sh with nodefly-common helper (Ryan Graham)

 * Unless not false, do not this... (Ryan Graham)

 * don't attempt to run query without app id (themitchy)

 * cleaning up old unused mongo code (themitchy)

 * use log2 (themitchy)


2013-07-25, Version collector/0.2.1
===================================

 * valid package name (themitchy)

 * use strong-agent (themitchy)

 * populate collection_sessions.app_id (Eugene Kaydalov)

 * update profiler status when data comes in (themitchy)

 * refactoring / cleanup (themitchy)

 * update session on duplicate sessionId (themitchy)

 * bind to main socket now that uruha fix is live (themitchy)

 * add debug to session storage (themitchy)

 * update git ignore and start script (themitchy)

 * store pid (themitchy)

 * only record connectedAgents if a pid is provided (themitchy)

 * Can now trigger profiler events on agents from API server (Stephen Belanger)


2013-06-28, Version collector/0.2.0
===================================

 * store server time for updates (themitchy)

 * remove insert to session_track (themitchy)

 * don't send to alerts (themitchy)

 * disconnect was bound to wrong object (themitchy)

 * Reconnection test, plus add db-migrate to dev dependencies (Stephen Belanger)

 * API V2 Tests with code coverage (Stephen Belanger)

 * API V2 tests written (Stephen Belanger)

 * Fix some global leaks (Stephen Belanger)

 * use uhura@stable (themitchy)

 * fix socket.io api (themitchy)

 * add session id into the log data record (Eugene Kaydalov)


2013-06-21, Version collector/0.1.7
===================================

 * valid session if it has appName or hostname (themitchy)

 * don't assume query will return rows (themitchy)

 * ignore invalid updates from older agents (themitchy)

 * print out correct value for debug log (themitchy)

 * formatting, clean-up, session fixing (themitchy)

 * add support for app_id for log data (Eugene Kaydalov)

 * make reconnect recover the whole session state from storage (Eugene Kaydalov)

 * some fixes to reconnect (themitchy)

 * populate apps table, change app_hash generation algo (Eugene Kaydalov)


2013-06-17, Version collector/0.1.6
===================================

 * fix for "on duplicate update" bug (themitchy)

 * make sure appId is stored in shared Uhura session (themitchy)

 * use uhura@stable (themitchy)

 * handle reconnect (themitchy)

 * store top functions into mysql top_calls table (Eugene Kaydalov)

 * Fix for missing session records (Stephen Belanger)


2013-05-22, Version collector/0.1.5
===================================

 * fix socket.io api (themitchy)

 * Move old Socket.IO interface to v0.1 folder and create v2 folder with Uhura interface (Stephen Belanger)


2013-05-15, Version collector/0.1.4
===================================

 * didn't need to be wrapped in getConnection (themitchy)

 * use runQuery instead of getConnection (themitchy)

 * debug logs, remove unnecessary getConnection call (themitchy)

 * separate debugging for data/server (themitchy)


2013-05-14, Version collector/0.1.3
===================================

 * appFinder module to search/create apps (themitchy)

 * add session id to data log (themitchy)


2013-04-25, Version collector/0.1.2
===================================

 * initial rest interface (themitchy)

 * route for establishing session (themitchy)

 * move data storage module into v1 dir (themitchy)

 * remove prototype stuff (themitchy)

 * wip: route loader for versioned api (themitchy)


2013-04-16, Version collector/0.1.1
===================================

 * move data storage calls into separate module (themitchy)

 * session store uses mysql pool (themitchy)

 * update mysql version for pooling (themitchy)


2013-04-09, Version collector/0.1.0
===================================

 * logging (themitchy)

 * Limit instance data to top 10 (Stephen Belanger)

 * fix saveTopFunctions (themitchy)

 * remove legacy stuff from collector (themitchy)

 * remove mongolab reference move insert to dataMan (themitchy)

 * added writing into session_track table (Eugene Kaydalov)

 * Instances data collection and serving (Stephen Belanger)

 * send new data to new mongo instance (themitchy)

 * update async module (themitchy)

 * store new data format for top functions (themitchy)

 * write session data to collector_sessions table (themitchy)

 * remove old session write (themitchy)

 * Switch to log From log_p (Jacob Groundwater)

 * Add NodeFly Analytics to Packages (Jacob Groundwater)

 * record session end and start (themitchy)

 * Use Collector Port from Config (Jacob Groundwater)

 * Fix Redis Configs (Jacob Groundwater)

 * Fix Redis Config (Jacob Groundwater)

 * Obtain Redis Config from Environment (Jacob Groundwater)

 * Use Redis-Backed Socket Sessions (Jacob Groundwater)

 * Use Trivial Round-Robin MySQL Connection Pool (Jacob Groundwater)

 * configure mongo to reconnect (themitchy)

 * store collector sessions on redis list (themitchy)

 * changed event name of topFunctions for backwards compatibility (themitchy)

 * Require parseInt for Environmentally Determined Ports (Jacob Groundwater)

 * Add NodeFly Metrics to Collector (Jacob Groundwater)

 * collector requires underscore (themitchy)

 * save express/http top functions (themitchy)

 * log tweaking (themitchy)

 * optionally profile from env (themitchy)

 * accept empty app and hostname (themitchy)

 * set frame based on time range use new log_p table (themitchy)

 * Add Alert Generator to Collector (Jacob Groundwater)

 * Fix Collector (Jacob Groundwater)

 * Move Alerts Server to Own Package (Jacob Groundwater)

 * Organize Alerts Module (Jacob Groundwater)

 * Add Alerts Framework to Collector (Jacob Groundwater)

 * refactor mongo api (themitchy)

 * add mysql calls to slowest functions (themitchy)

 * put async module back in (themitchy)

 * Fix Collector After Merge (Jacob Groundwater)

 * Disable Quiet Option for Supervisor (Jacob Groundwater)

 * Fix Merge Problem (Jacob Groundwater)

 * Surpress Debug Messages in Supervisor (Jacob Groundwater)

 * Switch From Forever to Foreman Process Management (Jacob Groundwater)

 * Watch for Changes with Forever (Jacob Groundwater)

 * Fix Server.js File in Collector (Jacob Groundwater)

 * Forever-ized NPM Startup Scripts (Jacob Groundwater)

 * Fix Exports Tests (Jacob Groundwater)

 * Add Test Support to All Packages (Jacob Groundwater)

 * Ignore NPM Debug Logs (Jacob Groundwater)

 * Reorganize into Modules (Jacob Groundwater)


2014-03-07, Version api/production
==================================



2014-03-07, Version api/0.2.4
=============================

 * Include demo app with any user (themitchy)

 * Remove noisy logs and fix style (themitchy)

 * Remove db update (themitchy)

 * Remove daily limit (themitchy)

 * API server now serves LoopBack readings (Salehen Shovon Rahman)

 * Separate app.use calls for each middleware. (themitchy)

 * Strip duration off of data. (themitchy)

 * lib: don't use express.bodyParser() (Ben Noordhuis)

 * lib: fix up whitespace errors (Ben Noordhuis)

 * Add callback for listen. (themitchy)

 * Print server address using server.address(). (Ben Noordhuis)

 * Avoid TypeError when SL_CORS_HOSTS is undefined. (Ben Noordhuis)

 * Convert lib/app.js to UNIX line endings. (Ben Noordhuis)

 * use session id to lookup heap profile data (themitchy)

 * line up data query to the whole minute (Eugene Kaydalov)

 * only sum conn_throughput (root)

 * make redisClient available to the rest of the application (themitchy)

 * have to sum conn_throughput metric, not avg it (eugene kaydalov)

 * npm: use git+ssh:// url for nodefly-common (Ben Noordhuis)

 * SLP-329 generic control channel route for any commands (themitchy)

 * bubble up session meta-data from 'data' column (themitchy)

 * Additional fix for SLP-298, get child apps for all routes (Andrew Martens)

 * Fix for SLP-298 (Andrew Martens)

 * The error logs are returned in reverse chronological order (Salehen Shovon Rahman)

 * Added a limit parameter. (Salehen Shovon Rahman)

 * password changes (Andrew Martens)

 * return 404 for cluster not found, return empty array when no rows in errors query (Andrew Martens)

 * dataHandler can return custom errors/statusCode instead of everything being 500 or 404 (Andrew Martens)

 * use hash for session_id in errors table (Andrew Martens)

 * fixed typo (Andrew Martens)

 * Added /cluster/:clusterId/errors (Andrew Martens)

 * Removed cookie domain except for prod/staging (Andrew Martens)

 * Add routes for the collector's new cluster control channel. (Michael Schoonmaker)

 * only limit cpu profile (themitchy)

 * Added sessionId to graphData for V2 (Andrew Martens)

 * Specify valid origins for CORS (Andrew Martens)

 * Remove unnecessary console.log (Andrew Martens)

 * Use cookies for .strongloop.com (Andrew Martens)

 * Removed unnecessary logging (Andrew Martens)

 * Fixing up graphData issues with frontend (Andrew Martens)

 * fixes for password change (Andrew Martens)

 * Added POST /users/me to update password (Andrew Martens)

 * Added user register/delete (Andrew Martens)

 * working call for /clusters/:clusterId/graphData (Andrew Martens)

 * Expose instance counts (Stephen Belanger)

 * Should be inclusive of start time, not end time. Otherwise we may miss a record that hasn't been created yet. (Stephen Belanger)

 * Minor changes to error reporting (Andrew Martens)

 * Fix instances range to go up to and INCLUDING end time (Stephen Belanger)

 * Added ping, get /clusters/:clusterId returns 404 when resource not found (Andrew Martens)

 * Refactoring; auth; initial graph data (Andrew Martens)

 * Moved database access into dataHelper.js (Andrew Martens)

 * additions to /v2/clusters (Andrew Martens)

 * doing /clusters with async.waterfall (Andrew Martens)

 * Proper repo this time (Andrew Martens)


2013-09-17, Version api/0.2.3
=============================

 * Massage the output format into something TimeSeries.js in the web frontend understands (Stephen Belanger)

 * add oracle support (Eugene Kaydalov)


2013-09-07, Version api/0.2.2
=============================

 * change column name to be backward compatible (Eugene Kaydalov)

 * fix bad string concat bug (Eugene Kaydalov)

 * change data query to use rollups v3 data structures (Eugene Kaydalov)

 * Re-add instances data as a new route. It got removed in the clustered graph data rewrite. (Stephen Belanger)

 * Make use of nodefly-common helper for test setup (Ryan Graham)

 * purge old unused mongo code (themitchy)


2013-07-25, Version api/0.2.1
=============================

 * valid package name (themitchy)

 * use strong-agent (themitchy)

 * use SUM for mq messages (themitchy)

 * set limit on profiler usage (themitchy)

 * use new top_calls tables (themitchy)

 * map correct object for strongmq counts (themitchy)

 * added support for top calls via session_id (Eugene Kaydalov)

 * make query by sessionId work (themitchy)

 * added support for session GET parameter (Eugene Kaydalov)

 * add support for 'pid' (using data2_X db tables) (Eugene Kaydalov)

 * update and retrieve status column (themitchy)

 * move core stuff above router middleware (themitchy)

 * use connection pool and accept sessionId instead of appId (themitchy)

 * remove debug log (themitchy)

 * update gitgnore and start script (themitchy)

 * Can now trigger profiler events on agents from API server (Stephen Belanger)


2013-06-21, Version api/0.2.0
=============================

 * un-hardcode appId (themitchy)

 * make sure tests exit (themitchy)

 * update tests (themitchy)

 * re-use top function query with bind (themitchy)

 * get top function data for time range from cluster tables (themitchy)

 * lock validator version (themitchy)

 * force a failed build in jenkins (themitchy)

 * different logging for tests (themitchy)

 * add db-migrate and restler for testing (themitchy)

 * db seeding and tests for api server (themitchy)

 * filter by metric/graph (themitchy)

 * all graph data is objects instead of arrays (themitchy)

 * send start for end if there was no new data (themitchy)

 * send last row ts for convenience (themitchy)

 * enable jsonp (themitchy)

 * I'm a dumbass (themitchy)

 * modify api server to use bucket tables (themitchy)

 * add support for rolled up data (Eugene Kaydalov)

 * only use cluster data (themitchy)

 * add 2 api calls for cluster support: getClusterAppId and getClusterData (Eugene Kaydalov)


2013-04-09, Version api/0.1.7
=============================



2013-04-09, Version api/0.1.0
=============================



2013-04-09, Version api/0.1.5
=============================



2013-04-09, Version api/0.1.4
=============================



2013-04-09, Version api/0.1.3
=============================



2013-04-09, Version api/0.1.2
=============================



2013-04-09, Version api/0.1.1
=============================



2013-04-09, Version api/0.1.6
=============================

 * Fixed conflicts (Stephen Belanger)

 * Change line type (Stephen Belanger)

 * timezone-less query (themitchy)

 * logging (themitchy)

 * timezone-proof query (themitchy)

 * make sure timestamp is utc (themitchy)

 * remove some debug (themitchy)

 * remove debug log (themitchy)

 * refactoring / cleanup (themitchy)

 * Limit instance data to top 10 (Stephen Belanger)

 * remove legacy stuff (themitchy)

 * Instances data collection and serving (Stephen Belanger)

 * update async module (themitchy)

 * Switch to log From log_p (Jacob Groundwater)

 * Add NodeFly Dependencies (Jacob Groundwater)

 * Add NodeFly Analytics to Packages (Jacob Groundwater)

 * Use Trivial Round-Robin MySQL Connection Pool (Jacob Groundwater)

 * Show Full Error (Jacob Groundwater)

 * update collection list for postgres topFunctions (themitchy)

 * renamed some functions to make backwards compatibility clearer (themitchy)

 * use time range to determine start of window for top functions (themitchy)

 * reduce/retrieve topFunctionts (themitchy)

 * close db handle no matter what (themitchy)

 * set frame based on time range use new log_p table (themitchy)

 * don't reduce series unless they need it (themitchy)

 * set minimum size on data series (themitchy)

 * support gzip (themitchy)

 * Add 'underscore' Dependency in 'apiserver' Package File (Jacob Groundwater)

 * memcache probes report queries (themitchy)

 * refactor mongo api (themitchy)

 * add mysql calls to slowest functions (themitchy)

 * fall back to row timestamp if real ts isn't there (themitchy)

 * new data format for times by tier (themitchy)

 * timers by tier. first take on 'in/out' support. mysql only (supermonster)

 * Disable Quiet Option for Supervisor (Jacob Groundwater)

 * Surpress Debug Messages in Supervisor (Jacob Groundwater)

 * Switch From Forever to Foreman Process Management (Jacob Groundwater)

 * Watch for Changes with Forever (Jacob Groundwater)

 * Forever-ized NPM Startup Scripts (Jacob Groundwater)

 * Fix Deprecated Express Usage (Jacob Groundwater)

 * Add Test Support to All Packages (Jacob Groundwater)

 * Ignore NPM Debug Logs (Jacob Groundwater)

 * Reorganize into Modules (Jacob Groundwater)


2014-02-13, Version agent/production
====================================



2014-02-13, Version agent/0.3.2
===============================

 * package.json: don't abort if node-gyp fails (Ben Noordhuis)

 * lib: make log message consistent with others (Sam Roberts)

 * package.json: depend on uhura ~0.1.1 (Ben Noordhuis)

 * lib: use uhura.Client#unref() (Ben Noordhuis)

 * package.json: bump version to v0.3.1 (Ben Noordhuis)

 * Revert "src: make backwards compatible with v0.8" (Ben Noordhuis)


2014-02-06, Version agent/0.2.22
================================

 * src: plug gcinfo memory leak (Ben Noordhuis)

 * src: make backwards compatible with v0.8 (Ben Noordhuis)

 * lib: emit caught error if collector times out (Ben Noordhuis)

 * lib: unref child process handle (Ben Noordhuis)

 * lib: unref node-measured timer (Ben Noordhuis)

 * test: replace mocha with node-tap (Ben Noordhuis)

 * package.json: convert to UNIX line endings (Ben Noordhuis)

 * Do not export an empty object as strong-agent (Sam Roberts)

 * test: drop dependency on request module (Ben Noordhuis)

 * test: fix tiers collector tests (Ben Noordhuis)

 * test: remove develop collector test (Ben Noordhuis)

 * test: remove STRONGLOOP_COLLECTOR test (Ben Noordhuis)

 * test: fix STRONGLOOP_COLLECTOR test (Ben Noordhuis)

 * lib: fix collector filtering in http client probe (Ben Noordhuis)


2014-02-04, Version agent/0.2.21
================================

 * Send confirmation of profiler stop/start (themitchy)

 * Fix collector configs. (themitchy)

 * Replace tabs with spaces, missing semicolon. (themitchy)

 * npmignore: ignore build/editor/test artifacts (Ben Noordhuis)

 * lib: share strong-agent add-on loading logic (Ben Noordhuis)

 * test: add two basic heap profiler tests (Ben Noordhuis)

 * src: tidy up node.js version checks (Ben Noordhuis)

 * test: drop bad assumption from cpu profiler test (Ben Noordhuis)

 * src: integrate gcinfo module (Ben Noordhuis)

 * src: add code lint checker (Ben Noordhuis)

 * src: guard against NULL CpuProfile (Ben Noordhuis)

 * src: turn profiler into general purpose module (Ben Noordhuis)

 * lib: don't start profiling if its already started (Sam Roberts)

 * lib: don't log cluster-control activity (Sam Roberts)

 * lib: prefix console output with strong-agent (Sam Roberts)

 * lib: when not configured, explain how to fix (Sam Roberts)

 * lib: prefix log message with strong-agent (Sam Roberts)

 * lib: inform user of dashboard location (Sam Roberts)

 * lib: identify app name and host that is profiled (Sam Roberts)

 * lib: cluster updates faster, and more informatively (Sam Roberts)

 * npm: replace memwatch dep with strong-memwatch (Ben Noordhuis)

 * test: don't use hard-coded port numbers (Ben Noordhuis)

 * Minor rewording and add link to official docs. (Rand McKinney)

 * lib, src: add v0.10/v0.12 cpu profiler bindings (Ben Noordhuis)

 * lib: consistently log cluster-control version (Sam Roberts)

 * test: use quiet mode in tests (Sam Roberts)

 * lib: report startup messages as info (Sam Roberts)

 * lib: add nf.info(), and quiet option to disable (Sam Roberts)

 * profile: allow options to be null or undefined (Sam Roberts)

 * lib: log lack of dependencies only when profiling (Sam Roberts)

 * npm: update author and homepage fields (Ben Noordhuis)

 * lib: remove unused express-server.js file (Sam Roberts)

 * lib: fix line and endings and trailing whitespace (Ben Noordhuis)


2014-01-14, Version agent/0.2.20
================================

 * lib/probes: intercept http 'upgrade' event (Ben Noordhuis)

 * Move loopback from dependencies to devDependencies (Miroslav Bajtoš)

 * Added a separate tier for LoopBack (Salehen Shovon Rahman)

 * test: don't call gc() unconditionally (Ben Noordhuis)

 * test: add timer/socket unref regression test (Ben Noordhuis)

 * lib: fix hanging process, unref uhura socket (Ben Noordhuis)

 * lib: fix hanging process, unref setInterval timers (Ben Noordhuis)

 * Remove 'env' from scripts.test to simplify CI (Ryan Graham)

 * Replace blanket with istanbul for coverage (Ryan Graham)

 * Add timeout overrides to individual tests (Ryan Graham)

 * testing locally was timing out (themitchy)

 * Can now detect if Loopback is present (Salehen Shovon Rahman)


2013-12-05, Version agent/0.2.19
================================

 * bump version (themitchy)

 * SLP-324 respond to cluster terminate and shutdown commands (themitchy)

 * SLP-323 respond to cluster:restart-all (themitchy)

 * SLP-322 store number of cpus (themitchy)

 * store workers for older cluster control as well (themitchy)

 * s/\t/  /g (themitchy)

 * override lookup path for module (for dev setups using "npm link") (themitchy)

 * SLP-321 rename options to clusterInfo (it's not just options),  send worker list (themitchy)

 * Move 'request' to devDependencies (Ryan Graham)


2013-11-01, Version agent/0.2.18
================================

 * bump version (themitchy)

 * fix data validation (themitchy)

 * add some debug options (themitchy)


2013-10-30, Version agent/0.2.17
================================

 * hot fix for backwards compatibility with strong-cluster-control < 0.2.0 (themitchy)


2013-10-29, Version agent/0.2.16
================================

 * remove console log (themitchy)

 * bump version (themitchy)

 * Don't monkey-patch app.listen() as it won't get called for http.createServer(app).listen(...) (Stephen Belanger)

 * Remove console.log from top-level error reporter (Stephen Belanger)

 * Fix broken test (Stephen Belanger)

 * Change event name away from error. That can blow stuff up... (Stephen Belanger)

 * Catch express errors per-route, with domain wrapper to forward the errors (Stephen Belanger)

 * Send errors to collector (Stephen Belanger)

 * Add DEVELOP doc for contributors to StrongAgent and StrongOps. (Michael Schoonmaker)

 * initial commit. unit test for metrics (eugene kaydalov)

 * let STRONGLOOP_COLLECTOR override config (themitchy)

 * test for overriding the collector host (themitchy)

 * allow transport to init without connecting (for tests) (themitchy)

 * using isFinite() to test cpu values (Andrew Martens)

 * tabs/spaces, removed unnecessary console.log (Andrew Martens)

 * moved array_sum to proc.js (Andrew Martens)

 * moved linux procfs code to proc.js (Andrew Martens)

 * made code more consistent (Andrew Martens)

 * exclude node_module in test coverage (emma wu)

 * fixed blanket pattern (emmawu)

 * Update cluster control channel to use public methods. (Michael Schoonmaker)

 * Add a cluster control channel. (Michael Schoonmaker)

 * Put memwatch.HeapDiff on a timer, as it forces a silent GC and will prevent the stats event from ever getting called. (Stephen Belanger)

 * Rename some uhura references to collector (Ryan Graham)

 * Make tests pass by accepting config options (Ryan Graham)

 * Make tests fail by using desired API (Ryan Graham)


2013-09-12, Version agent/0.2.15
================================

 * bump version (themitchy)

 * support NODEFLY_APPLICATION_KEY as backup (themitchy)

 * sanitization fix needs to be done from develop, master is behind (Stephen Belanger)

 * Fix conflicts (Stephen Belanger)

 * More fixes to mongodb sanitization (Stephen Belanger)

 * Version bump (Stephen Belanger)

 * Fix conflicts in package.json (Stephen Belanger)

 * Fix mongodb sanitization sometimes complaining about null values (Stephen Belanger)

 * support env var STRONGLOOP_KEY as well because heroku add-ons have hard prefix rules (themitchy)

 * Change agent to search for userKey in strongloop.json and update docs to explain cascading config search (Stephen Belanger)

 * Run first memory profile step right away (Stephen Belanger)

 * SLP-221 add repository url (themitchy)

 * missed last version bump (themitchy)

 * s/\t/  /g (themitchy)

 * Added ps params for freebsd cpu info (Andrew Martens)

 * Parameterization for parsePs() (Andrew Martens)

 * Relocated code to parse output of ps (Andrew Martens)

 * Fix for global.nodefly undefined (Stephen Belanger)

 * Still need to normalize CPU values to +ve (Andrew Martens)

 * moved CPU ptime calc for linux to fix logic bug (Andrew Martens)

 * handle getConnections() err (themitchy)


2013-09-04, Version agent/0.2.10
================================



2013-08-30, Version agent/0.2.9
===============================

 * No seriously, CPU values should be 0-100 (Andrew Martens)

 * bump version (themitchy)

 * Also force undefined CPU readings to 0 (Andrew Martens)

 * Update README.md (Mitch Granger)

 * refer to docs if not configured (themitchy)

 * Relocated negative cpu value fix for unit testing (Andrew Martens)

 * dependency on uvmon should be 'stable' not 'latest' (Andrew Martens)

 * Ensuring that CPU % values are never negative (Andrew Martens)

 * separated execute from rollback,commit to catch the command for rollback,commit (Eugene Kaydalov)

 * change tiers from 15 to 60 seconds (Eugene Kaydalov)

 * protect if app is not a web service (Eugene Kaydalov)

 * added around() method (Eugene Kaydalov)

 * initial commit, fails on line 56 (Eugene Kaydalov)

 * turfing redundant/failing test (themitchy)

 * Add a way to disabling colour on Jenkins runs (Ryan Graham)

 * Fix references broken by rename (Ryan Graham)

 * Rename lib/transport/uhura.js lib/transport.js (Ryan Graham)

 * Remove old transport implementation (Ryan Graham)

 * Override test reporter via $REPORTER env variable (Ryan Graham)

 * initial docs.json (themitchy)

 * Fixed childrenCount in cpu profiler test (Andrew Martens)

 * Use random ephemeral ports for tiers tests (Ryan Graham)

 * Use randome ephemeral port for sanity tests (Ryan Graham)

 * Disconnect from Uhura server on agent stop (Ryan Graham)

 * Remove trailing whitespace (Ryan Graham)

 * Add passing stop() (Ryan Graham)

 * Add test for stop() method existing (Ryan Graham)

 * Add option for testing subset of tests (Ryan Graham)

 * Make cpu-profiler tests more explicit (Ryan Graham)

 * Fix tiers tests to work with new data format (Stephen Belanger)

 * Added StrongLoop license (Andrew Martens)

 * Fix conflicts (Stephen Belanger)

 * Use new cpu profiler (Stephen Belanger)

 * Prevent failing test from cascading and interfering with other tests (Ryan Graham)

 * Add links to leveldown probe (Ryan Graham)

 * Fix tiers tests and tiers data event (Stephen Belanger)

 * Safer stubbing (Ryan Graham)

 * TODO for node-measured -> measured migration (Ryan Graham)

 * Make tiers tests runnable on their own (Ryan Graham)

 * Teach jshint about Mocha globals (Ryan Graham)

 * Shorten line, make jshint happier (Ryan Graham)

 * Implement #batch(), passing tests (Ryan Graham)

 * Add failing spec for instrumenting #batch() (Ryan Graham)

 * Further splitting up of leveldown tests (Ryan Graham)

 * Refactor leveldown tests to assert less per test (Ryan Graham)

 * Replace custom spy with sinon (Ryan Graham)

 * Add sinon module for spies/mocks in tests (Ryan Graham)

 * fixjsstyle test/leveldown.js (Ryan Graham)

 * Further DRYing of leveldown test (Ryan Graham)

 * Refactor leveldown tests to improve testability (Ryan Graham)

 * Improve correctness of .destroy/.repair test (Ryan Graham)

 * DRY up leveldown tests some more (Ryan Graham)

 * Consolidate leveldown mocking, improve test focus (Ryan Graham)

 * CPU profiler unit test (Andrew Martens)

 * Convert from tabs to 2 spaces (Ryan Graham)

 * Use '' for strings (Ryan Graham)

 * Simplify agent sanity tests (Ryan Graham)

 * Make note about potential performance problem (Ryan Graham)

 * Implement basic instrumentation of iterators (Ryan Graham)

 * Add failing tests for instrumentation of iterators (Ryan Graham)

 * Refactor put/get/del instrumentation (Ryan Graham)

 * Implement a basic mock/spy pattern to test leveldown instrumentation (Ryan Graham)

 * Fix bug in tiers conversion to external measured package (Stephen Belanger)

 * Add mongo sanitization and convert tiers to use external measured package (Stephen Belanger)

 * Tidy up names in tests (Ryan Graham)

 * Cleanup of leveldown probe (Ryan Graham)

 * More rough tests (Ryan Graham)

 * Initial leveldown probe tests (Ryan Graham)

 * camelCase (Ryan Graham)

 * fixjsstyle lib/wrapping_probes/leveldown.js (Ryan Graham)

 * Convert tabs to 2 spaces (Ryan Graham)

 * Initial work on probe that wraps leveldown (Ryan Graham)

 * Add support for probes that wrap modules intead of modify them (Ryan Graham)

 * Fixed CPU usage for 64-bit Solaris/SmartOS (Andrew Martens)

 * Add createSession validation to sanity tests (Ryan Graham)

 * Simplify sanity test (Ryan Graham)

 * Update tiers test to evaluate within uhura server, rather than intercepting transport (Stephen Belanger)

 * Make sure agent transport is disconnected (Ryan Graham)

 * Document oddity (Ryan Graham)

 * this.currentTest seems to be version specific (Ryan Graham)

 * Add missing dev dependency on express (Ryan Graham)

 * Close fake collector's server (Ryan Graham)

 * Fix Conflicts (Stephen Belanger)

 * Plug some leaks and add tiers test (Stephen Belanger)

 * Refactor test to more correctly use before/afterEach (Ryan Graham)

 * Sanity check for agent connecting to collector (Ryan Graham)

 * Clean up tests (Ryan Graham)

 * Working coverage reporting (Ryan Graham)

 * Make cpuinfo.cpuutil() tests work (Ryan Graham)

 * Add passing sanity specs (Ryan Graham)

 * Convert failing vows tests to failing mocha specs (Ryan Graham)

 * Use mocha for tests (with blanket for coverage) (Ryan Graham)

 * remove timekit dependency and direct use of pre-packaged node-measuredfork (Eugene Kaydalov)

 * dependency nodefly-v8-profiler now uses 'stable' instead of 'latest' (Andrew Martens)


2013-08-09, Version agent/0.2.7
===============================

 * bump version (themitchy)

 * set value instead of append (it could be an object) (themitchy)

 * missed package update (themitchy)

 * getConnections fix (themitchy)


2013-07-31, Version agent/0.2.6
===============================

 * all binary modules are now optional dependencies (Andrew Martens)

 * Added riak-js probe (Andrew Martens)


2013-07-25, Version agent/0.2.5
===============================

 * restore profiler, bump version (themitchy)


2013-07-24, Version agent/0.2.4
===============================

 * bump version (themitchy)

 * rollback to connections instead of getConnections() because the proxy.js would fail on it (eugene kaydalov)

 * change calculated value from micro to milliseconds (Eugene Kaydalov)

 * time to timer rename (Eugene Kaydalov)

 * remove a call to stackTrace() (Eugene Kaydalov)

 * final cleanup before release (Eugene Kaydalov)

 * initial cleanup. several probes left (eugene kaydalov)


2013-07-22, Version agent/0.2.3
===============================

 * bump version (themitchy)

 * Shut up node, you're drunk (Stephen Belanger)

 * change user-facing names to strong* (themitchy)

 * streams "re-patch" themselves when "on" is called so we'll make sure that patch is proxy'd (themitchy)


2013-07-18, Version agent/0.2.2
===============================



2013-07-18, Version agent/1.1.0
===============================

 * bump version (themitchy)

 * capture tiers no matter what (themitchy)

 * restore dummy proxy on setTimeout and nextTick (themitchy)


2013-07-18, Version agent/0.2.1
===============================

 * don't start timers if no config provided(agent not started) (themitchy)

 * Enable memory profiler in agent (Stephen Belanger)


2013-07-18, Version agent/0.2.0
===============================

 * Add count tracking to other probes (Stephen Belanger)

 * Slow down callCounts emit frequency (Stephen Belanger)

 * graph node probably shouldn't be in there... (Stephen Belanger)

 * Don't need that console.log... (Stephen Belanger)

 * Added sl-mq/strong-mq probe (Stephen Belanger)

 * Bump version (Stephen Belanger)

 * Removed lib/queue.js in favour of new metrics.  Piggybacked new uvmon data onto old queue metrics. (Andrew Martens)

 * minor data format change; uvmon points to bin repo (Andrew Martens)

 * Fixed conflicts (Stephen Belanger)

 * Restore tier interval to 15 seconds (Stephen Belanger)

 * Version bump (Stephen Belanger)

 * Fix conflicts (Stephen Belanger)

 * Increase tier reporting interval (Stephen Belanger)

 * Added ensureConfig to cascade load config data and ensure the agent does not run without valid configs (Stephen Belanger)

 * Loop monitor tie-in with nodefly-uvmon (Andrew Martens)

 * Forgot the profilers...whoops. (Stephen Belanger)

 * remove catcher which does nothing (Eugene Kaydalov)

 * remove garbage that gets packaged into npm (Eugene Kaydalov)

 * Can now trigger profiler events on agents from API server (Stephen Belanger)


2013-06-13, Version agent/0.1.44
================================



2013-06-13, Version agent/0.1.43
================================

 * use uhura@stable (themitchy)

 * bump version (themitchy)

 * add verbose logging (themitchy)


2013-05-28, Version agent/0.1.42
================================

 * Fix missing agentVersion (Stephen Belanger)


2013-05-27, Version agent/0.1.41
================================

 * bump version (themitchy)

 * update package.json to use uhura (themitchy)

 * added some debug logs (themitchy)

 * Preliminary uhura integration (Stephen Belanger)


2013-04-25, Version agent/0.1.39
================================

 * remove socket.io-client dependancy, add request module (themitchy)


2013-04-25, Version agent/0.1.38
================================

 * bump version (themitchy)

 * replace socket.io with http transport (themitchy)


2013-04-19, Version agent/0.1.40
================================



2013-04-19, Version agent/0.1.37
================================

 * update package (themitchy)

 * Fix redis.auth (Stephen Belanger)

 * Absolute path fix (Stephen Belanger)

 * bin/nodefly fix (Stephen Belanger)

 * Forgot to add to binary list in package.json (Stephen Belanger)

 * Added nodefly binary (Stephen Belanger)


2013-04-15, Version agent/0.1.36
================================

 * bump versions (themitchy)

 * Minor fix (Stephen Belanger)

 * Redis fix (Stephen Belanger)


2013-04-10, Version agent/0.1.35
================================

 * version update (themitchy)

 * fixed missing event (themitchy)

 * better debug log (themitchy)

 * instance monitoring fixes (Stephen Belanger)

 * Make memwatch optional (Stephen Belanger)

 * Added instances stuff (Stephen Belanger)


2013-03-25, Version agent/0.1.34
================================

 * nodefly-mark had been removed from package.json (themitchy)

 * require correct gcinfo (themitchy)


2013-03-18, Version agent/0.1.32
================================

 * back to regular gc-info removed memwatch dep (themitchy)


2013-03-12, Version agent/0.1.31
================================

 * switch to gcinfo2 until we get publish access to gcinfo (themitchy)

 * update module version (themitchy)

 * handle request hops and keep transaction (themitchy)

 * not proxying EE for now (themitchy)

 * updating version (themitchy)

 * add debug to socket module (themitchy)

 * check if transport is open before sending (themitchy)

 * remove some debug (themitchy)

 * added debug (themitchy)

 * updating package version (themitchy)

 * parodying the event emitter directly causes crashes for some (themitchy)

 * formate mongo query better (themitchy)

 * version bump (themitchy)

 * ensure events are passed context (themitchy)

 * pass called method down to hook (themitchy)

 * pass ws lib errors to socket error handler (themitchy)

 * Version Bump (Jacob Groundwater)

 * Change Linux CPU Calculation to Async (Jacob Groundwater)

 * update version (themitchy)

 * fix outgoing http probes (themitchy)

 * update package (themitchy)

 * send graph with top functions if present (themitchy)

 * no hook after tick(for now) (themitchy)

 * graph outgoing HTTP (themitchy)

 * store graph with top routes (themitchy)

 * quick fix for us taking global.config (themitchy)

 * graph data for probes (themitchy)

 * helper for graph data (themitchy)

 * set up closures for graph data (themitchy)

 * formatting (themitchy)

 * throw in a stack trace if it's there (themitchy)

 * update package version (themitchy)

 * socketIO error could be a string… or not (themitchy)

 * strict checking for probe (themitchy)


2013-01-22, Version agent/0.1.20
================================

 * First release!
