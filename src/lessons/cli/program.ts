// Python program for the command-line lesson: a small pipeline engine. Text
// flows through a series of filters joined by "|", just like a real shell.
export const CLI_PROGRAM = String.raw`
def _apply(cmd, args, data):
    if cmd == 'cat':
        return data
    if cmd == 'grep':
        invert = '-v' in args
        ignore = '-i' in args
        pats = [a for a in args if not a.startswith('-')]
        pat = pats[0] if pats else ''
        def match(line):
            hay = line.lower() if ignore else line
            needle = pat.lower() if ignore else pat
            found = needle in hay
            return (not found) if invert else found
        return [l for l in data if match(l)]
    if cmd == 'sort':
        rev = '-r' in args
        numeric = '-n' in args
        key = (lambda s: float(s)) if numeric else (lambda s: s)
        try:
            return sorted(data, key=key, reverse=rev)
        except ValueError:
            return sorted(data, reverse=rev)
    if cmd == 'uniq':
        count = '-c' in args
        out = []
        prev = object()
        n = 0
        for l in data:
            if l == prev:
                n += 1
            else:
                if n:
                    out.append(('%7d ' % n) + prev if count else prev)
                prev = l
                n = 1
        if n:
            out.append(('%7d ' % n) + prev if count else prev)
        return out
    if cmd == 'wc':
        if '-l' in args:
            return [str(len(data))]
        text = '\n'.join(data)
        return ['%d %d %d' % (len(data), len(text.split()), len(text))]
    if cmd == 'head':
        n = 10
        if '-n' in args:
            i = args.index('-n')
            if i + 1 < len(args):
                n = int(args[i + 1])
        return data[:n]
    if cmd == 'tail':
        n = 10
        if '-n' in args:
            i = args.index('-n')
            if i + 1 < len(args):
                n = int(args[i + 1])
        return data[-n:]
    if cmd == 'nl':
        return ['%6d  %s' % (i + 1, l) for i, l in enumerate(data)]
    return ['(unknown command: ' + cmd + ')']


def run_pipeline(text, pipeline):
    data = text.split('\n')
    stages = [s.strip() for s in pipeline.split('|') if s.strip()]
    for st in stages:
        parts = st.split()
        if not parts:
            continue
        try:
            data = _apply(parts[0], parts[1:], data)
        except Exception as e:
            return 'error in "' + st + '": ' + str(e)
    return '\n'.join(data)
`
