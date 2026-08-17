// Python program executed inside Pyodide. It runs a real discrete-event CPU
// scheduling simulation (FCFS, non-preemptive SJF, and Round Robin) and returns
// a Gantt timeline plus per-process and average metrics as JSON.
export const PROCESS_PROGRAM = String.raw`
import json
from collections import deque


def _fcfs(procs):
    time = 0
    timeline = []
    done = {}
    for p in sorted(procs, key=lambda p: (p['arrival'], p['pid'])):
        if time < p['arrival']:
            timeline.append({'pid': 'idle', 'start': time, 'end': p['arrival']})
            time = p['arrival']
        start = time
        time += p['burst']
        timeline.append({'pid': p['pid'], 'start': start, 'end': time})
        done[p['pid']] = time
    return timeline, done


def _sjf(procs):
    time = 0
    timeline = []
    done = {}
    pending = list(procs)
    while pending:
        avail = [p for p in pending if p['arrival'] <= time]
        if not avail:
            nxt = min(p['arrival'] for p in pending)
            timeline.append({'pid': 'idle', 'start': time, 'end': nxt})
            time = nxt
            continue
        p = min(avail, key=lambda p: (p['burst'], p['arrival'], p['pid']))
        start = time
        time += p['burst']
        timeline.append({'pid': p['pid'], 'start': start, 'end': time})
        done[p['pid']] = time
        pending.remove(p)
    return timeline, done


def _rr(procs, quantum):
    quantum = max(1, int(quantum))
    order = sorted(procs, key=lambda p: (p['arrival'], p['pid']))
    rem = {p['pid']: p['burst'] for p in procs}
    time = 0
    timeline = []
    done = {}
    q = deque()
    idx = 0
    total = len(procs)
    while idx < len(order) and order[idx]['arrival'] <= time:
        q.append(order[idx]['pid'])
        idx += 1
    while len(done) < total:
        if not q:
            if idx < len(order):
                nxt = order[idx]['arrival']
                if nxt > time:
                    timeline.append({'pid': 'idle', 'start': time, 'end': nxt})
                    time = nxt
                while idx < len(order) and order[idx]['arrival'] <= time:
                    q.append(order[idx]['pid'])
                    idx += 1
                continue
            break
        pid = q.popleft()
        run = min(quantum, rem[pid])
        start = time
        time += run
        rem[pid] -= run
        if timeline and timeline[-1]['pid'] == pid and timeline[-1]['end'] == start:
            timeline[-1]['end'] = time
        else:
            timeline.append({'pid': pid, 'start': start, 'end': time})
        while idx < len(order) and order[idx]['arrival'] <= time:
            q.append(order[idx]['pid'])
            idx += 1
        if rem[pid] > 0:
            q.append(pid)
        else:
            done[pid] = time
    return timeline, done


def simulate(procs_json, algo, quantum=2):
    procs = json.loads(procs_json)
    procs = [{'pid': str(p['pid']), 'arrival': int(p['arrival']), 'burst': int(p['burst'])}
             for p in procs if int(p['burst']) > 0]
    if not procs:
        return json.dumps({'timeline': [], 'metrics': [], 'avg_waiting': 0,
                           'avg_turnaround': 0, 'makespan': 0})
    if algo == 'fcfs':
        timeline, done = _fcfs(procs)
    elif algo == 'sjf':
        timeline, done = _sjf(procs)
    else:
        timeline, done = _rr(procs, quantum)

    metrics = []
    for p in sorted(procs, key=lambda p: p['pid']):
        completion = done[p['pid']]
        turnaround = completion - p['arrival']
        waiting = turnaround - p['burst']
        metrics.append({
            'pid': p['pid'], 'arrival': p['arrival'], 'burst': p['burst'],
            'completion': completion, 'turnaround': turnaround, 'waiting': waiting,
        })
    n = len(metrics)
    avg_waiting = round(sum(m['waiting'] for m in metrics) / n, 2)
    avg_turnaround = round(sum(m['turnaround'] for m in metrics) / n, 2)
    makespan = max((s['end'] for s in timeline), default=0)
    return json.dumps({
        'timeline': timeline, 'metrics': metrics,
        'avg_waiting': avg_waiting, 'avg_turnaround': avg_turnaround,
        'makespan': makespan,
    })
`
