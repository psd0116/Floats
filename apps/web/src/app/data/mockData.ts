export interface Artwork {
  id: string;
  title: string;
  date: string;
  thumbnail: string;
  tags: string[];
  comments: Comment[];
  color: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export const artworks: Artwork[] = [
  {
    id: "1",
    title: "파란 상어",
    date: "2026.03.12",
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    tags: ["#상어", "#바다"],
    color: "#D1FAE5",
    comments: [
      {
        id: "c1",
        author: "엄마",
        text: "우리 수아가 그린 상어 너무 멋져요!",
        date: "2026.03.12"
      },
      {
        id: "c2",
        author: "아빠",
        text: "지느러미 표현이 정말 대단하구나!",
        date: "2026.03.12"
      }
    ]
  },
  {
    id: "2",
    title: "노란 물고기",
    date: "2026.03.10",
    thumbnail: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=300&fit=crop",
    tags: ["#물고기", "#행복"],
    color: "#FEF08A",
    comments: [
      {
        id: "c3",
        author: "엄마",
        text: "밝은 노란색이 정말 예뻐요!",
        date: "2026.03.10"
      }
    ]
  },
  {
    id: "3",
    title: "분홍 해파리",
    date: "2026.03.08",
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    tags: ["#해파리", "#신비"],
    color: "#E0E7FF",
    comments: []
  },
  {
    id: "4",
    title: "초록 바다거북",
    date: "2026.03.05",
    thumbnail: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400&h=300&fit=crop",
    tags: ["#거북이", "#평화"],
    color: "#D1FAE5",
    comments: [
      {
        id: "c4",
        author: "할머니",
        text: "우리 손주 그림 솜씨가 날로 늘어가네요!",
        date: "2026.03.05"
      }
    ]
  },
  {
    id: "5",
    title: "보라 문어",
    date: "2026.03.01",
    thumbnail: "https://images.unsplash.com/photo-1591025207163-942350e47db2?w=400&h=300&fit=crop",
    tags: ["#문어", "#재미"],
    color: "#E0E7FF",
    comments: []
  }
];
