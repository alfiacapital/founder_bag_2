import { useCompletion } from 'ai/react';

export const useAI = () => {
  const { completion, complete, isLoading, error } = useCompletion({
    api: 'http://localhost:3000/api/groq/generate', 
    onError: (error) => {
      console.error('AI Error:', error);
    },
  });

  return {
    completion,
    complete,
    isLoading,
    error,
  };
};
