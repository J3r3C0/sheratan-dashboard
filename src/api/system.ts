import { apiClient } from './client';

// Fetch job queue count
export const getJobsCount = async (): Promise<number> => {
    const response = await apiClient.get<any[]>('/jobs');
    return response.data.length;
};

// Fetch active jobs (not done, not failed)
export const getActiveJobsCount = async (): Promise<number> => {
    const response = await apiClient.get<any[]>('/jobs');
    return response.data.filter(j =>
        j.status !== 'done' && j.status !== 'failed'
    ).length;
};

// Check Core API status  
export const getCoreStatus = async (): Promise<{ status: string; missions: number }> => {
    const response = await apiClient.get('/status');
    return response.data;
};

// System status for header bar
export interface LiveSystemStatus {
    selfloopState: 'running' | 'degraded' | 'stopped';
    activeModel: string;
    meshNodesOnline: number;
    meshNodesTotal: number;
    jobsInQueue: number;
    unreadAlerts: number;
}

export const getLiveSystemStatus = async (): Promise<LiveSystemStatus> => {
    try {
        const [statusRes, jobsRes] = await Promise.all([
            apiClient.get('/status'),
            apiClient.get<any[]>('/jobs'),
        ]);

        const jobs = jobsRes.data || [];
        const activeJobs = jobs.filter(j => j.status !== 'done' && j.status !== 'failed');
        const runningJobs = jobs.filter(j => j.status === 'running' || j.status === 'working');

        // Determine selfloop state based on running jobs
        let selfloopState: LiveSystemStatus['selfloopState'] = 'stopped';
        if (runningJobs.length > 0) {
            selfloopState = 'running';
        } else if (activeJobs.length > 0) {
            selfloopState = 'degraded';
        }

        return {
            selfloopState,
            activeModel: 'llama-3.8b-instruct', // Could be fetched from config
            meshNodesOnline: 4, // TODO: Mesh API when available
            meshNodesTotal: 5,
            jobsInQueue: activeJobs.length,
            unreadAlerts: jobs.filter(j => j.status === 'failed').length,
        };
    } catch (error) {
        console.error('Failed to fetch live system status:', error);
        return {
            selfloopState: 'stopped',
            activeModel: 'unknown',
            meshNodesOnline: 0,
            meshNodesTotal: 0,
            jobsInQueue: 0,
            unreadAlerts: 0,
        };
    }
};
