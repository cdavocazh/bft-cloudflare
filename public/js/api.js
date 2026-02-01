/**
 * BFT Workout Tracker - API Client
 */

const api = {
    baseUrl: '/api',

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || errorData.detail || `HTTP ${response.status}`);
        }

        return response.json();
    },

    // ==================== Exercises ====================

    async getExercises(params = {}) {
        const queryParams = new URLSearchParams();
        if (params.category) queryParams.append('category', params.category);
        if (params.muscle_main) queryParams.append('muscle_main', params.muscle_main);
        if (params.muscle_additional) queryParams.append('muscle_additional', params.muscle_additional);
        if (params.equipment_type) queryParams.append('equipment_type', params.equipment_type);

        const query = queryParams.toString();
        return this.request(`/exercises${query ? '?' + query : ''}`);
    },

    async searchExercises(q) {
        return this.request(`/exercises/search?q=${encodeURIComponent(q)}`);
    },

    async getExercise(id) {
        return this.request(`/exercises/${id}`);
    },

    async updateExercise(id, data) {
        return this.request(`/exercises/${id}`, {
            method: 'PUT',
            body: data
        });
    },

    async deleteExercise(id) {
        return this.request(`/exercises/${id}`, {
            method: 'DELETE'
        });
    },

    async createExercise(data) {
        return this.request('/exercises', {
            method: 'POST',
            body: data
        });
    },

    async getLatestWorkout(exerciseId) {
        return this.request(`/exercises/${exerciseId}/latest`);
    },

    async getExerciseLatest(exerciseId) {
        return this.request(`/exercises/${exerciseId}/latest`);
    },

    async getWeightOptions(equipmentType) {
        return this.request(`/weight-options/${encodeURIComponent(equipmentType)}`);
    },

    async getWeightRanges() {
        return this.request('/weight-ranges');
    },

    async getWeightRange(exerciseName) {
        return this.request(`/weight-ranges/${encodeURIComponent(exerciseName)}`);
    },

    // ==================== Workouts ====================

    async getWorkouts(params = {}) {
        const queryParams = new URLSearchParams();
        if (params.exercise_id) queryParams.append('exercise_id', params.exercise_id);
        if (params.category) queryParams.append('category', params.category);
        if (params.workout_date) queryParams.append('workout_date', params.workout_date);
        if (params.limit) queryParams.append('limit', params.limit);

        const query = queryParams.toString();
        return this.request(`/workouts${query ? '?' + query : ''}`);
    },

    async createWorkout(data) {
        return this.request('/workouts', {
            method: 'POST',
            body: data
        });
    },

    async getWorkout(id) {
        return this.request(`/workouts/${id}`);
    },

    async updateWorkout(id, data) {
        return this.request(`/workouts/${id}`, {
            method: 'PUT',
            body: data
        });
    },

    async deleteWorkout(id) {
        return this.request(`/workouts/${id}`, {
            method: 'DELETE'
        });
    },

    async getProgression(exerciseId) {
        return this.request(`/workouts/progression/${exerciseId}`);
    },

    async exportWorkouts() {
        return this.request('/workouts/export');
    },

    // ==================== Workout Plans ====================

    async getPlans(limit = 10) {
        return this.request(`/plans?limit=${limit}`);
    },

    async getPlan(planDate) {
        return this.request(`/plans/${planDate}`);
    },

    async savePlan(data) {
        return this.request('/plans', {
            method: 'POST',
            body: data
        });
    },

    async createPlan(data) {
        return this.request('/plans', {
            method: 'POST',
            body: data
        });
    },

    async deletePlan(planDate) {
        return this.request(`/plans/${planDate}`, {
            method: 'DELETE'
        });
    },

    // ==================== Constants ====================

    async getConstants() {
        return this.request('/constants');
    }
};
