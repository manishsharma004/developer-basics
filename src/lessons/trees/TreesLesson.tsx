import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'Depth-first (recursive)',
    code: `# A binary tree as nested nodes: (value, left, right)
tree = (1,
        (2, (4, None, None), (5, None, None)),
        (3, None, (6, None, None)))

def dfs(node):
    if node is None:
        return
    value, left, right = node
    print(value)          # visit (pre-order)
    dfs(left)
    dfs(right)

dfs(tree)`,
  },
  {
    label: 'Breadth-first (a queue)',
    code: `from collections import deque

tree = (1,
        (2, (4, None, None), (5, None, None)),
        (3, None, (6, None, None)))

def bfs(root):
    q = deque([root])
    while q:
        node = q.popleft()
        if node is None:
            continue
        value, left, right = node
        print(value)      # visit level by level
        q.append(left)
        q.append(right)

bfs(tree)   # 1, 2, 3, 4, 5, 6`,
  },
  {
    label: 'Shortest path in a graph',
    code: `from collections import deque

# An unweighted graph as an adjacency list.
graph = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "D"],
    "D": ["B", "C", "E"],
    "E": ["D"],
}

def shortest_path(start, goal):
    q = deque([[start]])
    seen = {start}
    while q:
        path = q.popleft()
        node = path[-1]
        if node == goal:
            return path
        for nxt in graph[node]:
            if nxt not in seen:
                seen.add(nxt)
                q.append(path + [nxt])

print(shortest_path("A", "E"))`,
  },
]

export default function TreesLesson() {
  return (
    <Lesson id="trees">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Some data is naturally hierarchical (a filesystem, a comment thread, an
          org chart) and some is a network (friends, roads, web links). Trees and
          graphs are the shapes that model both — and the same two traversals,{' '}
          <strong>depth-first</strong> and <strong>breadth-first</strong>, power
          search, routing, dependency resolution, and more.
        </p>
        <Callout kind="why" title="The one idea">
          A <strong>tree</strong> is a graph with no cycles and one path between any
          two nodes. To visit every node you either go <em>deep</em> first (a stack /
          recursion) or <em>wide</em> first (a queue).
        </Callout>
      </Section>

      <Section id="model" title="Trees, graphs & traversal">
        <ul className="prose-list">
          <li>
            A <strong>node</strong> holds a value and links to other nodes. A tree
            node links to its <strong>children</strong>; it has exactly one{' '}
            <strong>parent</strong> (the top node, the <strong>root</strong>, has
            none).
          </li>
          <li>
            A <strong>graph</strong> is the general case: any node may link to any
            other, links can be one- or two-way, and <strong>cycles</strong> are
            allowed — so traversal must remember what it has already{' '}
            <strong>visited</strong>.
          </li>
          <li>
            <strong>DFS</strong> uses a stack (often the call stack via recursion) and
            dives down one branch before backtracking. <strong>BFS</strong> uses a
            queue and expands outward in rings, which finds the{' '}
            <strong>shortest</strong> path in an unweighted graph.
          </li>
        </ul>
      </Section>

      <Section id="playground" title="Traverse it live">
        <p className="prose">
          Run real traversals in Python. The first two visit the same tree in a
          different order; the third uses BFS to find the shortest route between two
          nodes in a graph.
        </p>
        <SnippetRunner snippets={SNIPPETS} />
        <TryThis>
          Run <strong>Depth-first</strong> then <strong>Breadth-first</strong> and
          compare the order the numbers print. Then in{' '}
          <strong>Shortest path</strong>, change the goal to <code>"D"</code> and
          confirm the path gets shorter.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Why BFS finds the shortest path (but DFS may not)">
          <p className="prose">
            BFS explores all nodes one step away, then two steps away, and so on — so
            the first time it reaches the goal, it has used the fewest edges possible.
            DFS commits to a branch and can reach the goal by a long, winding route
            before it ever tries a shorter one. For <em>weighted</em> graphs you need
            Dijkstra's algorithm, which is BFS with a priority queue.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Cycles and the 'visited' set">
          <p className="prose">
            In a tree you can traverse freely because there are no cycles. In a graph,
            forgetting to track visited nodes means you can loop forever (A → B → A →
            …). A <code>set</code> of visited nodes turns an infinite walk into a
            finite one and keeps traversal at O(V + E) — every vertex and edge seen
            once.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'node / vertex', def: 'A single element holding a value and links to others.' },
            { term: 'edge', def: 'A link between two nodes; may be directed or undirected.' },
            { term: 'root', def: 'The single top node of a tree, with no parent.' },
            { term: 'leaf', def: 'A node with no children.' },
            { term: 'DFS', def: 'Depth-first search: go deep using a stack / recursion.' },
            { term: 'BFS', def: 'Breadth-first search: go wide using a queue; finds shortest unweighted paths.' },
            { term: 'cycle', def: 'A path that returns to where it started; trees have none.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'Which traversal finds the shortest path in an unweighted graph?',
              options: ['Depth-first (DFS)', 'Breadth-first (BFS)', 'Either always works', 'Neither'],
              answer: 1,
              explain: 'BFS expands outward in rings, so it reaches a node in the fewest edges.',
            },
            {
              q: 'What data structure does an iterative BFS use?',
              options: ['A stack', 'A queue', 'A hash map', 'A tree'],
              answer: 1,
              explain: 'BFS uses a FIFO queue; DFS uses a stack (or recursion).',
            },
            {
              q: 'Why does graph traversal need a "visited" set but tree traversal usually does not?',
              options: [
                'Graphs are bigger',
                'Graphs can contain cycles, so you could loop forever',
                'Trees have no edges',
                'It makes it slower on purpose',
              ],
              answer: 1,
              explain: 'Trees have no cycles; general graphs do, so you must remember what you have seen.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>A <strong>tree</strong> is a cycle-free graph with one root and one path between nodes.</>,
            <><strong>DFS</strong> goes deep with a stack/recursion; <strong>BFS</strong> goes wide with a queue.</>,
            <><strong>BFS</strong> finds the shortest path in an unweighted graph.</>,
            <>General graphs need a <strong>visited set</strong> to avoid looping on cycles.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}
