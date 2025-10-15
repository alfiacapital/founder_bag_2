import { axiosClient } from './axios';

// Template API service
export const templateApi = {
    // Get all templates
    getAll: (filter = 'all') => {
        return axiosClient.get(`/task-templates?filter=${filter}`);
    },

    // Get template by ID
    getById: (id) => {
        return axiosClient.get(`/task-templates/${id}`);
    },

    // Create template from task
    createFromTask: (taskId, templateData) => {
        return axiosClient.post(`/task-templates/from-task/${taskId}`, templateData);
    },

    // Create new template
    create: (data) => {
        return axiosClient.post('/task-templates', data);
    },

    // Update template
    update: (id, data) => {
        return axiosClient.put(`/task-templates/${id}`, data);
    },

    // Delete template
    delete: (id) => {
        return axiosClient.delete(`/task-templates/${id}`);
    },

    // Import template to space
    importToSpace: (templateId, spaceId, statusId) => {
        return axiosClient.post(`/task-templates/import/${templateId}`, { spaceId, statusId });
    },

    // Share template with user
    share: (templateId, email) => {
        return axiosClient.post(`/task-templates/share/${templateId}`, { email });
    },

    // Remove user from shared template
    removeShare: (templateId, userId) => {
        return axiosClient.delete(`/task-templates/${templateId}/share/${userId}`);
    }
};