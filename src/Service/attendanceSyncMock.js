const STORAGE_KEY = 'gms_pending_attendance';
const SYNCED_KEY = 'gms_synced_attendance';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const readJson = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(key, JSON.stringify(value));
};

export const generateIdLocal = () => `local-attendance-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;

export const normalizeQueuedRecord = (record = {}) => {
  const createdAt = record.createdAt || record.checkInTime || new Date().toISOString();
  const checkInTime = record.checkInTime || record.createdAt || createdAt;

  return {
    ...record,
    id_local: record.id_local || generateIdLocal(),
    memberId: record.memberId ?? record.member_id ?? record.memberId,
    memberName: record.memberName || record.member_name || 'Member',
    checkInTime,
    status: record.status || 'pending',
    syncAttempts: Number(record.syncAttempts || record.retry_count || 0),
    createdAt,
    error: record.error || null,
  };
};

export const getPendingAttendance = () => {
  const queue = readJson(STORAGE_KEY, []);
  return (Array.isArray(queue) ? queue : []).map(normalizeQueuedRecord);
};

export const savePendingAttendance = (records = []) => {
  const normalized = (Array.isArray(records) ? records : []).map(normalizeQueuedRecord);
  writeJson(STORAGE_KEY, normalized);
  return normalized;
};

export const queueAttendanceRecord = (record = {}) => {
  const item = normalizeQueuedRecord(record);
  const existing = getPendingAttendance();
  const nextQueue = existing.some((queuedRecord) => queuedRecord.id_local === item.id_local)
    ? existing.map((queuedRecord) => (queuedRecord.id_local === item.id_local ? item : queuedRecord))
    : [...existing, item];

  savePendingAttendance(nextQueue);
  return item;
};

export const getSyncedHistory = () => {
  const history = readJson(SYNCED_KEY, []);
  return Array.isArray(history) ? history : [];
};

export const saveSyncedHistory = (records = []) => {
  const normalized = (Array.isArray(records) ? records : []).map(normalizeQueuedRecord);
  writeJson(SYNCED_KEY, normalized);
  return normalized;
};

export const mockSyncAttendance = async (records = [], options = {}) => {
  const { failIds = [] } = options;
  const seen = new Set();

  await delay(1000);

  const syncedRecords = [];
  const failedRecords = [];

  records.forEach((record) => {
    const normalized = normalizeQueuedRecord(record);
    if (seen.has(normalized.id_local)) return;
    seen.add(normalized.id_local);

    if (failIds.includes(normalized.id_local)) {
      failedRecords.push({
        ...normalized,
        status: 'failed',
        syncAttempts: Number(normalized.syncAttempts || 0) + 1,
        error: 'Network error',
      });
      return;
    }

    syncedRecords.push({
      ...normalized,
      status: 'synced',
      syncAttempts: Number(normalized.syncAttempts || 0) + 1,
      syncedAt: new Date().toISOString(),
      error: null,
    });
  });

  return {
    success: failedRecords.length === 0,
    syncedRecords,
    failedRecords,
  };
};

export const syncPendingQueue = async (options = {}) => {
  const queue = getPendingAttendance();

  if (!queue.length) {
    return {
      success: true,
      syncedRecords: [],
      failedRecords: [],
      remaining: [],
      total: 0,
    };
  }

  const result = await mockSyncAttendance(queue, options);
  const syncedIds = new Set(result.syncedRecords.map((record) => record.id_local));

  const remaining = queue
    .filter((record) => !syncedIds.has(record.id_local))
    .map((record) => {
      const failedRecord = result.failedRecords.find((item) => item.id_local === record.id_local);
      if (failedRecord) {
        return {
          ...record,
          ...failedRecord,
          status: 'failed',
          error: failedRecord.error || 'Network error',
          syncAttempts: Number(failedRecord.syncAttempts || record.syncAttempts || 0),
        };
      }

      return {
        ...record,
        status: 'pending',
        error: null,
      };
    });

  savePendingAttendance(remaining);

  const history = [...getSyncedHistory(), ...result.syncedRecords.map((record) => ({
    ...record,
    syncedAt: record.syncedAt || new Date().toISOString(),
  }))];
  saveSyncedHistory(history);

  return {
    success: result.failedRecords.length === 0,
    syncedRecords: result.syncedRecords,
    failedRecords: result.failedRecords,
    remaining,
    total: queue.length,
  };
};
