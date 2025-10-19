/**
 * Exercise Session React Query Hooks
 */
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { exerciseSessionService } from '@/lib/api/exerciseSession';
import { useExerciseSessionStore } from '@/stores/useExerciseSessionStore';
import type {
  CreateSessionRequest,
  SubmitAnswerRequest,
} from '@/types/exerciseSession';

/**
 * 建立 Session Hook
 */
export function useCreateSession() {
  const router = useRouter();
  const setSession = useExerciseSessionStore((state) => state.setSession);
  const setCurrentQuestion = useExerciseSessionStore(
    (state) => state.setCurrentQuestion
  );
  const startTimer = useExerciseSessionStore((state) => state.startTimer);

  return useMutation({
    mutationFn: (data: CreateSessionRequest) =>
      exerciseSessionService.createSession(data),
    onSuccess: (data) => {
      // 設定 session
      setSession(data.session_id, data.status);
      setCurrentQuestion(data.first_question);
      startTimer();

      // 導向練習頁面
      router.push(`/exercise-sessions/${data.session_id}`);
    },
  });
}

/**
 * 提交答案 Hook
 */
export function useSubmitAnswer(sessionId: number) {
  const setFeedback = useExerciseSessionStore((state) => state.setFeedback);
  const stopTimer = useExerciseSessionStore((state) => state.stopTimer);

  return useMutation({
    mutationFn: (data: SubmitAnswerRequest) => {
      // 停止計時
      const timeSpent = stopTimer();
      return exerciseSessionService.submitAnswer(sessionId, {
        ...data,
        time_spent: timeSpent,
      });
    },
    onSuccess: (data) => {
      // 顯示即時反饋
      setFeedback(
        {
          isCorrect: data.is_correct,
          yourAnswer: data.your_answer,
          correctAnswer: data.correct_answer,
          explanation: data.explanation,
          skills: data.skills,
        },
        data.session_stats
      );
    },
  });
}

/**
 * 取得下一題 Hook
 */
export function useGetNextExercise(sessionId: number) {
  const setCurrentQuestion = useExerciseSessionStore(
    (state) => state.setCurrentQuestion
  );
  const clearFeedback = useExerciseSessionStore((state) => state.clearFeedback);
  const startTimer = useExerciseSessionStore((state) => state.startTimer);

  return useMutation({
    mutationFn: () => exerciseSessionService.getNextExercise(sessionId),
    onSuccess: (data) => {
      // 清除反饋,設定新題目
      clearFeedback();
      setCurrentQuestion(data);
      startTimer();
    },
  });
}

/**
 * 結束 Session Hook
 */
export function useCompleteSession(sessionId: number) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => exerciseSessionService.completeSession(sessionId),
    onSuccess: () => {
      // 清除快取
      queryClient.invalidateQueries({
        queryKey: ['exercise-session', sessionId],
      });

      // 導向結算頁面
      router.push(`/exercise-sessions/${sessionId}/summary`);
    },
  });
}

/**
 * 取得 Session 詳情 Hook
 */
export function useExerciseSession(sessionId: number) {
  return useQuery({
    queryKey: ['exercise-session', sessionId],
    queryFn: () => exerciseSessionService.getSession(sessionId),
    enabled: !!sessionId,
  });
}
