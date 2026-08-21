// Small Python helper for the memory lesson's "values vs references" playground.
// Each run executes in a fresh namespace and captures stdout so learners see
// exactly what real CPython does with aliasing, copying, and identity.
export const MEMORY_PROGRAM = String.raw`
import io, contextlib, traceback

def run_snippet(code):
    ns = {}
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
            exec(compile(code, '<memory>', 'exec'), ns)
    except Exception:
        buf.write(traceback.format_exc())
    return buf.getvalue().rstrip('\n')
`
