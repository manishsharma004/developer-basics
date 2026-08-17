// Python program for the errors lesson: run a snippet in a fresh namespace and
// capture stdout plus any real traceback, so learners see genuine exceptions.
export const ERRORS_PROGRAM = String.raw`
import io, contextlib, traceback

def run_snippet(code):
    ns = {}
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
            exec(compile(code, '<errors>', 'exec'), ns)
    except Exception:
        buf.write(traceback.format_exc())
    return buf.getvalue().rstrip('\n')
`
