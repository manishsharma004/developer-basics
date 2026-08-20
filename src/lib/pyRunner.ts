// Shared Python program: runs a snippet in a fresh namespace and captures
// stdout + any traceback. Used by the OOP and Design Patterns playgrounds.
export const RUNNER_PROGRAM = String.raw`
import io, contextlib, traceback

def run_snippet(code):
    ns = {}
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
            exec(compile(code, '<run>', 'exec'), ns)
    except Exception:
        buf.write(traceback.format_exc())
    return buf.getvalue().rstrip('\n')
`
