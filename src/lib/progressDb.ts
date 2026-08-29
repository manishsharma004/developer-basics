export interface LessonProgressRecord {
  lessonId: string
  openCount: number
  read: boolean
  firstOpenedAt: number
  lastOpenedAt: number
  quizAnswers: Record<string, number>
}

const DB_NAME = 'developer-basics-progress'
const DB_VERSION = 2
const LESSONS_STORE = 'lessons'
const CAPSTONE_STORE = 'capstone'

export interface CapstoneProgressRecord {
  capstoneId: string
  completedSteps: string[]
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'))
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(LESSONS_STORE)) {
        db.createObjectStore(LESSONS_STORE, { keyPath: 'lessonId' })
      }
      if (!db.objectStoreNames.contains(CAPSTONE_STORE)) {
        db.createObjectStore(CAPSTONE_STORE, { keyPath: 'capstoneId' })
      }
    }
  })
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'))
  })
}

export async function loadAllLessonProgress(): Promise<LessonProgressRecord[]> {
  const db = await openDb()
  try {
    const tx = db.transaction(LESSONS_STORE, 'readonly')
    const store = tx.objectStore(LESSONS_STORE)
    return await requestToPromise(store.getAll())
  } finally {
    db.close()
  }
}

export async function saveLessonProgress(record: LessonProgressRecord): Promise<void> {
  const db = await openDb()
  try {
    const tx = db.transaction(LESSONS_STORE, 'readwrite')
    const store = tx.objectStore(LESSONS_STORE)
    store.put(record)
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'))
      tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'))
    })
  } finally {
    db.close()
  }
}

export function normalizeQuizAnswers(raw: Record<string, number> | undefined): Record<number, number> {
  if (!raw) return {}
  const answers: Record<number, number> = {}
  for (const [key, value] of Object.entries(raw)) {
    const index = Number(key)
    if (Number.isInteger(index) && Number.isInteger(value)) {
      answers[index] = value
    }
  }
  return answers
}

export function serializeQuizAnswers(answers: Record<number, number>): Record<string, number> {
  const raw: Record<string, number> = {}
  for (const [key, value] of Object.entries(answers)) {
    raw[String(key)] = value
  }
  return raw
}

export async function clearAllLessonProgress(): Promise<void> {
  const db = await openDb()
  try {
    const tx = db.transaction(LESSONS_STORE, 'readwrite')
    const store = tx.objectStore(LESSONS_STORE)
    store.clear()
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'))
      tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'))
    })
  } finally {
    db.close()
  }
}

export async function loadCapstoneProgress(capstoneId: string): Promise<CapstoneProgressRecord | undefined> {
  const db = await openDb()
  try {
    const tx = db.transaction(CAPSTONE_STORE, 'readonly')
    const store = tx.objectStore(CAPSTONE_STORE)
    const record = await requestToPromise<CapstoneProgressRecord | undefined>(store.get(capstoneId))
    return record
  } finally {
    db.close()
  }
}

export async function loadAllCapstoneProgress(): Promise<CapstoneProgressRecord[]> {
  const db = await openDb()
  try {
    const tx = db.transaction(CAPSTONE_STORE, 'readonly')
    const store = tx.objectStore(CAPSTONE_STORE)
    return await requestToPromise(store.getAll())
  } finally {
    db.close()
  }
}

export async function saveCapstoneProgress(record: CapstoneProgressRecord): Promise<void> {
  const db = await openDb()
  try {
    const tx = db.transaction(CAPSTONE_STORE, 'readwrite')
    const store = tx.objectStore(CAPSTONE_STORE)
    store.put(record)
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'))
      tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'))
    })
  } finally {
    db.close()
  }
}

export async function clearAllCapstoneProgress(): Promise<void> {
  const db = await openDb()
  try {
    const tx = db.transaction(CAPSTONE_STORE, 'readwrite')
    const store = tx.objectStore(CAPSTONE_STORE)
    store.clear()
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'))
      tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'))
    })
  } finally {
    db.close()
  }
}

export const PROGRESS_EXPORT_VERSION = 2

export interface ProgressExportPayload {
  version: number
  exportedAt: string
  lessons: LessonProgressRecord[]
  capstone?: CapstoneProgressRecord[]
}
