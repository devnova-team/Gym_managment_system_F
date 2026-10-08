const DB_NAME = 'gym_management_system';
const STORE_NAME = 'offlineAttendance';

let dbPromise = null;
let syncInProgress = false;

const makeIdLocal = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `offline_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const openDatabase = () => {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id_local' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('created_at', 'created_at', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('IndexedDB is unavailable.'));
  });

  return dbPromise;
};

const getStore = async (mode = 'readonly') => {
  const db = await openDatabase();
  return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
};

const normalizeRecord = (attendanceRecord = {}) => {
  const checkInTime = attendanceRecord.check_in_time || attendanceRecord.checkInTime || new Date().toISOString();
  const createdAt = attendanceRecord.created_at || attendanceRecord.createdAt || new Date().toISOString();

  return {
    ...attendanceRecord,
    id_local: attendanceRecord.id_local || attendanceRecord.local_id || makeIdLocal(),
    local_id: attendanceRecord.local_id || attendanceRecord.id_local || attendanceRecord.id_local || makeIdLocal(),
    check_in_time: checkInTime,
    status: attendanceRecord.status || 'pending',
    retry_count: Number(attendanceRecord.retry_count || 0),
    created_at: createdAt,
    last_error: attendanceRecord.last_error ?? null,
  };
};

export const getOfflineQueue = async () => {
  try {
    const store = await getStore('readonly');
    const records = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error || new Error('Unable to read offline queue.'));
    });

    return [...records].sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
  } catch {
    return [];
  }
};

export const queueAttendance = async (attendanceRecord) => {
  const record = normalizeRecord(attendanceRecord);

  const store = await getStore('readwrite');
  const savedRecord = await new Promise((resolve, reject) => {
    const request = store.put(record);
    request.onsuccess = () => resolve(record);
    request.onerror = () => reject(request.error || new Error('Unable to queue attendance.'));
  });

  return savedRecord;
};

export const addToOfflineQueue = queueAttendance;

export const getPendingAttendance = async () => {
  const records = await getOfflineQueue();
  return records.filter((record) => ['pending', 'syncing', 'failed'].includes(record.status));
};

export const removeSyncedAttendance = async (idLocal) => {
  if (!idLocal) return null;

  const store = await getStore('readwrite');
  return new Promise((resolve, reject) => {
    const request = store.delete(idLocal);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error || new Error('Unable to remove synced attendance.'));
  });
};

export const clearOfflineQueue = async () => {
  const store = await getStore('readwrite');
  return new Promise((resolve, reject) => {
    const request = store.clear();
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error || new Error('Unable to clear offline queue.'));
  });
};

export const removeOfflineItem = async (localId) => {
  return removeSyncedAttendance(localId);
};

export const updateOfflineAttendance = async (idLocal, updates) => {
  if (!idLocal) return null;

  const store = await getStore('readwrite');
  const existingRecord = await new Promise((resolve, reject) => {
    const request = store.get(idLocal);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error || new Error('Unable to find offline attendance.'));
  });

  if (!existingRecord) {
    return null;
  }

  const nextRecord = {
    ...existingRecord,
    ...updates,
    id_local: idLocal,
    local_id: updates.local_id || existingRecord.local_id || idLocal,
  };

  const savedRecord = await new Promise((resolve, reject) => {
    const request = store.put(nextRecord);
    request.onsuccess = () => resolve(nextRecord);
    request.onerror = () => reject(request.error || new Error('Unable to update offline attendance.'));
  });

  return savedRecord;
};

export const retryFailedAttendance = async () => {
  const records = await getPendingAttendance();
  const failedRecords = records.filter((record) => record.status === 'failed');

  await Promise.all(failedRecords.map((record) => updateOfflineAttendance(record.id_local, {
    ...record,
    status: 'pending',
    last_error: null,
  })));

  return failedRecords.length;
};

export const syncPendingAttendance = async (syncHandler) => {
  if (syncInProgress) {
    return { skipped: true, synced: 0, pending: await getPendingAttendance(), error: null };
  }

  const records = await getPendingAttendance();

  if (!records.length) {
    return { skipped: true, synced: 0, pending: 0, error: null };
  }

  syncInProgress = true;

  try {
    await Promise.all(records.map((record) => updateOfflineAttendance(record.id_local, {
      ...record,
      status: 'syncing',
      last_error: null,
    })));

    await syncHandler(records);

    await Promise.all(records.map((record) => removeSyncedAttendance(record.id_local)));

    return {
      skipped: false,
      synced: records.length,
      pending: await getPendingAttendance(),
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    await Promise.all(records.map((record) => updateOfflineAttendance(record.id_local, {
      ...record,
      status: 'failed',
      retry_count: Number(record.retry_count || 0) + 1,
      last_error: message,
    })));

    return {
      skipped: false,
      synced: 0,
      pending: await getPendingAttendance(),
      error,
    };
  } finally {
    syncInProgress = false;
  }
};
