import { prisma } from '../db/prisma.js';

export class UserService {
  // 통계: 작품 수, 받은 댓글 수, 연속 그림 일수
  static async getMyStats(userId: string) {
    const artworkCount = await prisma.artwork.count({ where: { userId } });
    const commentCount = await prisma.comment.count({
      where: { artwork: { userId } }
    });

    // 연속 그림 일수 계산
    const artworks = await prisma.artwork.findMany({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' }
    });

    let streak = 0;
    if (artworks.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 날짜별로 그룹핑
      const dates = [...new Set(artworks.map((a: any) => {
        const d = new Date(a.createdAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      }))].sort((a: any, b: any) => b - a) as number[];

      // 오늘 또는 어제부터 시작
      const firstDate = dates[0] as number;
      const startDate = firstDate === today.getTime() ? today.getTime() : today.getTime() - 86400000;
      if (firstDate >= startDate) {
        streak = 1;
        for (let i = 1; i < dates.length; i++) {
          const prevDate = dates[i - 1] as number;
          const currDate = dates[i] as number;
          if (prevDate - currDate === 86400000) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    return { artworkCount, commentCount, streak };
  }

  // 활동 캘린더: 최근 12주간 날짜별 작품 수
  static async getActivityCalendar(userId: string) {
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);
    twelveWeeksAgo.setHours(0, 0, 0, 0);

    const artworks = await prisma.artwork.findMany({
      where: {
        userId,
        createdAt: { gte: twelveWeeksAgo }
      },
      select: { createdAt: true }
    });

    // 날짜별 카운트 맵
    const dateMap: Record<string, number> = {};
    artworks.forEach((a: any) => {
      const parts = new Date(a.createdAt).toISOString().split('T');
      const key = parts[0] as string;
      const currentCount = dateMap[key] || 0;
      dateMap[key] = currentCount + 1;
    });

    const calendar: { date: string; count: number }[] = [];
    for (let i = 83; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const parts = d.toISOString().split('T');
      const key = parts[0] as string;
      calendar.push({ date: key, count: dateMap[key] || 0 });
    }

    return calendar;
  }

  // 뱃지: 조건 기반 계산 (DB 스키마 불필요)
  static async getBadges(userId: string) {
    const artworkCount = await prisma.artwork.count({ where: { userId } });
    const publicCount = await prisma.artwork.count({ where: { userId, isPublic: true } });
    const commentCount = await prisma.comment.count({ where: { userId } });

    // 연속 일수 계산
    const artworks = await prisma.artwork.findMany({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    const dates = [...new Set(artworks.map((a: any) => {
      const d = new Date(a.createdAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }))].sort((a: any, b: any) => b - a) as number[];

    let maxStreak = 0;
    if (dates.length > 0) {
      let currentStreak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prevD = dates[i - 1] as number;
        const currD = dates[i] as number;
        if (prevD - currD === 86400000) {
          currentStreak++;
        } else {
          maxStreak = Math.max(maxStreak, currentStreak);
          currentStreak = 1;
        }
      }
      maxStreak = Math.max(maxStreak, currentStreak);
    }

    return [
      { id: 'first-art', emoji: '🎨', name: '첫 작품', desc: '작품 1개 이상 올리기', earned: artworkCount >= 1 },
      { id: 'ten-arts', emoji: '🔥', name: '열정 화가', desc: '작품 10개 이상 올리기', earned: artworkCount >= 10 },
      { id: 'week-streak', emoji: '📅', name: '7일 연속', desc: '7일 연속 작품 업로드', earned: maxStreak >= 7 },
      { id: 'public-debut', emoji: '🌍', name: '공개 데뷔', desc: '공개 작품 1개 이상', earned: publicCount >= 1 },
      { id: 'social-star', emoji: '💬', name: '소통왕', desc: '댓글 5개 이상 작성', earned: commentCount >= 5 },
    ];
  }

  // 가족 멤버 목록
  static async getFamilyMembers(familyCode: string) {
    const members = await prisma.user.findMany({
      where: { familyCode },
      select: {
        id: true,
        name: true,
        avatar: true,
        _count: { select: { artworks: true } }
      }
    });
    return members.map((m: any) => ({
      id: m.id,
      name: m.name || '친구',
      avatar: m.avatar || '🐰',
      artworkCount: m._count.artworks
    }));
  }

  // 프로필 업데이트
  static async updateProfile(userId: string, data: { name?: string; avatar?: string }) {
    return await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, avatar: true, familyCode: true }
    });
  }
}
