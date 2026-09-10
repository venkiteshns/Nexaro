export const CHECKLIST = [
    { key: 'arrived', label: 'Arrived at location', stepIndex: 1 },
    { key: 'discussed', label: 'Discussed job with poster', stepIndex: 2 },
    { key: 'started', label: 'Started work', stepIndex: 3 },
    { key: 'completed', label: 'Job completed', stepIndex: 4 },
    { key: 'payment', label: 'Payment received', stepIndex: 5 },
];

export const UPDATE_ORDER = ['not_started', 'arrived', 'discussed', 'started', 'completed', 'payment'];

export function doneCount(update) {
    const idx = UPDATE_ORDER.indexOf(update);
    return Math.max(0, idx);
}
