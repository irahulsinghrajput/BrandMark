import { supabase } from './supabase';
import * as Sentry from '@sentry/react';

export const storage = {
  async uploadFile(bucket, path, file, options = {}) {
    try {
      const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        ...options,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  async downloadFile(bucket, path) {
    try {
      const { data, error } = await supabase.storage.from(bucket).download(path);
      if (error) throw error;
      return data;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  async deleteFile(bucket, paths) {
    try {
      const pathsArray = Array.isArray(paths) ? paths : [paths];
      const { data, error } = await supabase.storage.from(bucket).remove(pathsArray);
      if (error) throw error;
      return data;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  async getSignedUrl(bucket, path, expiresIn = 3600) {
    try {
      const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
      if (error) throw error;
      return data?.signedUrl;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  async listFiles(bucket, path = '', options = { limit: 100, offset: 0 }) {
    try {
      const { data, error } = await supabase.storage.from(bucket).list(path, options);
      if (error) throw error;
      return data;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }
};
