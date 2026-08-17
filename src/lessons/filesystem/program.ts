// Python program executed inside Pyodide. It implements a tiny Unix-like shell
// and a Python REPL that both operate on Pyodide's REAL in-browser filesystem
// (Emscripten MEMFS). Nothing here is faked — `os`, `open`, permissions and
// inodes are genuine CPython calls running against a real virtual disk.
//
// NOTE: this string is embedded in a JS template literal, so backslashes that
// Python should see (e.g. "\n") are written as "\\n".
export const FILESYSTEM_PROGRAM = String.raw`
import os, json, shlex, stat as statmod, shutil, io, contextlib, traceback

STATE = {'cwd': '/home/dev'}

HELP = """Available commands:
  pwd                 print working directory
  ls [-l] [path]      list directory contents
  cd [path]           change directory
  cat <file>          print file contents
  mkdir [-p] <dir>    create a directory
  touch <file>        create an empty file / update timestamp
  echo <text> [> f]   print text (or write/append to a file with > / >>)
  rm [-r] <path>      remove a file or directory
  tree [path]         show the directory tree
  stat <path>         show inode / size / permissions
  clear               clear the terminal
  help                show this help
Tip: switch to the Python tab to drive the same filesystem with real code."""


def _resolve(path):
    if not path:
        return STATE['cwd']
    if path.startswith('/'):
        p = path
    else:
        p = os.path.normpath(os.path.join(STATE['cwd'], path))
    return p or '/'


def _mode_str(path):
    st = os.stat(path)
    mode = st.st_mode
    is_dir = statmod.S_ISDIR(mode)
    bits = [
        (statmod.S_IRUSR, 'r'), (statmod.S_IWUSR, 'w'), (statmod.S_IXUSR, 'x'),
        (statmod.S_IRGRP, 'r'), (statmod.S_IWGRP, 'w'), (statmod.S_IXGRP, 'x'),
        (statmod.S_IROTH, 'r'), (statmod.S_IWOTH, 'w'), (statmod.S_IXOTH, 'x'),
    ]
    s = ''.join(ch if mode & flag else '-' for flag, ch in bits)
    return ('d' if is_dir else '-') + s


def _ls(args):
    long = False
    paths = []
    for a in args:
        if a.startswith('-'):
            if 'l' in a:
                long = True
        else:
            paths.append(a)
    raw = paths[0] if paths else STATE['cwd']
    target = _resolve(raw)
    if not os.path.exists(target):
        return 'ls: ' + raw + ': No such file or directory'
    if os.path.isdir(target):
        entries = sorted(os.listdir(target))
        base = target
    else:
        entries = [os.path.basename(target)]
        base = os.path.dirname(target)
    if long:
        lines = []
        for e in entries:
            full = os.path.join(base, e)
            suffix = '/' if os.path.isdir(full) else ''
            lines.append('%s %6d  %s%s' % (_mode_str(full), os.path.getsize(full), e, suffix))
        return '\n'.join(lines)
    return '  '.join(e + ('/' if os.path.isdir(os.path.join(base, e)) else '') for e in entries)


def _cd(args):
    raw = args[0] if args else '/home/dev'
    target = _resolve(raw)
    if not os.path.exists(target):
        return 'cd: ' + raw + ': No such file or directory'
    if not os.path.isdir(target):
        return 'cd: ' + raw + ': Not a directory'
    STATE['cwd'] = target
    return ''


def _cat(args):
    if not args:
        return 'cat: missing file operand'
    outs = []
    for a in args:
        p = _resolve(a)
        if not os.path.exists(p):
            outs.append('cat: ' + a + ': No such file or directory')
        elif os.path.isdir(p):
            outs.append('cat: ' + a + ': Is a directory')
        else:
            with open(p) as f:
                outs.append(f.read().rstrip('\n'))
    return '\n'.join(outs)


def _mkdir(args):
    p_flag = any(a == '-p' for a in args)
    dirs = [a for a in args if not a.startswith('-')]
    if not dirs:
        return 'mkdir: missing operand'
    for d in dirs:
        path = _resolve(d)
        try:
            if p_flag:
                os.makedirs(path, exist_ok=True)
            else:
                os.mkdir(path)
        except FileExistsError:
            return 'mkdir: ' + d + ': File exists'
        except FileNotFoundError:
            return 'mkdir: ' + d + ": No such file or directory (try 'mkdir -p')"
    return ''


def _touch(args):
    files = [a for a in args if not a.startswith('-')]
    if not files:
        return 'touch: missing file operand'
    for f_ in files:
        p = _resolve(f_)
        try:
            with open(p, 'a'):
                os.utime(p, None)
        except FileNotFoundError:
            return 'touch: ' + f_ + ': No such file or directory'
    return ''


def _rm(args):
    recursive = any(a.startswith('-') and ('r' in a or 'R' in a) for a in args)
    force = any(a.startswith('-') and 'f' in a for a in args)
    targets = [a for a in args if not a.startswith('-')]
    if not targets:
        return 'rm: missing operand'
    for t in targets:
        p = _resolve(t)
        if not os.path.exists(p):
            if force:
                continue
            return 'rm: ' + t + ': No such file or directory'
        if os.path.isdir(p):
            if recursive:
                shutil.rmtree(p)
            else:
                return 'rm: ' + t + ': is a directory (use -r)'
        else:
            os.remove(p)
    return ''


def _tree_cmd(args):
    raw = args[0] if args else STATE['cwd']
    root = _resolve(raw)
    if not os.path.exists(root):
        return 'tree: ' + raw + ': No such file or directory'
    lines = [os.path.basename(root) or '/']
    def walk(d, prefix=''):
        entries = sorted(os.listdir(d))
        for i, e in enumerate(entries):
            full = os.path.join(d, e)
            last = i == len(entries) - 1
            conn = '\u2514\u2500\u2500 ' if last else '\u251c\u2500\u2500 '
            lines.append(prefix + conn + e + ('/' if os.path.isdir(full) else ''))
            if os.path.isdir(full):
                walk(full, prefix + ('    ' if last else '\u2502   '))
    if os.path.isdir(root):
        walk(root)
    return '\n'.join(lines)


def _stat(args):
    if not args:
        return 'stat: missing operand'
    p = _resolve(args[0])
    if not os.path.exists(p):
        return 'stat: ' + args[0] + ': No such file or directory'
    st = os.stat(p)
    kind = 'directory' if os.path.isdir(p) else 'regular file'
    return ('  File: ' + p + '\n'
            '  Type: ' + kind + '\n'
            '  Size: ' + str(st.st_size) + ' bytes\n'
            '  Mode: ' + _mode_str(p) + '\n'
            ' Inode: ' + str(st.st_ino))


def _run(cmd, args):
    if cmd == 'pwd':
        return STATE['cwd']
    if cmd == 'whoami':
        return 'dev'
    if cmd == 'help':
        return HELP
    if cmd == 'echo':
        return ' '.join(args)
    if cmd == 'ls':
        return _ls(args)
    if cmd == 'cd':
        return _cd(args)
    if cmd == 'cat':
        return _cat(args)
    if cmd == 'mkdir':
        return _mkdir(args)
    if cmd == 'touch':
        return _touch(args)
    if cmd == 'rm':
        return _rm(args)
    if cmd == 'tree':
        return _tree_cmd(args)
    if cmd == 'stat':
        return _stat(args)
    return cmd + ": command not found (try 'help')"


def shell(cmdline):
    cmdline = (cmdline or '').strip()
    if not cmdline:
        return ''
    redirect = None
    target = None
    if '>>' in cmdline:
        left, right = cmdline.split('>>', 1)
        redirect, target, cmdline = 'append', right.strip(), left.strip()
    elif '>' in cmdline:
        left, right = cmdline.split('>', 1)
        redirect, target, cmdline = 'write', right.strip(), left.strip()
    try:
        parts = shlex.split(cmdline)
    except ValueError as e:
        return 'parse error: ' + str(e)
    if not parts:
        return ''
    try:
        out = _run(parts[0], parts[1:])
        if redirect and target:
            tpath = _resolve(target)
            mode = 'a' if redirect == 'append' else 'w'
            with open(tpath, mode) as f:
                f.write(out + ('\n' if out and not out.endswith('\n') else ''))
            return ''
        return out
    except Exception as e:
        return 'error: ' + str(e)


def run_py(code):
    # Keep the Python cwd in sync with the shell so relative paths behave the same.
    try:
        os.chdir(STATE['cwd'])
    except Exception:
        pass
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
            try:
                result = eval(compile(code, '<repl>', 'eval'), globals())
                if result is not None:
                    print(repr(result))
            except SyntaxError:
                exec(compile(code, '<repl>', 'exec'), globals())
    except Exception:
        buf.write(traceback.format_exc())
    STATE['cwd'] = os.getcwd()
    return buf.getvalue().rstrip('\n')


def fs_tree(root='/home/dev'):
    def node(p):
        is_dir = os.path.isdir(p)
        d = {
            'name': os.path.basename(p) or '/',
            'path': p,
            'type': 'dir' if is_dir else 'file',
            'perms': _mode_str(p),
            'size': os.path.getsize(p),
        }
        if is_dir:
            d['children'] = [node(os.path.join(p, e)) for e in sorted(os.listdir(p))]
        return d
    return json.dumps({'cwd': STATE['cwd'], 'tree': node(root)})


def _seed():
    for d in ['/home/dev/projects/webapp/src', '/home/dev/notes', '/home/dev/.config']:
        os.makedirs(d, exist_ok=True)
    files = {
        '/home/dev/README.md': '# Developer Basics sandbox\n\nThis is a REAL filesystem running in your browser via Python (Pyodide).\nEverything you type actually creates and reads files.\n\nTry:  ls -l    tree    cd projects    cat webapp/README.md\n',
        '/home/dev/projects/webapp/README.md': 'A tiny web app project.\n',
        '/home/dev/projects/webapp/src/app.py': 'def main():\n    print("hello, world")\n\n\nif __name__ == "__main__":\n    main()\n',
        '/home/dev/notes/todo.txt': '- explore the filesystem\n- run the CPU scheduler\n- read about inodes\n',
        '/home/dev/.config/settings.json': '{"theme": "dark", "tabs": 2}\n',
    }
    for path, content in files.items():
        with open(path, 'w') as f:
            f.write(content)
    os.chmod('/home/dev/projects/webapp/src/app.py', 0o755)
    STATE['cwd'] = '/home/dev'


_seed()
`
