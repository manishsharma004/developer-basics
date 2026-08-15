import { useMemo, useState } from 'react'

// A small sample of a Unix-like filesystem. Each node carries the kind of
// metadata the OS actually tracks: type, permissions, owner, size, and inode.
const FILESYSTEM = {
  name: '/',
  type: 'dir',
  perms: 'rwxr-xr-x',
  owner: 'root',
  size: 4096,
  inode: 2,
  children: [
    {
      name: 'bin',
      type: 'dir',
      perms: 'rwxr-xr-x',
      owner: 'root',
      size: 4096,
      inode: 12,
      children: [
        { name: 'ls', type: 'file', perms: 'rwxr-xr-x', owner: 'root', size: 138208, inode: 131 },
        { name: 'bash', type: 'file', perms: 'rwxr-xr-x', owner: 'root', size: 1234376, inode: 132 },
      ],
    },
    {
      name: 'etc',
      type: 'dir',
      perms: 'rwxr-xr-x',
      owner: 'root',
      size: 4096,
      inode: 20,
      children: [
        { name: 'hosts', type: 'file', perms: 'rw-r--r--', owner: 'root', size: 220, inode: 201 },
        { name: 'passwd', type: 'file', perms: 'rw-r--r--', owner: 'root', size: 1810, inode: 202 },
      ],
    },
    {
      name: 'home',
      type: 'dir',
      perms: 'rwxr-xr-x',
      owner: 'root',
      size: 4096,
      inode: 30,
      children: [
        {
          name: 'ada',
          type: 'dir',
          perms: 'rwxr-x---',
          owner: 'ada',
          size: 4096,
          inode: 305,
          children: [
            { name: 'notes.md', type: 'file', perms: 'rw-r--r--', owner: 'ada', size: 512, inode: 3051 },
            {
              name: 'projects',
              type: 'dir',
              perms: 'rwxr-xr-x',
              owner: 'ada',
              size: 4096,
              inode: 3060,
              children: [
                { name: 'app.js', type: 'file', perms: 'rw-r--r--', owner: 'ada', size: 2048, inode: 3061 },
                { name: 'README.md', type: 'file', perms: 'rw-r--r--', owner: 'ada', size: 900, inode: 3062 },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'tmp',
      type: 'dir',
      perms: 'rwxrwxrwt',
      owner: 'root',
      size: 4096,
      inode: 40,
      children: [
        { name: 'session.lock', type: 'file', perms: 'rw-------', owner: 'ada', size: 0, inode: 401 },
      ],
    },
  ],
}

function permBits(perms, type) {
  const typeChar = type === 'dir' ? 'd' : '-'
  return typeChar + perms
}

function TreeNode({ node, path, depth, selectedPath, onSelect }) {
  const isDir = node.type === 'dir'
  const nodePath = path === '/' ? `/${node.name}` : `${path}/${node.name}`
  const fullPath = node.name === '/' ? '/' : nodePath
  const [open, setOpen] = useState(depth < 2)
  const isSelected = selectedPath === fullPath

  return (
    <li>
      <div
        className={`tree-row${isSelected ? ' selected' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          onSelect(fullPath, node)
          if (isDir) setOpen((v) => !v)
        }}
      >
        {isDir ? (
          <span className="tree-caret">{open ? '▾' : '▸'}</span>
        ) : (
          <span className="tree-caret tree-caret--empty" />
        )}
        <span className="tree-glyph">{isDir ? '📁' : '📄'}</span>
        <span className="tree-name">{node.name === '/' ? '/' : node.name}</span>
      </div>
      {isDir && open && node.children?.length > 0 && (
        <ul className="tree-children">
          {node.children.map((child) => (
            <TreeNode
              key={child.inode}
              node={child}
              path={fullPath}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

function FilesystemDemo() {
  const [selectedPath, setSelectedPath] = useState('/home/ada/projects/app.js')
  const [selectedNode, setSelectedNode] = useState(
    FILESYSTEM.children[2].children[0].children[1].children[0],
  )

  const breadcrumb = useMemo(() => {
    if (selectedPath === '/') return ['/']
    return selectedPath.split('/').filter(Boolean)
  }, [selectedPath])

  const handleSelect = (path, node) => {
    setSelectedPath(path)
    setSelectedNode(node)
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>🗂️ Filesystem</h1>
        <p className="lead">
          A filesystem organizes data as a tree of directories and files rooted
          at <code>/</code>. Click around the tree to inspect what the operating
          system stores about each entry.
        </p>
      </header>

      <div className="demo-split">
        <div className="panel">
          <div className="panel-title">Directory tree</div>
          <ul className="tree">
            <TreeNode
              node={FILESYSTEM}
              path=""
              depth={0}
              selectedPath={selectedPath}
              onSelect={handleSelect}
            />
          </ul>
        </div>

        <div className="panel">
          <div className="panel-title">Selected entry</div>
          <div className="breadcrumb">
            <span className="crumb-root">/</span>
            {breadcrumb.map((part, i) =>
              part === '/' ? null : (
                <span key={i} className="crumb">
                  {part}
                  {i < breadcrumb.length - 1 ? <span className="crumb-sep">/</span> : null}
                </span>
              ),
            )}
          </div>

          <dl className="meta">
            <div>
              <dt>Absolute path</dt>
              <dd><code>{selectedPath}</code></dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{selectedNode.type === 'dir' ? 'Directory' : 'Regular file'}</dd>
            </div>
            <div>
              <dt>Permissions</dt>
              <dd><code>{permBits(selectedNode.perms, selectedNode.type)}</code></dd>
            </div>
            <div>
              <dt>Owner</dt>
              <dd>{selectedNode.owner}</dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>{selectedNode.size.toLocaleString()} bytes</dd>
            </div>
            <div>
              <dt>Inode</dt>
              <dd>{selectedNode.inode}</dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="concepts">
        <h3>Key concepts</h3>
        <div className="concept-grid">
          <div className="concept">
            <h4>Hierarchy &amp; the root</h4>
            <p>
              Everything descends from a single root, <code>/</code>. Directories
              contain other directories and files, forming a tree.
            </p>
          </div>
          <div className="concept">
            <h4>Absolute vs. relative paths</h4>
            <p>
              An absolute path starts at <code>/</code> (e.g.
              <code> /home/ada/notes.md</code>). A relative path is resolved from
              the current working directory (e.g. <code>projects/app.js</code>).
            </p>
          </div>
          <div className="concept">
            <h4>Inodes</h4>
            <p>
              A file's real identity is its inode — a number pointing to metadata
              and data blocks. Names are just directory entries pointing at inodes.
            </p>
          </div>
          <div className="concept">
            <h4>Permissions</h4>
            <p>
              The <code>rwx</code> triples control read/write/execute for the
              owner, group, and everyone else. A leading <code>d</code> marks a
              directory.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FilesystemDemo
